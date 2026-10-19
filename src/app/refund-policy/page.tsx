import Link from "next/link";

const contactNumbers = [
  { label: "+91 8147503170", href: "tel:+918147503170" },
  { label: "+91 9071102249", href: "tel:+919071102249" },
  { label: "+91 9900341598", href: "tel:+919900341598" },
];

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1a1208,transparent_45%),#07090d] px-4 py-12 text-zinc-200">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm uppercase tracking-[0.16em] text-orange-300 hover:text-orange-200">
          VykraX
        </Link>
        <p className="mt-8 text-xs uppercase tracking-[0.28em] text-orange-300">Entry terms</p>
        <h1 className="mt-3 font-display text-3xl uppercase text-white md:text-4xl">Refund Policy</h1>
        <p className="mt-4 text-zinc-400">
          This policy applies to tournament registrations collected by VykraX, powered by Rank2Seat.
        </p>

        <div className="mt-8 space-y-7 leading-relaxed">
          <section>
            <h2 className="font-display text-lg uppercase text-white">All entry fees are non-refundable</h2>
            <p className="mt-2">
              Once your payment has been successfully completed, the tournament entry fee is
              non-refundable. This applies if you withdraw, change your mind, do not attend or play,
              or are disqualified for not following the tournament rules.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg uppercase text-white">Payment problems</h2>
            <p className="mt-2">
              If a payment appears to have failed, was charged more than once, or you paid but did
              not receive a Team ID, contact us with your registered email and payment reference.
              We will review the transaction with the payment records. Any resolution remains
              subject to applicable law and payment-provider or bank processes.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg uppercase text-white">Contact</h2>
            <p className="mt-2">
              For entry-fee or payment questions, email{" "}
              <a href="mailto:vykrax@zohomail.in" className="text-cyan-300 underline">
                vykrax@zohomail.in
              </a>{" "}
              or call:
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
          <Link href="/privacy-policy" className="text-orange-300 hover:text-orange-200">Privacy Policy</Link>
        </nav>
      </article>
    </main>
  );
}
