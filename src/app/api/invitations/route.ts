import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createInvitationSchema } from '@/lib/validators';
import { generateToken, absoluteUrl } from '@/lib/utils';
import { sendEmail, generateInvitationEmail } from '@/lib/integrations/email';
import { sendInvitationSMS } from '@/lib/integrations/sms';
import QRCode from 'qrcode';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { organizationId } = body;

    // Validate user has access to organization
    const orgUser = await prisma.organizationUser.findFirst({
      where: {
        userId: session.user.id,
        organizationId,
      },
      include: {
        organization: true,
        user: true,
      },
    });

    if (!orgUser) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Validate input
    const validatedData = createInvitationSchema.parse(body);

    // Generate invitation token
    const token = generateToken(48);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Generate QR code
    const inviteUrl = absoluteUrl(`/invite/${token}`);
    const qrCodeUrl = await QRCode.toDataURL(inviteUrl);

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        organizationId,
        email: validatedData.email,
        phone: validatedData.phone,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        token,
        expiresAt,
        type: validatedData.type,
        status: 'PENDING',
        landingPageId: validatedData.landingPageId,
        intakeFormId: validatedData.intakeFormId,
        caseId: validatedData.caseId,
        message: validatedData.message,
        qrCodeUrl,
        createdById: session.user.id,
      },
      include: {
        landingPage: true,
        intakeForm: true,
      },
    });

    // Send invitations based on sendVia preferences
    const sentVia: string[] = [];

    if (validatedData.sendVia.includes('email')) {
      const emailContent = generateInvitationEmail({
        recipientName: validatedData.firstName || '',
        firmName: orgUser.organization.name,
        inviterName: `${orgUser.user.firstName} ${orgUser.user.lastName}`,
        inviteUrl,
        message: validatedData.message,
        expiresAt: expiresAt.toLocaleDateString(),
      });

      const emailResult = await sendEmail({
        to: validatedData.email,
        ...emailContent,
      });

      if (emailResult.success) {
        sentVia.push('email');
      }
    }

    if (validatedData.sendVia.includes('sms') && validatedData.phone) {
      const smsResult = await sendInvitationSMS({
        phone: validatedData.phone,
        recipientName: validatedData.firstName,
        firmName: orgUser.organization.name,
        inviteUrl,
      });

      if (smsResult.success) {
        sentVia.push('sms');
      }
    }

    // Update invitation with sent status
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        sentAt: new Date(),
        sentVia,
        status: 'SENT',
      },
    });

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        token,
        inviteUrl,
        qrCodeUrl,
        sentVia,
      },
    });
  } catch (error) {
    console.error('Invitation error:', error);
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 });
    }

    // Verify user has access
    const orgUser = await prisma.organizationUser.findFirst({
      where: {
        userId: session.user.id,
        organizationId,
      },
    });

    if (!orgUser) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const where: any = { organizationId };
    if (status) {
      where.status = status;
    }

    const [invitations, total] = await Promise.all([
      prisma.invitation.findMany({
        where,
        include: {
          landingPage: true,
          case: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.invitation.count({ where }),
    ]);

    return NextResponse.json({
      invitations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get invitations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}
