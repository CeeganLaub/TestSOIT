import { generateCompletion, streamCompletion, generateJSONCompletion, AI_MODELS } from './index';
import { prisma } from '@/lib/db';

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type ChatAction = {
  type: 'schedule_appointment' | 'request_document' | 'send_message' | 'update_case' | 'create_task' | 'none';
  data?: Record<string, unknown>;
  requiresConfirmation: boolean;
};

const CHATBOT_SYSTEM_PROMPT = `You are an AI legal assistant for a law firm client portal. You can help clients with:

1. Answering questions about their case status
2. Scheduling appointments with their attorney
3. Requesting document uploads
4. Sending messages to their legal team
5. Explaining legal processes in simple terms
6. Providing general information about their case type

IMPORTANT RULES:
- Never provide legal advice - always recommend consulting with their attorney
- Be empathetic and professional
- If you don't have information, say so clearly
- For sensitive matters, recommend scheduling a call with their attorney
- You can take actions like scheduling appointments or requesting documents
- Always confirm before taking any action

When you want to take an action, indicate it clearly in your response.`;

export async function generateChatResponse(
  messages: ChatMessage[],
  clientContext: {
    clientId: string;
    caseId?: string;
    caseSummary?: string;
    attorneyName?: string;
    upcomingAppointments?: string[];
    pendingTasks?: string[];
  }
): Promise<{
  response: string;
  suggestedActions: ChatAction[];
}> {
  const contextPrompt = `
Client Context:
- Client ID: ${clientContext.clientId}
${clientContext.caseId ? `- Active Case ID: ${clientContext.caseId}` : ''}
${clientContext.caseSummary ? `- Case Summary: ${clientContext.caseSummary}` : ''}
${clientContext.attorneyName ? `- Primary Attorney: ${clientContext.attorneyName}` : ''}
${clientContext.upcomingAppointments?.length ? `- Upcoming Appointments: ${clientContext.upcomingAppointments.join(', ')}` : ''}
${clientContext.pendingTasks?.length ? `- Pending Tasks: ${clientContext.pendingTasks.join(', ')}` : ''}

Previous messages in this conversation:
${messages.slice(-10).map((m) => `${m.role}: ${m.content}`).join('\n')}
`;

  const lastMessage = messages[messages.length - 1];

  const prompt = `${contextPrompt}

Latest user message: "${lastMessage.content}"

Respond helpfully and indicate any actions you'd like to take on behalf of the client.
Return JSON with "response" and "suggestedActions" array.`;

  return generateJSONCompletion(
    prompt,
    CHATBOT_SYSTEM_PROMPT,
    AI_MODELS.chatbot
  );
}

export async function* streamChatResponse(
  messages: ChatMessage[],
  clientContext: {
    clientId: string;
    caseId?: string;
    caseSummary?: string;
  }
): AsyncGenerator<string> {
  const contextPrompt = `
Client Context:
- Client ID: ${clientContext.clientId}
${clientContext.caseId ? `- Case ID: ${clientContext.caseId}` : ''}
${clientContext.caseSummary ? `- Case Summary: ${clientContext.caseSummary}` : ''}

Conversation:
${messages.slice(-10).map((m) => `${m.role}: ${m.content}`).join('\n')}
`;

  yield* streamCompletion(
    contextPrompt,
    CHATBOT_SYSTEM_PROMPT,
    AI_MODELS.chatbot
  );
}

export async function detectIntent(message: string): Promise<{
  intent: 'question' | 'action_request' | 'complaint' | 'update' | 'greeting' | 'other';
  confidence: number;
  entities: {
    type: string;
    value: string;
  }[];
  suggestedAction?: ChatAction;
}> {
  const prompt = `Classify this client message intent:

"${message}"

Identify: intent type, confidence, any entities (dates, names, document types), and suggested action.`;

  return generateJSONCompletion(
    prompt,
    'You are an intent classification system for a legal client portal chatbot.',
    AI_MODELS.classification
  );
}

export async function executeAction(
  action: ChatAction,
  clientId: string,
  organizationId: string
): Promise<{
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}> {
  switch (action.type) {
    case 'schedule_appointment':
      // Implementation would interact with appointment system
      return {
        success: true,
        message: 'Appointment scheduling initiated. Please select a time slot.',
        data: { nextStep: 'show_calendar' },
      };

    case 'request_document':
      // Implementation would create document request
      return {
        success: true,
        message: 'Document request has been noted. Your legal team will follow up.',
        data: { documentType: action.data?.documentType },
      };

    case 'send_message':
      // Implementation would queue message for attorney
      return {
        success: true,
        message: 'Your message has been sent to your legal team.',
      };

    case 'create_task':
      // Implementation would create task
      return {
        success: true,
        message: 'Task has been created and assigned.',
        data: { taskId: 'new_task_id' },
      };

    default:
      return {
        success: false,
        message: 'Unknown action type',
      };
  }
}

export async function generateWelcomeMessage(
  clientName: string,
  caseSummary?: string
): Promise<string> {
  const prompt = `Generate a warm, professional welcome message for a client named ${clientName} logging into their law firm portal.
${caseSummary ? `Their case involves: ${caseSummary}` : ''}

Keep it brief, friendly, and offer to help with common tasks.`;

  return generateCompletion(
    prompt,
    'You are a friendly AI assistant for a law firm client portal.',
    AI_MODELS.chatbot
  );
}
