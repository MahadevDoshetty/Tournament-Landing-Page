import { createPrivateKey } from "node:crypto";
import { google } from "googleapis";
import type { RegistrationDocument } from "@/models/Registration";

const HEADERS = [
  "Team ID",
  "Category",
  "Team Name",
  "Captain Name",
  "Email",
  "WhatsApp",
  "Captain Free Fire ID",
  "Member 2 Name",
  "Member 2 Free Fire ID",
  "Member 3 Name",
  "Member 3 Free Fire ID",
  "Member 4 Name",
  "Member 4 Free Fire ID",
  "Amount (INR)",
  "Razorpay Order ID",
  "Razorpay Payment ID",
  "Paid At",
];

function getSheetsClient() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!spreadsheetId || !email || !key) {
    const missing = [
      ["GOOGLE_SHEETS_SPREADSHEET_ID", spreadsheetId],
      ["GOOGLE_SERVICE_ACCOUNT_EMAIL", email],
      ["GOOGLE_PRIVATE_KEY", key],
    ]
      .filter(([, value]) => !value)
      .map(([name]) => name);
    throw new Error(
      `Google Sheets is not configured. Set ${missing.join(", ")} in .env.local or your deployment environment.`,
    );
  }

  try {
    createPrivateKey(key);
  } catch {
    throw new Error(
      "GOOGLE_PRIVATE_KEY is invalid. Set it to the full private_key value from your downloaded Google service-account JSON, with PEM header/footer and line breaks encoded as \\n.",
    );
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return {
    client: google.sheets({ version: "v4", auth }),
    spreadsheetId,
  };
}

function registrationValues(registration: RegistrationDocument) {
  const members = registration.members ?? [];

  return [
    registration.teamId ?? "",
    registration.category,
    registration.teamName,
    registration.captainName,
    registration.email,
    registration.whatsapp,
    registration.freeFireId,
    members[0]?.name ?? "",
    members[0]?.freeFireId ?? "",
    members[1]?.name ?? "",
    members[1]?.freeFireId ?? "",
    members[2]?.name ?? "",
    members[2]?.freeFireId ?? "",
    registration.amountInr,
    registration.razorpayOrderId,
    registration.razorpayPaymentId ?? "",
    registration.paidAt ? new Date(registration.paidAt).toISOString() : "",
  ];
}

export async function ensureRegistrationSheet() {
  const { client, spreadsheetId } = getSheetsClient();
  const sheetName = "Registrations";

  const spreadsheet = await client.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });
  const hasRegistrationsSheet = spreadsheet.data.sheets?.some(
    (sheet) => sheet.properties?.title === sheetName,
  );

  if (!hasRegistrationsSheet) {
    await client.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: sheetName } } }],
      },
    });
  }
}

export async function appendRegistrationToGoogleSheet(registration: RegistrationDocument) {
  await ensureRegistrationSheet();

  const { client, spreadsheetId } = getSheetsClient();
  const quotedSheet = "'Registrations'";

  const headerResponse = await client.spreadsheets.values.get({
    spreadsheetId,
    range: `${quotedSheet}!A1:Q1`,
  });

  if (!headerResponse.data.values?.[0]?.some((value) => value !== "")) {
    await client.spreadsheets.values.update({
      spreadsheetId,
      range: `${quotedSheet}!A1:Q1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS] },
    });
  }

  const rowsResponse = await client.spreadsheets.values.get({
    spreadsheetId,
    range: `${quotedSheet}!A2:A`,
  });
  const rows = rowsResponse.data.values ?? [];
  const existingIndex = rows.findIndex((row) => row[0] === registration.teamId);
  const values = [registrationValues(registration)];

  if (existingIndex >= 0) {
    const rowNumber = existingIndex + 2;
    await client.spreadsheets.values.update({
      spreadsheetId,
      range: `${quotedSheet}!A${rowNumber}:Q${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: { values },
    });
    return;
  }

  await client.spreadsheets.values.append({
    spreadsheetId,
    range: `${quotedSheet}!A:Q`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
}
