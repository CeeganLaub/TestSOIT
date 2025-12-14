import { generateJSONCompletion, AI_MODELS } from './index';
import { prisma } from '@/lib/db';

export async function assignTask(
  task: {
    title: string;
    description?: string;
    caseId?: string;
    priority: string;
    estimatedHours?: number;
    requiredSkills?: string[];
    deadline?: string;
  },
  teamMembers: {
    id: string;
    name: string;
    role: string;
    skills: string[];
    currentWorkload: number; // percentage
    availability: number; // hours available
    hourlyRate?: number;
  }[]
): Promise<{
  recommendedAssignee: string;
  confidence: number;
  reasoning: string;
  alternatives: {
    userId: string;
    score: number;
    pros: string[];
    cons: string[];
  }[];
  workloadImpact: string;
}> {
  const prompt = `Assign this task to the best team member:

Task: ${task.title}
${task.description ? `Description: ${task.description}` : ''}
Priority: ${task.priority}
${task.estimatedHours ? `Estimated Hours: ${task.estimatedHours}` : ''}
${task.requiredSkills?.length ? `Required Skills: ${task.requiredSkills.join(', ')}` : ''}
${task.deadline ? `Deadline: ${task.deadline}` : ''}

Available Team Members:
${teamMembers.map((m) => `- ${m.name} (${m.role}): Skills: ${m.skills.join(', ')}, Workload: ${m.currentWorkload}%, Available: ${m.availability}h`).join('\n')}

Recommend the best assignee with reasoning.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal team manager. Assign tasks optimally based on skills, workload, and availability.',
    AI_MODELS.documentAnalysis
  );
}

export async function balanceWorkload(
  organizationId: string
): Promise<{
  currentDistribution: {
    userId: string;
    userName: string;
    taskCount: number;
    totalHours: number;
    utilizationRate: number;
  }[];
  imbalances: {
    issue: string;
    severity: 'high' | 'medium' | 'low';
    affectedUsers: string[];
  }[];
  recommendations: {
    action: string;
    fromUser: string;
    toUser: string;
    taskIds: string[];
    reason: string;
  }[];
}> {
  const tasks = await prisma.task.findMany({
    where: {
      organizationId,
      status: { in: ['TODO', 'IN_PROGRESS'] },
    },
    include: {
      assignedTo: true,
    },
  });

  const users = await prisma.organizationUser.findMany({
    where: { organizationId, isActive: true },
    include: { user: true },
  });

  const workloadData = users.map((ou) => {
    const userTasks = tasks.filter((t) => t.assignedToId === ou.userId);
    return {
      userId: ou.userId,
      userName: `${ou.user.firstName} ${ou.user.lastName}`,
      role: ou.role,
      taskCount: userTasks.length,
      tasks: userTasks.map((t) => ({ id: t.id, title: t.title, priority: t.priority })),
    };
  });

  const prompt = `Analyze and balance team workload:

Current Distribution:
${workloadData.map((w) => `- ${w.userName} (${w.role}): ${w.taskCount} tasks`).join('\n')}

Tasks Detail:
${workloadData.map((w) => `${w.userName}:\n${w.tasks.map((t) => `  - [${t.priority}] ${t.title}`).join('\n')}`).join('\n\n')}

Identify imbalances and recommend task reassignments.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal operations manager. Optimize team workload distribution.',
    AI_MODELS.documentAnalysis
  );
}

export async function suggestTasksFromCase(
  caseDetails: {
    id: string;
    caseType: string;
    practiceArea: string;
    status: string;
    description: string;
    existingTasks: string[];
  }
): Promise<{
  suggestedTasks: {
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    estimatedHours: number;
    suggestedRole: string;
    dependsOn?: string[];
  }[];
  timeline: {
    phase: string;
    tasks: string[];
    estimatedDuration: string;
  }[];
}> {
  const prompt = `Suggest tasks for this legal case:

Case Type: ${caseDetails.caseType}
Practice Area: ${caseDetails.practiceArea}
Current Status: ${caseDetails.status}
Description: ${caseDetails.description}

Existing Tasks:
${caseDetails.existingTasks.map((t) => `- ${t}`).join('\n') || 'None yet'}

Suggest tasks needed to progress the case, with priorities and timeline.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal project manager. Suggest comprehensive task lists for case progression.',
    AI_MODELS.casePrediction
  );
}

export async function prioritizeTasks(
  tasks: {
    id: string;
    title: string;
    priority: string;
    dueDate?: string;
    caseId?: string;
    casePriority?: string;
    estimatedHours?: number;
  }[]
): Promise<{
  prioritizedOrder: {
    taskId: string;
    newPriority: number;
    reason: string;
    deadline: string;
  }[];
  urgentItems: string[];
  recommendations: string[];
}> {
  const prompt = `Prioritize these legal tasks:

${tasks.map((t) => `- ID: ${t.id}, Title: ${t.title}, Current Priority: ${t.priority}, Due: ${t.dueDate || 'Not set'}, Case Priority: ${t.casePriority || 'N/A'}`).join('\n')}

Consider: deadlines, case priority, dependencies, and legal requirements.
Return prioritized order with reasoning.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal task prioritization expert. Optimize task order for efficiency and compliance.',
    AI_MODELS.documentAnalysis
  );
}

export async function estimateTaskDuration(
  task: {
    title: string;
    description: string;
    caseType: string;
    taskType: string;
  },
  historicalData?: {
    similarTasks: { title: string; actualHours: number }[];
  }
): Promise<{
  estimatedHours: number;
  confidence: number;
  range: { min: number; max: number };
  factors: string[];
  basedOn: string;
}> {
  const prompt = `Estimate time for this legal task:

Task: ${task.title}
Description: ${task.description}
Case Type: ${task.caseType}
Task Type: ${task.taskType}

${historicalData?.similarTasks?.length ? `Similar Past Tasks:
${historicalData.similarTasks.map((t) => `- ${t.title}: ${t.actualHours}h`).join('\n')}` : ''}

Provide time estimate with confidence level and range.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal time estimation expert. Provide accurate task duration estimates.',
    AI_MODELS.classification
  );
}
