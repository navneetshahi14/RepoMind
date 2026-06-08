"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { OAuthButtons } from "./OAuthButtons";
import { cn } from "@/lib/utils";

type Mode = "signup" | "signin";

const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = signinSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Add at least one uppercase letter")
    .regex(/[0-9]/, "Add at least one number"),
});

type SigninValues = z.infer<typeof signinSchema>;
type SignupValues = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: Mode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const signupFn = useAuthStore((s) => s.signup);
  const loginFn = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const storeError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const isSignup = mode === "signup";
  const schema = isSignup ? signupSchema : signinSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues | SigninValues>({
    resolver: zodResolver(schema),
    defaultValues: isSignup
      ? { name: "", email: "", password: "" }
      : { email: "", password: "" },
  });

  const onSubmit = async (values: SigninValues | SignupValues) => {
    clearError();
    try {
      if (isSignup) {
        await signupFn(values as SignupValues);
        toast.success("Welcome to RepoMind!", {
          description: "Your account is ready. Let's get started.",
        });
      } else {
        await loginFn(values as SigninValues);
        toast.success("Signed in", {
          description: "Redirecting to your dashboard…",
        });
      }
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(isSignup ? "Sign up failed" : "Sign in failed", {
        description: message,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      <div className="space-y-3">
        {isSignup && (
          <Field
            id="name"
            label="Full name"
            type="text"
            placeholder="Ada Lovelace"
            autoComplete="name"
            error={isSignup ? (errors as Record<string, { message?: string }>).name?.message : undefined}
            registration={register("name" as const)}
          />
        )}

        <Field
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          registration={register("email")}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {!isSignup && (
              <button
                type="button"
                className="text-xs font-medium text-primary hover:underline"
                onClick={(e: FormEvent) => {
                  e.preventDefault();
                  toast.info("Password reset coming soon", {
                    description: "We're wiring up email-based reset.",
                  });
                }}
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={isSignup ? "At least 8 characters" : "••••••••"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              className={cn(
                "pr-10",
                errors.password &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password?.message && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
          {isSignup && !errors.password?.message && (
            <p className="text-xs text-muted-foreground">
              8+ characters with at least one uppercase letter and one number.
            </p>
          )}
        </div>
      </div>

      {storeError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {storeError}
        </div>
      )}

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSignup ? "Create account" : "Sign in"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <OAuthButtons />
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
  error?: string;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
}

function Field({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  error,
  registration,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(error && "border-destructive focus-visible:ring-destructive")}
        {...registration}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
