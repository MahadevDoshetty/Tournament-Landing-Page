export function LoadingSpinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  );
}

export function FullScreenLoader({ message }: { message: string }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center bg-black/90 px-5 py-8 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-orange-400/25 bg-[#0b0f14] px-6 py-10 text-center shadow-[0_0_48px_rgba(249,115,22,0.16)] sm:px-10 sm:py-12">
        <span
          aria-hidden="true"
          className="size-14 animate-spin rounded-full border-[5px] border-orange-400/20 border-t-orange-400 sm:size-16"
        />
        <p className="mt-6 font-display text-sm uppercase leading-relaxed tracking-[0.14em] text-white sm:text-base sm:tracking-[0.18em]">
          {message}
        </p>
        <p className="mt-3 text-sm text-zinc-400">Please keep this page open.</p>
      </div>
    </div>
  );
}
