"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, LogOut, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from './auth-provider';

export function UserProfile() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <Card className="card-cosmic">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <div>
              <div className="h-4 bg-primary/20 rounded w-24 mb-2"></div>
              <div className="h-3 bg-primary/20 rounded w-16"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="card-cosmic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <User className="w-5 h-5" />
            User Profile
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in with email to access your profile and analysis history
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Mail className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Create an account to track your deepfake analyses
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown';
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Card className="card-cosmic">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <User className="w-5 h-5" />
          User Profile
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Your Supabase account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User ID */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">User ID:</span>
          <Badge className="badge-cosmic font-mono text-xs">
            {user.id.slice(0, 8)}...
          </Badge>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Email Address</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge className="badge-cosmic">
            <CheckCircle className="w-3 h-3 mr-1" />
            <span>Verified</span>
          </Badge>
        </div>

        {/* Account Type */}
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Account Type</p>
            <p className="text-sm text-muted-foreground">Supabase Authentication</p>
          </div>
          <Badge className="badge-cosmic">Free Plan</Badge>
        </div>

        {/* Created At */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Member Since</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(user.created_at)}
            </p>
          </div>
        </div>

        {/* Account Benefits */}
        <div className="pt-4 border-t border-border/30">
          <h4 className="text-sm font-medium text-foreground mb-3">Account Benefits:</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>Unlimited analyses</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>Image & video upload</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>Detailed analysis reports</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>Analysis history tracking</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-4 border-t border-border">
          <Button
            onClick={handleLogout}
            className="w-full btn-cosmic-secondary"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}