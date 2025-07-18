"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, UserPlus, LogIn, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from './auth-provider';

interface AuthFormProps {
  onAuthSuccess?: (user: any) => void;
  className?: string;
}

export function AuthForm({ onAuthSuccess, className = '' }: AuthFormProps) {
  const { signIn, signUp, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const result = await signUp(email, password);
        
        if (result.user) {
          setMessage({
            type: 'success',
            text: 'Account created successfully! You are now signed in.'
          });
          onAuthSuccess?.(result.user);
        }
      } else {
        const result = await signIn(email, password);
        
        if (result.user) {
          setMessage({
            type: 'success',
            text: 'Signed in successfully!'
          });
          onAuthSuccess?.(result.user);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Authentication failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setMessage(null);
    setEmail('');
    setPassword('');
  };

  const isFormLoading = loading || isLoading;

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <Card className="auth-dialog-fixed bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-foreground mb-2">
            {isSignUp ? '🚀 Create Account' : '🔐 Sign In'}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base leading-relaxed">
            {isSignUp 
              ? 'Create your DeepSniff account to start detecting deepfakes'
              : 'Sign in to your DeepSniff account'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-11 h-12 bg-background/50 border-border/60 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  required
                  disabled={isFormLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-11 h-12 bg-background/50 border-border/60 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  required
                  disabled={isFormLoading}
                  minLength={6}
                />
              </div>
              {isSignUp && (
                <p className="text-xs text-muted-foreground/80 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isFormLoading || !email || !password}
              className="w-full h-12 btn-cosmic-primary font-semibold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isFormLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <UserPlus className="mr-3 h-5 w-5" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-3 h-5 w-5" />
                      Sign In
                    </>
                  )}
                </>
              )}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={toggleMode}
              disabled={isFormLoading}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <Alert className={`mt-4 ${
              message.type === 'success' 
                ? 'border-green-500/30 bg-green-500/10' 
                : 'border-red-500/30 bg-red-500/10'
            }`}>
              <div className="flex items-start gap-3">
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <AlertDescription className={`${
                  message.type === 'success' ? 'text-green-300' : 'text-red-300'
                } leading-relaxed`}>
                  {message.text}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Features List - Separated with proper spacing */}
      <div className="mt-8 bg-card/30 backdrop-blur-sm rounded-xl border border-border/30 p-6">
        <h4 className="text-base font-semibold text-foreground mb-4 text-center">
          ✨ What you get with your account:
        </h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 text-green-400" />
            </div>
            <span className="text-foreground/90">Unlimited deepfake analysis</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 text-green-400" />
            </div>
            <span className="text-foreground/90">Upload images and videos</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 text-green-400" />
            </div>
            <span className="text-foreground/90">Detailed confidence reports</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 text-green-400" />
            </div>
            <span className="text-foreground/90">Analysis history tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
}