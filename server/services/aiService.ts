import { GoogleGenAI, Type } from '@google/genai';
import { ComplaintEntity, DepartmentEntity } from './databaseService';

// Standard taxonomy definitions
export const ALLOWED_CATEGORIES = [
  'IT / Network',
  'Electrical',
  'Classroom Equipment',
  'Cleanliness',
  'Water / Plumbing',
  'Infrastructure',
  'Security',
  'Other',
] as const;

export type StandardCategory = typeof ALLOWED_CATEGORIES[number];

export const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High', 'Emergency'] as const;
export type StandardPriority = typeof ALLOWED_PRIORITIES[number];

export type QualitativeConfidence = 'High confidence' | 'Moderate confidence' | 'Needs review';

export interface SimilarComplaintItem {
  complaintId: string;
  trackingNumber: string;
  title: string;
  location: string;
  category: string;
  status: string;
  upvotes: number;
  reason: string;
}

export interface SimilarityDetectionResult {
  possibleDuplicate: boolean;
  similarComplaints: SimilarComplaintItem[];
}

export interface AIAnalysisResponse {
  issue: string;
  category: StandardCategory;
  aiRecommendedCategory: string;
  priority: StandardPriority;
  aiRecommendedPriority: string;
  finalSystemPriority: StandardPriority;
  safetyRuleTriggered: boolean;
  safetyRuleReason?: string;
  department: string;
  departmentId: string;
  location: string;
  summary: string;
  keywords: string[];
  confidence: QualitativeConfidence;
  humanReviewRequired: boolean;
  humanReviewReasons: string[];
  possibleDuplicate: boolean;
  similarComplaints: SimilarComplaintItem[];
  source: 'llm' | 'deterministic';
  fallbackUsed: boolean;
  fallbackReason?: string;
  modelName?: string;
  disclaimer: string;
  timestamp: string;
}

export const AI_DISCLAIMER_TEXT =
  'AI analysis is an assistive recommendation based on student input. For emergency or safety threats, immediate institutional escalation rules apply.';

// Predefined institutional safety hazard keywords
const SAFETY_EMERGENCY_KEYWORDS = [
  'hazard', 'spark', 'sparks', 'fire', 'electric shock', 'exposed wire', 'exposed live wire',
  'gas leak', 'flood', 'flooding', 'collapse', 'structural danger', 'emergency', 'broken glass',
  'injury', 'smoke', 'explosion', 'immediate danger', 'safety threat', 'short circuit', 'burning smell',
  'live wire', 'open wire', 'flame'
];

const HIGH_PRIORITY_KEYWORDS = [
  'exam', 'midterm', 'final exam', 'entire floor', 'all students', 'whole lab',
  'whole class', 'lecture hall', 'major outage', 'complete blackout', 'no water supply',
  'urgent', 'urgent attention', 'server down', 'admission', 'blocked entrance', 'corridor dark'
];

const LOW_PRIORITY_KEYWORDS = [
  'minor', 'aesthetic', 'paint', 'scratch', 'loose handle', 'squeaky', 'creak',
  'cosmetic', 'suggestion', 'faint noise', 'dirty spot', 'small stain', 'dust on table'
];

// Department deterministic mapping matrix
const CATEGORY_DEPARTMENT_MAPPING: Record<StandardCategory, { department: string; departmentId: string }> = {
  'IT / Network': { department: 'IT Support', departmentId: 'dept_it_support' },
  'Electrical': { department: 'Electrical Maintenance', departmentId: 'dept_electrical_maintenance' },
  'Classroom Equipment': { department: 'Maintenance / IT Support', departmentId: 'dept_facility_management' },
  'Cleanliness': { department: 'Housekeeping', departmentId: 'dept_housekeeping' },
  'Water / Plumbing': { department: 'Facility / Plumbing', departmentId: 'dept_plumbing' },
  'Infrastructure': { department: 'Facility Management', departmentId: 'dept_facility_management' },
  'Security': { department: 'Security Department', departmentId: 'dept_security' },
  'Other': { department: 'Administration', departmentId: 'dept_administration' },
};

// Deterministic rule definitions for classification fallback
interface RulePattern {
  category: StandardCategory;
  keywords: string[];
}

const DETERMINISTIC_RULES: RulePattern[] = [
  {
    category: 'IT / Network',
    keywords: [
      'wifi', 'wi-fi', 'internet', 'network', 'router', 'ethernet', 'lan', 'connection',
      'disconnect', 'packet', 'speed', 'slow internet', 'hotspot', 'portal', 'moodle',
      'login', 'server', 'firewall', 'bandwidth', 'switch', 'down', 'offline', 'buffering',
      'connectivity', 'broadband', 'cable', 'ip address', 'internet nahi'
    ],
  },
  {
    category: 'Electrical',
    keywords: [
      'fan', 'ac', 'air conditioner', 'air conditioning', 'cooler', 'electricity',
      'power', 'light', 'bulb', 'tube light', 'switch', 'socket', 'plug', 'short circuit',
      'spark', 'shock', 'current', 'voltage', 'blackout', 'tripped', 'fuse', 'wire',
      'generator', 'hvac', 'heater', 'dark', 'no power', 'bijli', 'exposed wire', 'live wire'
    ],
  },
  {
    category: 'Classroom Equipment',
    keywords: [
      'projector', 'computer', 'pc', 'monitor', 'screen', 'smartboard', 'smart board',
      'hdmi', 'mic', 'microphone', 'speaker', 'podium', 'audio', 'sound', 'display',
      'whiteboard', 'marker', 'lab pc', 'remote', 'amplifier', 'av', 'flicker', 'blur',
      'kaam nahi kar raha', 'not displaying'
    ],
  },
  {
    category: 'Cleanliness',
    keywords: [
      'cleaning', 'clean', 'dirty', 'garbage', 'trash', 'dust', 'smell', 'odor',
      'waste', 'bin', 'dustbin', 'mess', 'janitor', 'hygiene', 'cockroach', 'pest',
      'mosquito', 'insect', 'spill', 'stain', 'sweep', 'broom', 'dirty floor', 'trash can',
      'safai', 'kachra', 'ganda', 'bad smell'
    ],
  },
  {
    category: 'Water / Plumbing',
    keywords: [
      'water', 'leakage', 'leak', 'tap', 'faucet', 'pipe', 'pipeline', 'flush',
      'restroom', 'toilet', 'washroom', 'drain', 'drainage', 'sink', 'shower', 'sewage',
      'clogged', 'overflow', 'plumbing', 'no water', 'dripping', 'paani', 'geyser', 'tank'
    ],
  },
  {
    category: 'Infrastructure',
    keywords: [
      'building', 'wall', 'door', 'infrastructure', 'window', 'desk', 'chair', 'bench',
      'table', 'ceiling', 'roof', 'floor', 'tile', 'staircase', 'handrail', 'elevator',
      'lift', 'crack', 'paint', 'furniture', 'cupboard', 'lock', 'handle', 'key',
      'balcony', 'glass', 'door lock', 'hinge', 'broken chair', 'gate'
    ],
  },
  {
    category: 'Security',
    keywords: [
      'security', 'suspicious', 'theft', 'stolen', 'guard', 'safety', 'harassment',
      'cctv', 'camera', 'trespass', 'stranger', 'unauthorized', 'threat', 'chori',
      'lost item', 'id card', 'fighting', 'noise', 'night', 'dark corner', 'break-in'
    ],
  },
];

// Lazy-initialization helper for Gemini AI client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Extracts a normalized location from natural language text
 */
function extractLocationFromText(text: string, providedLocation?: string): string {
  if (providedLocation && providedLocation.trim() && providedLocation.trim().toLowerCase() !== 'unknown') {
    return providedLocation.trim();
  }

  const normalized = text.toLowerCase();

  const roomMatch = text.match(/(room\s*\d+[a-z]?|hall\s*\d+|cabin\s*\d+)/i);
  if (roomMatch) return roomMatch[0].replace(/\s+/g, ' ');

  const labMatch = text.match(/(computer\s*lab\s*\d+|lab\s*\d+|ai\s*lab|physics\s*lab|chemistry\s*lab)/i);
  if (labMatch) return labMatch[0].replace(/\s+/g, ' ');

  const blockMatch = text.match(/(hostel\s*block\s*[a-z0-9]|block\s*[a-z0-9]|wing\s*[a-z0-9]|main\s*block)/i);
  if (blockMatch) return blockMatch[0].replace(/\s+/g, ' ');

  const washroomMatch = text.match(/(block\s*[a-z0-9]\s*washroom|washroom|restroom|toilet)/i);
  if (washroomMatch) return washroomMatch[0].replace(/\s+/g, ' ');

  if (normalized.includes('library')) return 'Central Library';
  if (normalized.includes('cafeteria') || normalized.includes('canteen') || normalized.includes('mess')) return 'Cafeteria & Dining Hall';
  if (normalized.includes('auditorium')) return 'Auditorium Main Stage';
  if (normalized.includes('sports complex') || normalized.includes('gym')) return 'Sports Complex';

  return 'Campus Facility';
}

/**
 * Extracts a crisp issue summary title from natural language
 */
function extractIssueTitle(text: string, category: StandardCategory, location: string): string {
  const normalized = text.toLowerCase();

  if (normalized.includes('projector')) {
    return `Projector not working in ${location}`;
  }
  if (normalized.includes('wifi') || normalized.includes('wi-fi') || normalized.includes('internet')) {
    return `Wi-Fi unavailable in ${location}`;
  }
  if (normalized.includes('ac') || normalized.includes('air conditioner')) {
    return `AC not working in ${location}`;
  }
  if (normalized.includes('fan')) {
    return `Ceiling fan malfunction in ${location}`;
  }
  if (normalized.includes('wire') || normalized.includes('spark')) {
    return `Electrical hazard / exposed wire in ${location}`;
  }
  if (normalized.includes('leak') || normalized.includes('pipe') || normalized.includes('water')) {
    return `Water leakage in ${location}`;
  }
  if (normalized.includes('clean') || normalized.includes('dirty') || normalized.includes('garbage')) {
    return `Cleanliness & sanitation request in ${location}`;
  }
  if (normalized.includes('door') || normalized.includes('lock') || normalized.includes('chair') || normalized.includes('window')) {
    return `Infrastructure repair in ${location}`;
  }

  const firstSentence = text.split(/[.\n!?]/)[0].trim();
  if (firstSentence.length > 5 && firstSentence.length <= 60) {
    return firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1);
  }

  return `${category} issue at ${location}`;
}

/**
 * Deterministic Safety Rule Engine
 * Evaluates college-defined safety and emergency override rules
 */
export function evaluateSafetyRules(
  complaintText: string,
  aiPriority: string,
  aiCategory: string
): {
  finalPriority: StandardPriority;
  safetyRuleTriggered: boolean;
  safetyRuleReason?: string;
} {
  const lower = complaintText.toLowerCase();

  // Rule 1: Immediate Safety & Hazard (Fire, exposed wires, sparks, gas leak, building collapse)
  const isEmergencyHazard = SAFETY_EMERGENCY_KEYWORDS.some(kw => lower.includes(kw));

  if (isEmergencyHazard) {
    return {
      finalPriority: 'Emergency',
      safetyRuleTriggered: true,
      safetyRuleReason: 'College Safety Protocol: Potential electrical, fire, or structural hazard detected. Direct Emergency priority enforced.',
    };
  }

  // Rule 2: Major Service Disruption (Exams, entire floors, complete blackouts)
  const isMajorDisruption = HIGH_PRIORITY_KEYWORDS.some(kw => lower.includes(kw));
  if (isMajorDisruption && aiPriority !== 'Emergency') {
    return {
      finalPriority: 'High',
      safetyRuleTriggered: aiPriority === 'Low' || aiPriority === 'Medium',
      safetyRuleReason: aiPriority === 'Low' || aiPriority === 'Medium'
        ? 'College Operations Policy: Academic assessment or multi-user facility disruption escalated to High priority.'
        : undefined,
    };
  }

  // Rule 3: Minor cosmetic issues
  const isMinor = LOW_PRIORITY_KEYWORDS.some(kw => lower.includes(kw));
  if (isMinor && !isEmergencyHazard && !isMajorDisruption) {
    const validP: StandardPriority = (aiPriority === 'Low' || aiPriority === 'Medium') ? (aiPriority as StandardPriority) : 'Low';
    return {
      finalPriority: validP,
      safetyRuleTriggered: false,
    };
  }

  // Rule 4: Normal validated priority
  const normalizedAiPriority: StandardPriority =
    ALLOWED_PRIORITIES.includes(aiPriority as StandardPriority) ? (aiPriority as StandardPriority) : 'Medium';

  return {
    finalPriority: normalizedAiPriority,
    safetyRuleTriggered: false,
  };
}

/**
 * Deterministic Department Mapping Layer
 * Validates and routes AI recommendation to the institutional department
 */
export function validateDepartmentRouting(category: StandardCategory, aiRecommendedDept?: string): { department: string; departmentId: string } {
  const mapping = CATEGORY_DEPARTMENT_MAPPING[category] || CATEGORY_DEPARTMENT_MAPPING['Other'];
  return mapping;
}

/**
 * Similar Complaint Detection
 * Compares new complaint against existing database complaints using category, location, and keywords
 */
export function detectSimilarComplaints(
  complaintText: string,
  category: StandardCategory,
  location: string,
  existingComplaints: ComplaintEntity[] = []
): SimilarityDetectionResult {
  if (!existingComplaints || existingComplaints.length === 0) {
    return { possibleDuplicate: false, similarComplaints: [] };
  }

  const normalizedText = complaintText.toLowerCase();
  const normalizedLoc = location.toLowerCase();

  const stopWords = new Set([
    'bhai', 'mein', 'nahi', 'raha', 'this', 'that', 'from', 'with', 'have',
    'been', 'last', 'please', 'there', 'near', 'room', 'floor', 'block', 'days'
  ]);

  const searchWords = normalizedText
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !stopWords.has(w));

  const similarList: SimilarComplaintItem[] = [];

  for (const comp of existingComplaints) {
    // Only check active or recent complaints
    if (comp.status === 'Resolved' || comp.status === 'Closed') continue;

    const compText = `${comp.title} ${comp.description} ${comp.original_message || ''} ${comp.issue || ''}`.toLowerCase();
    const compLoc = `${comp.location} ${comp.building || ''} ${comp.room_number || ''}`.toLowerCase();

    // Check location match
    const locMatch =
      normalizedLoc !== 'campus facility' &&
      (compLoc.includes(normalizedLoc) ||
        normalizedLoc.includes(compLoc) ||
        (normalizedLoc.includes('204') && compLoc.includes('204')) ||
        (normalizedLoc.includes('lab 2') && compLoc.includes('lab 2')) ||
        (normalizedLoc.includes('lab 3') && compLoc.includes('lab 3')) ||
        (normalizedLoc.includes('block b') && compLoc.includes('block b')) ||
        (normalizedLoc.includes('block c') && compLoc.includes('block c')));

    // Check category match
    const catMatch = comp.category.toLowerCase() === category.toLowerCase();

    // Check keyword overlap
    let sharedWordCount = 0;
    const matchedWords: string[] = [];
    for (const word of searchWords) {
      if (compText.includes(word) || compLoc.includes(word)) {
        sharedWordCount++;
        matchedWords.push(word);
      }
    }

    if (locMatch && catMatch) {
      similarList.push({
        complaintId: comp.id,
        trackingNumber: `SF-${comp.id.substring(5, 8)}`,
        title: comp.title || comp.issue || 'Active Campus Issue',
        location: comp.location || comp.building,
        category: comp.category,
        status: comp.status,
        upvotes: comp.upvotes || 1,
        reason: `Same location (${comp.location}) and ${comp.category} issue`,
      });
    } else if (locMatch && sharedWordCount >= 1) {
      similarList.push({
        complaintId: comp.id,
        trackingNumber: `SF-${comp.id.substring(5, 8)}`,
        title: comp.title || comp.issue || 'Active Campus Issue',
        location: comp.location || comp.building,
        category: comp.category,
        status: comp.status,
        upvotes: comp.upvotes || 1,
        reason: `Overlapping issue symptoms in same location (${matchedWords.slice(0, 2).join(', ')})`,
      });
    } else if (catMatch && sharedWordCount >= 3) {
      similarList.push({
        complaintId: comp.id,
        trackingNumber: `SF-${comp.id.substring(5, 8)}`,
        title: comp.title || comp.issue || 'Active Campus Issue',
        location: comp.location || comp.building,
        category: comp.category,
        status: comp.status,
        upvotes: comp.upvotes || 1,
        reason: `Similar ${category} symptoms: "${matchedWords.slice(0, 2).join(', ')}"`,
      });
    }
  }

  const topSimilar = similarList.slice(0, 3);

  return {
    possibleDuplicate: topSimilar.length > 0,
    similarComplaints: topSimilar,
  };
}

/**
 * Deterministic Fallback Engine
 * Runs transparently when Gemini API key is missing or when LLM errors occur
 */
export function runDeterministicAnalysis(
  complaintText: string,
  locationHint?: string,
  existingComplaints: ComplaintEntity[] = [],
  fallbackReason?: string
): AIAnalysisResponse {
  const combinedText = `${complaintText} ${locationHint || ''}`.toLowerCase();
  const detectedLocation = extractLocationFromText(complaintText, locationHint);

  let bestCategory: StandardCategory = 'Other';
  let maxScore = 0;
  const matchedKeywords: string[] = [];

  for (const rule of DETERMINISTIC_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (combinedText.includes(kw)) {
        score += kw.length > 5 ? 2 : 1;
        if (!matchedKeywords.includes(kw)) {
          matchedKeywords.push(kw);
        }
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestCategory = rule.category;
    }
  }

  // Safety evaluation
  const safetyEval = evaluateSafetyRules(complaintText, maxScore > 0 ? 'Medium' : 'Low', bestCategory);

  const deptInfo = validateDepartmentRouting(bestCategory);
  const issue = extractIssueTitle(complaintText, bestCategory, detectedLocation);

  const similarity = detectSimilarComplaints(complaintText, bestCategory, detectedLocation, existingComplaints);

  // Confidence & human review checks
  const humanReviewReasons: string[] = [];
  if (bestCategory === 'Other') humanReviewReasons.push('Category classified as Other');
  if (detectedLocation === 'Campus Facility' || detectedLocation === 'Unknown') humanReviewReasons.push('Location not specifically identified');
  if (safetyEval.finalPriority === 'Emergency') humanReviewReasons.push('Emergency priority safety check required');
  if (fallbackReason) humanReviewReasons.push('Processed via deterministic fallback engine');

  const humanReviewRequired = humanReviewReasons.length > 0;
  const confidence: QualitativeConfidence = maxScore >= 2 && !humanReviewRequired ? 'High confidence' : maxScore >= 1 ? 'Moderate confidence' : 'Needs review';

  return {
    issue,
    category: bestCategory,
    aiRecommendedCategory: bestCategory,
    priority: safetyEval.finalPriority,
    aiRecommendedPriority: maxScore > 0 ? 'Medium' : 'Low',
    finalSystemPriority: safetyEval.finalPriority,
    safetyRuleTriggered: safetyEval.safetyRuleTriggered,
    safetyRuleReason: safetyEval.safetyRuleReason,
    department: deptInfo.department,
    departmentId: deptInfo.departmentId,
    location: detectedLocation,
    summary: `${issue}. Priority classified as ${safetyEval.finalPriority} for ${deptInfo.department}.`,
    keywords: matchedKeywords.slice(0, 6),
    confidence,
    humanReviewRequired,
    humanReviewReasons,
    possibleDuplicate: similarity.possibleDuplicate,
    similarComplaints: similarity.similarComplaints,
    source: 'deterministic',
    fallbackUsed: true,
    fallbackReason: fallbackReason || 'Deterministic campus rules engine activated.',
    disclaimer: AI_DISCLAIMER_TEXT,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Helper to execute Gemini generateContent with automatic retry and model fallback
 */
const CANDIDATE_MODELS = [
  { id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash' },
  { id: 'gemini-flash-latest', label: 'Gemini Flash Latest' },
  { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite' },
];

async function generateWithModelFallback(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction: string,
  schema: any
): Promise<{ text: string; modelUsed: string }> {
  let lastError: any = null;

  for (const modelCandidate of CANDIDATE_MODELS) {
    // Try up to 2 attempts per model for transient 503 / 429 errors
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelCandidate.id,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: schema,
          },
        });

        if (response.text && response.text.trim().length > 0) {
          return { text: response.text, modelUsed: modelCandidate.label };
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('429') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('high demand') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('fetch failed');

        if (isTransient && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 350 * attempt));
          continue; // retry same model once
        }
        // Break to try next candidate model
        break;
      }
    }
  }

  throw lastError || new Error('All Gemini model candidates were unavailable.');
}

/**
 * Server-Side Gemini AI Complaint Analysis
 * Uses @google/genai with strict JSON schema, multi-model fallback, and deterministic safety validation
 */
export async function analyzeComplaintWithGemini(
  complaintText: string,
  locationHint?: string,
  existingComplaints: ComplaintEntity[] = []
): Promise<AIAnalysisResponse> {
  const trimmed = complaintText.trim();
  if (!trimmed) {
    return runDeterministicAnalysis('Campus maintenance request', locationHint, existingComplaints);
  }

  const ai = getGeminiClient();

  if (!ai) {
    return runDeterministicAnalysis(
      trimmed,
      locationHint,
      existingComplaints,
      'Gemini API key is not configured; using deterministic fallback.'
    );
  }

  const prompt = `You are the SMARTFIX Campus Maintenance AI Classifier.
Analyze the following student complaint (which may be written in English, Hinglish, or informal student phrasing) and extract structured details strictly conforming to campus maintenance taxonomy.

Student's Location Hint: "${locationHint || 'Unknown'}"
Student's Complaint Description:
"""
${trimmed}
"""

Strict Taxonomy Rules:
1. "category" MUST be EXACTLY one of: "IT / Network", "Electrical", "Classroom Equipment", "Cleanliness", "Water / Plumbing", "Infrastructure", "Security", "Other".
2. "priority" MUST be EXACTLY one of: "Low", "Medium", "High", "Emergency".
   - "Emergency": Sparks, exposed wires, fire, smoke, gas leak, severe flooding, immediate safety hazard.
   - "High": Wi-Fi down during exam, entire classroom or lab outage, complete blackout, no water supply.
   - "Medium": Standard classroom or equipment defect (e.g. projector not working in Room 204 for 2 days).
   - "Low": Minor cosmetic or non-urgent maintenance.
3. "issue": A crisp, professional, capitalized title summarizing the exact fault (e.g. "Projector not working", "Wi-Fi unavailable", "Water leakage", "Electrical wire exposed").
4. "location": Extracted campus location, room, lab, or hostel block (e.g. "Room 204", "Computer Lab 2", "Block B washroom", "Hostel Block C"). If not mentioned, use the location hint.
5. "department": Recommended department (e.g. "IT Support", "Electrical Maintenance", "Maintenance / IT Support", "Housekeeping", "Facility / Plumbing", "Facility Management", "Security Department", "Administration").
6. "keywords": Array of 2 to 6 key semantic domain terms (e.g. ["projector", "classroom equipment"]).
7. "summary": A professional 1-2 sentence executive briefing explaining the reported fault and duration/impact.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      issue: {
        type: Type.STRING,
        description: 'Concise professional title of the problem.',
      },
      location: {
        type: Type.STRING,
        description: 'Extracted campus room, lab, or building.',
      },
      category: {
        type: Type.STRING,
        description: 'One of the 8 allowed standard categories.',
      },
      priority: {
        type: Type.STRING,
        description: 'Recommended priority (Low, Medium, High, Emergency).',
      },
      department: {
        type: Type.STRING,
        description: 'Recommended maintenance department.',
      },
      keywords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Keywords identified.',
      },
      summary: {
        type: Type.STRING,
        description: '1-2 sentence executive summary.',
      },
    },
    required: ['issue', 'location', 'category', 'priority', 'department', 'keywords', 'summary'],
  };

  try {
    const { text: rawJson, modelUsed } = await generateWithModelFallback(
      ai,
      prompt,
      'You are a strict, assist-only campus complaint classification AI. Always return structured JSON strictly following the schema. Never guess or fabricate ungrounded locations.',
      schema
    );

    const parsed = JSON.parse(rawJson.trim());

    // Strict validation of category
    let fallbackUsed = false;
    let fallbackReason: string | undefined;

    let validCategory: StandardCategory;
    if (ALLOWED_CATEGORIES.includes(parsed.category as StandardCategory)) {
      validCategory = parsed.category as StandardCategory;
    } else {
      fallbackUsed = true;
      fallbackReason = `Gemini returned invalid category "${parsed.category}"; reverted to deterministic category.`;
      const fallbackAnalysis = runDeterministicAnalysis(trimmed, locationHint, existingComplaints);
      validCategory = fallbackAnalysis.category;
    }

    // Strict validation of priority & Safety Rule evaluation
    const aiPriorityRaw = parsed.priority || 'Medium';
    const safetyEvaluation = evaluateSafetyRules(trimmed, aiPriorityRaw, validCategory);

    // Department routing validation
    const deptInfo = validateDepartmentRouting(validCategory, parsed.department);

    // Location extraction validation
    const detectedLocation =
      parsed.location && parsed.location.trim() && parsed.location.trim().toLowerCase() !== 'unknown'
        ? parsed.location.trim()
        : extractLocationFromText(trimmed, locationHint);

    // Similar complaint detection
    const similarity = detectSimilarComplaints(trimmed, validCategory, detectedLocation, existingComplaints);

    // Confidence and Human Review triggers
    const humanReviewReasons: string[] = [];
    if (validCategory === 'Other') humanReviewReasons.push('Category classified as Other');
    if (detectedLocation === 'Campus Facility' || detectedLocation === 'Unknown') humanReviewReasons.push('Location could not be definitively identified');
    if (safetyEvaluation.finalPriority === 'Emergency') humanReviewReasons.push('Emergency safety review required');
    if (safetyEvaluation.safetyRuleTriggered) humanReviewReasons.push('Institutional safety rule overrode AI priority recommendation');
    if (fallbackUsed) humanReviewReasons.push(fallbackReason!);

    const humanReviewRequired = humanReviewReasons.length > 0;
    const confidence: QualitativeConfidence =
      humanReviewRequired || validCategory === 'Other'
        ? 'Needs review'
        : detectedLocation !== 'Campus Facility'
        ? 'High confidence'
        : 'Moderate confidence';

    const cleanKeywords = Array.isArray(parsed.keywords)
      ? parsed.keywords.map((k: any) => String(k).toLowerCase()).slice(0, 6)
      : [];

    return {
      issue: (parsed.issue || extractIssueTitle(trimmed, validCategory, detectedLocation)).trim(),
      category: validCategory,
      aiRecommendedCategory: parsed.category || validCategory,
      priority: safetyEvaluation.finalPriority,
      aiRecommendedPriority: parsed.priority || 'Medium',
      finalSystemPriority: safetyEvaluation.finalPriority,
      safetyRuleTriggered: safetyEvaluation.safetyRuleTriggered,
      safetyRuleReason: safetyEvaluation.safetyRuleReason,
      department: deptInfo.department,
      departmentId: deptInfo.departmentId,
      location: detectedLocation,
      summary: (parsed.summary || `${parsed.issue || 'Issue'} reported at ${detectedLocation}.`).trim(),
      keywords: cleanKeywords,
      confidence,
      humanReviewRequired,
      humanReviewReasons,
      possibleDuplicate: similarity.possibleDuplicate,
      similarComplaints: similarity.similarComplaints,
      source: fallbackUsed ? 'deterministic' : 'llm',
      fallbackUsed,
      fallbackReason,
      modelName: modelUsed,
      disclaimer: AI_DISCLAIMER_TEXT,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    const errorMsg = error?.message || 'High demand / service unavailable';
    console.warn('[AI_SERVICE] Gemini models busy or unavailable; applying deterministic classification fallback.');
    return runDeterministicAnalysis(
      trimmed,
      locationHint,
      existingComplaints,
      `AI service experiencing high demand (${errorMsg}). Instant deterministic classification applied.`
    );
  }
}

/**
 * Backend Admin AI Insights Engine
 * Generates administrative pattern detection from actual database records
 */
export async function generateAdminAIInsights(
  complaints: ComplaintEntity[],
  departments: DepartmentEntity[]
): Promise<{
  hasData: boolean;
  message?: string;
  insights: Array<{
    id: string;
    type: 'recurring_problem' | 'repeated_location' | 'common_category' | 'department_attention' | 'infrastructure_risk';
    title: string;
    description: string;
    evidence: string;
    badge: string;
    badgeColor: 'rose' | 'amber' | 'blue' | 'purple' | 'emerald';
    recommendation: string;
    relatedCount: number;
    relatedComplaintIds: string[];
  }>;
  executiveSummary?: string;
}> {
  if (!complaints || complaints.length < 2) {
    return {
      hasData: false,
      message: 'No sufficient complaint data available for AI insights.',
      insights: [],
    };
  }

  // 1. Group complaints by Category + Location
  const clustersMap = new Map<string, ComplaintEntity[]>();
  const locationMap = new Map<string, { count: number; ids: string[]; cats: Set<string> }>();
  const categoryCounts: Record<string, { count: number; ids: string[] }> = {};

  for (const c of complaints) {
    const cat = c.category || 'Other';
    const loc = (c.location || c.building || 'Campus Zone').trim();
    const clusterKey = `${cat}__${loc.toLowerCase()}`;

    if (!clustersMap.has(clusterKey)) {
      clustersMap.set(clusterKey, []);
    }
    clustersMap.get(clusterKey)!.push(c);

    // Location counting
    if (!locationMap.has(loc)) {
      locationMap.set(loc, { count: 0, ids: [], cats: new Set() });
    }
    const locEntry = locationMap.get(loc)!;
    locEntry.count++;
    locEntry.ids.push(c.id);
    locEntry.cats.add(cat);

    // Category counting
    if (!categoryCounts[cat]) {
      categoryCounts[cat] = { count: 0, ids: [] };
    }
    categoryCounts[cat].count++;
    categoryCounts[cat].ids.push(c.id);
  }

  const generatedInsights: any[] = [];

  // Insight A: Recurring issues in the same location
  clustersMap.forEach((items, key) => {
    if (items.length >= 2) {
      const [cat] = key.split('__');
      const loc = items[0].location || items[0].building || 'Campus Zone';
      const hasEmergency = items.some(i => i.priority === 'Emergency');

      generatedInsights.push({
        id: `ai_insight_cluster_${items[0].id}`,
        type: 'recurring_problem',
        title: `Recurring Issue: ${items[0].category} in ${loc}`,
        description: `${items[0].category}-related complaints appear repeatedly around ${loc} (${items.length} verified complaints).`,
        evidence: `Extracted from ${items.length} database tickets matching this location and taxonomy cluster.`,
        badge: `${items.length} Linked Tickets`,
        badgeColor: hasEmergency ? 'rose' : 'amber',
        recommendation: `Schedule targeted preventive inspection and hardware diagnosis at ${loc} to halt recurring failures.`,
        relatedCount: items.length,
        relatedComplaintIds: items.map(i => i.id),
      });
    }
  });

  // Insight B: Repeated location hotspot
  const sortedLocations = Array.from(locationMap.entries()).sort((a, b) => b[1].count - a[1].count);
  if (sortedLocations.length > 0 && sortedLocations[0][1].count >= 2) {
    const [topLoc, data] = sortedLocations[0];
    const catList = Array.from(data.cats).join(', ');
    generatedInsights.push({
      id: `ai_insight_location_${topLoc.replace(/\s+/g, '_')}`,
      type: 'repeated_location',
      title: `Campus Hotspot: ${topLoc}`,
      description: `${topLoc} is currently the most active maintenance zone across campus with ${data.count} reported issues.`,
      evidence: `Accounts for ${Math.round((data.count / complaints.length) * 100)}% of total complaints across categories: ${catList}.`,
      badge: 'Location Hotspot',
      badgeColor: 'purple',
      recommendation: `Conduct a facility-wide audit across ${topLoc} to resolve systemic power, AV, or plumbing bottlenecks.`,
      relatedCount: data.count,
      relatedComplaintIds: data.ids,
    });
  }

  // Insight C: Dominant complaint category
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1].count - a[1].count);
  if (sortedCategories.length > 0 && sortedCategories[0][1].count > 0) {
    const [topCat, catData] = sortedCategories[0];
    const pct = Math.round((catData.count / complaints.length) * 100);
    generatedInsights.push({
      id: `ai_insight_category_${topCat.replace(/[\s/]+/g, '_')}`,
      type: 'common_category',
      title: `Dominant Category: ${topCat} (${pct}% of all issues)`,
      description: `${topCat} represents the largest volume of campus complaints logged in the database.`,
      evidence: `${catData.count} of ${complaints.length} database records belong to this category.`,
      badge: 'Dominant Category',
      badgeColor: 'emerald',
      recommendation: `Review parts inventory and technician shift staffing dedicated to ${topCat}.`,
      relatedCount: catData.count,
      relatedComplaintIds: catData.ids,
    });
  }

  // Insight D: Department workload bottleneck
  const deptPendingMap: Record<string, { count: number; name: string; ids: string[] }> = {};
  complaints.forEach(c => {
    if (c.status !== 'Resolved' && c.status !== 'Closed') {
      const dId = c.department_id || 'dept_administration';
      const dName = departments.find(d => d.id === dId)?.name || 'General Operations';
      if (!deptPendingMap[dId]) {
        deptPendingMap[dId] = { count: 0, name: dName, ids: [] };
      }
      deptPendingMap[dId].count++;
      deptPendingMap[dId].ids.push(c.id);
    }
  });

  const sortedPendingDepts = Object.entries(deptPendingMap).sort((a, b) => b[1].count - a[1].count);
  if (sortedPendingDepts.length > 0 && sortedPendingDepts[0][1].count > 0) {
    const [, deptData] = sortedPendingDepts[0];
    generatedInsights.push({
      id: `ai_insight_dept_pending`,
      type: 'department_attention',
      title: `Department Requiring Attention: ${deptData.name}`,
      description: `${deptData.name} currently has ${deptData.count} open or in-progress work orders requiring technician resolution.`,
      evidence: `Derived from real-time database ticket statuses across all active campus queues.`,
      badge: 'High Workload',
      badgeColor: 'rose',
      recommendation: `Evaluate staff bandwidth or reassign technician dispatch to clear backlog.`,
      relatedCount: deptData.count,
      relatedComplaintIds: deptData.ids,
    });
  }

  return {
    hasData: true,
    insights: generatedInsights,
    executiveSummary: `Analysis of ${complaints.length} verified database tickets identified ${generatedInsights.length} operational patterns.`,
  };
}
