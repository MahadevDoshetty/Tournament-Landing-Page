import nodemailer from "nodemailer";
import type { RegistrationDocument } from "@/models/Registration";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "");

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendConfirmationEmail(registration: RegistrationDocument): Promise<boolean> {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM;

  if (!transporter || !from) {
    console.warn("SMTP is not configured. Skipping confirmation email.");
    return false;
  }

  const membersHtml = (registration.members ?? [])
    .map(
      (member, index) =>
        `<li>Player ${index + 2}: ${escapeHtml(member.name)} (FF ID: ${escapeHtml(member.freeFireId)})</li>`,
    )
    .join("");

  await transporter.sendMail({
    from,
    to: registration.email,
    subject: `Payment received — Team ID ${registration.teamId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0b0f14;color:#f5f5f5;padding:24px;border:1px solid #f59e0b;">
        <p style="color:#f59e0b;letter-spacing:2px;text-transform:uppercase;font-size:12px;margin:0 0 8px;">VykraX Studios - Free Fire Max Championship</p>
        <h1 style="margin:0 0 16px;font-size:24px;">Registration confirmed</h1>
        <p>Hi ${escapeHtml(registration.captainName)},</p>
        <p>We have received your entry fee of <strong>INR ${registration.amountInr}</strong> for the <strong>${registration.category.toUpperCase()}</strong> category.</p>
        <p style="font-size:18px;background:#1a1408;border:1px solid #f59e0b;padding:12px 16px;">
          Your unique Team ID: <strong>${registration.teamId}</strong>
        </p>
        <p>Keep this Team ID safe. You will need it for tournament communication.</p>
        <h2 style="font-size:16px;">Team details</h2>
        <ul>
          <li>Team name: ${escapeHtml(registration.teamName)}</li>
          <li>Captain: ${escapeHtml(registration.captainName)} (FF ID: ${escapeHtml(registration.freeFireId)})</li>
          ${membersHtml}
        </ul>
        <p>Payment ID: ${registration.razorpayPaymentId ?? "N/A"}</p>
        <p style="color:#9ca3af;font-size:12px;">Powered by <a href="https://rank2seat.in" style="color:#f59e0b;">Rank2Seat</a> · Questions? <a href="mailto:vykraxstudios@gmail.com" style="color:#f59e0b;">vykraxstudios@gmail.com</a></p>
      </div>
    `,
  });
  return true;
}
