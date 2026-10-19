import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ teamId?: string }>;
}) {
  const { teamId } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#1a1208,transparent_45%),#07090d] px-6 py-16">
      <div className="fire-glow w-full max-w-xl rounded-2xl border border-orange-400/30 bg-black/50 p-8 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-orange-300">Entry confirmed</p>
        <h1 className="mt-3 font-display text-3xl uppercase text-white">VykraX Studios — You are in</h1>
        <p className="mt-4 text-lg text-zinc-300">
          Your Championship entry is confirmed. Keep this Team ID safe; it identifies your place in
          the competition.
        </p>
        <p className="mt-8 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-5 font-display text-2xl tracking-[0.18em] text-cyan-200">
          {teamId || "TEAM ID PENDING"}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg border border-white/15 px-5 py-3 text-sm uppercase tracking-[0.16em] text-white hover:border-orange-400"
        >
          Back to landing page
        </Link>
      </div>
    </main>
  );
}
