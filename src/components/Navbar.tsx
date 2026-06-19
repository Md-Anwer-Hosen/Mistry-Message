"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogOut, LogIn, ShieldCheck } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#12100E]/85 backdrop-blur-md border-b border-[#26221D]/60 antialiased shadow-2xl shadow-[#12100E]/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo - Premium Brand Mark & Typography */}
        <Link
          href="/"
          className="flex items-center gap-3 group relative select-none"
        >
          <div className="absolute -inset-1 rounded-full bg-[#C44536]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center justify-center w-8 h-8 rounded-xl border border-[#C44536]/40 bg-[#12100E] text-[#C44536] text-xs font-black transition-all duration-300 group-hover:border-[#C44536] group-hover:bg-[#C44536] group-hover:text-[#F2EBDD] group-hover:shadow-[0_0_15px_rgba(196,69,54,0.4)]">
            M
          </span>
          <span
            className="text-lg font-bold tracking-tight text-[#F2EBDD] transition-colors duration-200"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Mistry
            <span className="italic text-[#C44536] font-semibold ml-0.5 group-hover:text-[#c44536]/90">
              Message
            </span>
          </span>
        </Link>

        {/* Desktop Interface */}
        <div className="hidden sm:flex items-center gap-6">
          {session ? (
            <>
              {/* User Identifier Tag */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#26221D]/40 border border-[#3A352D]/30 shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-lg h-2 w-2 bg-emerald-500"></span>
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.15em] text-[#9A938A] font-medium"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Active:{" "}
                  <span className="text-[#F2EBDD] font-bold">
                    {session.user.username}
                  </span>
                </span>
              </div>

              {/* Log Out Trigger */}
              <button
                onClick={() => signOut({ callbackUrl: "/sign-in" })}
                className="inline-flex items-center justify-center rounded-sm border border-[#3A352D] bg-[#26221D]/20 px-4 py-2 text-sm font-medium text-[#F2EBDD] transition-all duration-300 hover:border-[#C44536] hover:bg-[#C44536]/5 hover:text-[#C44536] active:scale-[0.97] hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              >
                <LogOut className="h-4 w-4 mr-2 stroke-[2.25]" />
                Sign out
              </button>
            </>
          ) : (
            /* Log In Trigger */
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-[#F2EBDD] to-[#E6DEC9] px-5 py-2 text-sm font-semibold text-[#12100E] shadow-md transition-all duration-300 hover:brightness-110 active:scale-[0.97] hover:shadow-[0_0_20px_rgba(242,235,221,0.15)]"
            >
              <LogIn className="h-4 w-4 mr-2 stroke-[2.25]" />
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile Controller Trigger */}
        <button
          className="sm:hidden text-[#F2EBDD] p-2 rounded-sm bg-[#26221D]/30 border border-[#3A352D]/20 hover:bg-[#26221D]/60 active:scale-95 transition-all"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Navigation Panel"
        >
          {menuOpen ? (
            <X className="h-5 w-5 transition-transform duration-200" />
          ) : (
            <Menu className="h-5 w-5 transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[#26221D]/60 bg-[#12100E] px-5 py-6 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300 content-none">
          {session ? (
            <>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#26221D]/30 border border-[#3A352D]/20">
                <div className="h-8 w-8 rounded-sm bg-[#C44536]/10 flex items-center justify-center border border-[#C44536]/20">
                  <ShieldCheck className="h-4 w-4 text-[#C44536]" />
                </div>
                <div className="space-y-0.5">
                  <p
                    className="text-[10px] uppercase tracking-[0.15em] text-[#9A938A]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Identified Account
                  </p>
                  <p className="text-[#F2EBDD] font-bold text-sm tracking-wide">
                    {session.user.username}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: "/sign-in" });
                }}
                className="flex w-full items-center justify-center rounded-sm border border-[#3A352D] bg-[#26221D]/10 py-3 text-sm font-medium text-[#F2EBDD] transition-all duration-200 hover:border-[#C44536] hover:bg-[#C44536]/5 hover:text-[#C44536] active:scale-95"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center justify-center rounded-sm bg-gradient-to-b from-[#F2EBDD] to-[#E6DEC9] py-3 text-sm font-bold text-[#12100E] shadow-lg active:scale-95 transition-all"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
