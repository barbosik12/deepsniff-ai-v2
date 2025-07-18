"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LogIn, LogOut, Mail, Loader2 } from 'lucide-react';
import { AuthForm } from './auth-form';
import { useAuth } from './auth-provider';

interface AuthButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showUserInfo?: boolean;
}

export function AuthButton({ 
  variant = 'default', 
  size = 'default', 
  className = '',
  showUserInfo = false 
}: AuthButtonProps) {
  const { user, loading, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleAuth = async () => {
    if (user) {
      await signOut();
    } else {
      setShowAuthDialog(true);
    }
  };

  const handleAuthSuccess = (user: any) => {
    setShowAuthDialog(false);
    console.log('User authenticated:', user);
  };

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (user) {
    // Get display name from email
    const displayName = user.email || 'User';

    if (showUserInfo) {
      return (
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={handleAuth}
        >
          <Mail className="mr-2 h-4 w-4" />
          {displayName}
          <LogOut className="ml-2 h-4 w-4" />
        </Button>
      );
    }

    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleAuth}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleAuth}
      >
        <LogIn className="mr-2 h-4 w-4" />
        Sign In with Email
      </Button>

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