"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FullScreenLoader, LoadingSpinner } from "@/components/LoadingSpinner";
import { EXTRA_MEMBERS_REQUIRED, FEES_INR, type Category } from "@/lib/fees";

type Member = { name: string; freeFireId: string };
type SubmissionStage = "idle" | "preparing" | "awaiting-payment" | "confirming" | "redirecting";

const emptyMember = (): Member => ({ name: "", freeFireId: "" });

function membersForCategory(category: Category, current: Member[]) {
  const count = EXTRA_MEMBERS_REQUIRED[category];
  return Array.from({ length: count }, (_, index) => current[index] ?? emptyMember());
}

async function loadRazorpayScript() {
  if (window.Razorpay) return true;

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RegistrationForm() {
  const router = useRouter();
  const [category, setCategory] = useState<Category>("squad");
  const [captainName, setCaptainName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [freeFireId, setFreeFireId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<Member[]>(membersForCategory("squad", []));
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState<SubmissionStage>("idle");

  const fee = FEES_INR[category];
  const extraSlots = useMemo(() => membersForCategory(category, members), [category, members]);

  function changeCategory(next: Category) {
    setCategory(next);
    setMembers(membersForCategory(next, members));
  }

  function updateMember(index: number, field: keyof Member, value: string) {
    setMembers((current) => {
      const next = membersForCategory(category, current);
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStage("preparing");

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captainName,
          email,
          whatsapp,
          freeFireId,
          teamName,
          category,
          members: extraSlots,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const message =
          typeof data.error === "string" ? data.error : "Could not start your entry.";
        throw new Error(
          /server is missing|not configured|environment variables|\.env\.local/i.test(message)
            ? "Entries are temporarily unavailable. Please contact the organizer for assistance."
            : message,
        );
      }

      if (!data.orderId || !data.amount || !data.keyId) {
        throw new Error("We couldn’t prepare your entry. Please try again.");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Could not open secure payment. Please try again.");
      }

      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "VykraX",
        description: `${category.toUpperCase()} championship entry — ₹${fee}`,
        order_id: data.orderId,
        prefill: {
          name: captainName,
          email,
          contact: whatsapp,
        },
        theme: { color: "#f97316" },
        handler: async (payment) => {
          setStage("confirming");
          try {
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payment),
            });
            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
              throw new Error(
                "Your payment was received, but we could not confirm your entry yet. Please contact support with your payment details.",
              );
            }
            setStage("redirecting");
            router.push(`/success?teamId=${encodeURIComponent(verifyData.teamId)}`);
          } catch (verifyError) {
            setError(
              verifyError instanceof Error
                ? verifyError.message
                : "Your payment was received, but we could not confirm your entry yet. Please contact support with your payment details.",
            );
            setStage("idle");
          }
        },
        modal: {
          ondismiss: () => setStage("idle"),
        },
      });

      checkout.on("payment.failed", (failure) => {
        setError(
          failure.error?.description ||
            "Payment wasn’t completed. You can try again when you’re ready.",
        );
        setStage("idle");
      });

      setStage("awaiting-payment");
      checkout.open();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Registration failed.");
      setStage("idle");
    }
  }

  const isSubmitting = stage !== "idle";
  const stageMessage: Partial<Record<SubmissionStage, string>> = {
    preparing: "Preparing your entry...",
    "awaiting-payment": "Complete your payment in the secure payment window.",
    confirming: "Payment received. Confirming your championship entry...",
    redirecting: "Championship confirmed. Loading your Team ID...",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={isSubmitting} className="contents">
        <legend className="sr-only">Championship registration details</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {(["solo", "duo", "squad"] as Category[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => changeCategory(option)}
            disabled={isSubmitting}
            className={`rounded-xl border px-4 py-4 text-left transition ${
              category === option
                ? "border-orange-400 bg-orange-500/15 shadow-[0_0_24px_rgba(249,115,22,0.25)]"
                : "border-white/10 bg-black/30 hover:border-orange-400/40"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-orange-300">{option}</p>
            <p className="mt-2 font-display text-2xl text-white">₹{FEES_INR[option]}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" value={captainName} onChange={setCaptainName} required maxLength={80} />
        <Field label="Email" type="email" value={email} onChange={setEmail} required maxLength={254} />
        <Field
          label="WhatsApp number"
          value={whatsapp}
          onChange={setWhatsapp}
          required
          placeholder="10-digit number"
          inputMode="numeric"
          maxLength={10}
        />
        <Field
          label="Free Fire ID (numbers only, up to 11 digits)"
          value={freeFireId}
          onChange={(value) => setFreeFireId(value.replace(/\D/g, "").slice(0, 11))}
          required
          inputMode="numeric"
          maxLength={11}
        />
        <div className="sm:col-span-2">
          <Field label="Team name" value={teamName} onChange={setTeamName} required maxLength={40} />
        </div>
      </div>

      {extraSlots.length > 0 && (
        <div className="space-y-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
          <p className="font-display text-sm uppercase tracking-[0.18em] text-cyan-300">
            Teammates
          </p>
          {extraSlots.map((member, index) => (
            <div key={index} className="grid gap-4 sm:grid-cols-2">
              <Field
                label={`Player ${index + 2} name`}
                value={member.name}
                onChange={(value) => updateMember(index, "name", value)}
                required
                maxLength={80}
              />
              <Field
                label={`Player ${index + 2} Free Fire ID`}
                value={member.freeFireId}
                onChange={(value) =>
                  updateMember(index, "freeFireId", value.replace(/\D/g, "").slice(0, 11))
                }
                required
                inputMode="numeric"
                maxLength={11}
              />
            </div>
          ))}
        </div>
      )}

      <label className="flex items-start gap-3 text-sm text-zinc-300">
        <input
          type="checkbox"
          required
          checked={policyAccepted}
          onChange={(event) => setPolicyAccepted(event.target.checked)}
          className="mt-1 accent-orange-500"
        />
        <span>
          I have read and agree to the{" "}
          <a href="/privacy-policy" target="_blank" className="text-cyan-300 underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/refund-policy" target="_blank" className="text-cyan-300 underline">
            Refund Policy
          </a>
          . Entry fees are non-refundable.
        </span>
      </label>
      </fieldset>

      <div className="flex flex-col gap-3 rounded-xl border border-orange-400/30 bg-gradient-to-r from-orange-500/10 to-yellow-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-orange-300">Payable now</p>
          <p className="font-display text-3xl text-white">₹{fee}</p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-orange-500 px-6 py-3 font-display text-sm uppercase tracking-[0.2em] text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {stage === "preparing" ? (
            <span className="inline-flex items-center justify-center gap-2">
              <LoadingSpinner />
              Preparing your entry...
            </span>
          ) : (
            "Confirm and enter"
          )}
        </button>
      </div>

      {stageMessage[stage] && (
        stage === "awaiting-payment" ? (
          <p
            className="flex items-center gap-3 rounded-lg border border-cyan-400/25 bg-cyan-400/5 px-4 py-3 text-sm text-cyan-100"
            role="status"
            aria-live="polite"
          >
            <LoadingSpinner />
            {stageMessage[stage]}
          </p>
        ) : (
          <FullScreenLoader message={stageMessage[stage]} />
        )
      )}

      {error && (
        <p
          className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {error}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-400">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none ring-orange-400/0 transition placeholder:text-zinc-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30"
      />
    </label>
  );
}
