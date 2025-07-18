"use client";

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lock, Shield, CheckCircle, Mail, LogIn, Loader2 } from 'lucide-react';
import { AuthForm } from './auth-form';
import { useAuth } from './auth-provider';
import { useState } from 'react';

interface ProtectedContentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedContent({ children, fallback }: ProtectedContentProps) {
  const { user, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleAuthSuccess = (user: any) => {
    setShowAuthDialog(false);
    console.log('User authenticated:', user);
  };

  if (loading) {
    return (
      <Card className="card-cosmic">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <div>
              <div className="h-4 bg-primary/20 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-primary/20 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return fallback || (
      <>
        <Card className="card-cosmic">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent p-4 lunar-glow">
              <Lock className="w-8 h-8 text-background" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground mb-2">
              🔐 Email Sign-In Required
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Create your account or sign in with email to access DeepSniff&apos;s deepfake detection system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Benefits */}
            <div className="bg-card/30 p-6 rounded-lg border border-border/30">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                ✅ What you get with email sign-in:
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Unlimited deepfake analyses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Upload images and videos for analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Get detailed confidence scores and reports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Access to sample deepfake demonstrations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Analysis history tracking</span>
                </div>
              </div>
            </div>

            {/* Why Email Only */}
            <div className="bg-card/30 p-6 rounded-lg border border-border/30">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                🔐 Simple & Secure Email Authentication
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use email-based authentication powered by Supabase to keep things simple and secure. 
                Create an account with just your email and password to start detecting deepfakes.
              </p>
              <div className="flex items-center space-x-3 p-3 bg-card/50 rounded-lg border border-border/50">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email & Password</p>
                  <p className="text-xs text-muted-foreground">Secure authentication with Supabase</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <Button 
                onClick={() => setShowAuthDialog(true)}
                size="lg"
                className="btn-cosmic-primary px-8 py-6 text-lg font-semibold rounded-xl group mb-4"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Sign In with Email
              </Button>
              <p className="text-sm text-muted-foreground">
                ⚡ Quick email sign-up - create account or sign in to existing account
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Auth Dialog */}
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="card-cosmic border-border/50 max-w-md p-0 bg-transparent border-none shadow-none">
            <DialogHeader>
              <DialogTitle className="text-foreground text-center sr-only">
                Welcome to DeepSniff
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-center sr-only">
                Sign in or create an account to start detecting deepfakes
              </DialogDescription>
            </DialogHeader>
            
            <AuthForm 
              onAuthSuccess={handleAuthSuccess}
              className=""
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return <>{children}</>;
}