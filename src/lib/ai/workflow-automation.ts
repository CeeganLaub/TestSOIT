import { generateJSONCompletion, AI_MODELS } from './index';
import { prisma } from '@/lib/db';

export type WorkflowTrigger =
  | 'new_client'
  | 'new_case'
  | 'case_status_change'
  | 'document_uploaded'
  | 'form_submitted'
  | 'deadline_approaching'
  | 'payment_received'
  | 'appointment_scheduled'
  | 'message_received';

export type WorkflowAction =
  | 'send_email'
  | 'send_sms'
  | 'create_task'
  | 'assign_user'
  | 'update_status'
  | 'create_document'
  | 'schedule_reminder'
  | 'notify_team'
  | 'run_ai_analysis'
  | 'webhook';

export type WorkflowStep = {
  id: string;
  action: WorkflowAction;
  config: Record<string, unknown>;
  conditions?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: unknown;
  }[];
  delay?: {
    amount: number;
    unit: 'minutes' | 'hours' | 'days';
  };
};

export async function suggestWorkflow(
  trigger: WorkflowTrigger,
  context: {
    organizationType?: string;
    practiceAreas?: string[];
    existingWorkflows?: string[];
  }
): Promise<{
  name: string;
  description: string;
  steps: WorkflowStep[];
  estimatedTimesSaved: string;
  bestPractices: string[];
}> {
  const prompt = `Suggest an automated workflow for a law firm:

Trigger: ${trigger}
${context.organizationType ? `Firm Type: ${context.organizationType}` : ''}
${context.practiceAreas?.length ? `Practice Areas: ${context.practiceAreas.join(', ')}` : ''}
${context.existingWorkflows?.length ? `Existing Workflows: ${context.existingWorkflows.join(', ')}` : ''}

Design an efficient workflow with appropriate steps, delays, and conditions.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal operations expert. Design efficient workflows for law firm automation.',
    AI_MODELS.contentGeneration
  );
}

export async function executeWorkflow(
  workflowId: string,
  triggerData: Record<string, unknown>,
  organizationId: string
): Promise<{
  success: boolean;
  executedSteps: {
    stepId: string;
    action: string;
    result: 'success' | 'failed' | 'skipped';
    message?: string;
  }[];
  errors: string[];
}> {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow || workflow.organizationId !== organizationId) {
    return {
      success: false,
      executedSteps: [],
      errors: ['Workflow not found or access denied'],
    };
  }

  const steps = workflow.steps as unknown as WorkflowStep[];
  const executedSteps: {
    stepId: string;
    action: string;
    result: 'success' | 'failed' | 'skipped';
    message?: string;
  }[] = [];

  for (const step of steps) {
    // Check conditions
    if (step.conditions?.length) {
      const conditionsMet = step.conditions.every((condition) => {
        const fieldValue = triggerData[condition.field];
        switch (condition.operator) {
          case 'equals':
            return fieldValue === condition.value;
          case 'not_equals':
            return fieldValue !== condition.value;
          case 'contains':
            return String(fieldValue).includes(String(condition.value));
          case 'greater_than':
            return Number(fieldValue) > Number(condition.value);
          case 'less_than':
            return Number(fieldValue) < Number(condition.value);
          default:
            return true;
        }
      });

      if (!conditionsMet) {
        executedSteps.push({
          stepId: step.id,
          action: step.action,
          result: 'skipped',
          message: 'Conditions not met',
        });
        continue;
      }
    }

    try {
      await executeWorkflowAction(step, triggerData, organizationId);
      executedSteps.push({
        stepId: step.id,
        action: step.action,
        result: 'success',
      });
    } catch (error) {
      executedSteps.push({
        stepId: step.id,
        action: step.action,
        result: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Update workflow stats
  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      timesTriggered: { increment: 1 },
      lastTriggeredAt: new Date(),
    },
  });

  return {
    success: executedSteps.every((s) => s.result !== 'failed'),
    executedSteps,
    errors: executedSteps.filter((s) => s.result === 'failed').map((s) => s.message || 'Unknown error'),
  };
}

async function executeWorkflowAction(
  step: WorkflowStep,
  data: Record<string, unknown>,
  organizationId: string
): Promise<void> {
  switch (step.action) {
    case 'send_email':
      // Queue email via email service
      console.log('Sending email:', step.config);
      break;

    case 'send_sms':
      // Queue SMS via Twilio
      console.log('Sending SMS:', step.config);
      break;

    case 'create_task':
      await prisma.task.create({
        data: {
          organizationId,
          title: String(step.config.title || 'Automated Task'),
          description: String(step.config.description || ''),
          priority: (step.config.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') || 'MEDIUM',
          assignedToId: step.config.assigneeId as string | undefined,
          dueDate: step.config.dueDays
            ? new Date(Date.now() + Number(step.config.dueDays) * 24 * 60 * 60 * 1000)
            : undefined,
          isAiGenerated: true,
          aiSource: 'workflow_automation',
        },
      });
      break;

    case 'update_status':
      if (data.caseId) {
        await prisma.case.update({
          where: { id: String(data.caseId) },
          data: { status: step.config.newStatus as any },
        });
      }
      break;

    case 'notify_team':
      // Create notification for team members
      console.log('Notifying team:', step.config);
      break;

    case 'run_ai_analysis':
      // Queue AI analysis job
      await prisma.aIJob.create({
        data: {
          organizationId,
          type: step.config.analysisType as any || 'DOCUMENT_ANALYSIS',
          status: 'PENDING',
          input: data as any,
          entityType: step.config.entityType as string,
          entityId: step.config.entityId as string,
        },
      });
      break;

    default:
      console.log('Unknown action:', step.action);
  }
}

export async function analyzeWorkflowEfficiency(
  workflowId: string
): Promise<{
  efficiency: number;
  bottlenecks: string[];
  suggestions: string[];
  averageExecutionTime: number;
  successRate: number;
}> {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  const prompt = `Analyze this workflow for efficiency:

Workflow Name: ${workflow.name}
Times Triggered: ${workflow.timesTriggered}
Steps: ${JSON.stringify(workflow.steps)}

Identify bottlenecks and suggest improvements.`;

  return generateJSONCompletion(
    prompt,
    'You are a process optimization expert. Analyze workflow efficiency and suggest improvements.',
    AI_MODELS.documentAnalysis
  );
}

export async function generateNurturingSequence(
  clientType: 'lead' | 'active' | 'past',
  practiceArea: string
): Promise<{
  name: string;
  emails: {
    day: number;
    subject: string;
    bodyTemplate: string;
    purpose: string;
  }[];
  smsMessages?: {
    day: number;
    message: string;
  }[];
}> {
  const prompt = `Create a client nurturing email sequence:

Client Type: ${clientType}
Practice Area: ${practiceArea}

Design a sequence of emails (and optional SMS) to nurture the relationship.
For leads: focus on conversion
For active: focus on satisfaction and referrals
For past: focus on re-engagement`;

  return generateJSONCompletion(
    prompt,
    'You are a legal marketing expert. Create effective client nurturing sequences.',
    AI_MODELS.contentGeneration
  );
}
