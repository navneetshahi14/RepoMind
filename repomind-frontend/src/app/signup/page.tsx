import { type Metadata } from "next";
import { AuthForm } from "@/features/auth/AuthForm";
import { AuthShell } from "@/features/auth/AuthShell";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Sign up for RepoMind and start chatting with your code, PDFs, and documents using AI.",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Get started with RepoMind — it's free to try."
      footerPrompt="Already have an account?"
      footerLinkLabel="Sign in"
      footerLinkHref="/signin"
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
