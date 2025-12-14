import { generateJSONCompletion, AI_MODELS } from './index';
import type { SentimentAnalysis } from '@/types';

const SENTIMENT_ANALYSIS_PROMPT = `You are an expert at analyzing client communication sentiment in a legal context. Analyze the message and determine:

1. Overall sentiment (positive, negative, neutral)
2. Confidence level (0-1)
3. Urgency level (low, medium, high)
4. Suggested action for the legal team

Consider the legal context - clients may be stressed, confused, or frustrated. Be empathetic in your analysis.`;

export async function analyzeSentiment(message: string): Promise<SentimentAnalysis> {
  const prompt = `Analyze the sentiment of this client message:

"${message}"

Provide sentiment analysis with recommended response approach.`;

  return generateJSONCompletion<SentimentAnalysis>(
    prompt,
    SENTIMENT_ANALYSIS_PROMPT,
    AI_MODELS.classification
  );
}

export async function analyzeClientSatisfaction(
  messages: { content: string; timestamp: string; isFromClient: boolean }[]
): Promise<{
  overallSatisfaction: number;
  trend: 'improving' | 'declining' | 'stable';
  concerns: string[];
  positiveIndicators: string[];
  recommendations: string[];
}> {
  const messageHistory = messages
    .map((m) => `[${m.timestamp}] ${m.isFromClient ? 'Client' : 'Attorney'}: ${m.content}`)
    .join('\n');

  const prompt = `Analyze this conversation history for client satisfaction:

${messageHistory}

Identify satisfaction level, trends, concerns, and recommendations.`;

  return generateJSONCompletion(
    prompt,
    'You are a client satisfaction analyst. Provide actionable insights for improving client relationships.',
    AI_MODELS.documentAnalysis
  );
}

export async function suggestResponse(
  clientMessage: string,
  context: {
    caseType?: string;
    previousMessages?: string[];
    sentiment?: SentimentAnalysis;
  }
): Promise<{
  suggestedResponse: string;
  tone: string;
  keyPointsToAddress: string[];
  warnings: string[];
}> {
  const contextInfo = [
    context.caseType ? `Case Type: ${context.caseType}` : '',
    context.sentiment ? `Detected Sentiment: ${context.sentiment.sentiment} (Urgency: ${context.sentiment.urgency})` : '',
    context.previousMessages?.length
      ? `Previous Messages:\n${context.previousMessages.slice(-3).join('\n')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  const prompt = `Suggest a professional response to this client message:

Client Message: "${clientMessage}"

${contextInfo}

Provide a suggested response, appropriate tone, key points to address, and any warnings about sensitive topics.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal communication expert. Suggest professional, empathetic responses that maintain attorney-client relationship standards.',
    AI_MODELS.chatbot
  );
}

export async function detectUrgentIssues(
  messages: { content: string; timestamp: string }[]
): Promise<{
  hasUrgentIssues: boolean;
  issues: {
    message: string;
    urgency: 'immediate' | 'high' | 'medium';
    reason: string;
    suggestedAction: string;
  }[];
}> {
  const messageList = messages
    .map((m) => `[${m.timestamp}] ${m.content}`)
    .join('\n');

  const prompt = `Scan these messages for urgent issues requiring immediate attorney attention:

${messageList}

Identify any mentions of: immediate deadlines, threats, safety concerns, opposing counsel contact, court dates, or time-sensitive matters.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal triage specialist. Identify urgent matters that require immediate attorney attention.',
    AI_MODELS.classification
  );
}

export async function analyzeEmotionalState(message: string): Promise<{
  primaryEmotion: string;
  secondaryEmotions: string[];
  stressLevel: 'low' | 'moderate' | 'high' | 'severe';
  communicationRecommendations: string[];
}> {
  const prompt = `Analyze the emotional state of the person who wrote this message:

"${message}"

This is in a legal context - the person is likely a client dealing with a legal matter.
Identify emotions, stress level, and provide communication recommendations.`;

  return generateJSONCompletion(
    prompt,
    'You are an expert in emotional intelligence and client communication in legal settings.',
    AI_MODELS.classification
  );
}
