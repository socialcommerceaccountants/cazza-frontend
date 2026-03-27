import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { Bot } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-4 px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Cazza.ai</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            New to Cazza.ai?{" "}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              Create an account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
        
        {/* Additional Info */}
        <div className="mt-8 max-w-md text-center space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <span className="font-semibold">🤖</span>
              </div>
              <p className="font-medium">AI-Powered</p>
              <p className="text-muted-foreground">Smart automation</p>
            </div>
            <div className="space-y-1">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <span className="font-semibold">⚡</span>
              </div>
              <p className="font-medium">Fast Setup</p>
              <p className="text-muted-foreground">Get started in minutes</p>
            </div>
            <div className="space-y-1">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <span className="font-semibold">🔒</span>
              </div>
              <p className="font-medium">Secure</p>
              <p className="text-muted-foreground">Enterprise-grade security</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Trusted by 500+ businesses to automate workflows and drive growth
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            <p>© {new Date().getFullYear()} Cazza.ai. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/support" className="hover:text-foreground transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}