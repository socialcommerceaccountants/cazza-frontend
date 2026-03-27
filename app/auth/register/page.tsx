import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";
import { Bot, CheckCircle } from "lucide-react";

export default function RegisterPage() {
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
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <RegisterForm />
        </div>
        
        {/* Features */}
        <div className="mt-8 max-w-2xl">
          <h3 className="text-lg font-semibold text-center mb-6">Why businesses choose Cazza.ai</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg border space-y-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">⏱️</span>
              </div>
              <h4 className="font-semibold">Save 20+ Hours/Week</h4>
              <p className="text-sm text-muted-foreground">
                Automate repetitive tasks and focus on what matters
              </p>
            </div>
            
            <div className="p-4 rounded-lg border space-y-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold text-xl">📈</span>
              </div>
              <h4 className="font-semibold">Increase Revenue</h4>
              <p className="text-sm text-muted-foreground">
                AI-powered insights to drive growth and efficiency
              </p>
            </div>
            
            <div className="p-4 rounded-lg border space-y-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xl">🔄</span>
              </div>
              <h4 className="font-semibold">Seamless Integration</h4>
              <p className="text-sm text-muted-foreground">
                Connect with your existing tools in minutes
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-6 rounded-lg bg-muted">
            <h4 className="font-semibold mb-4">What's included in your free trial:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "14-day free trial of all features",
                "Unlimited AI task automation",
                "Up to 5 team members",
                "Basic analytics and reporting",
                "Email and chat support",
                "All core integrations",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
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