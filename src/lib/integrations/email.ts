import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Fallback to nodemailer for development
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export type EmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }[];
  tags?: { name: string; value: string }[];
};

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const fromAddress = options.from || process.env.EMAIL_FROM || 'noreply@lawfirmplatform.com';

  try {
    if (resend) {
      const result = await resend.emails.send({
        from: fromAddress,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
        attachments: options.attachments?.map((a) => ({
          filename: a.filename,
          content: typeof a.content === 'string' ? Buffer.from(a.content) : a.content,
        })),
        tags: options.tags,
      });

      return { success: true, messageId: result.data?.id };
    }

    // Fallback to nodemailer
    const result = await transporter.sendMail({
      from: fromAddress,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      attachments: options.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

// Email templates
export function generateInvitationEmail(data: {
  recipientName: string;
  firmName: string;
  inviterName: string;
  inviteUrl: string;
  message?: string;
  expiresAt: string;
}): { subject: string; html: string; text: string } {
  const subject = `${data.inviterName} from ${data.firmName} has invited you`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">${data.firmName}</h1>
      </div>
      <div style="background: #fff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hello${data.recipientName ? ` ${data.recipientName}` : ''},</p>
        <p style="font-size: 16px;">${data.inviterName} has invited you to join <strong>${data.firmName}</strong>'s client portal.</p>
        ${data.message ? `<div style="background: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0;"><p style="margin: 0; font-style: italic;">"${data.message}"</p></div>` : ''}
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.inviteUrl}" style="background: #d69e2e; color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
        </div>
        <p style="font-size: 14px; color: #718096;">This invitation expires on ${data.expiresAt}.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="font-size: 12px; color: #a0aec0;">If you didn't expect this invitation, you can safely ignore this email.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
${data.firmName}

Hello${data.recipientName ? ` ${data.recipientName}` : ''},

${data.inviterName} has invited you to join ${data.firmName}'s client portal.

${data.message ? `Message: "${data.message}"` : ''}

Accept your invitation: ${data.inviteUrl}

This invitation expires on ${data.expiresAt}.

If you didn't expect this invitation, you can safely ignore this email.
  `.trim();

  return { subject, html, text };
}

export function generateWelcomeEmail(data: {
  clientName: string;
  firmName: string;
  portalUrl: string;
  attorneyName?: string;
}): { subject: string; html: string; text: string } {
  const subject = `Welcome to ${data.firmName}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #fff; margin: 0;">${data.firmName}</h1>
      </div>
      <div style="background: #fff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1a365d;">Welcome, ${data.clientName}!</h2>
        <p>Your client portal account has been created successfully. You can now:</p>
        <ul style="padding-left: 20px;">
          <li>View your case status and updates</li>
          <li>Securely message your legal team</li>
          <li>Upload and access documents</li>
          <li>Schedule appointments</li>
          <li>View and pay invoices</li>
        </ul>
        ${data.attorneyName ? `<p>Your primary attorney is <strong>${data.attorneyName}</strong>.</p>` : ''}
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.portalUrl}" style="background: #d69e2e; color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Access Your Portal</a>
        </div>
        <p style="font-size: 14px; color: #718096;">If you have any questions, please don't hesitate to reach out to us.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to ${data.firmName}, ${data.clientName}!

Your client portal account has been created successfully. You can now:
- View your case status and updates
- Securely message your legal team
- Upload and access documents
- Schedule appointments
- View and pay invoices

${data.attorneyName ? `Your primary attorney is ${data.attorneyName}.` : ''}

Access your portal: ${data.portalUrl}

If you have any questions, please don't hesitate to reach out to us.
  `.trim();

  return { subject, html, text };
}

export function generateAppointmentReminderEmail(data: {
  clientName: string;
  firmName: string;
  appointmentTitle: string;
  appointmentDate: string;
  appointmentTime: string;
  locationType: string;
  location?: string;
  attorneyName: string;
  videoLink?: string;
}): { subject: string; html: string; text: string } {
  const subject = `Reminder: ${data.appointmentTitle} - ${data.appointmentDate}`;

  const locationText = data.locationType === 'VIDEO'
    ? `Video Call${data.videoLink ? ` - Join: ${data.videoLink}` : ''}`
    : data.locationType === 'PHONE'
    ? 'Phone Call'
    : data.location || 'TBD';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #fff; margin: 0;">${data.firmName}</h1>
      </div>
      <div style="background: #fff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1a365d;">Appointment Reminder</h2>
        <p>Hello ${data.clientName},</p>
        <p>This is a reminder about your upcoming appointment:</p>
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Title:</strong> ${data.appointmentTitle}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${data.appointmentDate}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${data.appointmentTime}</p>
          <p style="margin: 5px 0;"><strong>With:</strong> ${data.attorneyName}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${locationText}</p>
        </div>
        ${data.videoLink ? `<div style="text-align: center; margin: 20px 0;"><a href="${data.videoLink}" style="background: #d69e2e; color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Join Video Call</a></div>` : ''}
        <p style="font-size: 14px; color: #718096;">If you need to reschedule, please contact us as soon as possible.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Appointment Reminder - ${data.firmName}

Hello ${data.clientName},

This is a reminder about your upcoming appointment:

Title: ${data.appointmentTitle}
Date: ${data.appointmentDate}
Time: ${data.appointmentTime}
With: ${data.attorneyName}
Location: ${locationText}

${data.videoLink ? `Join Video Call: ${data.videoLink}` : ''}

If you need to reschedule, please contact us as soon as possible.
  `.trim();

  return { subject, html, text };
}
