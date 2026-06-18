"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          <MessageCircleQuestion className="h-5 w-5 text-primary" />
          MistryMessage
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome,{" "}
                <span className="font-semibold text-foreground">
                  {session.user.username}
                </span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/sign-in" })}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-foreground"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {session ? (
            <>
              <p className="text-sm text-muted-foreground">
                Welcome,{" "}
                <span className="font-semibold text-foreground">
                  {session.user.username}
                </span>
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: "/sign-in" });
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
