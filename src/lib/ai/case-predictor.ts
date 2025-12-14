import { generateJSONCompletion, AI_MODELS } from './index';
import type { CasePrediction } from '@/types';

const CASE_PREDICTION_PROMPT = `You are an expert legal analyst with decades of experience predicting case outcomes. Analyze the provided case details and provide:

1. Win probability (0-1 scale) based on the facts, evidence, and legal precedents
2. Estimated settlement range (if applicable)
3. Key factors that will influence the outcome (positive, negative, neutral) with weights
4. Similar cases for reference

Be analytical and objective. Base your analysis on legal principles and precedents.
Important: This is for internal legal strategy only, not for client communication.`;

export async function predictCaseOutcome(caseDetails: {
  practiceArea: string;
  caseType: string;
  description: string;
  evidence?: string[];
  jurisdiction?: string;
  opposingCounsel?: string;
  judgeName?: string;
}): Promise<CasePrediction> {
  const prompt = `Analyze this case and predict the outcome:

Practice Area: ${caseDetails.practiceArea}
Case Type: ${caseDetails.caseType}
Jurisdiction: ${caseDetails.jurisdiction || 'Not specified'}
Judge: ${caseDetails.judgeName || 'Not assigned'}
Opposing Counsel: ${caseDetails.opposingCounsel || 'Unknown'}

Case Description:
${caseDetails.description}

Evidence Available:
${caseDetails.evidence?.join('\n') || 'Not specified'}

Provide a comprehensive prediction analysis.`;

  return generateJSONCompletion<CasePrediction>(
    prompt,
    CASE_PREDICTION_PROMPT,
    AI_MODELS.casePrediction
  );
}

export async function assessCaseComplexity(caseDetails: {
  practiceArea: string;
  description: string;
  parties: number;
  documentCount: number;
}): Promise<{
  complexityScore: number;
  factors: string[];
  estimatedDuration: string;
  recommendedTeamSize: number;
}> {
  const prompt = `Assess the complexity of this legal case:

Practice Area: ${caseDetails.practiceArea}
Number of Parties: ${caseDetails.parties}
Document Count: ${caseDetails.documentCount}

Description:
${caseDetails.description}

Provide complexity score (0-1), contributing factors, estimated duration, and recommended team size.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal case complexity analyst. Provide accurate assessments for resource planning.',
    AI_MODELS.casePrediction
  );
}

export async function identifyLegalPrecedents(caseDetails: {
  practiceArea: string;
  caseType: string;
  keyIssues: string[];
  jurisdiction: string;
}): Promise<{
  precedents: {
    caseName: string;
    citation: string;
    relevance: string;
    outcome: string;
    applicability: 'strongly_applicable' | 'somewhat_applicable' | 'distinguishable';
  }[];
  recommendations: string[];
}> {
  const prompt = `Identify relevant legal precedents for this case:

Practice Area: ${caseDetails.practiceArea}
Case Type: ${caseDetails.caseType}
Jurisdiction: ${caseDetails.jurisdiction}
Key Issues:
${caseDetails.keyIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

Find the most relevant precedents and explain their applicability.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal research expert. Identify relevant case law and precedents.',
    AI_MODELS.casePrediction
  );
}

export async function generateCaseStrategy(caseDetails: {
  practiceArea: string;
  caseType: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  clientGoals: string;
}): Promise<{
  recommendedStrategy: string;
  alternativeStrategies: string[];
  riskMitigation: string[];
  timeline: { phase: string; duration: string; activities: string[] }[];
  keyMilestones: string[];
}> {
  const prompt = `Develop a legal strategy for this case:

Practice Area: ${caseDetails.practiceArea}
Case Type: ${caseDetails.caseType}
Client Goals: ${caseDetails.clientGoals}

Case Description:
${caseDetails.description}

Strengths:
${caseDetails.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Weaknesses:
${caseDetails.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

Provide a comprehensive strategy recommendation.`;

  return generateJSONCompletion(
    prompt,
    'You are a senior legal strategist. Develop winning strategies based on case facts.',
    AI_MODELS.casePrediction
  );
}

export async function estimateSettlementValue(caseDetails: {
  caseType: string;
  damages: {
    type: string;
    amount?: number;
    description: string;
  }[];
  liability: 'clear' | 'disputed' | 'shared';
  jurisdiction: string;
}): Promise<{
  lowEstimate: number;
  highEstimate: number;
  mostLikelyValue: number;
  factors: string[];
  recommendations: string[];
}> {
  const prompt = `Estimate settlement value for this case:

Case Type: ${caseDetails.caseType}
Jurisdiction: ${caseDetails.jurisdiction}
Liability: ${caseDetails.liability}

Damages:
${caseDetails.damages.map((d, i) => `${i + 1}. ${d.type}: ${d.description}${d.amount ? ` ($${d.amount})` : ''}`).join('\n')}

Provide settlement range estimate with supporting factors.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal valuation expert. Provide realistic settlement estimates.',
    AI_MODELS.casePrediction
  );
}
