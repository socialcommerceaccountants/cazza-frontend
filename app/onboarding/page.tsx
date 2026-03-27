import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import Link from "next/link";
import { Bot, ArrowLeft } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to dashboard</span>
            </Link>
          </div>
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Cazza.ai</span>
          </Link>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <OnboardingWizard />
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