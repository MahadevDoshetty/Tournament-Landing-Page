import crypto from "crypto";
import { Registration } from "@/models/Registration";

function randomTeamId() {
  const token = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `FFI-${token}`;
}

export async function createUniqueTeamId() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const teamId = randomTeamId();
    const exists = await Registration.exists({ teamId });
    if (!exists) return teamId;
  }
  throw new Error("Could not generate a unique team ID.");
}
