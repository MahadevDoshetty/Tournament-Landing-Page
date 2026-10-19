import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import type { Category } from "@/lib/fees";

const MemberSchema = new Schema(
  {
    name: { type: String, required: true },
    freeFireId: { type: String, required: true },
  },
  { _id: false },
);

const RegistrationSchema = new Schema(
  {
    teamId: { type: String, unique: true, sparse: true },
    captainName: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    freeFireId: { type: String, required: true },
    teamName: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["solo", "duo", "squad"],
    },
    members: { type: [MemberSchema], default: [] },
    amountInr: { type: Number, required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paidAt: { type: Date },
    confirmationEmailSentAt: { type: Date },
  },
  { timestamps: true },
);

export type RegistrationDocument = InferSchemaType<typeof RegistrationSchema> & {
  category: Category;
};

export const Registration: Model<RegistrationDocument> =
  (mongoose.models.Registration as Model<RegistrationDocument>) ||
  mongoose.model<RegistrationDocument>("Registration", RegistrationSchema);
