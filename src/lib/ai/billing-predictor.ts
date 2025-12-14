import { generateJSONCompletion, AI_MODELS } from './index';
import { prisma } from '@/lib/db';

export async function predictPaymentDate(
  invoice: {
    clientId: string;
    amount: number;
    dueDate: string;
    invoiceHistory?: {
      amount: number;
      dueDate: string;
      paidDate: string;
    }[];
  }
): Promise<{
  predictedPaymentDate: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
  recommendations: string[];
}> {
  const prompt = `Predict when this invoice will be paid:

Invoice Amount: $${invoice.amount}
Due Date: ${invoice.dueDate}

${invoice.invoiceHistory?.length ? `Payment History:
${invoice.invoiceHistory.map((h) => `- $${h.amount} due ${h.dueDate}, paid ${h.paidDate}`).join('\n')}` : 'No payment history available'}

Predict payment date, risk level, and recommendations for improving collection.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal billing analyst. Predict payment behavior and suggest collection strategies.',
    AI_MODELS.casePrediction
  );
}

export async function forecastRevenue(
  organizationId: string,
  months: number = 3
): Promise<{
  forecast: {
    month: string;
    predictedRevenue: number;
    lowEstimate: number;
    highEstimate: number;
    factors: string[];
  }[];
  atRiskAccounts: {
    clientId: string;
    clientName: string;
    outstandingAmount: number;
    riskLevel: 'high' | 'medium' | 'low';
    reason: string;
  }[];
  recommendations: string[];
}> {
  // Get historical data
  const invoices = await prisma.invoice.findMany({
    where: { organizationId },
    include: { client: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const invoiceData = invoices.map((inv) => ({
    amount: Number(inv.total),
    status: inv.status,
    dueDate: inv.dueDate.toISOString(),
    paidAt: inv.paidAt?.toISOString(),
    clientName: `${inv.client.firstName} ${inv.client.lastName}`,
  }));

  const prompt = `Forecast revenue for the next ${months} months:

Historical Invoice Data:
${JSON.stringify(invoiceData.slice(0, 50))}

Total invoices: ${invoices.length}
Current outstanding: $${invoices.filter((i) => i.status === 'SENT' || i.status === 'OVERDUE').reduce((sum, i) => sum + Number(i.amountDue), 0)}

Provide monthly forecasts and identify at-risk accounts.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal financial analyst. Forecast revenue and identify collection risks.',
    AI_MODELS.casePrediction
  );
}

export async function suggestBillingOptimization(
  organizationId: string
): Promise<{
  currentMetrics: {
    averageDaysToPayment: number;
    collectionRate: number;
    averageInvoiceAmount: number;
  };
  issues: {
    issue: string;
    impact: 'high' | 'medium' | 'low';
    affectedAmount: number;
  }[];
  recommendations: {
    action: string;
    expectedImprovement: string;
    priority: 'high' | 'medium' | 'low';
    effort: 'low' | 'medium' | 'high';
  }[];
}> {
  const invoices = await prisma.invoice.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const prompt = `Analyze billing practices and suggest optimizations:

Invoice Data Summary:
- Total invoices: ${invoices.length}
- Paid: ${invoices.filter((i) => i.status === 'PAID').length}
- Overdue: ${invoices.filter((i) => i.status === 'OVERDUE').length}
- Average amount: $${invoices.reduce((sum, i) => sum + Number(i.total), 0) / invoices.length || 0}

Identify issues and recommend improvements.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal billing optimization expert. Identify inefficiencies and recommend improvements.',
    AI_MODELS.documentAnalysis
  );
}

export async function generatePaymentReminder(
  invoice: {
    invoiceNumber: string;
    clientName: string;
    amount: number;
    dueDate: string;
    daysPastDue: number;
  },
  reminderType: 'friendly' | 'firm' | 'final'
): Promise<{
  emailSubject: string;
  emailBody: string;
  smsMessage?: string;
}> {
  const toneInstructions = {
    friendly: 'Polite and understanding, assuming the client may have overlooked the invoice.',
    firm: 'Professional but direct, emphasizing the importance of timely payment.',
    final: 'Serious tone mentioning potential consequences while remaining professional.',
  };

  const prompt = `Generate a payment reminder:

Invoice Number: ${invoice.invoiceNumber}
Client: ${invoice.clientName}
Amount: $${invoice.amount}
Due Date: ${invoice.dueDate}
Days Past Due: ${invoice.daysPastDue}
Tone: ${toneInstructions[reminderType]}

Create email subject, body, and optional SMS message.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal billing communications specialist. Write effective but professional payment reminders.',
    AI_MODELS.contentGeneration
  );
}

export async function analyzePricingStrategy(
  organizationId: string,
  practiceArea: string
): Promise<{
  currentAverageRate: number;
  marketComparison: 'below_market' | 'at_market' | 'above_market';
  recommendations: {
    recommendation: string;
    potentialImpact: string;
    risk: 'low' | 'medium' | 'high';
  }[];
  suggestedRateRanges: {
    seniorAttorney: { min: number; max: number };
    associate: { min: number; max: number };
    paralegal: { min: number; max: number };
  };
}> {
  const timeEntries = await prisma.timeEntry.findMany({
    where: {
      organizationId,
      case: { practiceArea },
    },
    take: 500,
  });

  const avgRate = timeEntries.length
    ? timeEntries.reduce((sum, t) => sum + Number(t.hourlyRate || 0), 0) / timeEntries.length
    : 0;

  const prompt = `Analyze pricing strategy:

Practice Area: ${practiceArea}
Current Average Hourly Rate: $${avgRate.toFixed(2)}
Number of Time Entries: ${timeEntries.length}

Compare to market rates and suggest optimizations.`;

  return generateJSONCompletion(
    prompt,
    'You are a legal pricing strategist. Analyze rates and recommend competitive pricing.',
    AI_MODELS.casePrediction
  );
}
