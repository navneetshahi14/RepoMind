"use client";

import { Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const providers = [
  {
    id: "google",
    label: "Google",
    icon: Mail,
    handler: () => undefined,
  },
  {
    id: "github",
    label: "GitHub",
    icon: Github,
    handler: () => undefined,
  },
] as const;

export function OAuthButtons() {
  const handleClick = (provider: string) => {
    toast.info(`${provider} sign-in coming soon`, {
      description: "We're polishing the OAuth flow. Check back shortly.",
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {providers.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          disabled
          onClick={() => handleClick(label)}
          className="w-full"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}
