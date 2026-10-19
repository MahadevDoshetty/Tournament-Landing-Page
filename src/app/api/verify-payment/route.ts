import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { sendConfirmationEmail } from "@/lib/email";
import { appendRegistrationToGoogleSheet } from "@/lib/googleSheets";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { createUniqueTeamId } from "@/lib/teamId";
import { Registration } from "@/models/Registration";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id : "";
    const paymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
    const signature = typeof body.razorpay_signature === "string" ? body.razorpay_signature : "";

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
    }

    if (!verifyRazorpaySignature({ orderId, paymentId, signature })) {
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    await connectToDatabase();

    let registration = await Registration.findOne({ razorpayOrderId: orderId });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found for this order." }, { status: 404 });
    }

    if (registration.status !== "paid") {
      const teamId = await createUniqueTeamId();
      const updatedRegistration = await Registration.findOneAndUpdate(
        { _id: registration._id, status: "pending" },
        {
          $set: {
            teamId,
            razorpayPaymentId: paymentId,
            razorpaySignature: signature,
            status: "paid",
            paidAt: new Date(),
          },
        },
        { returnDocument: "after", runValidators: true },
      );

      registration =
        updatedRegistration ??
        (await Registration.findById(registration._id)) ??
        registration;
    }

    if (registration.status !== "paid" || !registration.teamId) {
      return NextResponse.json(
        { error: "This entry is not ready to be confirmed. Contact the organizer for help." },
        { status: 409 },
      );
    }

    await appendRegistrationToGoogleSheet(registration);

    if (!registration.confirmationEmailSentAt) {
      try {
        const emailSent = await sendConfirmationEmail(registration);
        if (emailSent) {
          registration.confirmationEmailSentAt = new Date();
          await registration.save();
        }
      } catch (error) {
        console.error("Confirmation email delivery failed.", error);
      }
    }

    return NextResponse.json({
      teamId: registration.teamId,
      amountInr: registration.amountInr,
    });
  } catch (error) {
    console.error("Payment confirmation processing failed.", error);
    return NextResponse.json(
      {
        error:
          "Your payment was received, but we couldn’t finish confirming your entry. Please contact the organizer with your payment details.",
      },
      { status: 500 },
    );
  }
}
