import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';
import { AuthProvider } from '@/components/auth/auth-provider';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create Account - Cazza.ai',
  description: 'Create your Cazza.ai account to start automating your business workflows',
};

export default function RegisterPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <div className="text-2xl font-bold text-primary">
                Cazza.ai
              </div>
              <div className="w-24"></div> {/* Spacer for alignment */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Form */}
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Start your AI business journey
                  </h1>
                  <p className="text-muted-foreground">
                    Create your account and discover how Cazza.ai can transform your business operations.
                  </p>
                </div>
                
                <RegisterForm />
              </div>

              {/* Right side - Benefits */}
              <div className="hidden lg:block">
                <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 border">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">
                        Everything you need to grow
                      </h2>
                      <p className="text-muted-foreground">
                        Get access to powerful tools designed to help your business succeed.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-primary">🤖</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">AI Business Assistant</h3>
                          <p className="text-sm text-muted-foreground">
                            Your personal AI assistant that learns your business and suggests optimizations.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-primary">📈</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Growth Analytics</h3>
                          <p className="text-sm text-muted-foreground">
                            Track CAC, ROI, LTV, and other key metrics with beautiful, interactive dashboards.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-primary">⚡</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Workflow Automation</h3>
                          <p className="text-sm text-muted-foreground">
                            Automate invoices, payments, customer communications, and more with no-code tools.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-primary">👥</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Team Collaboration</h3>
                          <p className="text-sm text-muted-foreground">
                            Invite team members, set permissions, and work together seamlessly.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="font-semibold mb-4">What our customers say</h3>
                      <div className="space-y-4">
                        <div className="bg-background rounded-lg p-4 border">
                          <p className="text-sm italic mb-2">
                            "Cazza.ai saved us 20 hours per week on administrative tasks. The ROI was immediate."
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">SR</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Sarah R.</p>
                              <p className="text-xs text-muted-foreground">CEO, TechStart Inc.</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-background rounded-lg p-4 border">
                          <p className="text-sm italic mb-2">
                            "The analytics dashboard alone is worth the price. We've optimized our marketing spend by 35%."
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">MJ</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Michael J.</p>
                              <p className="text-xs text-muted-foreground">Marketing Director</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Cazza.ai. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm">
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="/support" className="text-muted-foreground hover:text-foreground">
                  Support
                </Link>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}