import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Configure authenticator
authenticator.options = {
  window: 1, // Allow 1 step variance
};

export function generateTOTPSecret(): string {
  return authenticator.generateSecret();
}

export function verifyTOTP(secret: string, token: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}

export function generateTOTPToken(secret: string): string {
  return authenticator.generate(secret);
}

export async function generateQRCodeDataURL(
  email: string,
  secret: string,
  issuer = 'LawFirm Platform'
): Promise<string> {
  const otpauthUrl = authenticator.keyuri(email, issuer, secret);
  return QRCode.toDataURL(otpauthUrl);
}

export function generateBackupCodes(count = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric codes
    const code = Array.from({ length: 8 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(
        Math.floor(Math.random() * 36)
      )
    ).join('');
    codes.push(code);
  }
  return codes;
}

export function verifyBackupCode(
  code: string,
  hashedCodes: string[],
  bcrypt: typeof import('bcryptjs')
): { valid: boolean; index: number } {
  for (let i = 0; i < hashedCodes.length; i++) {
    if (bcrypt.compareSync(code.toUpperCase(), hashedCodes[i])) {
      return { valid: true, index: i };
    }
  }
  return { valid: false, index: -1 };
}

export async function hashBackupCodes(
  codes: string[],
  bcrypt: typeof import('bcryptjs')
): Promise<string[]> {
  return Promise.all(codes.map((code) => bcrypt.hash(code, 10)));
}
