import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';
import { AuthProvider } from '@/components/auth/auth-provider';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign In - Cazza.ai',
  description: 'Sign in to your Cazza.ai account',
};

export default function LoginPage() {
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
                    Welcome back to Cazza.ai
                  </h1>
                  <p className="text-muted-foreground">
                    Sign in to access your AI business assistant and continue automating your workflows.
                  </p>
                </div>
                
                <LoginForm />
              </div>

              {/* Right side - Features */}
              <div className="hidden lg:block">
                <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 border">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">
                        Why businesses choose Cazza.ai
                      </h2>
                      <p className="text-muted-foreground">
                        Join thousands of businesses automating their workflows with AI.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-primary">✓</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">AI-Powered Automation</h3>
                          <p className="text-sm text-muted-foreground">
                            Automate repetitive tasks and workflows with intelligent AI assistants.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-primary">📊</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Real-time Analytics</h3>
                          <p className="text-sm text-muted-foreground">
                            Get actionable insights with comprehensive dashboards and reports.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-primary">🔗</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Platform Integration</h3>
                          <p className="text-sm text-muted-foreground">
                            Connect with Xero, Stripe, Google Workspace, and more in minutes.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-primary">🛡️</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Enterprise Security</h3>
                          <p className="text-sm text-muted-foreground">
                            Bank-level security with encryption, 2FA, and compliance certifications.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">10k+</div>
                          <div className="text-sm text-muted-foreground">Businesses</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">99.9%</div>
                          <div className="text-sm text-muted-foreground">Uptime</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">24/7</div>
                          <div className="text-sm text-muted-foreground">Support</div>
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