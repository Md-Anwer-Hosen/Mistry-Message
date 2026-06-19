"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useCompletion } from "@ai-sdk/react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2, SendHorizontal, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApiResponse } from "@/types/apiResponse";

const SUGGESTION_SEPARATOR = "||";
const MAX_LENGTH = 300;

const PublicProfilePage = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [justSent, setJustSent] = useState(false);

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error: suggestError,
  } = useCompletion({
    api: "/api/suggest-messages",
    streamProtocol: "text",
  });

  const fetchSuggestions = async () => {
    try {
      await complete("suggest");
    } catch (err) {
      toast.error("Failed to load suggestions. Try again.");
    }
  };

  const suggestions = completion
    ? completion
        .split(SUGGESTION_SEPARATOR)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const handleSend = async () => {
    if (!content.trim()) {
      toast.error("Write something before sending");
      return;
    }

    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content,
      });
      toast.success(response.data.message);
      setContent("");
      setJustSent(true);
      setTimeout(() => setJustSent(false), 1800);
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to send message",
      );
    } finally {
      setIsSending(false);
    }
  };

  const remaining = MAX_LENGTH - content.length;
  const isNearLimit = remaining <= 30;

  return (
    <div className="min-h-screen bg-[#0E0E12] text-[#F7F4EE] px-4 py-16 relative overflow-hidden">
      {/* ambient grain */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 15%, #fff 0px, transparent 1px), radial-gradient(circle at 75% 65%, #fff 0px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="max-w-xl mx-auto space-y-8 relative">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8B8794]">
            anonymous message to
          </p>
          <h1
            className="text-3xl sm:text-4xl font-semibold transition-transform duration-300"
            style={{ fontFamily: "var(--font-display)" }}
          >
            @{username}
          </h1>
        </div>

        {/* Message box */}
        <div
          className="rounded-xl border bg-[#15151B] p-5 space-y-4 transition-colors duration-300"
          style={{
            borderColor: justSent ? "rgba(214,69,44,0.6)" : "#3A3640",
          }}
        >
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your anonymous message here..."
            maxLength={MAX_LENGTH}
            className="min-h-[120px] bg-transparent border-[#3A3640] text-[#F7F4EE] placeholder:text-[#5F5B66] resize-none focus-visible:ring-[#D6452C]/50 transition-shadow"
          />

          <div className="flex items-center justify-between">
            <span
              className="text-xs font-mono tabular-nums transition-colors duration-200"
              style={{ color: isNearLimit ? "#D6452C" : "#5F5B66" }}
            >
              {content.length}/{MAX_LENGTH}
            </span>
            <Button
              onClick={handleSend}
              disabled={isSending || !content.trim()}
              className="bg-[#F7F4EE] text-[#0E0E12] hover:bg-[#D6452C] hover:text-[#F7F4EE] transition-all active:scale-95 disabled:active:scale-100"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : justSent ? (
                <span className="mr-1">Sent</span>
              ) : (
                <>
                  <SendHorizontal className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Suggestion section */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={fetchSuggestions}
            disabled={isSuggestLoading}
            className="w-full border-[#3A3640] bg-transparent text-[#F7F4EE] hover:bg-[#1C1418] hover:border-[#D6452C]/60 hover:text-[#F7F4EE] transition-all active:scale-[0.98] group"
          >
            {isSuggestLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Thinking of something to say...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                Suggest messages
              </>
            )}
          </Button>

          <p className="text-xs text-center text-[#8B8794]">
            Tap a line below to drop it into the box
          </p>

          {suggestError && (
            <p className="text-xs text-center text-destructive">
              Couldn&apos;t load suggestions. Try again.
            </p>
          )}

          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setContent(s)}
                style={{
                  animation: `fadeSlideIn 0.4s ease-out ${i * 0.08}s both`,
                }}
                className="w-full text-left rounded-lg border border-[#3A3640] bg-[#15151B] px-4 py-3 text-sm text-[#C9C5CE] transition-all duration-200 hover:border-[#D6452C]/60 hover:text-[#F7F4EE] hover:bg-[#1A171B] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-between gap-3 group"
              >
                <span>{s}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#5F5B66] opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#D6452C]" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center pt-6 border-t border-[#23222A]">
          <p className="text-sm text-[#8B8794]">
            Want your own anonymous inbox?
          </p>
          <Link
            href="/sign-up"
            className="text-sm font-medium text-[#D6452C] hover:underline underline-offset-4"
          >
            Create your MistryMessage link
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PublicProfilePage;
