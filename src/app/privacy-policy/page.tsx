import Link from "next/link";

const contactNumbers = [
  { label: "+91 8147503170", href: "tel:+918147503170" },
  { label: "+91 9071102249", href: "tel:+919071102249" },
  { label: "+91 9900341598", href: "tel:+919900341598" },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1a1208,transparent_45%),#07090d] px-4 py-12 text-zinc-200">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm uppercase tracking-[0.16em] text-orange-300 hover:text-orange-200">
          VykraX
        </Link>
        <p className="mt-8 text-xs uppercase tracking-[0.28em] text-orange-300">Legal</p>
        <h1 className="mt-3 font-display text-3xl uppercase text-white md:text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-zinc-400">
          This policy explains how VykraX, powered by Rank2Seat, handles information when you
          register for a tournament.
        </p>

        <div className="mt-8 space-y-7 leading-relaxed">
          <section>
            <h2 className="font-display text-lg uppercase text-white">Information we collect</h2>
            <p className="mt-2">
              We collect the details you submit for registration, such as your name, email address,
              WhatsApp number, team name, category, and the Free Fire IDs and names of registered
              players. We also receive payment and transaction references needed to verify your
              entry and provide support.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg uppercase text-white">How we use it</h2>
            <p className="mt-2">
              Registration information is used to manage entries, verify payments, issue Team IDs,
              communicate tournament information, administer the event and rewards, and respond to
              queries.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg uppercase text-white">Payments and service providers</h2>
            <p className="mt-2">
              Payments are processed by Razorpay. We do not ask you to enter or store full payment
              card, bank, or UPI credentials on this website. Information may be processed by
              service providers supporting the tournament, including payment, hosting, database, and
              email services, and may be disclosed where required by law.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg uppercase text-white">Storage and retention</h2>
            <p className="mt-2">
              We retain registration and transaction records for as long as reasonably necessary to
              operate the tournament, handle support and payment queries, maintain required records,
              and meet legal obligations. Access to those records is limited to people and
              providers who need them for these purposes.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg uppercase text-white">Your choices and contacting us</h2>
            <p className="mt-2">
              For questions about your information or to request a correction, contact the organizer
              at{" "}
              <a href="mailto:vykrax@zohomail.in" className="text-cyan-300 underline">
                vykrax@zohomail.in
              </a>
              . You can also call:
            </p>
            <ul className="mt-3 space-y-1">
              {contactNumbers.map((number) => (
                <li key={number.href}>
                  <a href={number.href} className="text-cyan-300 underline">
                    {number.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <nav className="mt-10 flex gap-5 border-t border-white/10 pt-6 text-sm">
          <Link href="/" className="text-orange-300 hover:text-orange-200">Home</Link>
          <Link href="/refund-policy" className="text-orange-300 hover:text-orange-200">Refund Policy</Link>
        </nav>
      </article>
    </main>
  );
}
