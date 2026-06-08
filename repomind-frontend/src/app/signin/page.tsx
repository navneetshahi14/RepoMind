import { type Metadata } from "next";
import { AuthForm } from "@/features/auth/AuthForm";
import { AuthShell } from "@/features/auth/AuthShell";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to RepoMind and continue chatting with your data.",
};

export default function SigninPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue chatting with your sources."
      footerPrompt="Don't have an account?"
      footerLinkLabel="Create one"
      footerLinkHref="/signup"
    >
      <AuthForm mode="signin" />
    </AuthShell>
  );
}
