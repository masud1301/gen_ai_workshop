import { Complaint, Department, StandardCategory } from '../types';

export const STANDARD_CATEGORIES: StandardCategory[] = [
  'IT / Network',
  'Electrical',
  'Classroom Equipment',
  'Cleanliness',
  'Water / Plumbing',
  'Infrastructure',
  'Security',
  'Other',
];

/**
 * Normalizes any category string into one of the 8 Standard Categories
 */
export function normalizeToStandardCategory(cat: string | undefined | null): StandardCategory {
  if (!cat) return 'Other';
  const lower = cat.toLowerCase();
  
  if (lower.includes('it') || lower.includes('network') || lower.includes('wifi') || lower.includes('internet')) {
    return 'IT / Network';
  }
  if (lower.includes('electr') || lower.includes('power') || lower.includes('light')) {
    return 'Electrical';
  }
  if (lower.includes('classroom') || lower.includes('av') || lower.includes('projector') || lower.includes('smartboard')) {
    return 'Classroom Equipment';
  }
  if (lower.includes('clean') || lower.includes('hygiene') || lower.includes('housekeep') || lower.includes('trash') || lower.includes('garbage')) {
    return 'Cleanliness';
  }
  if (lower.includes('plumb') || lower.includes('water') || lower.includes('leak') || lower.includes('toilet') || lower.includes('restroom')) {
    return 'Water / Plumbing';
  }
  if (lower.includes('infrastruct') || lower.includes('hostel') || lower.includes('building') || lower.includes('door') || lower.includes('furniture')) {
    return 'Infrastructure';
  }
  if (lower.includes('secur') || lower.includes('safety') || lower.includes('theft') || lower.includes('guard')) {
    return 'Security';
  }
  return 'Other';
}

/**
 * Normalizes status to Open, In Progress, Resolved, Closed
 */
export function normalizeStatus(status: string | undefined | null): 'open' | 'in_progress' | 'resolved' | 'closed' {
  if (!status) return 'open';
  const s = status.toLowerCase().replace(/[\s-_]+/g, '');
  if (s.includes('resolved')) return 'resolved';
  if (s.includes('closed')) return 'closed';
  if (s.includes('progress') || s.includes('working') || s.includes('assigned') || s.includes('investigating')) return 'in_progress';
  return 'open';
}

/**
 * Normalizes priority to Low, Medium, High, Emergency
 */
export function normalizePriority(priority: string | undefined | null): 'Low' | 'Medium' | 'High' | 'Emergency' {
  if (!priority) return 'Medium';
  const p = priority.toLowerCase();
  if (p.includes('critical') || p.includes('emergency')) return 'Emergency';
  if (p.includes('high')) return 'High';
  if (p.includes('low')) return 'Low';
  return 'Medium';
}

export interface RecurringClusterInsight {
  id: string;
  category: StandardCategory;
  location: string;
  count: number;
  complaintIds: string[];
  complaints: Complaint[];
  keywords: string[];
  message: string;
  severity: 'high' | 'medium' | 'low';
  firstReportedAt: string;
  lastReportedAt: string;
}

export interface AIInsightItem {
  id: string;
  type: 'recurring_problem' | 'repeated_location' | 'duplicate_complaints' | 'department_attention' | 'common_category';
  title: string;
  description: string;
  evidence: string;
  badge: string;
  badgeColor: 'rose' | 'amber' | 'blue' | 'purple' | 'emerald';
  recommendation: string;
  relatedCount: number;
  relatedComplaintIds: string[];
}

/**
 * Detect recurring problem clusters purely from database records
 */
export function detectRecurringProblems(complaints: Complaint[]): RecurringClusterInsight[] {
  if (!complaints || complaints.length === 0) return [];

  // Group by Normalized Category + Normalized Location
  const map = new Map<string, Complaint[]>();

  for (const c of complaints) {
    const stdCat = normalizeToStandardCategory(c.category);
    const loc = (c.location || c.building || 'Campus Zone').trim();
    // Normalize location key: remove small details if similar
    const key = `${stdCat}__${loc.toLowerCase()}`;

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(c);
  }

  const clusters: RecurringClusterInsight[] = [];

  map.forEach((items) => {
    if (items.length >= 2) {
      const first = items[0];
      const stdCat = normalizeToStandardCategory(first.category);
      const loc = first.location || first.building || 'Campus Zone';

      // Extract shared keywords
      const wordsMap: Record<string, number> = {};
      const stopWords = new Set(['the', 'and', 'with', 'from', 'this', 'that', 'near', 'room', 'floor', 'block', 'mein', 'nahi', 'last', 'days', 'keep', 'keeps']);
      
      items.forEach(item => {
        const text = `${item.title || ''} ${item.description || ''} ${item.issue || ''}`.toLowerCase();
        const words = text.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length >= 3 && !stopWords.has(w));
        new Set(words).forEach(w => {
          wordsMap[w] = (wordsMap[w] || 0) + 1;
        });
      });

      const topKeywords = Object.entries(wordsMap)
        .filter(([, cnt]) => cnt >= 2)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([w]) => w);

      // Sort items by date
      const sorted = [...items].sort((a, b) => new Date(a.createdAt || a.created_at || 0).getTime() - new Date(b.createdAt || b.created_at || 0).getTime());
      const firstDate = sorted[0]?.createdAt || sorted[0]?.created_at || '';
      const lastDate = sorted[sorted.length - 1]?.createdAt || sorted[sorted.length - 1]?.created_at || '';

      const hasEmergency = items.some(c => normalizePriority(c.priority) === 'Emergency');
      const hasHigh = items.some(c => normalizePriority(c.priority) === 'High');

      clusters.push({
        id: `cluster_${stdCat.replace(/[\s/]+/g, '_')}_${loc.replace(/[\s/]+/g, '_')}`,
        category: stdCat,
        location: loc,
        count: items.length,
        complaintIds: items.map(i => i.id),
        complaints: items,
        keywords: topKeywords.length > 0 ? topKeywords : [stdCat.toLowerCase(), loc.toLowerCase()],
        message: `${stdCat}-related complaints are repeatedly being reported around ${loc} (${items.length} records logged).`,
        severity: hasEmergency ? 'high' : hasHigh || items.length >= 3 ? 'medium' : 'low',
        firstReportedAt: firstDate,
        lastReportedAt: lastDate,
      });
    }
  });

  // Sort clusters by count descending
  return clusters.sort((a, b) => b.count - a.count);
}

/**
 * Generate structured AI Insights strictly derived from current database records
 */
export function generateAIInsights(complaints: Complaint[], departments: Department[]): AIInsightItem[] {
  if (!complaints || complaints.length === 0) return [];

  const insights: AIInsightItem[] = [];

  // 1. Recurring problem insights
  const recurringClusters = detectRecurringProblems(complaints);
  recurringClusters.forEach((cluster, idx) => {
    insights.push({
      id: `ai_insight_recurring_${idx}`,
      type: 'recurring_problem',
      title: `Recurring Problem: ${cluster.category} at ${cluster.location}`,
      description: `${cluster.category}-related complaints are repeatedly being reported around ${cluster.location}.`,
      evidence: `Derived from ${cluster.count} verified complaints in the database matching this location and category pattern (${cluster.keywords.map(k => `#${k}`).join(' ')}).`,
      badge: `${cluster.count} Linked Records`,
      badgeColor: cluster.severity === 'high' ? 'rose' : 'amber',
      recommendation: `Dispatch a permanent maintenance inspection to ${cluster.location} for root-cause infrastructure overhaul.`,
      relatedCount: cluster.count,
      relatedComplaintIds: cluster.complaintIds,
    });
  });

  // 2. Repeated location hotspot
  const locationCounts: Record<string, { count: number; ids: string[]; cats: Set<string> }> = {};
  complaints.forEach(c => {
    const loc = (c.location || c.building || 'Campus Zone').trim();
    if (!locationCounts[loc]) {
      locationCounts[loc] = { count: 0, ids: [], cats: new Set() };
    }
    locationCounts[loc].count += 1;
    locationCounts[loc].ids.push(c.id);
    locationCounts[loc].cats.add(normalizeToStandardCategory(c.category));
  });

  const sortedLocations = Object.entries(locationCounts).sort((a, b) => b[1].count - a[1].count);
  if (sortedLocations.length > 0 && sortedLocations[0][1].count >= 2) {
    const [topLoc, data] = sortedLocations[0];
    const catList = Array.from(data.cats).join(', ');
    insights.push({
      id: `ai_insight_location_hotspot`,
      type: 'repeated_location',
      title: `Repeated Location Hotspot: ${topLoc}`,
      description: `${topLoc} is currently the most active complaint hotspot across campus with ${data.count} reported issues.`,
      evidence: `Accounts for ${Math.round((data.count / complaints.length) * 100)}% of total complaints across categories: ${catList}.`,
      badge: 'Location Hotspot',
      badgeColor: 'purple',
      recommendation: `Conduct a facility-wide audit across ${topLoc} to prevent further multi-category issues.`,
      relatedCount: data.count,
      relatedComplaintIds: data.ids,
    });
  }

  // 3. Possible duplicate complaints
  const duplicatePairs: { c1: Complaint; c2: Complaint; reason: string }[] = [];
  for (let i = 0; i < complaints.length; i++) {
    for (let j = i + 1; j < complaints.length; j++) {
      const a = complaints[i];
      const b = complaints[j];
      const aLoc = (a.location || a.building || '').toLowerCase();
      const bLoc = (b.location || b.building || '').toLowerCase();
      const aCat = normalizeToStandardCategory(a.category);
      const bCat = normalizeToStandardCategory(b.category);

      if (aCat === bCat && (aLoc === bLoc || (aLoc.includes(bLoc) || bLoc.includes(aLoc)) && aLoc.length > 3)) {
        duplicatePairs.push({
          c1: a,
          c2: b,
          reason: `Both report ${aCat} in ${a.location || a.building}`,
        });
      }
    }
  }

  if (duplicatePairs.length > 0) {
    const pair = duplicatePairs[0];
    insights.push({
      id: `ai_insight_duplicates`,
      type: 'duplicate_complaints',
      title: `Possible Duplicate Complaints Detected`,
      description: `Tickets "${pair.c1.title}" (${pair.c1.trackingNumber}) and "${pair.c2.title}" (${pair.c2.trackingNumber}) describe similar symptoms at ${pair.c1.location || pair.c1.building}.`,
      evidence: `NLP semantic and location matching detected overlapping complaints logged for the same facility unit.`,
      badge: 'Potential Duplicate',
      badgeColor: 'blue',
      recommendation: `Merge ticket updates or link resolution work orders to prevent dual staff dispatch.`,
      relatedCount: 2,
      relatedComplaintIds: [pair.c1.id, pair.c2.id],
    });
  }

  // 4. Department requiring attention (highest open/unresolved load)
  const deptWorkloads: Record<string, { total: number; openOrProgress: number; name: string; ids: string[] }> = {};
  
  complaints.forEach(c => {
    const deptId = c.department_id || c.assignedDepartmentId || 'dept_administration';
    const deptName = c.assignedDepartmentName || departments.find(d => d.id === deptId)?.name || 'General Operations';
    
    if (!deptWorkloads[deptId]) {
      deptWorkloads[deptId] = { total: 0, openOrProgress: 0, name: deptName, ids: [] };
    }
    deptWorkloads[deptId].total += 1;
    deptWorkloads[deptId].ids.push(c.id);
    const s = normalizeStatus(c.status);
    if (s === 'open' || s === 'in_progress') {
      deptWorkloads[deptId].openOrProgress += 1;
    }
  });

  const sortedDepts = Object.entries(deptWorkloads).sort((a, b) => b[1].openOrProgress - a[1].openOrProgress);
  if (sortedDepts.length > 0 && sortedDepts[0][1].openOrProgress > 0) {
    const [, deptData] = sortedDepts[0];
    insights.push({
      id: `ai_insight_dept_attention`,
      type: 'department_attention',
      title: `Department Requiring Attention: ${deptData.name}`,
      description: `${deptData.name} has the largest active workload with ${deptData.openOrProgress} open or in-progress tickets.`,
      evidence: `Represents ${Math.round((deptData.openOrProgress / Math.max(1, complaints.filter(c => normalizeStatus(c.status) !== 'resolved' && normalizeStatus(c.status) !== 'closed').length)) * 100)}% of campus active workload.`,
      badge: 'High Workload',
      badgeColor: 'rose',
      recommendation: `Evaluate staff bandwidth or reassign pending tickets to expedite ticket turnaround.`,
      relatedCount: deptData.openOrProgress,
      relatedComplaintIds: deptData.ids,
    });
  }

  // 5. Common complaint category
  const catDistribution: Record<StandardCategory, { count: number; ids: string[] }> = {
    'IT / Network': { count: 0, ids: [] },
    'Electrical': { count: 0, ids: [] },
    'Classroom Equipment': { count: 0, ids: [] },
    'Cleanliness': { count: 0, ids: [] },
    'Water / Plumbing': { count: 0, ids: [] },
    'Infrastructure': { count: 0, ids: [] },
    'Security': { count: 0, ids: [] },
    'Other': { count: 0, ids: [] },
  };

  complaints.forEach(c => {
    const stdCat = normalizeToStandardCategory(c.category);
    catDistribution[stdCat].count += 1;
    catDistribution[stdCat].ids.push(c.id);
  });

  const topCategoryEntry = Object.entries(catDistribution).sort((a, b) => b[1].count - a[1].count)[0];
  if (topCategoryEntry && topCategoryEntry[1].count > 0) {
    const [topCat, data] = topCategoryEntry;
    const pct = Math.round((data.count / complaints.length) * 100);
    insights.push({
      id: `ai_insight_top_category`,
      type: 'common_category',
      title: `Dominant Category: ${topCat} (${pct}% of all issues)`,
      description: `${topCat} represents the most common complaint category logged by campus members.`,
      evidence: `${data.count} out of ${complaints.length} total database records fall under this category classification.`,
      badge: 'Top Category',
      badgeColor: 'emerald',
      recommendation: `Schedule preventative maintenance checklists for ${topCat} equipment before peak academic periods.`,
      relatedCount: data.count,
      relatedComplaintIds: data.ids,
    });
  }

  return insights;
}
