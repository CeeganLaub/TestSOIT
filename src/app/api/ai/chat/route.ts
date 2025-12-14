import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateChatResponse, detectIntent, executeAction } from '@/lib/ai/chatbot';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, organizationId, message, sessionToken, conversationHistory = [] } = body;

    // Verify client session
    const clientSession = await prisma.clientPortalSession.findFirst({
      where: {
        token: sessionToken,
        clientId,
        expiresAt: { gt: new Date() },
      },
      include: {
        client: {
          include: {
            cases: {
              where: { status: 'ACTIVE' },
              take: 1,
              include: {
                assignments: {
                  where: { isPrimary: true },
                  include: { user: true },
                },
              },
            },
            appointments: {
              where: {
                startTime: { gt: new Date() },
                status: { in: ['SCHEDULED', 'CONFIRMED'] },
              },
              take: 3,
              orderBy: { startTime: 'asc' },
            },
          },
        },
      },
    });

    if (!clientSession) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const client = clientSession.client;
    const activeCase = client.cases[0];
    const primaryAttorney = activeCase?.assignments[0]?.user;

    // Detect intent
    const intent = await detectIntent(message);

    // Build context for chatbot
    const context = {
      clientId: client.id,
      caseId: activeCase?.id,
      caseSummary: activeCase?.title,
      attorneyName: primaryAttorney ? `${primaryAttorney.firstName} ${primaryAttorney.lastName}` : undefined,
      upcomingAppointments: client.appointments.map(
        (apt) => `${apt.title} on ${apt.startTime.toLocaleDateString()}`
      ),
      pendingTasks: [], // Would fetch from database
    };

    // Format conversation history
    const messages = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.isFromClient ? 'user' : 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    // Generate response
    const response = await generateChatResponse(messages, context);

    // Execute any suggested actions that don't require confirmation
    const executedActions = [];
    for (const action of response.suggestedActions) {
      if (!action.requiresConfirmation && action.type !== 'none') {
        const result = await executeAction(action, clientId, organizationId);
        executedActions.push({
          action: action.type,
          result,
        });
      }
    }

    // Store message in database
    await prisma.message.create({
      data: {
        organizationId,
        clientId,
        caseId: activeCase?.id,
        content: message,
        contentType: 'TEXT',
        isFromClient: true,
      },
    });

    // Store AI response
    await prisma.message.create({
      data: {
        organizationId,
        clientId,
        caseId: activeCase?.id,
        content: response.response,
        contentType: 'AI_RESPONSE',
        isFromClient: false,
      },
    });

    return NextResponse.json({
      success: true,
      response: response.response,
      suggestedActions: response.suggestedActions.filter((a) => a.requiresConfirmation),
      executedActions,
      intent: intent.intent,
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
