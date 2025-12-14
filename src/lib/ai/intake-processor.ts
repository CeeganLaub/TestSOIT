import { generateJSONCompletion, generateCompletion, AI_MODELS } from './index';

export async function generateIntakeForm(
  practiceArea: string,
  caseType?: string
): Promise<{
  fields: {
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
    helpText?: string;
  }[];
  suggestedFollowUp: string[];
}> {
  const prompt = `Generate a comprehensive intake form for:

Practice Area: ${practiceArea}
${caseType ? `Case Type: ${caseType}` : ''}

Create form fields that gather all necessary information for initial case evaluation.
Include personal information, case-specific details, and relevant documentation requests.
Use appropriate field types: text, textarea, select, checkbox, radio, date, email, phone, file.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal intake specialist. Design intake forms that capture essential client and case information.',
    AI_MODELS.contentGeneration
  );
}

export async function processIntakeResponse(
  formSchema: { fields: { id: string; label: string; type: string }[] },
  responses: Record<string, unknown>
): Promise<{
  summary: string;
  extractedData: {
    clientInfo: Record<string, unknown>;
    caseInfo: Record<string, unknown>;
    urgentItems: string[];
    missingInformation: string[];
  };
  suggestedCaseType: string;
  initialAssessment: string;
  recommendedNextSteps: string[];
}> {
  const formattedResponses = formSchema.fields
    .map((field) => `${field.label}: ${responses[field.id] || 'Not provided'}`)
    .join('\n');

  const prompt = `Process this intake form submission:

${formattedResponses}

Extract and organize the information, suggest case type, provide initial assessment, and recommend next steps.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal intake analyst. Process submissions and provide actionable insights for case evaluation.',
    AI_MODELS.documentAnalysis
  );
}

export async function identifyConflicts(
  intakeData: {
    clientName: string;
    opposingParty?: string;
    relatedParties?: string[];
    companyName?: string;
  },
  existingClients: {
    name: string;
    company?: string;
    cases: { opposingParty?: string }[];
  }[]
): Promise<{
  hasConflict: boolean;
  conflicts: {
    type: 'direct' | 'indirect' | 'potential';
    description: string;
    existingClientId?: string;
    severity: 'high' | 'medium' | 'low';
  }[];
  recommendations: string[];
}> {
  const prompt = `Check for conflicts of interest:

New Client: ${intakeData.clientName}
${intakeData.companyName ? `Company: ${intakeData.companyName}` : ''}
${intakeData.opposingParty ? `Opposing Party: ${intakeData.opposingParty}` : ''}
${intakeData.relatedParties?.length ? `Related Parties: ${intakeData.relatedParties.join(', ')}` : ''}

Existing Clients:
${existingClients.map((c) => `- ${c.name}${c.company ? ` (${c.company})` : ''}: Cases against ${c.cases.map((cs) => cs.opposingParty).filter(Boolean).join(', ') || 'N/A'}`).join('\n')}

Identify any direct, indirect, or potential conflicts of interest.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal ethics expert specializing in conflict of interest analysis.',
    AI_MODELS.casePrediction
  );
}

export async function scoreLeadQuality(
  intakeData: Record<string, unknown>,
  practiceArea: string
): Promise<{
  score: number;
  factors: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
  }[];
  predictedValue: {
    low: number;
    high: number;
    likely: number;
  };
  recommendation: 'pursue' | 'review' | 'decline';
  reasoning: string;
}> {
  const prompt = `Score this potential client lead:

Practice Area: ${practiceArea}
Intake Data:
${Object.entries(intakeData).map(([k, v]) => `${k}: ${v}`).join('\n')}

Evaluate lead quality based on: case viability, potential value, client fit, and resource requirements.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal business development analyst. Score leads based on case viability and firm fit.',
    AI_MODELS.casePrediction
  );
}

export async function generateFollowUpQuestions(
  intakeData: Record<string, unknown>,
  practiceArea: string
): Promise<{
  questions: {
    question: string;
    importance: 'required' | 'recommended' | 'optional';
    reason: string;
  }[];
  documentRequests: {
    document: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}> {
  const prompt = `Based on this intake submission, generate follow-up questions:

Practice Area: ${practiceArea}
Current Information:
${Object.entries(intakeData).map(([k, v]) => `${k}: ${v}`).join('\n')}

Identify missing information needed for case evaluation and document requirements.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal intake specialist. Identify gaps in client information.',
    AI_MODELS.documentAnalysis
  );
}
