"use client";

import { useState } from "react";
import { CopyIcon } from "@/components/SocialIcons";

export function CopyEmailButton({
  email,
  className = "",
}: {
  email: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — silently no-op
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Email copied" : "Copy email"}
      title={`Copy ${email}`}
      className={`inline-flex items-center gap-1.5 text-body text-foreground hover:opacity-70 transition-opacity ${className}`}
    >
      <CopyIcon className="h-4 w-4" />
      <span>{copied ? "Copied" : "Copy Email"}</span>
    </button>
  );
}
