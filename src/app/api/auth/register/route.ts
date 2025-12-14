import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { registerSchema } from '@/lib/validators';
import { slugify, generateToken } from '@/lib/utils';
import { sendEmail, generateWelcomeEmail } from '@/lib/integrations/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);
    const { email, password, firstName, lastName } = validatedData;
    const organizationName = body.organizationName;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        status: 'PENDING_VERIFICATION',
      },
    });

    // Create organization if provided
    if (organizationName) {
      let slug = slugify(organizationName);

      // Ensure slug is unique
      const existingOrg = await prisma.organization.findUnique({
        where: { slug },
      });

      if (existingOrg) {
        slug = `${slug}-${generateToken(4).toLowerCase()}`;
      }

      const organization = await prisma.organization.create({
        data: {
          name: organizationName,
          slug,
          users: {
            create: {
              userId: user.id,
              role: 'OWNER',
            },
          },
          settings: {
            create: {},
          },
          branding: {
            create: {},
          },
        },
      });
    }

    // Create email verification token
    const verificationToken = generateToken(32);
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        type: 'EMAIL_VERIFICATION',
      },
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your email - LawFirm Platform',
      html: `
        <h1>Welcome to LawFirm Platform!</h1>
        <p>Hi ${firstName},</p>
        <p>Thank you for creating an account. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; background: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Verify Email</a>
        <p>This link expires in 24 hours.</p>
        <p>If you didn't create this account, you can safely ignore this email.</p>
      `,
      text: `Welcome to LawFirm Platform! Verify your email: ${verificationUrl}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
