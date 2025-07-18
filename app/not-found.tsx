"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Home, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Animation */}
            <div className="mb-8">
              <div className="text-8xl font-bold text-primary/20 mb-4 font-mono">
                404
              </div>
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-primary to-accent p-6 lunar-glow animate-pulse">
                <Search className="w-12 h-12 text-background" />
              </div>
            </div>

            <Card className="card-cosmic">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-foreground mb-2">
                  Page Not Found
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  The page you're looking for doesn't exist or has been moved
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Helpful suggestions */}
                <div className="bg-card/30 p-6 rounded-lg border border-border/30">
                  <h3 className="font-semibold text-foreground mb-4">What you can do:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Check the URL for typos</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Go back to the previous page</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Visit our homepage to start fresh</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Try our deepfake detection system</span>
                    </li>
                  </ul>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => window.history.back()}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Button>
                  
                  <Button
                    onClick={() => window.location.href = '/'}
                    className="flex-1 btn-cosmic-primary"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Button>
                </div>

                {/* Quick links */}
                <div className="pt-6 border-t border-border/30">
                  <h4 className="font-medium text-foreground mb-3">Popular pages:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.href = '/#features'}
                      className="hover:bg-primary/10"
                    >
                      Features
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.href = '/#api-demo'}
                      className="hover:bg-primary/10"
                    >
                      Try System
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.href = '/dashboard'}
                      className="hover:bg-primary/10"
                    >
                      Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}