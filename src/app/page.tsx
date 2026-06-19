"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Lock, LockOpen } from "lucide-react";
import { useSession } from "next-auth/react";

const letters = [
  {
    body: "I've always admired how calm you stay under pressure.",
    stamp: "OBSERVED",
  },
  {
    body: "Your idea in the meeting yesterday actually changed my mind.",
    stamp: "RECONSIDERED",
  },
  {
    body: "I never told you, but you're the reason I didn't quit.",
    stamp: "GRATEFUL",
  },
  {
    body: "Your laugh is the best part of my Mondays.",
    stamp: "NOTICED",
  },
  {
    body: "I think you're better at this than you give yourself credit for.",
    stamp: "OVERDUE",
  },
  {
    body: "Someone out there is grateful for something you did today.",
    stamp: "UNSIGNED",
  },
];

export default function Home() {
  const { data: session } = useSession();
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % letters.length);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(next, 4200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next]);

  const goTo = (i: number) => {
    setActive(i);
    setOpened((prev) => new Set(prev).add(i));
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 4200);
  };

  const breakSeal = (i: number) => {
    setOpened((prev) => new Set(prev).add(i));
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 4200);
  };

  const isOpen = opened.has(active);

  return (
    <div className="min-h-screen bg-[#12100E] text-[#F2EBDD] overflow-hidden">
      {/* paper grain */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 25%, #fff 0px, transparent 1px), radial-gradient(circle at 85% 70%, #fff 0px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <main className="relative max-w-5xl mx-auto px-6 sm:px-10 pt-24 pb-28 flex flex-col items-center">
        {/* Eyebrow — postal frank */}
        <div className="flex items-center gap-3 mb-9">
          <span className="h-px w-7 bg-[#5C5650]" />
          <span
            className="text-[11px] tracking-[0.3em] uppercase text-[#9A938A]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            no return address
          </span>
          <span className="h-px w-7 bg-[#5C5650]" />
        </div>

        {/* Hero headline */}
        <h1
          className="text-center text-[2.6rem] sm:text-[4.5rem] leading-[1.04] tracking-tight max-w-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Say it without
          <br />
          <span className="text-[#C44536] italic">signing your name.</span>
        </h1>

        <p className="mt-6 text-center text-[#B7AFA4] max-w-md text-base sm:text-lg leading-relaxed">
          MistryMessage gives anyone a link where strangers, friends, and secret
          admirers can leave a message — and you&apos;ll never know who sent it.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center gap-5">
          <Link
            href={session ? "/dashboard" : "/sign-up"}
            className="group inline-flex items-center gap-2 rounded-sm bg-[#F2EBDD] text-[#12100E] px-7 py-3 text-sm font-medium tracking-wide transition-colors hover:bg-[#C44536] hover:text-[#F2EBDD]"
          >
            {session ? "Go to dashboard" : "Create your link"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {!session && (
            <Link
              href="/sign-in"
              className="text-sm text-[#9A938A] hover:text-[#F2EBDD] transition-colors underline-offset-4 hover:underline"
            >
              Already have one? Sign in
            </Link>
          )}
        </div>

        {/* Signature element: sealed-letter stack you break open */}
        <section
          aria-label="Sample anonymous letters"
          className="mt-24 w-full max-w-xl"
        >
          <div className="flex items-center justify-between mb-5 px-1">
            <span
              className="text-[11px] uppercase tracking-[0.25em] text-[#9A938A]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              intercepted post
            </span>
            <span
              className="text-[11px] text-[#9A938A]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {String(active + 1).padStart(2, "0")}/
              {String(letters.length).padStart(2, "0")}
            </span>
          </div>

          <button
            onClick={() => !isOpen && breakSeal(active)}
            className="relative w-full text-left rounded-md border border-[#3A352D] bg-[#26221D] px-7 py-7 sm:px-9 sm:py-9 min-h-[180px] flex flex-col transition-colors hover:border-[#4A453B]"
            style={{ cursor: isOpen ? "default" : "pointer" }}
          >
            {/* faint envelope fold lines */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, transparent 48%, #5C5650 49%, transparent 50%), linear-gradient(45deg, transparent 48%, #5C5650 49%, transparent 50%)",
              }}
            />

            {!isOpen ? (
              <div className="relative flex flex-col items-center justify-center flex-1 gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#C44536] text-[#C44536]">
                  <Lock className="h-5 w-5" />
                </div>
                <p
                  className="text-sm text-[#9A938A] uppercase tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  tap to break the seal
                </p>
              </div>
            ) : (
              <div className="relative animate-[fadeIn_0.4s_ease-out]">
                <div className="flex items-center gap-2 mb-4">
                  <LockOpen className="h-3.5 w-3.5 text-[#C44536]" />
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] text-[#C44536]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {letters[active].stamp}
                  </span>
                </div>
                <p
                  className="text-[1.15rem] sm:text-[1.4rem] leading-snug text-[#F2EBDD]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  &ldquo;{letters[active].body}&rdquo;
                </p>
                <p
                  className="mt-4 text-xs text-[#9A938A]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  — anonymous
                </p>
              </div>
            )}
          </button>

          {/* dot controls */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {letters.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Show letter ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === active ? "20px" : "6px",
                  backgroundColor:
                    i === active ? "#C44536" : "rgba(242,235,221,0.18)",
                }}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="relative border-t border-[#26221D] py-6">
        <p
          className="text-center text-[11px] text-[#5C5650] tracking-wide"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          mistrymessage — say what you mean, keep who you are.
        </p>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
