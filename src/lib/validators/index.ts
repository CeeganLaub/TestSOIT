import { z } from 'zod';

// User validators
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  twoFactorCode: z.string().optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  title: z.string().optional(),
  bio: z.string().optional(),
  barNumber: z.string().optional(),
  practiceAreas: z.array(z.string()).optional(),
});

// Organization validators
export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

// Client validators
export const createClientSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  preferredContactMethod: z.enum(['EMAIL', 'PHONE', 'SMS', 'PORTAL']).optional(),
  source: z.string().optional(),
});

// Case validators
export const createCaseSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  title: z.string().min(1, 'Case title is required'),
  description: z.string().optional(),
  practiceArea: z.string().min(1, 'Practice area is required'),
  caseType: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  feeArrangement: z.enum(['HOURLY', 'FLAT_FEE', 'CONTINGENCY', 'RETAINER', 'HYBRID', 'PRO_BONO']).default('HOURLY'),
  estimatedValue: z.number().optional(),
  retainerAmount: z.number().optional(),
  contingencyPercent: z.number().min(0).max(100).optional(),
  statuteOfLimitations: z.string().optional(),
});

// Invitation validators
export const createInvitationSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  type: z.enum(['CLIENT', 'TEAM_MEMBER', 'REFERRAL']).default('CLIENT'),
  landingPageId: z.string().optional(),
  intakeFormId: z.string().optional(),
  caseId: z.string().optional(),
  message: z.string().optional(),
  sendVia: z.array(z.enum(['email', 'sms'])).default(['email']),
});

// Landing page validators
export const createLandingPageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  template: z.enum(['PROFESSIONAL', 'MODERN', 'CLASSIC', 'MINIMAL', 'BOLD', 'CUSTOM']).default('PROFESSIONAL'),
  intakeFormId: z.string().optional(),
});

// Intake form validators
export const createIntakeFormSchema = z.object({
  name: z.string().min(1, 'Form name is required'),
  description: z.string().optional(),
  practiceArea: z.string().optional(),
  schema: z.object({
    fields: z.array(z.object({
      id: z.string(),
      type: z.enum(['text', 'textarea', 'select', 'checkbox', 'radio', 'date', 'email', 'phone', 'file']),
      label: z.string(),
      placeholder: z.string().optional(),
      required: z.boolean().default(false),
      options: z.array(z.string()).optional(),
    })),
    settings: z.object({
      submitButtonText: z.string().default('Submit'),
      successMessage: z.string().default('Thank you for your submission.'),
      redirectUrl: z.string().optional(),
    }),
  }),
});

// Appointment validators
export const createAppointmentSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  attorneyId: z.string().min(1, 'Attorney is required'),
  caseId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['CONSULTATION', 'MEETING', 'COURT_DATE', 'DEPOSITION', 'MEDIATION', 'PHONE_CALL', 'VIDEO_CALL', 'OTHER']).default('CONSULTATION'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  locationType: z.enum(['IN_PERSON', 'VIDEO', 'PHONE']).default('VIDEO'),
  location: z.string().optional(),
});

// Message validators
export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  clientId: z.string().optional(),
  caseId: z.string().optional(),
  threadId: z.string().optional(),
});

// Invoice validators
export const createInvoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  caseId: z.string().optional(),
  dueDate: z.string().datetime(),
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number().min(0),
    rate: z.number().min(0),
    amount: z.number().min(0),
  })),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

// Task validators
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  assignedToId: z.string().optional(),
  caseId: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
});

// Document validators
export const uploadDocumentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  category: z.enum([
    'CONTRACT', 'COURT_FILING', 'CORRESPONDENCE', 'EVIDENCE',
    'INTAKE', 'INVOICE', 'ID_DOCUMENT', 'MEDICAL_RECORD',
    'POLICE_REPORT', 'ENGAGEMENT_LETTER', 'OTHER'
  ]).default('OTHER'),
  clientId: z.string().optional(),
  caseId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isConfidential: z.boolean().default(false),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type CreateCaseInput = z.infer<typeof createCaseSchema>;
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type CreateLandingPageInput = z.infer<typeof createLandingPageSchema>;
export type CreateIntakeFormInput = z.infer<typeof createIntakeFormSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
