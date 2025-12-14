import { generateJSONCompletion, AI_MODELS } from './index';

export async function scoreLeadQuality(
  lead: {
    source: string;
    practiceArea: string;
    caseType?: string;
    urgency?: string;
    budgetIndicated?: boolean;
    previousLegalHelp?: boolean;
    referralSource?: string;
    intakeResponses?: Record<string, unknown>;
  },
  firmProfile: {
    targetPracticeAreas: string[];
    averageCaseValue: number;
    preferredCaseTypes?: string[];
  }
): Promise<{
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
    details: string;
  }[];
  predictedValue: {
    low: number;
    likely: number;
    high: number;
  };
  conversionProbability: number;
  recommendedAction: 'immediate_contact' | 'schedule_consultation' | 'nurture_sequence' | 'low_priority' | 'decline';
  reasoning: string;
}> {
  const prompt = `Score this potential client lead:

Lead Information:
- Source: ${lead.source}
- Practice Area: ${lead.practiceArea}
${lead.caseType ? `- Case Type: ${lead.caseType}` : ''}
${lead.urgency ? `- Urgency: ${lead.urgency}` : ''}
${lead.budgetIndicated !== undefined ? `- Budget Indicated: ${lead.budgetIndicated}` : ''}
${lead.referralSource ? `- Referral Source: ${lead.referralSource}` : ''}
${lead.intakeResponses ? `- Intake Responses: ${JSON.stringify(lead.intakeResponses)}` : ''}

Firm Profile:
- Target Practice Areas: ${firmProfile.targetPracticeAreas.join(', ')}
- Average Case Value: $${firmProfile.averageCaseValue}
${firmProfile.preferredCaseTypes?.length ? `- Preferred Case Types: ${firmProfile.preferredCaseTypes.join(', ')}` : ''}

Score this lead and recommend next action.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal business development analyst. Score leads based on fit, value, and conversion potential.',
    AI_MODELS.casePrediction
  );
}

export async function analyzeLeadSources(
  leads: {
    source: string;
    score: number;
    converted: boolean;
    caseValue?: number;
  }[]
): Promise<{
  sourcePerformance: {
    source: string;
    leadCount: number;
    averageScore: number;
    conversionRate: number;
    averageCaseValue: number;
    roi: 'high' | 'medium' | 'low';
  }[];
  recommendations: string[];
  suggestedBudgetAllocation: {
    source: string;
    currentPercent?: number;
    recommendedPercent: number;
    reason: string;
  }[];
}> {
  const prompt = `Analyze lead source performance:

Lead Data:
${leads.map((l) => `- Source: ${l.source}, Score: ${l.score}, Converted: ${l.converted}, Value: $${l.caseValue || 0}`).join('\n')}

Identify best performing sources and recommend budget allocation.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal marketing analyst. Analyze lead sources and recommend optimizations.',
    AI_MODELS.documentAnalysis
  );
}

export async function predictConversionTimeline(
  lead: {
    source: string;
    practiceArea: string;
    initialContactDate: string;
    interactions: {
      type: string;
      date: string;
      outcome?: string;
    }[];
    currentStage: string;
  }
): Promise<{
  predictedConversionDate: string;
  confidence: number;
  currentProbability: number;
  stageProgression: {
    stage: string;
    probability: number;
    expectedDate: string;
  }[];
  riskFactors: string[];
  recommendedActions: {
    action: string;
    timing: string;
    expectedImpact: string;
  }[];
}> {
  const prompt = `Predict conversion timeline for this lead:

Practice Area: ${lead.practiceArea}
Source: ${lead.source}
Initial Contact: ${lead.initialContactDate}
Current Stage: ${lead.currentStage}

Interaction History:
${lead.interactions.map((i) => `- ${i.date}: ${i.type}${i.outcome ? ` (${i.outcome})` : ''}`).join('\n')}

Predict conversion timeline and recommend actions.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal sales analyst. Predict lead conversion timelines and recommend engagement strategies.',
    AI_MODELS.casePrediction
  );
}

export async function generatePersonalizedOutreach(
  lead: {
    firstName: string;
    lastName: string;
    practiceArea: string;
    source: string;
    concerns?: string[];
    preferredContactMethod?: string;
  },
  attorney: {
    name: string;
    title: string;
    practiceAreas: string[];
    bio?: string;
  }
): Promise<{
  emailSubject: string;
  emailBody: string;
  smsMessage?: string;
  callScript?: string;
  keyTalkingPoints: string[];
  personalizedValue: string;
}> {
  const prompt = `Generate personalized outreach for this lead:

Lead:
- Name: ${lead.firstName} ${lead.lastName}
- Practice Area: ${lead.practiceArea}
- Source: ${lead.source}
${lead.concerns?.length ? `- Concerns: ${lead.concerns.join(', ')}` : ''}
${lead.preferredContactMethod ? `- Preferred Contact: ${lead.preferredContactMethod}` : ''}

Attorney:
- Name: ${attorney.name}
- Title: ${attorney.title}
- Practice Areas: ${attorney.practiceAreas.join(', ')}
${attorney.bio ? `- Bio: ${attorney.bio}` : ''}

Create personalized, compelling outreach content.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal marketing copywriter. Create personalized outreach that resonates with potential clients.',
    AI_MODELS.contentGeneration
  );
}

export async function identifyReferralOpportunities(
  clients: {
    id: string;
    name: string;
    caseOutcome: 'won' | 'settled' | 'ongoing' | 'lost';
    satisfactionScore?: number;
    referralsMade: number;
    lastInteraction: string;
    caseType: string;
  }[]
): Promise<{
  topCandidates: {
    clientId: string;
    clientName: string;
    referralPotential: 'high' | 'medium' | 'low';
    bestApproach: string;
    suggestedTiming: string;
    talkingPoints: string[];
  }[];
  programRecommendations: string[];
}> {
  const prompt = `Identify referral opportunities from this client list:

${clients.map((c) => `- ${c.name}: Outcome: ${c.caseOutcome}, Satisfaction: ${c.satisfactionScore || 'N/A'}, Previous Referrals: ${c.referralsMade}, Last Contact: ${c.lastInteraction}`).join('\n')}

Identify best candidates for referral requests and suggest approach.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal client relationship expert. Identify referral opportunities and recommend approaches.',
    AI_MODELS.documentAnalysis
  );
}
