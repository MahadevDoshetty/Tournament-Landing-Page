import {
  EXTRA_MEMBERS_REQUIRED,
  isCategory,
  type Category,
} from "@/lib/fees";

export type MemberInput = {
  name: string;
  freeFireId: string;
};

export type RegistrationInput = {
  captainName: string;
  email: string;
  whatsapp: string;
  freeFireId: string;
  teamName: string;
  category: Category;
  members: MemberInput[];
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseRegistrationPayload(body: unknown): RegistrationInput {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid registration payload.");
  }

  const data = body as Record<string, unknown>;
  const categoryRaw = asString(data.category).toLowerCase();

  if (!isCategory(categoryRaw)) {
    throw new Error("Select Solo, Duo, or Squad.");
  }

  const membersRaw = Array.isArray(data.members) ? data.members : [];
  const members = membersRaw.map((member) => {
    const item = member && typeof member === "object" ? (member as Record<string, unknown>) : {};
    return {
      name: asString(item.name),
      freeFireId: asString(item.freeFireId),
    };
  });

  const payload: RegistrationInput = {
    captainName: asString(data.captainName),
    email: asString(data.email).toLowerCase(),
    whatsapp: asString(data.whatsapp).replace(/\s+/g, ""),
    freeFireId: asString(data.freeFireId),
    teamName: asString(data.teamName),
    category: categoryRaw,
    members,
  };

  validateRegistration(payload);
  return payload;
}

export function validateRegistration(payload: RegistrationInput) {
  if (!payload.captainName) throw new Error("Name is required.");
  if (payload.captainName.length > 80) throw new Error("Name must be 80 characters or fewer.");
  if (payload.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    throw new Error("Enter a valid email address.");
  }
  if (!/^[6-9]\d{9}$/.test(payload.whatsapp)) {
    throw new Error("Enter a valid 10-digit WhatsApp number.");
  }
  if (!/^\d{1,11}$/.test(payload.freeFireId)) {
    throw new Error("Free Fire IDs must contain numbers only and be no more than 11 digits.");
  }
  if (!payload.teamName) throw new Error("Team name is required.");
  if (payload.teamName.length > 40) throw new Error("Team name must be 40 characters or fewer.");

  const required = EXTRA_MEMBERS_REQUIRED[payload.category];
  if (payload.members.length !== required) {
    throw new Error(
      payload.category === "solo"
        ? "Solo registrations should not include extra members."
        : `Provide exactly ${required} teammate${required > 1 ? "s" : ""} for ${payload.category}.`,
    );
  }

  for (const [index, member] of payload.members.entries()) {
    if (!member.name) throw new Error(`Teammate ${index + 2} name is required.`);
    if (member.name.length > 80) {
      throw new Error(`Teammate ${index + 2} name must be 80 characters or fewer.`);
    }
    if (!/^\d{1,11}$/.test(member.freeFireId)) {
      throw new Error(
        `Free Fire IDs must contain numbers only and be no more than 11 digits (teammate ${index + 2}).`,
      );
    }
  }

  const ids = [payload.freeFireId, ...payload.members.map((member) => member.freeFireId)];
  if (new Set(ids).size !== ids.length) {
    throw new Error("Each player must have a unique Free Fire ID.");
  }
}
