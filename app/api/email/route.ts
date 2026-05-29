import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const emailsSentPerSlug = new Map<string, number>();
const MAX_EMAILS_PER_SLUG = 3;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email is not configured" },
      { status: 503 }
    );
  }

  let body: { email?: string; slug?: string; companyName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, slug, companyName } = body;

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required" },
      { status: 400 }
    );
  }

  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    return NextResponse.json(
      { error: "slug is required" },
      { status: 400 }
    );
  }

  const count = emailsSentPerSlug.get(slug) ?? 0;
  if (count >= MAX_EMAILS_PER_SLUG) {
    return NextResponse.json(
      { error: "Email limit reached for this audit" },
      { status: 429 }
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://tools.teddycastro.me";
  const auditUrl = `${siteUrl}/audit/${slug}`;
  const displayName = companyName || slug;

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: `Your positioning audit for ${displayName}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin: 0; padding: 0; background-color: #F5F5F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color: #1a1a1a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5F3;">
    <tr>
      <td align="center" style="padding: 48px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom: 32px;">
              <p style="margin: 0; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #94918b; font-weight: 500;">
                Positioning audit
              </p>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background-color: #ffffff; border: 1px solid #e0dfdc; border-radius: 4px; padding: 40px 32px;">
              <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 400; color: #1a1a1a; font-family: Georgia, 'Times New Roman', serif;">
                ${displayName}
              </h1>
              <p style="margin: 0 0 32px; font-size: 14px; line-height: 1.6; color: #94918b;">
                Your positioning audit is ready to view.
              </p>
              <a href="${auditUrl}" target="_blank" style="display: inline-block; background-color: #9E5F3E; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; padding: 12px 24px; border-radius: 4px;">
                View your audit
              </a>
              <p style="margin: 24px 0 0; font-size: 12px; color: #94918b;">
                This link expires in 30 days.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94918b;">
                Built by Teddy Castro |
                <a href="https://tools.teddycastro.me" style="color: #9E5F3E; text-decoration: none;">tools.teddycastro.me</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    emailsSentPerSlug.set(slug, count + 1);
    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
