"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Bot, Key } from "lucide-react";
import Link from "next/link";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  showHeader?: boolean;
}

export function ForgotPasswordForm({ onSuccess, showHeader = true }: ForgotPasswordFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"request" | "instructions">("request");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setStep("instructions");
    } catch (err) {
      setError("Failed to send reset instructions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccess(true);
    } catch (err) {
      setError("Failed to resend. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      {showHeader && (
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {step === "request" ? "Reset your password" : "Check your email"}
          </CardTitle>
          <CardDescription>
            {step === "request" 
              ? "Enter your email to receive reset instructions"
              : "We've sent you a password reset link"
            }
          </CardDescription>
        </CardHeader>
      )}
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "request" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            <>
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Password reset instructions have been sent to{" "}
                  <span className="font-semibold">{email}</span>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Check your inbox</h4>
                      <p className="text-sm text-muted-foreground">
                        We've sent an email with a password reset link to your email address.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Key className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Click the link</h4>
                      <p className="text-sm text-muted-foreground">
                        The link will expire in 1 hour for security reasons.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Can't find the email?</h4>
                      <p className="text-sm text-muted-foreground">
                        Check your spam folder or try resending the instructions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResend}
                    disabled={isLoading}
                  >
                    {isLoading ? "Resending..." : "Resend Instructions"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setStep("request")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Use a different email
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Still having trouble?{" "}
                <Link href="/support" className="text-primary hover:underline">
                  Contact support
                </Link>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="border-t pt-6">
          <div className="w-full text-center text-sm text-muted-foreground">
            <p>
              For security reasons, password reset links expire after 1 hour.
              If you need immediate assistance, please contact our support team.
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}