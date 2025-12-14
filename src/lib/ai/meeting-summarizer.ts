import { generateJSONCompletion, AI_MODELS } from './index';

export async function summarizeMeeting(
  transcription: string,
  meetingContext: {
    type: string;
    attendees: string[];
    caseId?: string;
    caseType?: string;
  }
): Promise<{
  summary: string;
  keyPoints: string[];
  actionItems: {
    task: string;
    assignee: string;
    dueDate?: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  decisions: string[];
  followUpRequired: boolean;
  nextMeetingTopics?: string[];
  clientConcerns?: string[];
}> {
  const prompt = `Summarize this legal meeting:

Meeting Type: ${meetingContext.type}
Attendees: ${meetingContext.attendees.join(', ')}
${meetingContext.caseType ? `Case Type: ${meetingContext.caseType}` : ''}

Transcription:
${transcription}

Extract: summary, key points, action items with assignees, decisions made, and any follow-up needed.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal meeting summarizer. Extract actionable insights from meeting transcriptions.',
    AI_MODELS.summarization
  );
}

export async function generateMeetingNotes(
  transcription: string,
  template: 'detailed' | 'brief' | 'client_friendly'
): Promise<string> {
  const templateInstructions = {
    detailed: 'Create comprehensive notes with all discussion points, questions raised, and responses.',
    brief: 'Create a concise bullet-point summary of the key topics discussed.',
    client_friendly: 'Create notes suitable for sharing with the client - clear, non-technical, focused on outcomes.',
  };

  const prompt = `Generate meeting notes from this transcription:

${transcription}

Style: ${templateInstructions[template]}`;

  const result = await generateJSONCompletion<{ notes: string }>(
    prompt,
    'You are a legal meeting note-taker. Create well-organized, professional meeting notes.',
    AI_MODELS.summarization
  );

  return result.notes;
}

export async function extractActionItems(transcription: string): Promise<{
  actionItems: {
    task: string;
    context: string;
    suggestedAssignee?: string;
    urgency: 'immediate' | 'this_week' | 'this_month' | 'ongoing';
    dependencies?: string[];
  }[];
}> {
  const prompt = `Extract all action items and tasks mentioned in this meeting transcription:

${transcription}

Identify who should do what, urgency level, and any dependencies.`;

  return generateJSONCompletion(
    prompt,
    'You are a task extraction specialist. Identify all commitments and action items from meetings.',
    AI_MODELS.documentAnalysis
  );
}

export async function identifyDeadlines(transcription: string): Promise<{
  deadlines: {
    date: string;
    description: string;
    type: 'court' | 'filing' | 'internal' | 'client' | 'other';
    source: string;
    isConfirmed: boolean;
  }[];
}> {
  const prompt = `Identify all deadlines mentioned in this meeting:

${transcription}

Extract dates, what's due, deadline type, and whether it was confirmed or tentative.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal deadline tracker. Identify all time-sensitive items from conversations.',
    AI_MODELS.classification
  );
}

export async function generateFollowUpEmail(
  meetingSummary: {
    summary: string;
    actionItems: { task: string; assignee: string }[];
    nextSteps: string[];
  },
  recipient: 'client' | 'team' | 'opposing_counsel'
): Promise<{
  subject: string;
  body: string;
}> {
  const toneInstructions = {
    client: 'Professional, reassuring, and clear. Avoid legal jargon.',
    team: 'Direct, action-oriented, with clear task assignments.',
    opposing_counsel: 'Formal, precise, and legally appropriate.',
  };

  const prompt = `Generate a follow-up email after a legal meeting:

Meeting Summary: ${meetingSummary.summary}

Action Items:
${meetingSummary.actionItems.map((a) => `- ${a.task} (${a.assignee})`).join('\n')}

Next Steps:
${meetingSummary.nextSteps.join('\n')}

Recipient Type: ${recipient}
Tone: ${toneInstructions[recipient]}`;

  return generateJSONCompletion(
    prompt,
    'You are a legal communication specialist. Draft professional follow-up emails.',
    AI_MODELS.contentGeneration
  );
}
