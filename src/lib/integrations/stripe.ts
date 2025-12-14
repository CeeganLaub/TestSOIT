import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' })
  : null;

export { stripe };

// Create Stripe Connect account for law firm
export async function createConnectedAccount(
  organizationId: string,
  email: string,
  businessName: string
): Promise<{ accountId: string; onboardingUrl: string } | null> {
  if (!stripe) return null;

  try {
    const account = await stripe.accounts.create({
      type: 'standard',
      email,
      business_profile: {
        name: businessName,
        mcc: '8111', // Legal services
      },
      metadata: {
        organizationId,
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      type: 'account_onboarding',
    });

    return {
      accountId: account.id,
      onboardingUrl: accountLink.url,
    };
  } catch (error) {
    console.error('Stripe Connect account creation error:', error);
    return null;
  }
}

// Create customer for a client
export async function createCustomer(
  email: string,
  name: string,
  metadata: Record<string, string>
): Promise<string | null> {
  if (!stripe) return null;

  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });

    return customer.id;
  } catch (error) {
    console.error('Stripe customer creation error:', error);
    return null;
  }
}

// Create invoice
export async function createInvoice(data: {
  customerId: string;
  connectedAccountId?: string;
  items: {
    description: string;
    amount: number; // in cents
    quantity: number;
  }[];
  dueDate: Date;
  metadata?: Record<string, string>;
}): Promise<{ invoiceId: string; hostedInvoiceUrl: string } | null> {
  if (!stripe) return null;

  try {
    // Add invoice items
    for (const item of data.items) {
      await stripe.invoiceItems.create({
        customer: data.customerId,
        description: item.description,
        amount: item.amount,
        quantity: item.quantity,
      }, data.connectedAccountId ? { stripeAccount: data.connectedAccountId } : undefined);
    }

    // Create the invoice
    const invoice = await stripe.invoices.create({
      customer: data.customerId,
      collection_method: 'send_invoice',
      due_date: Math.floor(data.dueDate.getTime() / 1000),
      metadata: data.metadata,
    }, data.connectedAccountId ? { stripeAccount: data.connectedAccountId } : undefined);

    // Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(
      invoice.id,
      data.connectedAccountId ? { stripeAccount: data.connectedAccountId } : undefined
    );

    return {
      invoiceId: finalizedInvoice.id,
      hostedInvoiceUrl: finalizedInvoice.hosted_invoice_url || '',
    };
  } catch (error) {
    console.error('Stripe invoice creation error:', error);
    return null;
  }
}

// Create payment intent for one-time payment
export async function createPaymentIntent(data: {
  amount: number; // in cents
  currency?: string;
  customerId?: string;
  connectedAccountId?: string;
  metadata?: Record<string, string>;
  applicationFeeAmount?: number; // Platform fee in cents
}): Promise<{ clientSecret: string; paymentIntentId: string } | null> {
  if (!stripe) return null;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency || 'usd',
      customer: data.customerId,
      metadata: data.metadata,
      ...(data.connectedAccountId && data.applicationFeeAmount
        ? {
            application_fee_amount: data.applicationFeeAmount,
            transfer_data: {
              destination: data.connectedAccountId,
            },
          }
        : {}),
    });

    return {
      clientSecret: paymentIntent.client_secret || '',
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    return null;
  }
}

// Create checkout session
export async function createCheckoutSession(data: {
  customerId?: string;
  customerEmail?: string;
  lineItems: {
    name: string;
    description?: string;
    amount: number;
    quantity: number;
  }[];
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  connectedAccountId?: string;
}): Promise<string | null> {
  if (!stripe) return null;

  try {
    const session = await stripe.checkout.sessions.create({
      customer: data.customerId,
      customer_email: data.customerId ? undefined : data.customerEmail,
      payment_method_types: ['card', 'us_bank_account'],
      line_items: data.lineItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: item.amount,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: data.metadata,
    }, data.connectedAccountId ? { stripeAccount: data.connectedAccountId } : undefined);

    return session.url;
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return null;
  }
}

// Create subscription for platform SaaS
export async function createSubscription(data: {
  customerId: string;
  priceId: string;
  trialDays?: number;
  metadata?: Record<string, string>;
}): Promise<{ subscriptionId: string; clientSecret: string | null } | null> {
  if (!stripe) return null;

  try {
    const subscription = await stripe.subscriptions.create({
      customer: data.customerId,
      items: [{ price: data.priceId }],
      trial_period_days: data.trialDays,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: data.metadata,
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret || null,
    };
  } catch (error) {
    console.error('Stripe subscription error:', error);
    return null;
  }
}

// Cancel subscription
export async function cancelSubscription(
  subscriptionId: string,
  immediately = false
): Promise<boolean> {
  if (!stripe) return false;

  try {
    if (immediately) {
      await stripe.subscriptions.cancel(subscriptionId);
    } else {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }
    return true;
  } catch (error) {
    console.error('Stripe subscription cancellation error:', error);
    return false;
  }
}

// Webhook signature verification
export function verifyWebhookSignature(
  payload: string,
  signature: string
): Stripe.Event | null {
  if (!stripe) return null;

  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}
