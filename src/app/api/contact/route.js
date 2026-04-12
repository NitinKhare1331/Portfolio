import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const OWNER_EMAIL = "nitin.khare.03.13.2001@gmail.com";

/* ─── Utility ────────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ─────────────────────────────────────────────────────────
   ADMIN EMAIL — Terminal / Code aesthetic
   (flex is fine for desktop email clients — admin mail)
───────────────────────────────────────────────────────── */
function adminEmailHtml(name, email, message, timestamp) {
  const lines = escapeHtml(message)
    .split("\n")
    .map(l => `<div style="line-height:1.8;">${l || "&nbsp;"}</div>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px 0;background:#080811;font-family:'Segoe UI',system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080811;"><tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;width:100%;">
  <tr><td style="height:3px;background:linear-gradient(90deg,#7c3aed,#06b6d4,#a855f7);border-radius:9px 9px 0 0;"></td></tr>
  <tr>
    <td style="background:#0d0d1a;border:1px solid rgba(139,92,246,0.25);border-top:none;border-radius:0 0 20px 20px;overflow:hidden;padding:0;">

      <!-- Terminal header bar -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background:#111128;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right:7px;"><div style="width:12px;height:12px;border-radius:50%;background:#ff5f57;"></div></td>
                <td style="padding-right:7px;"><div style="width:12px;height:12px;border-radius:50%;background:#febb2e;"></div></td>
                <td style="padding-right:16px;"><div style="width:12px;height:12px;border-radius:50%;background:#28c840;"></div></td>
                <td><span style="color:rgba(255,255,255,0.3);font-size:12px;font-family:'Courier New',monospace;letter-spacing:0.5px;">portfolio/contact — incoming_message.log</span></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Body -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:28px 32px;font-family:'Courier New',monospace;">
            <div style="color:rgba(255,255,255,0.2);font-size:12px;margin-bottom:24px;letter-spacing:0.5px;"><span style="color:#28c840;">&#9679;</span> &nbsp;NEW_CONTACT_EVENT &nbsp;&middot;&nbsp; ${timestamp}</div>

            <!-- Sender object -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:rgba(0,0,0,0.4);border:1px solid rgba(139,92,246,0.18);border-radius:12px;padding:24px;">
                  <div style="color:#7c3aed;font-size:11px;letter-spacing:1.5px;margin-bottom:14px;">const sender = {</div>
                  <div style="padding-left:20px;margin-bottom:8px;">
                    <span style="color:#06b6d4;font-size:13px;">name</span><span style="color:rgba(255,255,255,0.3);font-size:13px;">: </span><span style="color:#a3e635;font-size:13px;">"${escapeHtml(name)}"</span><span style="color:rgba(255,255,255,0.2);">,</span>
                  </div>
                  <div style="padding-left:20px;margin-bottom:14px;">
                    <span style="color:#06b6d4;font-size:13px;">email</span><span style="color:rgba(255,255,255,0.3);font-size:13px;">: </span><a href="mailto:${escapeHtml(email)}" style="color:#f472b6;font-size:13px;text-decoration:none;">"${escapeHtml(email)}"</a><span style="color:rgba(255,255,255,0.2);">,</span>
                  </div>
                  <div style="color:#7c3aed;font-size:11px;letter-spacing:1.5px;">}</div>
                </td>
              </tr>
            </table>

            <!-- Message block -->
            <div style="color:rgba(255,255,255,0.25);font-size:11px;letter-spacing:1.5px;margin-bottom:8px;">// message payload</div>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                <tr>
                  <!-- Left Accent Line -->
                  <td width="4" style="background:#06b6d4;border-radius:4px;">&nbsp;</td>

                  <!-- Message Box -->
                  <td style="background:#111827;border-radius:0 12px 12px 0;padding:18px 20px;color:#e5e7eb;font-size:14px;line-height:1.6;">
                    ${lines}
                  </td>
                </tr>
              </table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center">
                  <a href="mailto:${escapeHtml(email)}?subject=Re: Your portfolio message" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;font-size:13px;font-weight:700;font-family:'Segoe UI',sans-serif;text-decoration:none;padding:13px 32px;border-radius:50px;letter-spacing:0.5px;">&#8617; &nbsp; Reply to ${escapeHtml(name)}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Footer -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background:#080811;border-top:1px solid rgba(255,255,255,0.04);padding:14px 32px;text-align:center;">
            <span style="color:rgba(255,255,255,0.15);font-size:11px;font-family:'Courier New',monospace;">system: portfolio_v2 &nbsp;|&nbsp; status: 200 OK &nbsp;|&nbsp; env: production</span>
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>
</td></tr></table>
</body></html>`;
}

/* ─────────────────────────────────────────────────────────
   USER CONFIRMATION EMAIL
   100% table-based — works in Gmail mobile, Outlook, Apple Mail
───────────────────────────────────────────────────────── */
function confirmationEmailHtml(name, message) {
  const firstWord = escapeHtml(name).split(" ")[0];
  const msgLines = escapeHtml(message)
    .split("\n")
    .map(l => `<div style="margin:0;padding:2px 0;line-height:1.8;color:#94a3b8;font-size:13px;font-style:italic;">${l || "&nbsp;"}</div>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin:0;padding:0;background:#05050d;-webkit-text-size-adjust:100%;mso-line-height-rule:exactly;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#05050d">
<tr><td align="center" style="padding:24px 12px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

  <!-- TOP ACCENT BAR -->
  <tr>
    <td style="height:4px;background:linear-gradient(90deg,#34d399,#06b6d4,#818cf8);border-radius:9px 9px 0 0;font-size:0;line-height:0;">&nbsp;</td>
  </tr>

  <!-- CARD WRAPPER -->
  <tr>
    <td bgcolor="#0a0a17" style="border:1px solid rgba(52,211,153,0.2);border-top:none;border-radius:0 0 24px 24px;padding:0;">

      <!-- HERO -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding:44px 32px 12px;background:linear-gradient(180deg,rgba(52,211,153,0.07),transparent);">
            <!-- NK Initials badge -->
            <div style="width:68px;height:68px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;font-size:24px;font-weight:900;line-height:68px;text-align:center;margin:0 auto 18px;font-family:'Segoe UI',sans-serif;">NK</div>
            <h1 style="margin:0 0 10px;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;font-family:'Segoe UI',system-ui,sans-serif;">Message received, ${firstWord}! &#x1F389;</h1>
            <p style="margin:0 auto;color:rgba(255,255,255,0.5);font-size:14px;line-height:1.6;max-width:380px;font-family:'Segoe UI',system-ui,sans-serif;">I personally read every message and will reply within 24&ndash;48 hours.</p>
          </td>
        </tr>

        <!-- STATUS PILL -->
        <tr>
          <td align="center" style="padding:20px 32px 28px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="rgba(52,211,153,0.1)" style="border:1px solid rgba(52,211,153,0.3);border-radius:50px;padding:8px 22px;">
                  <span style="color:#34d399;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;font-family:'Segoe UI',system-ui,sans-serif;">&#9679;&nbsp; Response within 24&ndash;48 hrs</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- PERSONAL NOTE -->
        <tr>
          <td style="padding:0 32px 22px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:22px 24px;">
                  <p style="margin:0 0 10px;color:#94a3b8;font-size:14px;line-height:1.8;font-family:'Segoe UI',system-ui,sans-serif;">Hey <strong style="color:#e2e8f0;">${escapeHtml(name)}</strong> &mdash; your message arrived safely. No bots. You&rsquo;ll hear from me personally.</p>
                  <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.8;font-family:'Segoe UI',system-ui,sans-serif;">While you wait, feel free to connect on LinkedIn or browse my GitHub below.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DIVIDER LABEL -->
        <tr>
          <td align="center" style="padding:0 32px 10px;">
            <span style="color:rgba(255,255,255,0.2);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-family:'Segoe UI',system-ui,sans-serif;">&mdash;&nbsp; Your message &nbsp;&mdash;</span>
          </td>
        </tr>

        <!-- MESSAGE BLOCKQUOTE -->
        <tr>
          <td style="padding:0 32px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="3" bgcolor="#818cf8" style="border-radius:3px;font-size:0;line-height:0;">&nbsp;</td>
                <td bgcolor="rgba(0,0,0,0.35)" style="border-radius:0 12px 12px 0;padding:16px 20px;">${msgLines}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA BUTTONS -->
        <tr>
          <td align="center" style="padding:0 32px 36px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right:10px;">
                  <a href="https://www.linkedin.com/in/13-nitin-khare" style="display:inline-block;background:#0077b5;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 26px;border-radius:50px;font-family:'Segoe UI',system-ui,sans-serif;letter-spacing:0.3px;">LinkedIn</a>
                </td>
                <td>
                  <a href="https://github.com/NitinKhare1331" style="display:inline-block;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#e2e8f0;font-size:13px;font-weight:600;text-decoration:none;padding:12px 26px;border-radius:50px;font-family:'Segoe UI',system-ui,sans-serif;letter-spacing:0.3px;">GitHub</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- SIGNATURE FOOTER -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td bgcolor="rgba(0,0,0,0.3)" style="border-top:1px solid rgba(255,255,255,0.05);padding:20px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="vertical-align:middle;">
                  <div style="color:#e2e8f0;font-size:14px;font-weight:700;margin-bottom:4px;font-family:'Segoe UI',system-ui,sans-serif;">Nitin Khare</div>
                  <div style="color:rgba(255,255,255,0.3);font-size:12px;font-family:'Segoe UI',system-ui,sans-serif;">Software Development Engineer &middot; Full Stack</div>
                </td>
                <td width="44" style="vertical-align:middle;" align="right">
                  <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;font-size:13px;font-weight:900;line-height:40px;text-align:center;font-family:'Segoe UI',system-ui,sans-serif;">NK</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

    </td>
  </tr>

  <!-- BOTTOM DISCLAIMER -->
  <tr>
    <td align="center" style="padding:14px;">
      <span style="color:rgba(255,255,255,0.12);font-size:11px;font-family:'Segoe UI',system-ui,sans-serif;">Automated confirmation &middot; Do not reply directly to this email</span>
    </td>
  </tr>

</table>
</td></tr></table>
</body>
</html>`;
}

/* ─────────────────────────────────────────────────────────
   Module-level singleton transporter with connection pooling
───────────────────────────────────────────────────────── */
let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;
  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 3,
    rateDelta: 1000,
    rateLimit: 5,
  });
  return _transporter;
}

/* ─── POST Handler ────────────────────────────────────────── */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    /* Validation */
    const errors = {};
    if (!name?.trim() || name.trim().length < 2)
      errors.name = "Name must be at least 2 characters.";
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errors.email = "A valid email address is required.";
    if (!message?.trim() || message.trim().length < 10)
      errors.message = "Message must be at least 10 characters.";

    if (Object.keys(errors).length > 0)
      return NextResponse.json({ error: "Validation failed.", fields: errors }, { status: 400 });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)
      return NextResponse.json({ error: "Email service not configured." }, { status: 500 });

    const transporter = getTransporter();

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    const n = name.trim(), e = email.trim(), m = message.trim();

    /* Fire BOTH emails in parallel — ~2× faster than sequential */
    await Promise.all([
      transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: OWNER_EMAIL,
        replyTo: e,
        subject: `⚡ [Portfolio] New message from ${n}`,
        html: adminEmailHtml(n, e, m, timestamp),
      }),
      transporter.sendMail({
        from: `"Nitin Khare" <${process.env.EMAIL_USER}>`,
        to: e,
        subject: `Message received, ${n}! 🎉 — Nitin Khare`,
        html: confirmationEmailHtml(n, m),
      }),
    ]);

    return NextResponse.json(
      { success: true, message: "Message sent! Check your inbox for confirmation." },
      { status: 200 }
    );
  } catch (err) {
    console.error("[/api/contact]", err);
    return NextResponse.json(
      { error: "Could not send email. Please try again or contact me directly." },
      { status: 500 }
    );
  }
}
