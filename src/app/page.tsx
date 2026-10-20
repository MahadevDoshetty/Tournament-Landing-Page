import { RegistrationForm } from "@/components/RegistrationForm";
import { FEES_INR } from "@/lib/fees";

const nav = [
  { href: "#how", label: "How it works" },
  { href: "#rules", label: "Rules" },
  { href: "#prizes", label: "Prizes" },
  { href: "#register", label: "Register" },
];

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(249,115,22,0.22),transparent_36%),radial-gradient(circle_at_90%_10%,rgba(34,211,238,0.12),transparent_28%)]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="#top" className="font-display text-sm uppercase tracking-[0.2em] text-orange-400">
            VykraX Studios
          </a>
          <nav className="hidden gap-6 text-sm uppercase tracking-[0.16em] text-zinc-300 md:flex">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-orange-300">
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="https://rank2seat.in"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs uppercase tracking-[0.16em] text-cyan-300"
          >
            Powered by Rank2Seat
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero-grid relative mx-auto max-w-6xl px-4 pb-20 pt-16 md:pt-24">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-300">VykraX Studios presents</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl uppercase leading-tight text-white md:text-6xl">
            Free Fire Max
            <span className="block text-orange-400">Squad Championship</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-300 md:text-xl">
            Choose your competition category, register your players, and secure your place.
            You’ll receive a unique Team ID once your entry is confirmed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#register"
              className="rounded-lg bg-orange-500 px-6 py-3 font-display text-sm uppercase tracking-[0.2em] text-black hover:bg-orange-400"
            >
              Register now
            </a>
            <a
              href="#how"
              className="rounded-lg border border-white/15 px-6 py-3 font-display text-sm uppercase tracking-[0.2em] text-white hover:border-orange-400"
            >
              Championship format
            </a>
          </div>
          <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              ["Solo", `₹${FEES_INR.solo}`],
              ["Duo", `₹${FEES_INR.duo}`],
              ["Squad", `₹${FEES_INR.squad}`],
            ].map(([label, value]) => (
              <div key={label} className="fire-glow rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{label}</p>
                <p className="mt-2 font-display text-2xl text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            kicker="Format"
            title="Championship schedule & format"
            note="All three phases use Battle Royale on random maps. Teams advance according to their Rank Points (RP)."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                label: "Championship begins",
                date: "Saturday, 31 October 2026",
                time: "7:00 PM",
              },
              {
                label: "Grand Final",
                date: "Sunday, 1 November 2026",
                time: "6:30 PM",
              },
            ].map((event) => (
              <article
                key={event.label}
                className="rounded-2xl border border-orange-400/30 bg-orange-500/5 p-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-orange-300">{event.label}</p>
                <p className="mt-3 font-display text-xl uppercase text-white">{event.date}</p>
                <p className="mt-2 text-lg text-zinc-300">{event.time}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                phase: "Phase I",
                title: "Battle Royale qualifiers",
                field: "48 teams · 4 groups of 12",
                body: "Teams are placed into Groups A, B, C, and D. The top six teams in each group by RP advance to Phase II, for 24 qualifiers total.",
                matches: "Battle Royale · Random maps · 3 matches per group",
              },
              {
                phase: "Phase II",
                title: "Battle Royale qualifiers",
                field: "Groups E & F · 12 teams each",
                body: "The 24 qualifiers are split into Groups E and F, with 12 teams in each. The top six teams in each group by RP advance to Phase III, for 12 qualifiers total.",
                matches: "Battle Royale · Random maps · 3 matches per group",
              },
              {
                phase: "Phase III",
                title: "Championship standings",
                field: "12 teams · 1 group",
                body: "All 12 qualified teams compete together across two Battle Royale matches. Their combined RP across both matches determines the final standings: 1st, 2nd, and 3rd place.",
                matches: "Battle Royale · Random maps · 2 matches",
              },
            ].map((item) => (
              <article
                key={item.phase}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <p className="font-display text-orange-400">{item.phase}</p>
                <h3 className="mt-3 font-display text-xl uppercase text-white">{item.title}</h3>
                <p className="mt-3 text-sm uppercase tracking-[0.12em] text-cyan-300">{item.field}</p>
                <p className="mt-3 text-zinc-300">{item.body}</p>
                <p className="mt-5 border-t border-white/10 pt-4 text-sm text-orange-200">
                  {item.matches}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-4 text-zinc-200">
            <span className="font-display uppercase text-cyan-300">Championship objective: </span>
            Battle Royale qualifiers narrow 48 teams to 24, then 12. Phase III Rank Points across
            two matches determine the Championship’s top three.
          </p>
        </section>

        <section id="rules" className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            kicker="Fair play"
            title="Game rules"
            note="Qualifier rankings are determined by Rank Points (RP), with clear tie-break rules."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Your place is confirmed once your entry is complete and you receive a Team ID. Please check your spam box for the mail. ",
              "Your entry fee depends on the category you choose and is shown before you confirm your entry.",
              "Players must use the Free Fire IDs submitted during registration. Contact the organizer if you need help with a registration detail.",
              "The top six teams by RP from each Phase I group advance to Phase II, for 24 teams total.",
              "In Phase II, the 24 teams are split into two groups of 12. The top six by RP from each group advance to Phase III.",
              "All 12 Phase III teams play two Battle Royale matches together. Final placements are based on combined RP across those two matches.",
              "Rank Points (RP): each kill earns 1 RP.",
              "Placement points: 1st place (Booyah) earns 10 RP, 2nd place earns 6 RP, and 3rd place earns 5 RP.",
              "Teams are ranked by total RP. If teams are tied on RP, the team with more kills ranks higher.",
              "If teams remain tied after comparing kills, a new match will be played to determine their ranking.",
              "Participants found using hacking or AI tools will be disqualified from the Championship and may face further action from the organizing committee."
            ].map((rule) => (
              <p
                key={rule}
                className="rounded-xl border border-orange-400/20 bg-orange-500/5 px-5 py-4 text-zinc-200"
              >
                {rule}
              </p>
            ))}
          </div>
        </section>

        <section id="prizes" className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            kicker="Rewards"
            title="Game prizes"
            note="Rewards are subject to the final Championship announcement and organizer confirmation."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Prizes", "Up to ₹10,000"],
              ["Bonus", "Free entry tickets for upcoming Championships"],
              ["Giveaway", "Up to 5,000 Diamonds"],
            ].map(([label, value]) => (
              <article
                key={label}
                className="rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{label}</p>
                <p className="mt-3 font-display text-xl uppercase text-white">{value}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="register" className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            kicker="Entry"
            title="Registration"
            note="Choose Solo, Duo, or Squad, enter your player details, and confirm your entry fee."
          />
          <div className="mt-8 fire-glow rounded-2xl border border-orange-400/25 bg-black/50 p-6 md:p-8">
            <RegistrationForm />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="rounded-2xl border border-cyan-400/30 bg-linear-to-r from-cyan-500/10 to-orange-500/10 p-8 md:flex md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Powered by</p>
              <h2 className="mt-2 font-display text-3xl uppercase text-white">Rank2Seat</h2>
              <p className="mt-2 text-zinc-300">www.rank2seat.in</p>
            </div>
            <a
              href="https://rank2seat.in"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-lg bg-cyan-400 px-6 py-3 font-display text-sm uppercase tracking-[0.16em] text-black hover:bg-cyan-300 md:mt-0"
            >
              Visit Rank2Seat
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 text-sm text-zinc-500">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display uppercase tracking-[0.16em] text-white">VykraX Studios</p>
            <p className="mt-2">Free Fire Max - Squad Championship · Powered by Rank2Seat</p>
          </div>
          <div>
            <p className="mb-2 uppercase tracking-[0.16em] text-zinc-300">Policies</p>
            <div className="flex gap-4">
              <a href="/privacy-policy" className="hover:text-orange-300">Privacy Policy</a>
              <a href="/refund-policy" className="hover:text-orange-300">Refund Policy</a>
            </div>
          </div>
          <div>
            <p className="mb-2 uppercase tracking-[0.16em] text-zinc-300">Questions?</p>
            <a href="mailto:vykraxstudios@gmail.com" className="text-cyan-300 hover:text-cyan-200">
              vykraxstudios@gmail.com
            </a>
            <div className="mt-2 flex flex-col gap-1">
              {["+91 8147503170", "+91 9071102249", "+91 9900341598"].map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-orange-300">
                  {phone}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  note,
}: {
  kicker: string;
  title: string;
  note: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.32em] text-orange-300">{kicker}</p>
      <h2 className="mt-3 font-display text-3xl uppercase text-white md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-zinc-400">{note}</p>
    </div>
  );
}
