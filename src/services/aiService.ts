import {
  Complaint,
  StandardCategory,
  StandardPriority,
  IssueCategory,
  PriorityLevel,
  AIAnalysisResult,
} from '../types';

export type QualitativeConfidence = 'High confidence' | 'Moderate confidence' | 'Needs review';

export const AI_PIPELINE_STAGES = [
  'Understanding complaint',
  'Extracting information',
  'Classifying issue',
  'Detecting priority',
  'Checking similar complaints',
  'Recommending department',
  'Preparing structured ticket',
] as const;

export interface SimilarityCandidate {
  id: string;
  trackingNumber: string;
  title: string;
  location: string;
  category: string;
  status: string;
  upvotes: number;
  similarityReason: string;
}

export interface ComplaintAnalysisOutput {
  issue: string;
  location: string;
  category: StandardCategory;
  aiRecommendedCategory?: string;
  priority: StandardPriority;
  aiRecommendedPriority?: string;
  finalSystemPriority?: StandardPriority;
  safetyRuleTriggered?: boolean;
  safetyRuleReason?: string;
  department: string;
  departmentId: string;
  keywords: string[];
  summary: string;
  similarityCandidates: SimilarityCandidate[];
  confidenceScore: number;
  qualitativeConfidence: QualitativeConfidence;
  humanReviewRequired: boolean;
  humanReviewReasons: string[];
  rationale: string;
  suggestedActions: string[];
  estimatedHours: number;
  
  // Source & LLM metadata
  source: 'llm' | 'deterministic' | 'manual';
  modelName?: string;
  isEmergencyEscalated?: boolean;
  escalationNote?: string;
  fallbackUsed?: boolean;
  llmError?: string;
  disclaimer: string;

  // Interop fields
  legacyCategory: IssueCategory;
  legacyPriority: PriorityLevel;
}

/**
 * Deterministic AI Demo Service & Fallback Engine
 * Provides transparent, rule-based natural language classification,
 * entity extraction, priority calculation, and duplicate detection
 * for SmartFix campus complaints when backend LLM is unavailable.
 */

interface ClassificationRule {
  category: StandardCategory;
  legacyCategory: IssueCategory;
  department: string;
  departmentId: string;
  keywords: string[];
}

const DEMO_CLASSIFICATION_RULES: ClassificationRule[] = [
  {
    category: 'IT / Network',
    legacyCategory: 'it_network',
    department: 'IT Support',
    departmentId: 'dept_it_support',
    keywords: [
      'wifi', 'wi-fi', 'internet', 'network', 'router', 'ethernet', 'lan', 'connection',
      'disconnect', 'packet', 'speed', 'slow internet', 'hotspot', 'portal', 'moodle',
      'login', 'server', 'firewall', 'bandwidth', 'switch', 'down', 'offline', 'buffering',
      'connectivity', 'broadband', 'cable', 'ip address'
    ],
  },
  {
    category: 'Electrical',
    legacyCategory: 'electrical_power',
    department: 'Electrical Maintenance',
    departmentId: 'dept_electrical_maintenance',
    keywords: [
      'fan', 'ac', 'air conditioner', 'air conditioning', 'cooler', 'electricity',
      'power', 'light', 'bulb', 'tube light', 'switch', 'socket', 'plug', 'short circuit',
      'spark', 'shock', 'current', 'voltage', 'blackout', 'tripped', 'fuse', 'wire',
      'generator', 'hvac', 'heater', 'dark', 'no power', 'bijli', 'line'
    ],
  },
  {
    category: 'Classroom Equipment',
    legacyCategory: 'classroom_equipment',
    department: 'Facility Management',
    departmentId: 'dept_facility_management',
    keywords: [
      'projector', 'computer', 'pc', 'monitor', 'screen', 'smartboard', 'smart board',
      'hdmi', 'mic', 'microphone', 'speaker', 'podium', 'audio', 'sound', 'display',
      'whiteboard', 'marker', 'lab pc', 'remote', 'amplifier', 'av', 'flicker', 'blur',
      'kaam nahi kar raha', 'not displaying'
    ],
  },
  {
    category: 'Cleanliness',
    legacyCategory: 'campus_hygiene',
    department: 'Housekeeping',
    departmentId: 'dept_housekeeping',
    keywords: [
      'cleaning', 'clean', 'dirty', 'garbage', 'trash', 'dust', 'smell', 'odor',
      'waste', 'bin', 'dustbin', 'mess', 'janitor', 'hygiene', 'cockroach', 'pest',
      'mosquito', 'insect', 'spill', 'stain', 'sweep', 'broom', 'dirty floor', 'trash can',
      'safai', 'kachra', 'ganda', 'bad smell'
    ],
  },
  {
    category: 'Water / Plumbing',
    legacyCategory: 'plumbing_water',
    department: 'Plumbing',
    departmentId: 'dept_plumbing',
    keywords: [
      'water', 'leakage', 'leak', 'tap', 'faucet', 'pipe', 'pipeline', 'flush',
      'restroom', 'toilet', 'washroom', 'drain', 'drainage', 'sink', 'shower', 'sewage',
      'clogged', 'overflow', 'plumbing', 'no water', 'dripping', 'paani', 'geyser', 'tank'
    ],
  },
  {
    category: 'Infrastructure',
    legacyCategory: 'hostel_maintenance',
    department: 'Facility Management',
    departmentId: 'dept_facility_management',
    keywords: [
      'building', 'wall', 'door', 'infrastructure', 'window', 'desk', 'chair', 'bench',
      'table', 'ceiling', 'roof', 'floor', 'tile', 'staircase', 'handrail', 'elevator',
      'lift', 'crack', 'paint', 'furniture', 'cupboard', 'lock', 'handle', 'key',
      'balcony', 'glass', 'door lock', 'hinge', 'broken chair', 'gate'
    ],
  },
  {
    category: 'Security',
    legacyCategory: 'security_safety',
    department: 'Security',
    departmentId: 'dept_security',
    keywords: [
      'security', 'suspicious', 'theft', 'stolen', 'guard', 'safety', 'harassment',
      'cctv', 'camera', 'trespass', 'stranger', 'unauthorized', 'threat', 'chori',
      'lost item', 'id card', 'fighting', 'noise', 'night', 'dark corner', 'break-in'
    ],
  },
];

const EMERGENCY_KEYWORDS = [
  'hazard', 'spark', 'sparks', 'fire', 'electric shock', 'exposed wire', 'gas leak',
  'flood', 'flooding', 'collapse', 'structural danger', 'emergency', 'broken glass',
  'injury', 'smoke', 'explosion', 'immediate danger', 'safety threat', 'short circuit'
];

const HIGH_KEYWORDS = [
  'exam', 'test', 'midterm', 'final exam', 'entire floor', 'all students', 'whole lab',
  'whole class', 'lecture hall', 'major outage', 'complete blackout', 'no water supply',
  'urgent', 'urgent attention', 'server down', 'admission', 'blocked entrance'
];

const LOW_KEYWORDS = [
  'minor', 'aesthetic', 'paint', 'scratch', 'loose handle', 'squeaky', 'creak',
  'cosmetic', 'suggestion', 'faint noise', 'dirty spot', 'small stain'
];

const CATEGORY_MAP: Record<StandardCategory, { legacy: IssueCategory; dept: string; deptId: string }> = {
  'IT / Network': { legacy: 'it_network', dept: 'IT Support', deptId: 'dept_it_support' },
  'Electrical': { legacy: 'electrical_power', dept: 'Electrical Maintenance', deptId: 'dept_electrical_maintenance' },
  'Classroom Equipment': { legacy: 'classroom_equipment', dept: 'Facility Management', deptId: 'dept_facility_management' },
  'Cleanliness': { legacy: 'campus_hygiene', dept: 'Housekeeping', deptId: 'dept_housekeeping' },
  'Water / Plumbing': { legacy: 'plumbing_water', dept: 'Plumbing', deptId: 'dept_plumbing' },
  'Infrastructure': { legacy: 'hostel_maintenance', dept: 'Facility Management', deptId: 'dept_facility_management' },
  'Security': { legacy: 'security_safety', dept: 'Security', deptId: 'dept_security' },
  'Other': { legacy: 'hostel_maintenance', dept: 'Administration', deptId: 'dept_administration' },
};

export const AI_DISCLAIMER_TEXT =
  'AI analysis is an assistive recommendation based on student input. For emergency or safety threats, immediate institutional escalation rules apply.';

/**
 * Extracts a normalized location from natural language text
 */
function extractLocationFromText(text: string, providedLocation?: string): string {
  if (providedLocation && providedLocation.trim()) {
    return providedLocation.trim();
  }

  const normalized = text.toLowerCase();

  const roomMatch = text.match(/(room\s*\d+[a-z]?|hall\s*\d+|cabin\s*\d+)/i);
  if (roomMatch) return roomMatch[0].replace(/\s+/g, ' ');

  const labMatch = text.match(/(computer\s*lab\s*\d+|lab\s*\d+|ai\s*lab|physics\s*lab|chemistry\s*lab)/i);
  if (labMatch) return labMatch[0].replace(/\s+/g, ' ');

  const blockMatch = text.match(/(hostel\s*block\s*[a-z0-9]|block\s*[a-z0-9]|wing\s*[a-z0-9]|main\s*block)/i);
  if (blockMatch) return blockMatch[0].replace(/\s+/g, ' ');

  if (normalized.includes('library')) return 'Central Library';
  if (normalized.includes('cafeteria') || normalized.includes('canteen') || normalized.includes('mess')) return 'Cafeteria & Dining Hall';
  if (normalized.includes('auditorium')) return 'Auditorium Main Stage';
  if (normalized.includes('sports complex') || normalized.includes('gym')) return 'Sports Complex';

  return 'Campus Facility';
}

/**
 * Extracts a concise summary title / issue name from natural language
 */
function extractIssueTitle(text: string, category: StandardCategory, location: string): string {
  const normalized = text.toLowerCase();

  if (normalized.includes('projector') && (normalized.includes('kaam nahi') || normalized.includes('not working') || normalized.includes('flicker') || normalized.includes('broken'))) {
    return `Projector not working in ${location}`;
  }
  if (normalized.includes('wifi') || normalized.includes('wi-fi') || normalized.includes('internet')) {
    if (normalized.includes('down') || normalized.includes('slow') || normalized.includes('disconnect') || normalized.includes('nahi aa raha')) {
      return `Wi-Fi / Internet connectivity issue in ${location}`;
    }
    return `Network connectivity problem in ${location}`;
  }
  if (normalized.includes('fan') || normalized.includes('ac')) {
    return `${normalized.includes('ac') ? 'Air Conditioner' : 'Ceiling Fan'} malfunction in ${location}`;
  }
  if (normalized.includes('leak') || normalized.includes('pipe') || normalized.includes('tap')) {
    return `Water leakage / plumbing defect in ${location}`;
  }
  if (normalized.includes('dirty') || normalized.includes('clean') || normalized.includes('garbage')) {
    return `Sanitation & cleanliness requirement in ${location}`;
  }
  if (normalized.includes('door') || normalized.includes('lock') || normalized.includes('window') || normalized.includes('chair')) {
    return `Infrastructure repair needed in ${location}`;
  }

  const firstSentence = text.split(/[.\n!?]/)[0].trim();
  if (firstSentence.length > 5 && firstSentence.length <= 65) {
    return firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1);
  }

  return `${category} issue reported at ${location}`;
}

/**
 * Similarity check across active database complaints
 */
export function findSimilarComplaints(
  text: string,
  category: StandardCategory,
  location: string,
  existingComplaints: Complaint[]
): SimilarityCandidate[] {
  const candidates: SimilarityCandidate[] = [];
  const normalizedText = text.toLowerCase();
  const normalizedLoc = location.toLowerCase();

  const searchWords = normalizedText
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !['mein', 'nahi', 'raha', 'this', 'that', 'from', 'with', 'have', 'been', 'last', 'please', 'there'].includes(w));

  for (const comp of existingComplaints) {
    const compText = `${comp.title} ${comp.description} ${comp.original_message || ''} ${comp.issue || ''}`.toLowerCase();
    const compLoc = `${comp.location} ${comp.building || ''} ${comp.roomNumber || ''}`.toLowerCase();

    const locMatch = 
      (normalizedLoc !== 'campus facility' && compLoc.includes(normalizedLoc)) ||
      (comp.location && normalizedText.includes(comp.location.toLowerCase())) ||
      (normalizedLoc.includes('204') && compLoc.includes('204')) ||
      (normalizedLoc.includes('lab 2') && compLoc.includes('lab 2')) ||
      (normalizedLoc.includes('lab 1') && compLoc.includes('lab 1')) ||
      (normalizedLoc.includes('hostel') && compLoc.includes('hostel'));

    const catMatch = 
      comp.category === category ||
      compText.includes(category.toLowerCase().split('/')[0].trim());

    let sharedWordCount = 0;
    const matchedWords: string[] = [];
    for (const word of searchWords) {
      if (compText.includes(word) || compLoc.includes(word)) {
        sharedWordCount++;
        matchedWords.push(word);
      }
    }

    if (locMatch && (catMatch || sharedWordCount >= 1)) {
      candidates.push({
        id: comp.id,
        trackingNumber: comp.trackingNumber || `SF-${comp.id.substring(0, 4)}`,
        title: comp.title || comp.issue || 'Related Campus Issue',
        location: comp.location || comp.building || 'Campus Zone',
        category: comp.category,
        status: comp.status,
        upvotes: comp.upvotes || 1,
        similarityReason: `Possible Similar Issue (Location: ${comp.location || location}, Category: ${comp.category})`,
      });
    } else if (catMatch && sharedWordCount >= 2) {
      candidates.push({
        id: comp.id,
        trackingNumber: comp.trackingNumber || `SF-${comp.id.substring(0, 4)}`,
        title: comp.title || comp.issue || 'Related Campus Issue',
        location: comp.location || comp.building || 'Campus Zone',
        category: comp.category,
        status: comp.status,
        upvotes: comp.upvotes || 1,
        similarityReason: `Symptom match on "${matchedWords.slice(0, 2).join(', ')}" in ${comp.location}`,
      });
    }
  }

  return candidates.slice(0, 3);
}

/**
 * Synchronous Deterministic AI Analysis (Local Fallback & Instant Typing Engine)
 */
export function analyzeComplaint(
  input: { text: string; location?: string },
  existingComplaints: Complaint[] = []
): ComplaintAnalysisOutput {
  const combinedText = `${input.text} ${input.location || ''}`.toLowerCase();

  const detectedLocation = extractLocationFromText(input.text, input.location);

  let bestRule = DEMO_CLASSIFICATION_RULES[DEMO_CLASSIFICATION_RULES.length - 1];
  let highestScore = 0;
  const matchedKeywords: string[] = [];

  for (const rule of DEMO_CLASSIFICATION_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (combinedText.includes(kw)) {
        score += kw.length > 5 ? 2 : 1;
        if (!matchedKeywords.includes(kw)) {
          matchedKeywords.push(kw);
        }
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestRule = rule;
    }
  }

  let finalCategory: StandardCategory = 'Other';
  let finalLegacyCategory: IssueCategory = 'hostel_maintenance';
  let finalDepartment = 'Administration';
  let finalDepartmentId = 'dept_administration';

  if (highestScore > 0) {
    finalCategory = bestRule.category;
    finalLegacyCategory = bestRule.legacyCategory;
    finalDepartment = bestRule.department;
    finalDepartmentId = bestRule.departmentId;
  }

  let priority: StandardPriority = 'Medium';
  let legacyPriority: PriorityLevel = 'medium';
  let rationale = 'Normal classroom or equipment issue within standard resolution window.';
  let estimatedHours = 6;

  const hasEmergency = EMERGENCY_KEYWORDS.some(k => combinedText.includes(k));
  const hasHigh = HIGH_KEYWORDS.some(k => combinedText.includes(k));
  const hasLow = LOW_KEYWORDS.some(k => combinedText.includes(k));

  if (hasEmergency) {
    priority = 'Emergency';
    legacyPriority = 'critical';
    rationale = 'Immediate safety hazard or electrical/structural risk detected.';
    estimatedHours = 1.5;
  } else if (hasHigh) {
    priority = 'High';
    legacyPriority = 'high';
    rationale = 'Major service interruption, academic assessment or multiple students impacted.';
    estimatedHours = 3.5;
  } else if (hasLow && !hasHigh) {
    priority = 'Low';
    legacyPriority = 'low';
    rationale = 'Minor equipment or cosmetic convenience issue.';
    estimatedHours = 12;
  } else {
    priority = 'Medium';
    legacyPriority = 'medium';
    rationale = 'Standard campus service request within departmental SLA.';
    estimatedHours = 6;
  }

  const issue = extractIssueTitle(input.text, finalCategory, detectedLocation);

  const similarityCandidates = findSimilarComplaints(
    input.text,
    finalCategory,
    detectedLocation,
    existingComplaints
  );

  const confidenceScore = highestScore > 0 ? Math.min(0.85 + (highestScore * 0.03), 0.98) : 0.82;

  const suggestedActions: string[] = [];
  if (finalCategory === 'IT / Network') {
    suggestedActions.push('Ping local gateway switch and check PoE status', 'Verify AP channel congestion and uplink port');
  } else if (finalCategory === 'Electrical') {
    suggestedActions.push('Inspect circuit breaker panel and voltage load', 'Test ballast and switch contacts');
  } else if (finalCategory === 'Classroom Equipment') {
    suggestedActions.push('Test HDMI/VGA matrix signal handshake', 'Verify optical lamp and power relay');
  } else if (finalCategory === 'Water / Plumbing') {
    suggestedActions.push('Shut off isolating service valve', 'Replace damaged gasket or valve core');
  } else if (finalCategory === 'Cleanliness') {
    suggestedActions.push('Dispatch housekeeping team with sanitization cart', 'Replenish waste containers');
  } else {
    suggestedActions.push('Acknowledge work order with site arrival time', 'Inspect location and log resolution note');
  }

  const humanReviewReasons: string[] = [];
  if (finalCategory === 'Other') humanReviewReasons.push('Category classified as Other');
  if (detectedLocation === 'Campus Facility' || detectedLocation === 'Unknown') humanReviewReasons.push('Location not specifically identified');
  if (hasEmergency) humanReviewReasons.push('Emergency priority safety check required');

  const humanReviewRequired = humanReviewReasons.length > 0;
  const qualitativeConfidence: QualitativeConfidence =
    humanReviewRequired || finalCategory === 'Other'
      ? 'Needs review'
      : highestScore >= 2
      ? 'High confidence'
      : 'Moderate confidence';

  return {
    issue,
    location: detectedLocation,
    category: finalCategory,
    aiRecommendedCategory: finalCategory,
    priority,
    aiRecommendedPriority: priority,
    finalSystemPriority: priority,
    safetyRuleTriggered: hasEmergency,
    safetyRuleReason: hasEmergency
      ? 'Predefined College Safety Escalation Triggered: Prioritized for immediate technician dispatch.'
      : undefined,
    department: finalDepartment,
    departmentId: finalDepartmentId,
    keywords: matchedKeywords.slice(0, 6),
    summary: `${issue} at ${detectedLocation}. Priority classified as ${priority} under ${finalDepartment}.`,
    similarityCandidates,
    confidenceScore: Number(confidenceScore.toFixed(2)),
    qualitativeConfidence,
    humanReviewRequired,
    humanReviewReasons,
    rationale,
    suggestedActions,
    estimatedHours,
    source: 'deterministic',
    isEmergencyEscalated: hasEmergency,
    escalationNote: hasEmergency
      ? 'Predefined College Safety Escalation Triggered: Prioritized for immediate technician dispatch.'
      : undefined,
    fallbackUsed: true,
    disclaimer: AI_DISCLAIMER_TEXT,
    legacyCategory: finalLegacyCategory,
    legacyPriority,
  };
}

/**
 * Asynchronous Full-Stack LLM Analysis Service
 * Communicates with backend Express server (/api/ai/analyze-complaint) powered by Gemini 3.7 Flash.
 * Falls back transparently to deterministic engine if backend or API key is unavailable.
 */
export async function analyzeComplaintWithLLM(
  input: { text: string; location?: string },
  existingComplaints: Complaint[] = []
): Promise<ComplaintAnalysisOutput> {
  const fallback = analyzeComplaint(input, existingComplaints);

  if (!input.text || input.text.trim().length === 0) {
    return fallback;
  }

  try {
    const response = await fetch('/api/ai/analyze-complaint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: input.text.trim(),
        location: input.location || fallback.location,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.warn('Backend LLM responded with non-200, using deterministic fallback:', errData);
      return {
        ...fallback,
        source: 'deterministic',
        fallbackUsed: true,
        llmError: errData.error || `Backend service error (${response.status})`,
      };
    }

    const payload = await response.json();

    if (!payload.success || !payload.data) {
      return {
        ...fallback,
        source: 'deterministic',
        fallbackUsed: true,
        llmError: payload.error || 'Invalid LLM response payload',
      };
    }

    const rawData = payload.data;

    // Strict Client Validation
    const validCategories: StandardCategory[] = [
      'IT / Network',
      'Electrical',
      'Classroom Equipment',
      'Cleanliness',
      'Water / Plumbing',
      'Infrastructure',
      'Security',
      'Other',
    ];
    const validPriorities: StandardPriority[] = ['Low', 'Medium', 'High', 'Emergency'];

    const normalizedCategory: StandardCategory = validCategories.includes(rawData.category)
      ? rawData.category
      : fallback.category;

    const normalizedPriority: StandardPriority = validPriorities.includes(rawData.priority)
      ? rawData.priority
      : fallback.priority;

    const catMapping = CATEGORY_MAP[normalizedCategory] || CATEGORY_MAP['Other'];

    // If server already computed similar complaints, map them; otherwise run client-side
    const similarityCandidates: SimilarityCandidate[] = Array.isArray(rawData.similarComplaints) && rawData.similarComplaints.length > 0
      ? rawData.similarComplaints.map((c: any) => ({
          id: c.complaintId || c.id,
          trackingNumber: c.trackingNumber || `SF-${(c.complaintId || c.id).substring(5, 8)}`,
          title: c.title || 'Campus Issue',
          location: c.location || 'Campus Facility',
          category: c.category || normalizedCategory,
          status: c.status || 'Submitted',
          upvotes: c.upvotes || 1,
          similarityReason: c.reason || 'Similar facility issue',
        }))
      : findSimilarComplaints(
          input.text,
          normalizedCategory,
          rawData.location || fallback.location,
          existingComplaints
        );

    const legacyPriority: PriorityLevel =
      normalizedPriority === 'Emergency'
        ? 'critical'
        : normalizedPriority === 'High'
        ? 'high'
        : normalizedPriority === 'Medium'
        ? 'medium'
        : 'low';

    const estimatedHours =
      normalizedPriority === 'Emergency'
        ? 1.5
        : normalizedPriority === 'High'
        ? 3.5
        : normalizedPriority === 'Medium'
        ? 6
        : 12;

    const humanReviewReasons: string[] = Array.isArray(rawData.humanReviewReasons) && rawData.humanReviewReasons.length > 0
      ? rawData.humanReviewReasons
      : [];

    if (normalizedCategory === 'Other' && !humanReviewReasons.includes('Category classified as Other')) {
      humanReviewReasons.push('Category classified as Other');
    }
    if ((rawData.location === 'Campus Facility' || !rawData.location) && !humanReviewReasons.includes('Location not specifically identified')) {
      humanReviewReasons.push('Location not specifically identified');
    }
    if (rawData.safetyRuleTriggered && !humanReviewReasons.includes('Institutional safety rule escalated priority')) {
      humanReviewReasons.push('Institutional safety rule escalated priority');
    }

    const humanReviewRequired = humanReviewReasons.length > 0 || !!rawData.humanReviewRequired;
    const qualitativeConfidence: QualitativeConfidence =
      rawData.confidence ||
      (humanReviewRequired || normalizedCategory === 'Other'
        ? 'Needs review'
        : rawData.location && rawData.location !== 'Campus Facility'
        ? 'High confidence'
        : 'Moderate confidence');

    return {
      issue: (rawData.issue || fallback.issue).trim(),
      location: (rawData.location || fallback.location).trim(),
      category: normalizedCategory,
      aiRecommendedCategory: rawData.aiRecommendedCategory || rawData.category,
      priority: normalizedPriority,
      aiRecommendedPriority: rawData.aiRecommendedPriority || normalizedPriority,
      finalSystemPriority: rawData.finalSystemPriority || normalizedPriority,
      safetyRuleTriggered: rawData.safetyRuleTriggered ?? fallback.isEmergencyEscalated,
      safetyRuleReason: rawData.safetyRuleReason,
      department: rawData.department || catMapping.dept,
      departmentId: rawData.departmentId || catMapping.deptId,
      keywords: Array.isArray(rawData.keywords) && rawData.keywords.length > 0
        ? rawData.keywords.slice(0, 8)
        : fallback.keywords,
      summary: (rawData.summary || fallback.summary).trim(),
      similarityCandidates,
      confidenceScore: qualitativeConfidence === 'High confidence' ? 0.95 : qualitativeConfidence === 'Moderate confidence' ? 0.85 : 0.65,
      qualitativeConfidence,
      humanReviewRequired,
      humanReviewReasons,
      rationale: rawData.safetyRuleTriggered
        ? `Safety Rule Escalation: ${rawData.safetyRuleReason || 'Escalated by college safety protocol.'}`
        : `AI classification: Assigned to ${normalizedCategory} with ${normalizedPriority} priority for ${rawData.department || catMapping.dept}.`,
      suggestedActions: fallback.suggestedActions,
      estimatedHours,
      source: rawData.source || 'llm',
      modelName: rawData.modelName || payload.model || 'Gemini 3.7 Flash',
      isEmergencyEscalated: rawData.safetyRuleTriggered || rawData.isEmergencyEscalated || false,
      escalationNote: rawData.safetyRuleReason || rawData.escalationNote,
      fallbackUsed: rawData.fallbackUsed || payload.fallback || false,
      disclaimer: AI_DISCLAIMER_TEXT,
      legacyCategory: catMapping.legacy,
      legacyPriority,
    };
  } catch (error: any) {
    console.warn('Network or LLM fetch error; reverting to deterministic fallback:', error);
    return {
      ...fallback,
      source: 'deterministic',
      fallbackUsed: true,
      llmError: error?.message || 'Network connection to backend AI unavailable',
    };
  }
}

/**
 * Fetch Administrative AI Insights from Server API
 */
export async function fetchAdminAIInsights(): Promise<{
  hasData: boolean;
  message?: string;
  insights: any[];
  executiveSummary?: string;
} | null> {
  try {
    const res = await fetch('/api/ai/admin-insights');
    if (!res.ok) return null;
    const payload = await res.json();
    if (payload.success && payload.data) {
      return payload.data;
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch server admin AI insights:', err);
    return null;
  }
}

/**
 * Backward compatibility wrapper for existing components
 */
export function analyzeComplaintText(
  title: string,
  description: string,
  locationHint?: string,
  existingComplaints: Complaint[] = []
): AIAnalysisResult {
  const result = analyzeComplaint(
    {
      text: `${title} ${description}`,
      location: locationHint,
    },
    existingComplaints
  );

  return {
    detectedCategory: result.legacyCategory,
    confidenceScore: result.confidenceScore,
    extractedEntities: {
      location: result.location,
      equipmentOrItem: result.keywords[0] ? result.keywords[0].toUpperCase() : 'General',
      impactLevel: result.priority === 'Emergency' ? 'Critical (Safety Dispatch)' : result.priority === 'High' ? 'High Impact' : 'Standard',
      urgencyReason: result.rationale,
    },
    recommendedPriority: result.legacyPriority,
    priorityRationale: result.rationale,
    recommendedDepartmentId: result.departmentId,
    similarComplaintIds: result.similarityCandidates.map(c => c.id),
    suggestedQuickActions: result.suggestedActions,
    estimatedResolutionHours: result.estimatedHours,
  };
}

/**
 * Helper to answer campus queries in AI Assistant Modal
 */
export async function answerCampusQueryAsync(query: string, existingComplaints: Complaint[] = []): Promise<string> {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.reply) {
        return data.reply;
      }
    }
  } catch (err) {
    console.warn('Campus chat fallback triggered:', err);
  }
  return answerCampusQuery(query, existingComplaints);
}

export function answerCampusQuery(query: string, existingComplaints: Complaint[] = []): string {
  const lower = query.toLowerCase();

  if (lower.includes('wifi') || lower.includes('internet') || lower.includes('network')) {
    const wifiTickets = existingComplaints.filter(c => c.category === 'IT / Network' && (c.status === 'In Progress' || c.status === 'in_progress' || c.status === 'Assigned' || c.status === 'assigned'));
    if (wifiTickets.length > 0) {
      return `There are currently ${wifiTickets.length} active Wi-Fi tickets being addressed by IT Support, including "${wifiTickets[0].title}" in ${wifiTickets[0].location}. If you are experiencing outages elsewhere, please submit a quick report!`;
    }
    return `Campus Wi-Fi (eduroam & Campus-Guest) is operating under normal SLA targets. If you are experiencing slow connections or packet drops in computer labs or dorms, please log an issue with your location.`;
  }

  if (lower.includes('projector') || lower.includes('classroom') || lower.includes('room 204')) {
    return `Classroom AV and smartboard systems are monitored by Facility Management and IT Support. For urgent pre-lecture equipment defects, reports are prioritized with a <2 hour response SLA.`;
  }

  if (lower.includes('water') || lower.includes('leak') || lower.includes('plumbing')) {
    return `Plumbing and water facilities are managed by the Plumbing & Sanitation dispatch team. Active emergency pipe inspections are underway in hostel zones.`;
  }

  if (lower.includes('lost') || lower.includes('found')) {
    return `You can check the campus Lost & Found registry under the Student navigation tab to search or report items with photos and recovery tags.`;
  }

  if (lower.includes('how') && (lower.includes('report') || lower.includes('submit'))) {
    return `To report any campus issue, navigate to "Report Issue", type your issue in plain English or Hinglish (e.g. "Room 204 mein projector kaam nahi kar raha"), and our AI will auto-extract the location, priority, and route it to the appropriate maintenance department!`;
  }

  return `SmartFix AI received your query: "${query}". You can report maintenance issues, track real-time resolution SLAs, search campus work orders, or claim lost items across all campus zones.`;
}

export const aiService = {
  analyzeComplaint,
  analyzeComplaintWithLLM,
  analyzeComplaintText,
  answerCampusQuery,
  answerCampusQueryAsync,
  findSimilarComplaints,
  AI_DISCLAIMER_TEXT,
};

export default aiService;
