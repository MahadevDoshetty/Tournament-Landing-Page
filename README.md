This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## VykraX contest setup

Copy `.env.example` to `.env.local` for local development. Configure the same server-side
environment variables in the Vercel project settings for each deployment environment:

- `MONGODB_URI`
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`
- `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY`

The public Razorpay key ID may also be set as `NEXT_PUBLIC_RAZORPAY_KEY_ID`; never expose the
Razorpay key secret or MongoDB connection string in client-side code or commit them. Confirmation
email is configured to use the `vykraxstudios@gmail.com` Google account via `smtp.gmail.com`,
port `465` (SSL). Set `SMTP_PASS` to that Google account's app password; app passwords require
2-Step Verification. The visible support contact remains `vykrax@zohomail.in`. Do not put real
credentials in `.env.example`.

Free Fire IDs are validated as numeric and at most 11 digits. The Privacy Policy and Refund Policy
are available at `/privacy-policy` and `/refund-policy`; completed contest entry fees are
non-refundable, subject to applicable law and payment-provider or bank processes.

To export verified registrations to Google Sheets, enable the Google Sheets API in your Google
Cloud project, create a service account, and share the spreadsheet with its email as an Editor.
Set the spreadsheet ID (the value between `/d/` and `/edit` in the spreadsheet URL), the service
account email, and its private key in `.env.local` or your deployment environment. For
`GOOGLE_PRIVATE_KEY`, store the complete PEM private key; when entering it as a single-line
environment value, replace each newline with `\n`. The spreadsheet must contain a tab named
`Registrations`. Never commit or share the private key.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
