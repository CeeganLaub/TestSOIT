import { generateJSONCompletion, AI_MODELS } from './index';
import type { AIAnalysisResult } from '@/types';

const DOCUMENT_ANALYSIS_PROMPT = `You are an expert legal document analyzer. Analyze the provided document and extract:

1. A concise summary (2-3 paragraphs)
2. Key terms and definitions
3. Important dates and deadlines
4. All parties mentioned
5. Potential risks or red flags (categorized as low/medium/high)
6. Recommendations for the legal team

Be thorough but concise. Focus on legally significant information.`;

export async function analyzeDocument(
  documentText: string,
  documentType?: string
): Promise<AIAnalysisResult> {
  const prompt = `Document Type: ${documentType || 'Unknown'}

Document Content:
${documentText}

Analyze this document and provide a structured analysis.`;

  return generateJSONCompletion<AIAnalysisResult>(
    prompt,
    DOCUMENT_ANALYSIS_PROMPT,
    AI_MODELS.documentAnalysis
  );
}

export async function extractKeyTerms(documentText: string): Promise<string[]> {
  const prompt = `Extract all important legal terms, defined terms, and key concepts from this document:

${documentText}

Return as a JSON array of strings.`;

  return generateJSONCompletion<string[]>(
    prompt,
    'You are a legal term extractor. Return only a JSON array of terms.',
    AI_MODELS.classification
  );
}

export async function identifyRisks(documentText: string): Promise<{
  level: 'low' | 'medium' | 'high';
  description: string;
}[]> {
  const prompt = `Identify all potential legal risks, problematic clauses, or red flags in this document:

${documentText}

For each risk, provide a severity level (low/medium/high) and description.`;

  return generateJSONCompletion<{ level: 'low' | 'medium' | 'high'; description: string }[]>(
    prompt,
    'You are a legal risk analyst. Return a JSON array of risk objects.',
    AI_MODELS.documentAnalysis
  );
}

export async function summarizeDocument(
  documentText: string,
  targetLength: 'brief' | 'detailed' = 'brief'
): Promise<string> {
  const lengthGuidance = targetLength === 'brief'
    ? 'Provide a 2-3 sentence summary.'
    : 'Provide a comprehensive summary in 2-3 paragraphs.';

  const prompt = `Summarize this legal document for a client who is not a lawyer:

${documentText}

${lengthGuidance}`;

  const result = await generateJSONCompletion<{ summary: string }>(
    prompt,
    'You are a legal document summarizer. Return JSON with a "summary" field.',
    AI_MODELS.summarization
  );

  return result.summary;
}

export async function compareDocuments(
  document1: string,
  document2: string
): Promise<{
  similarities: string[];
  differences: string[];
  recommendations: string[];
}> {
  const prompt = `Compare these two legal documents and identify:
1. Key similarities
2. Important differences
3. Recommendations for review

Document 1:
${document1}

Document 2:
${document2}`;

  return generateJSONCompletion(
    prompt,
    'You are a legal document comparison expert. Return JSON with similarities, differences, and recommendations arrays.',
    AI_MODELS.documentAnalysis
  );
}

export async function generateDocumentTimeline(documentText: string): Promise<{
  date: string;
  event: string;
  importance: 'low' | 'medium' | 'high';
}[]> {
  const prompt = `Extract all dates and associated events/deadlines from this document:

${documentText}

For each date, provide the event description and importance level.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal timeline extractor. Return a JSON array of date/event objects.',
    AI_MODELS.documentAnalysis
  );
}
