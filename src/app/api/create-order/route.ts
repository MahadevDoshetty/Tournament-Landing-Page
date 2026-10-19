import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { FEES_INR, feeInPaise } from "@/lib/fees";
import { ensureRegistrationSheet } from "@/lib/googleSheets";
import { connectToDatabase } from "@/lib/mongodb";
import { getRazorpay } from "@/lib/razorpay";
import { parseRegistrationPayload, type RegistrationInput } from "@/lib/validation";
import { Registration } from "@/models/Registration";

function missingEnvMessage() {
  const missing = [
    ["MONGODB_URI", process.env.MONGODB_URI],
    ["RAZORPAY_KEY_ID", process.env.RAZORPAY_KEY_ID],
    ["RAZORPAY_KEY_SECRET", process.env.RAZORPAY_KEY_SECRET],
    ["GOOGLE_SHEETS_SPREADSHEET_ID", process.env.GOOGLE_SHEETS_SPREADSHEET_ID],
    ["GOOGLE_SERVICE_ACCOUNT_EMAIL", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL],
    ["GOOGLE_PRIVATE_KEY", process.env.GOOGLE_PRIVATE_KEY],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length === 0) return null;
  return `Server is missing ${missing.join(", ")}. Configure these environment variables in .env.local for local development or in the Vercel project settings, then restart or redeploy.`;
}

export async function POST(request: Request) {
  const configError = missingEnvMessage();
  if (configError) {
    return NextResponse.json({ error: configError }, { status: 500 });
  }

  let payload: RegistrationInput;
  try {
    payload = parseRegistrationPayload(await request.json());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid registration details.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    await connectToDatabase();
    await ensureRegistrationSheet();

    const amountInr = FEES_INR[payload.category];
    const razorpay = getRazorpay();
    const receipt = `ffi_${Date.now().toString(36)}`;

    const order = await razorpay.orders.create({
      amount: feeInPaise(payload.category),
      currency: "INR",
      receipt,
      notes: {
        category: payload.category,
        teamName: payload.teamName.slice(0, 40),
      },
    });

    await Registration.create({
      captainName: payload.captainName,
      email: payload.email,
      whatsapp: payload.whatsapp,
      freeFireId: payload.freeFireId,
      teamName: payload.teamName,
      category: payload.category,
      members: payload.members,
      amountInr,
      razorpayOrderId: order.id,
      status: "pending",
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      amountInr,
    });
  } catch (error) {
    console.error("Order creation failed.", error);
    return NextResponse.json(
      { error: "We couldn’t prepare your entry. Please try again shortly." },
      { status: 500 },
    );
  }
}
