import { ServerClient } from "postmark";

const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@ratemyapartment.com";
const APP_URL = process.env.APP_URL || "http://localhost:5000";

let client: ServerClient | null = null;

function getClient(): ServerClient | null {
  if (!POSTMARK_API_KEY) {
    console.warn("POSTMARK_API_KEY not set - email sending disabled");
    return null;
  }
  if (!client) {
    client = new ServerClient(POSTMARK_API_KEY);
  }
  return client;
}

// Template aliases - these should match the aliases in your Postmark account
export const EMAIL_TEMPLATES = {
  WELCOME: "welcome",
  PASSWORD_RESET: "password-reset",
  EMAIL_VERIFICATION: "email-verification",
  REVIEW_APPROVED: "review-approved",
  REVIEW_REJECTED: "review-rejected",
  BUILDING_APPROVED: "building-approved",
  BUILDING_REJECTED: "building-rejected",
} as const;

type TemplateAlias = (typeof EMAIL_TEMPLATES)[keyof typeof EMAIL_TEMPLATES];

interface SendTemplateEmailOptions {
  to: string;
  templateAlias: TemplateAlias;
  templateModel: Record<string, unknown>;
}

async function sendTemplateEmail({
  to,
  templateAlias,
  templateModel,
}: SendTemplateEmailOptions): Promise<boolean> {
  const postmarkClient = getClient();

  // Add common template variables
  const model = {
    ...templateModel,
    app_url: APP_URL,
    current_year: new Date().getFullYear(),
  };

  if (!postmarkClient) {
    console.log(`[Email] Template email "${templateAlias}" would be sent to: ${to}`);
    console.log(`[Email] Template model:`, JSON.stringify(model, null, 2));
    return true;
  }

  try {
    await postmarkClient.sendEmailWithTemplate({
      From: FROM_EMAIL,
      To: to,
      TemplateAlias: templateAlias,
      TemplateModel: model,
      MessageStream: "outbound",
    });

    console.log(`[Email] Template "${templateAlias}" sent to: ${to}`);
    return true;
  } catch (error) {
    console.error(`[Email] Failed to send template "${templateAlias}" to ${to}:`, error);
    return false;
  }
}

// Welcome email
export interface WelcomeEmailData {
  email: string;
  name?: string;
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  return sendTemplateEmail({
    to: data.email,
    templateAlias: EMAIL_TEMPLATES.WELCOME,
    templateModel: {
      name: data.name || "there",
    },
  });
}

// Password reset email
export interface PasswordResetEmailData {
  email: string;
  token: string;
}

export async function sendPasswordResetEmail(data: PasswordResetEmailData): Promise<boolean> {
  const resetUrl = `${APP_URL}/reset-password/${data.token}`;

  return sendTemplateEmail({
    to: data.email,
    templateAlias: EMAIL_TEMPLATES.PASSWORD_RESET,
    templateModel: {
      reset_url: resetUrl,
    },
  });
}

// Email verification
export interface EmailVerificationData {
  email: string;
  token: string;
}

export async function sendEmailVerificationEmail(data: EmailVerificationData): Promise<boolean> {
  const verifyUrl = `${APP_URL}/verify-email/${data.token}`;

  return sendTemplateEmail({
    to: data.email,
    templateAlias: EMAIL_TEMPLATES.EMAIL_VERIFICATION,
    templateModel: {
      verify_url: verifyUrl,
    },
  });
}

// Review approved notification
export interface ReviewApprovedEmailData {
  email: string;
  buildingName: string;
  buildingAddress: string;
  buildingId: string;
}

export async function sendReviewApprovedEmail(data: ReviewApprovedEmailData): Promise<boolean> {
  const buildingUrl = `${APP_URL}/building/${data.buildingId}`;

  return sendTemplateEmail({
    to: data.email,
    templateAlias: EMAIL_TEMPLATES.REVIEW_APPROVED,
    templateModel: {
      building_name: data.buildingName,
      building_address: data.buildingAddress,
      building_url: buildingUrl,
    },
  });
}

// Review rejected notification
export interface ReviewRejectedEmailData {
  email: string;
  buildingName: string;
  reason?: string;
}

export async function sendReviewRejectedEmail(data: ReviewRejectedEmailData): Promise<boolean> {
  return sendTemplateEmail({
    to: data.email,
    templateAlias: EMAIL_TEMPLATES.REVIEW_REJECTED,
    templateModel: {
      building_name: data.buildingName,
      reason: data.reason || "It did not meet our community guidelines.",
    },
  });
}

// Building approved notification
export interface BuildingApprovedEmailData {
  email: string;
  buildingName: string;
  buildingAddress: string;
  buildingId: string;
}

export async function sendBuildingApprovedEmail(data: BuildingApprovedEmailData): Promise<boolean> {
  const buildingUrl = `${APP_URL}/building/${data.buildingId}`;

  return sendTemplateEmail({
    to: data.email,
    templateAlias: EMAIL_TEMPLATES.BUILDING_APPROVED,
    templateModel: {
      building_name: data.buildingName,
      building_address: data.buildingAddress,
      building_url: buildingUrl,
    },
  });
}

// Building rejected notification
export interface BuildingRejectedEmailData {
  email: string;
  buildingName: string;
  reason?: string;
}

export async function sendBuildingRejectedEmail(data: BuildingRejectedEmailData): Promise<boolean> {
  return sendTemplateEmail({
    to: data.email,
    templateAlias: EMAIL_TEMPLATES.BUILDING_REJECTED,
    templateModel: {
      building_name: data.buildingName,
      reason: data.reason || "It did not meet our submission requirements.",
    },
  });
}

// Helper to check if email service is configured
export function isEmailServiceEnabled(): boolean {
  return !!POSTMARK_API_KEY;
}
