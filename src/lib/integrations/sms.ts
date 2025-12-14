import twilio from 'twilio';

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const fromNumber = process.env.TWILIO_PHONE_NUMBER;

export type SMSOptions = {
  to: string;
  body: string;
  mediaUrl?: string[];
};

export async function sendSMS(options: SMSOptions): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  if (!client || !fromNumber) {
    console.warn('Twilio not configured, SMS not sent');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    // Format phone number
    const formattedPhone = formatPhoneNumber(options.to);

    const message = await client.messages.create({
      body: options.body,
      from: fromNumber,
      to: formattedPhone,
      mediaUrl: options.mediaUrl,
    });

    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('SMS send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send SMS',
    };
  }
}

export async function send2FACode(phone: string, code: string): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const body = `Your verification code is: ${code}. This code expires in 10 minutes. Do not share this code with anyone.`;
  return sendSMS({ to: phone, body });
}

export async function sendAppointmentReminder(data: {
  phone: string;
  clientName: string;
  appointmentDate: string;
  appointmentTime: string;
  attorneyName: string;
  locationType: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const locationText = data.locationType === 'VIDEO'
    ? 'video call'
    : data.locationType === 'PHONE'
    ? 'phone call'
    : 'in-person meeting';

  const body = `Hi ${data.clientName}, reminder: You have a ${locationText} with ${data.attorneyName} on ${data.appointmentDate} at ${data.appointmentTime}. Reply CONFIRM to confirm or call us to reschedule.`;

  return sendSMS({ to: data.phone, body });
}

export async function sendInvitationSMS(data: {
  phone: string;
  recipientName?: string;
  firmName: string;
  inviteUrl: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const body = `${data.recipientName ? `Hi ${data.recipientName}, ` : ''}You've been invited to ${data.firmName}'s client portal. Complete your registration here: ${data.inviteUrl}`;

  return sendSMS({ to: data.phone, body });
}

export async function sendCaseUpdateSMS(data: {
  phone: string;
  clientName: string;
  caseTitle: string;
  updateMessage: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const body = `Hi ${data.clientName}, update on your case "${data.caseTitle}": ${data.updateMessage}. Log in to your portal for details.`;

  return sendSMS({ to: data.phone, body });
}

export async function sendPaymentReminderSMS(data: {
  phone: string;
  clientName: string;
  amount: number;
  dueDate: string;
  paymentUrl: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const body = `Hi ${data.clientName}, reminder: Your payment of $${data.amount.toFixed(2)} is due on ${data.dueDate}. Pay securely: ${data.paymentUrl}`;

  return sendSMS({ to: data.phone, body });
}

function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Add US country code if not present
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  // Already has country code
  if (phone.startsWith('+')) {
    return phone;
  }

  return `+${digits}`;
}

// Verify phone number format
export function isValidPhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

// Generate SMS-friendly short URLs (placeholder - would use URL shortener service)
export async function shortenUrl(url: string): Promise<string> {
  // In production, integrate with Bitly, TinyURL, or custom shortener
  return url;
}
