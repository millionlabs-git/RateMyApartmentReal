import { ServerClient } from "postmark";

const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@ratemyapartment.com";

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

export interface WelcomeEmailData {
  email: string;
  name?: string;
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  const postmarkClient = getClient();

  if (!postmarkClient) {
    console.log(`[Email] Welcome email would be sent to: ${data.email}`);
    return true;
  }

  try {
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: data.email,
      Subject: "Welcome to Rate My Apartment!",
      HtmlBody: getWelcomeEmailHtml(data),
      TextBody: getWelcomeEmailText(data),
      MessageStream: "outbound",
    });

    console.log(`[Email] Welcome email sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`[Email] Failed to send welcome email to ${data.email}:`, error);
    return false;
  }
}

function getWelcomeEmailHtml(data: WelcomeEmailData): string {
  const name = data.name || "there";
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Rate My Apartment</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #FDFAF6;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FDFAF6;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="padding: 40px; text-align: center; background-color: #1C1917; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 400;">Rate My Apartment</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1C1917; font-size: 24px; font-weight: 500;">Welcome, ${name}!</h2>
              <p style="margin: 0 0 20px; color: #57534E; font-size: 16px; line-height: 1.6;">
                Thanks for joining Rate My Apartment. You're now part of a community of NYC renters sharing honest experiences to help others find their perfect home.
              </p>
              <p style="margin: 0 0 20px; color: #57534E; font-size: 16px; line-height: 1.6;">
                With your new account, you can:
              </p>
              <ul style="margin: 0 0 20px; padding-left: 20px; color: #57534E; font-size: 16px; line-height: 1.8;">
                <li>Save your favorite buildings</li>
                <li>Write and manage your reviews</li>
                <li>Get notified about buildings you're interested in</li>
              </ul>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="background-color: #B45309; border-radius: 6px;">
                    <a href="${process.env.APP_URL || 'https://ratemyapartment.com'}" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500;">Start Exploring</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #A8A29E; font-size: 14px;">
                If you have any questions, just reply to this email. We're here to help!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #F5F5F4; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #A8A29E; font-size: 13px;">
                © ${new Date().getFullYear()} Rate My Apartment. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function getWelcomeEmailText(data: WelcomeEmailData): string {
  const name = data.name || "there";
  return `
Welcome to Rate My Apartment, ${name}!

Thanks for joining our community of NYC renters. You're now part of a group sharing honest experiences to help others find their perfect home.

With your new account, you can:
- Save your favorite buildings
- Write and manage your reviews
- Get notified about buildings you're interested in

Start exploring at: ${process.env.APP_URL || 'https://ratemyapartment.com'}

If you have any questions, just reply to this email. We're here to help!

© ${new Date().getFullYear()} Rate My Apartment
  `.trim();
}

export interface PasswordResetEmailData {
  email: string;
  token: string;
}

export async function sendPasswordResetEmail(data: PasswordResetEmailData): Promise<boolean> {
  const postmarkClient = getClient();
  const resetUrl = `${process.env.APP_URL || 'http://localhost:5000'}/reset-password/${data.token}`;

  if (!postmarkClient) {
    console.log(`[Email] Password reset email would be sent to: ${data.email}`);
    console.log(`[Email] Reset URL: ${resetUrl}`);
    return true;
  }

  try {
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: data.email,
      Subject: "Reset Your Password - Rate My Apartment",
      HtmlBody: getPasswordResetEmailHtml(resetUrl),
      TextBody: getPasswordResetEmailText(resetUrl),
      MessageStream: "outbound",
    });

    console.log(`[Email] Password reset email sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`[Email] Failed to send password reset email to ${data.email}:`, error);
    return false;
  }
}

function getPasswordResetEmailHtml(resetUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #FDFAF6;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FDFAF6;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="padding: 40px; text-align: center; background-color: #1C1917; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 400;">Rate My Apartment</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1C1917; font-size: 24px; font-weight: 500;">Reset Your Password</h2>
              <p style="margin: 0 0 20px; color: #57534E; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="background-color: #B45309; border-radius: 6px;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500;">Reset Password</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 20px; color: #57534E; font-size: 16px; line-height: 1.6;">
                This link will expire in 24 hours.
              </p>
              <p style="margin: 0; color: #A8A29E; font-size: 14px;">
                If you didn't request this password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #F5F5F4; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #A8A29E; font-size: 13px;">
                © ${new Date().getFullYear()} Rate My Apartment. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function getPasswordResetEmailText(resetUrl: string): string {
  return `
Reset Your Password

We received a request to reset your password. Visit the link below to create a new password:

${resetUrl}

This link will expire in 24 hours.

If you didn't request this password reset, you can safely ignore this email.

© ${new Date().getFullYear()} Rate My Apartment
  `.trim();
}

export interface EmailVerificationData {
  email: string;
  token: string;
}

export async function sendEmailVerificationEmail(data: EmailVerificationData): Promise<boolean> {
  const postmarkClient = getClient();
  const verifyUrl = `${process.env.APP_URL || 'http://localhost:5000'}/verify-email/${data.token}`;

  if (!postmarkClient) {
    console.log(`[Email] Email verification would be sent to: ${data.email}`);
    console.log(`[Email] Verify URL: ${verifyUrl}`);
    return true;
  }

  try {
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: data.email,
      Subject: "Verify Your New Email - Rate My Apartment",
      HtmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #FDFAF6;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FDFAF6;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="padding: 40px; text-align: center; background-color: #1C1917; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 400;">Rate My Apartment</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1C1917; font-size: 24px; font-weight: 500;">Verify Your New Email</h2>
              <p style="margin: 0 0 20px; color: #57534E; font-size: 16px; line-height: 1.6;">
                Click the button below to verify this email address for your Rate My Apartment account.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="background-color: #B45309; border-radius: 6px;">
                    <a href="${verifyUrl}" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500;">Verify Email</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 20px; color: #57534E; font-size: 16px; line-height: 1.6;">
                This link will expire in 24 hours.
              </p>
              <p style="margin: 0; color: #A8A29E; font-size: 14px;">
                If you didn't request this email change, please ignore this email or contact support.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #F5F5F4; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #A8A29E; font-size: 13px;">
                © ${new Date().getFullYear()} Rate My Apartment. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
      TextBody: `Verify Your New Email\n\nClick the link below to verify this email address:\n\n${verifyUrl}\n\nThis link will expire in 24 hours.\n\n© ${new Date().getFullYear()} Rate My Apartment`,
      MessageStream: "outbound",
    });

    console.log(`[Email] Email verification sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`[Email] Failed to send email verification to ${data.email}:`, error);
    return false;
  }
}
