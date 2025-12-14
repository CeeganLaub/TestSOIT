/**
 * DocuSign E-Signature Integration
 * Handles document signing workflows for legal documents
 */

type DocuSignConfig = {
  integrationKey: string;
  accountId: string;
  userId: string;
  privateKey: string;
  environment: 'demo' | 'production';
};

type Signer = {
  email: string;
  name: string;
  recipientId: string;
  routingOrder?: number;
  tabs?: SignerTab[];
};

type SignerTab = {
  type: 'signHere' | 'dateSignedHere' | 'initialHere' | 'textHere';
  documentId: string;
  pageNumber: number;
  xPosition: number;
  yPosition: number;
  tabLabel?: string;
};

type EnvelopeDocument = {
  documentId: string;
  name: string;
  fileExtension: string;
  documentBase64?: string;
  fileUrl?: string;
};

type CreateEnvelopeOptions = {
  emailSubject: string;
  emailBlurb?: string;
  documents: EnvelopeDocument[];
  signers: Signer[];
  status: 'created' | 'sent';
  expiresInDays?: number;
  brandId?: string;
  webhookUrl?: string;
};

type EnvelopeStatus = {
  envelopeId: string;
  status: 'sent' | 'delivered' | 'signed' | 'completed' | 'declined' | 'voided';
  sentDateTime: string;
  statusChangedDateTime: string;
  completedDateTime?: string;
  recipients: {
    signers: {
      email: string;
      name: string;
      status: string;
      signedDateTime?: string;
    }[];
  };
};

type WebhookEvent = {
  event: string;
  apiVersion: string;
  uri: string;
  retryCount: number;
  configurationId: string;
  generatedDateTime: string;
  data: {
    envelopeId: string;
    accountId: string;
    userId: string;
    recipientId?: string;
    envelopeSummary?: {
      status: string;
      emailSubject: string;
      completedDateTime?: string;
    };
  };
};

export class DocuSignService {
  private config: DocuSignConfig;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.config = {
      integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY || '',
      accountId: process.env.DOCUSIGN_ACCOUNT_ID || '',
      userId: process.env.DOCUSIGN_USER_ID || '',
      privateKey: process.env.DOCUSIGN_PRIVATE_KEY || '',
      environment: (process.env.DOCUSIGN_ENVIRONMENT as 'demo' | 'production') || 'demo',
    };

    this.baseUrl = this.config.environment === 'production'
      ? 'https://na3.docusign.net/restapi'
      : 'https://demo.docusign.net/restapi';
  }

  /**
   * Get OAuth access token using JWT Grant
   */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    // In production, implement JWT token generation using the private key
    // For now, simulate the token retrieval
    console.log('Obtaining DocuSign access token...');

    // Mock implementation - in production use actual JWT grant flow
    const mockToken = 'mock_access_token_' + Date.now();
    this.accessToken = mockToken;
    this.tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    return this.accessToken;
  }

  /**
   * Create and send an envelope for signing
   */
  async createEnvelope(options: CreateEnvelopeOptions): Promise<{ envelopeId: string; uri: string }> {
    const token = await this.getAccessToken();

    const envelope = {
      emailSubject: options.emailSubject,
      emailBlurb: options.emailBlurb || 'Please review and sign the attached document.',
      documents: options.documents.map((doc, index) => ({
        documentId: doc.documentId || String(index + 1),
        name: doc.name,
        fileExtension: doc.fileExtension,
        documentBase64: doc.documentBase64,
      })),
      recipients: {
        signers: options.signers.map((signer, index) => ({
          email: signer.email,
          name: signer.name,
          recipientId: signer.recipientId || String(index + 1),
          routingOrder: signer.routingOrder || index + 1,
          tabs: this.formatTabs(signer.tabs || []),
        })),
      },
      status: options.status,
      notification: options.expiresInDays ? {
        expirations: {
          expireEnabled: 'true',
          expireAfter: String(options.expiresInDays),
          expireWarn: '3',
        },
      } : undefined,
      eventNotification: options.webhookUrl ? {
        url: options.webhookUrl,
        loggingEnabled: 'true',
        requireAcknowledgment: 'true',
        envelopeEvents: [
          { envelopeEventStatusCode: 'sent' },
          { envelopeEventStatusCode: 'delivered' },
          { envelopeEventStatusCode: 'completed' },
          { envelopeEventStatusCode: 'declined' },
          { envelopeEventStatusCode: 'voided' },
        ],
        recipientEvents: [
          { recipientEventStatusCode: 'Sent' },
          { recipientEventStatusCode: 'Delivered' },
          { recipientEventStatusCode: 'Completed' },
          { recipientEventStatusCode: 'Declined' },
        ],
      } : undefined,
    };

    // Mock API call - in production, make actual API request
    console.log('Creating DocuSign envelope:', JSON.stringify(envelope, null, 2));

    const envelopeId = 'env_' + Date.now();
    return {
      envelopeId,
      uri: `${this.baseUrl}/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}`,
    };
  }

  /**
   * Format tabs for DocuSign API
   */
  private formatTabs(tabs: SignerTab[]): Record<string, any[]> {
    const formatted: Record<string, any[]> = {
      signHereTabs: [],
      dateSignedTabs: [],
      initialHereTabs: [],
      textTabs: [],
    };

    for (const tab of tabs) {
      const tabData = {
        documentId: tab.documentId,
        pageNumber: String(tab.pageNumber),
        xPosition: String(tab.xPosition),
        yPosition: String(tab.yPosition),
        tabLabel: tab.tabLabel,
      };

      switch (tab.type) {
        case 'signHere':
          formatted.signHereTabs.push(tabData);
          break;
        case 'dateSignedHere':
          formatted.dateSignedTabs.push(tabData);
          break;
        case 'initialHere':
          formatted.initialHereTabs.push(tabData);
          break;
        case 'textHere':
          formatted.textTabs.push(tabData);
          break;
      }
    }

    return formatted;
  }

  /**
   * Get envelope status
   */
  async getEnvelopeStatus(envelopeId: string): Promise<EnvelopeStatus> {
    const token = await this.getAccessToken();

    // Mock implementation
    console.log(`Getting status for envelope: ${envelopeId}`);

    return {
      envelopeId,
      status: 'sent',
      sentDateTime: new Date().toISOString(),
      statusChangedDateTime: new Date().toISOString(),
      recipients: {
        signers: [
          {
            email: 'client@example.com',
            name: 'John Smith',
            status: 'sent',
          },
        ],
      },
    };
  }

  /**
   * Generate embedded signing URL for recipient
   */
  async getSigningUrl(
    envelopeId: string,
    signer: { email: string; name: string; clientUserId: string },
    returnUrl: string
  ): Promise<string> {
    const token = await this.getAccessToken();

    const recipientView = {
      returnUrl,
      authenticationMethod: 'none',
      email: signer.email,
      userName: signer.name,
      clientUserId: signer.clientUserId,
    };

    // Mock implementation - return simulated signing URL
    console.log(`Generating signing URL for: ${signer.email}`);

    return `https://demo.docusign.net/Signing/StartInSession.aspx?env=${envelopeId}&t=${Date.now()}`;
  }

  /**
   * Download signed documents from envelope
   */
  async getSignedDocuments(envelopeId: string): Promise<Buffer> {
    const token = await this.getAccessToken();

    console.log(`Downloading signed documents for envelope: ${envelopeId}`);

    // Mock implementation - return empty buffer
    return Buffer.from('');
  }

  /**
   * Void an envelope
   */
  async voidEnvelope(envelopeId: string, reason: string): Promise<void> {
    const token = await this.getAccessToken();

    console.log(`Voiding envelope ${envelopeId}: ${reason}`);
  }

  /**
   * Resend envelope to recipient
   */
  async resendEnvelope(envelopeId: string): Promise<void> {
    const token = await this.getAccessToken();

    console.log(`Resending envelope: ${envelopeId}`);
  }

  /**
   * Process webhook event from DocuSign
   */
  async processWebhook(event: WebhookEvent): Promise<{
    success: boolean;
    action?: string;
    envelopeId?: string;
    status?: string;
  }> {
    console.log('Processing DocuSign webhook event:', event.event);

    const envelopeId = event.data.envelopeId;
    const status = event.data.envelopeSummary?.status;

    // Handle different event types
    switch (event.event) {
      case 'envelope-sent':
        return { success: true, action: 'envelope_sent', envelopeId, status };

      case 'envelope-delivered':
        return { success: true, action: 'envelope_delivered', envelopeId, status };

      case 'envelope-completed':
        return { success: true, action: 'envelope_completed', envelopeId, status };

      case 'envelope-declined':
        return { success: true, action: 'envelope_declined', envelopeId, status };

      case 'recipient-sent':
      case 'recipient-delivered':
      case 'recipient-completed':
        return { success: true, action: 'recipient_update', envelopeId, status };

      default:
        return { success: true, action: 'unknown_event', envelopeId };
    }
  }

  /**
   * Create envelope from template
   */
  async createFromTemplate(
    templateId: string,
    signers: Signer[],
    options: {
      emailSubject?: string;
      emailBlurb?: string;
      status?: 'created' | 'sent';
    } = {}
  ): Promise<{ envelopeId: string }> {
    const token = await this.getAccessToken();

    const envelope = {
      templateId,
      templateRoles: signers.map((signer) => ({
        email: signer.email,
        name: signer.name,
        roleName: signer.recipientId,
      })),
      status: options.status || 'sent',
      emailSubject: options.emailSubject,
      emailBlurb: options.emailBlurb,
    };

    console.log('Creating envelope from template:', templateId);

    return { envelopeId: 'env_template_' + Date.now() };
  }
}

// Export singleton instance
export const docusign = new DocuSignService();

// Helper functions for common document types
export const documentTemplates = {
  retainerAgreement: {
    templateId: 'retainer_agreement_v1',
    name: 'Retainer Agreement',
    signatureLocations: [
      { type: 'signHere' as const, pageNumber: 3, xPosition: 100, yPosition: 700 },
      { type: 'dateSignedHere' as const, pageNumber: 3, xPosition: 400, yPosition: 700 },
    ],
  },
  settlementOffer: {
    templateId: 'settlement_offer_v1',
    name: 'Settlement Offer',
    signatureLocations: [
      { type: 'signHere' as const, pageNumber: 2, xPosition: 100, yPosition: 650 },
      { type: 'initialHere' as const, pageNumber: 1, xPosition: 500, yPosition: 750 },
    ],
  },
  medicalRelease: {
    templateId: 'medical_release_v1',
    name: 'Medical Records Release',
    signatureLocations: [
      { type: 'signHere' as const, pageNumber: 1, xPosition: 100, yPosition: 600 },
      { type: 'dateSignedHere' as const, pageNumber: 1, xPosition: 350, yPosition: 600 },
    ],
  },
};

export default docusign;
