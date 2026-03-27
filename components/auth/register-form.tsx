'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from './auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, Building, Eye, EyeOff, Check, X } from 'lucide-react';
import Link from 'next/link';

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export function RegisterForm() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthContext();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const validatePassword = (pwd: string) => {
    setPasswordValidation({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    });
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (!email.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    // Check password strength
    const isStrongPassword = Object.values(passwordValidation).every(Boolean);
    if (!isStrongPassword) {
      setFormError('Please choose a stronger password');
      return;
    }

    try {
      await register({ email, password, name, company });
      // Redirect to dashboard on successful registration
      router.push('/');
    } catch (err: any) {
      // Error is already handled in the auth store
      console.error('Registration failed:', err);
    }
  };

  const ValidationItem = ({ valid, text }: { valid: boolean; text: string }) => (
    <div className="flex items-center gap-2">
      {valid ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={`text-sm ${valid ? 'text-green-600' : 'text-red-600'}`}>
        {text}
      </span>
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Get started with Cazza.ai - your AI business assistant
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {(error || formError) && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {formError || error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="pl-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company (Optional)</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="company"
                type="text"
                placeholder="Your Company Ltd"
                className="pl-10"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {/* Password strength indicator */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <ValidationItem
                valid={passwordValidation.length}
                text="At least 8 characters"
              />
              <ValidationItem
                valid={passwordValidation.uppercase}
                text="One uppercase letter"
              />
              <ValidationItem
                valid={passwordValidation.lowercase}
                text="One lowercase letter"
              />
              <ValidationItem
                valid={passwordValidation.number}
                text="One number"
              />
              <ValidationItem
                valid={passwordValidation.special}
                text="One special character"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              required
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/login')}
            disabled={isLoading}
          >
            Sign in instead
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          By creating an account, you agree to receive occasional product updates and marketing emails.
          You can unsubscribe at any time.
        </div>
        
        <div className="text-center text-sm">
          Need help?{' '}
          <Link href="/support" className="text-primary hover:underline">
            Contact our sales team
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}