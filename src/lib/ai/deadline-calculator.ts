import { generateJSONCompletion, AI_MODELS } from './index';
import { addDays, addBusinessDays, isWeekend, format } from 'date-fns';

export type DeadlineRule = {
  jurisdiction: string;
  caseType: string;
  eventType: string;
  daysFromEvent: number;
  includeWeekends: boolean;
  excludeHolidays: boolean;
  description: string;
};

// Common federal holidays (US)
const FEDERAL_HOLIDAYS_2024 = [
  '2024-01-01', '2024-01-15', '2024-02-19', '2024-05-27',
  '2024-06-19', '2024-07-04', '2024-09-02', '2024-10-14',
  '2024-11-11', '2024-11-28', '2024-12-25',
];

export function calculateDeadline(
  startDate: Date,
  days: number,
  options: {
    includeWeekends?: boolean;
    excludeHolidays?: boolean;
    holidays?: string[];
  } = {}
): Date {
  const { includeWeekends = false, excludeHolidays = true, holidays = FEDERAL_HOLIDAYS_2024 } = options;

  if (includeWeekends && !excludeHolidays) {
    return addDays(startDate, days);
  }

  let currentDate = new Date(startDate);
  let daysAdded = 0;

  while (daysAdded < days) {
    currentDate = addDays(currentDate, 1);

    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const isHoliday = excludeHolidays && holidays.includes(dateStr);
    const isWeekendDay = !includeWeekends && isWeekend(currentDate);

    if (!isHoliday && !isWeekendDay) {
      daysAdded++;
    }
  }

  return currentDate;
}

export async function getDeadlineRules(
  jurisdiction: string,
  caseType: string
): Promise<DeadlineRule[]> {
  const prompt = `Provide common legal deadline rules for:

Jurisdiction: ${jurisdiction}
Case Type: ${caseType}

Include deadlines for:
- Filing responses
- Discovery deadlines
- Motion deadlines
- Appeal deadlines
- Statute of limitations

Return as array with days from triggering event, whether weekends count, and description.`;

  const result = await generateJSONCompletion<{ rules: DeadlineRule[] }>(
    prompt,
    'You are a legal deadline expert. Provide accurate deadline rules based on jurisdiction and case type.',
    AI_MODELS.casePrediction
  );

  return result.rules;
}

export async function calculateCaseDeadlines(
  caseDetails: {
    caseType: string;
    jurisdiction: string;
    filingDate: string;
    keyDates: { event: string; date: string }[];
  }
): Promise<{
  deadlines: {
    name: string;
    date: string;
    daysRemaining: number;
    priority: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    basedOn: string;
  }[];
  warnings: string[];
}> {
  const prompt = `Calculate all relevant deadlines for this case:

Case Type: ${caseDetails.caseType}
Jurisdiction: ${caseDetails.jurisdiction}
Filing Date: ${caseDetails.filingDate}

Key Dates:
${caseDetails.keyDates.map((d) => `- ${d.event}: ${d.date}`).join('\n')}

Calculate all applicable deadlines with remaining days and priority.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal deadline calculator. Calculate accurate deadlines based on case type and jurisdiction rules.',
    AI_MODELS.casePrediction
  );
}

export async function analyzeDeadlineRisks(
  upcomingDeadlines: {
    name: string;
    date: string;
    caseId: string;
    assignedTo: string;
  }[],
  teamCapacity: {
    userId: string;
    currentLoad: number;
    availability: number;
  }[]
): Promise<{
  atRiskDeadlines: {
    deadline: string;
    date: string;
    caseId: string;
    riskLevel: 'high' | 'medium' | 'low';
    reason: string;
    recommendation: string;
  }[];
  capacityWarnings: string[];
  recommendations: string[];
}> {
  const prompt = `Analyze deadline risks for this team:

Upcoming Deadlines:
${upcomingDeadlines.map((d) => `- ${d.name} (${d.date}) - Case: ${d.caseId}, Assigned: ${d.assignedTo}`).join('\n')}

Team Capacity:
${teamCapacity.map((t) => `- ${t.userId}: Load ${t.currentLoad}%, Available ${t.availability}%`).join('\n')}

Identify at-risk deadlines and capacity issues.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal project manager. Identify deadline risks and resource constraints.',
    AI_MODELS.documentAnalysis
  );
}

export function generateReminderSchedule(
  deadline: Date,
  priority: 'critical' | 'high' | 'medium' | 'low'
): Date[] {
  const reminderDays = {
    critical: [30, 14, 7, 3, 1, 0],
    high: [14, 7, 3, 1],
    medium: [7, 3, 1],
    low: [3, 1],
  };

  const days = reminderDays[priority];
  const now = new Date();

  return days
    .map((d) => addDays(deadline, -d))
    .filter((date) => date > now);
}

export async function suggestDeadlineExtension(
  deadline: {
    name: string;
    date: string;
    caseType: string;
    jurisdiction: string;
    reason: string;
  }
): Promise<{
  canExtend: boolean;
  maxExtensionDays: number;
  procedure: string[];
  requiredDocuments: string[];
  likelihoodOfApproval: 'high' | 'medium' | 'low';
  alternatives: string[];
}> {
  const prompt = `Advise on deadline extension possibility:

Deadline: ${deadline.name}
Date: ${deadline.date}
Case Type: ${deadline.caseType}
Jurisdiction: ${deadline.jurisdiction}
Reason for Extension: ${deadline.reason}

Provide extension options, procedures, and likelihood of approval.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal procedure expert. Advise on deadline extension options and procedures.',
    AI_MODELS.casePrediction
  );
}
