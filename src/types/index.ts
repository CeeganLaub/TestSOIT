import type {
  Organization,
  User,
  Client,
  Case,
  Document,
  Invitation,
  LandingPage,
  IntakeForm,
  Message,
  Appointment,
  Invoice,
  Task,
  Workflow,
  Template,
  OrganizationUser,
} from '@prisma/client';

// Extended types with relations
export type OrganizationWithRelations = Organization & {
  settings?: OrganizationSettings | null;
  branding?: OrganizationBranding | null;
  users?: OrganizationUserWithUser[];
};

export type OrganizationUserWithUser = OrganizationUser & {
  user: User;
  organization?: Organization;
};

export type OrganizationUserWithOrganization = OrganizationUser & {
  organization: Organization;
};

export type UserWithOrganizations = User & {
  organizations: OrganizationUserWithOrganization[];
};

export type ClientWithRelations = Client & {
  cases?: Case[];
  documents?: Document[];
  messages?: Message[];
  appointments?: Appointment[];
  invoices?: Invoice[];
};

export type CaseWithRelations = Case & {
  client: Client;
  assignments?: CaseAssignmentWithUser[];
  documents?: Document[];
  tasks?: Task[];
  events?: CaseEvent[];
  invoices?: Invoice[];
};

export type CaseAssignmentWithUser = {
  id: string;
  caseId: string;
  userId: string;
  role: string;
  isPrimary: boolean;
  user: User;
};

export type CaseEvent = {
  id: string;
  caseId: string;
  title: string;
  description?: string | null;
  eventType: string;
  eventDate: Date;
  isCompleted: boolean;
};

export type DocumentWithRelations = Document & {
  client?: Client | null;
  case?: Case | null;
};

export type InvitationWithRelations = Invitation & {
  landingPage?: LandingPage | null;
  intakeForm?: IntakeForm | null;
  case?: Case | null;
};

export type LandingPageWithRelations = LandingPage & {
  attorneys?: OrganizationUserWithUser[];
  intakeForm?: IntakeForm | null;
};

export type AppointmentWithRelations = Appointment & {
  attorney: User;
  client: Client;
  case?: Case | null;
};

export type InvoiceWithRelations = Invoice & {
  client: Client;
  case?: Case | null;
  payments?: Payment[];
  timeEntries?: TimeEntry[];
};

export type Payment = {
  id: string;
  invoiceId: string;
  clientId: string;
  amount: number;
  method: string;
  status: string;
  createdAt: Date;
};

export type TimeEntry = {
  id: string;
  caseId: string;
  userId: string;
  date: Date;
  duration: number;
  description: string;
  isBillable: boolean;
  hourlyRate?: number | null;
  amount?: number | null;
};

export type MessageWithRelations = Message & {
  sender?: User | null;
  client?: Client | null;
  case?: Case | null;
};

export type TaskWithRelations = Task & {
  assignedTo?: User | null;
  createdBy?: User | null;
  case?: Case | null;
};

// Settings types
export type OrganizationSettings = {
  id: string;
  organizationId: string;
  require2FA: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  enableVideoConsultations: boolean;
  enableOnlinePayments: boolean;
  enableDocumentSigning: boolean;
  enableClientMessaging: boolean;
  enableAIFeatures: boolean;
  defaultHourlyRate?: number | null;
  defaultCurrency: string;
};

export type OrganizationBranding = {
  id: string;
  organizationId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  customCss?: string | null;
};

// Form types
export type IntakeFormField = {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'email' | 'phone' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  conditionalLogic?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains';
    value: string;
    action: 'show' | 'hide';
  };
};

export type IntakeFormSchema = {
  fields: IntakeFormField[];
  settings: {
    submitButtonText: string;
    successMessage: string;
    redirectUrl?: string;
  };
};

// Landing page content types
export type HeroSection = {
  headline: string;
  subheadline?: string;
  ctaText: string;
  ctaUrl: string;
  backgroundImage?: string;
  overlayColor?: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  link?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  title?: string;
  content: string;
  rating?: number;
  image?: string;
};

// AI types
export type AIAnalysisResult = {
  summary: string;
  keyTerms: string[];
  dates: { date: string; description: string }[];
  parties: string[];
  risks: { level: 'low' | 'medium' | 'high'; description: string }[];
  recommendations: string[];
};

export type CasePrediction = {
  winProbability: number;
  settlementRange: { min: number; max: number };
  factors: { factor: string; impact: 'positive' | 'negative' | 'neutral'; weight: number }[];
  similarCases: { id: string; outcome: string; similarity: number }[];
};

export type SentimentAnalysis = {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  urgency: 'low' | 'medium' | 'high';
  suggestedAction?: string;
};

// API response types
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      organizations?: OrganizationUserWithOrganization[];
    };
  }

  interface User {
    firstName?: string | null;
    lastName?: string | null;
    organizations?: OrganizationUserWithOrganization[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    organizations?: OrganizationUserWithOrganization[];
  }
}
