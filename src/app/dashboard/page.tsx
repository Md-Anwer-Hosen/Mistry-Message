"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2, RefreshCcw, Copy, MessageSquareOff } from "lucide-react";

import { Message } from "@/model/user";
import { ApiResponse } from "@/types/apiResponse";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MessageCard from "@/components/MessgeCards";

const UserDashboard = () => {
  const { data: session } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      isAcceptingMessage: true,
    },
  });

  const { watch, setValue } = form;
  const acceptMessages = watch("isAcceptingMessage");

  /* Fetch current accept-message status */
  const fetchAcceptMessageStatus = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("isAcceptingMessage", response.data.isAcceptingMessages ?? true);
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to fetch message status",
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  /* Fetch all messages */
  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success("Messages refreshed successfully");
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to fetch messages",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessageStatus();
  }, [session, fetchMessages, fetchAcceptMessageStatus]);

  /* Handle switch toggle */
  const handleSwitchChange = async (checked: boolean) => {
    setValue("isAcceptingMessage", checked);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        isAcceptingMessage: checked,
      });
      toast.success(response.data.message);
    } catch (err) {
      setValue("isAcceptingMessage", !checked);
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to update status",
      );
    }
  };

  /* Handle message delete */
  const handleMessageDelete = (messageId: string) => {
    setMessages((prev) =>
      prev.filter((message) => String(message._id) !== messageId),
    );
  };

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const { username } = session.user;

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard ✨");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10 antialiased selection:bg-primary/10">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          User Dashboard
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your anonymous feedback link and view incoming messages.
        </p>
      </div>

      {/* Settings Panel Card */}
      <div className="grid gap-6 p-6 rounded-lg border bg-card text-card-foreground shadow-sm md:grid-cols-2 md:items-center">
        {/* Copy Link Section */}
        <div className="space-y-2.5">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Your Unique Share Link
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 rounded-sm border border-input bg-muted/50 px-4 py-2.5 text-sm font-mono text-muted-foreground select-all outline-none"
            />
            <Button
              onClick={copyToClipboard}
              size="default"
              className="rounded-sm shadow-sm transition-all duration-200 active:scale-95"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>

        {/* Accept Messages Switch Section */}
        <div className="flex items-center justify-between md:justify-end md:gap-8 p-4 md:p-0 bg-muted/30 md:bg-transparent rounded-xl border border-dashed md:border-none">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-foreground">
              Accept Messages
            </h3>
            <p className="text-xs text-muted-foreground">
              Toggle availability of your inbox
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-primary"
            />
            <span
              className={`text-sm font-bold min-w-[30px] transition-colors duration-200 ${acceptMessages ? "text-emerald-500" : "text-destructive"}`}
            >
              {acceptMessages ? "On" : "Off"}
            </span>
          </div>
        </div>
      </div>

      <Separator className="opacity-60" />

      {/* Messages Feed Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Inbox Messages
            <span className="inline-flex items-center justify-center bg-muted px-2.5 py-0.5 text-xs font-semibold rounded-full border">
              {messages.length}
            </span>
          </h2>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          disabled={isLoading}
          className="rounded-sm hover:bg-muted/80 transition-all active:scale-95 shadow-sm"
          title="Refresh Messages"
        >
          <RefreshCcw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleMessageDelete}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 rounded-lg border border-dashed bg-muted/10 text-center space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <MessageSquareOff className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-foreground">
                No messages yet
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Share your unique link with friends to start receiving anonymous
                messages!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
