"use client";

import { useEffect, useState } from 'react';

export function BottomTechSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Space-like background with stars */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-card/20">
        {/* Animated stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/60 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated scroll icon */}
          <div className={`mb-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="inline-flex items-center justify-center">
              <div className="relative">
                {/* Mouse shape container */}
                <div className="w-8 h-12 border-2 border-primary/60 rounded-full flex justify-center relative overflow-hidden">
                  {/* Animated scroll wheel */}
                  <div className="w-1 h-3 bg-primary/80 rounded-full mt-2 animate-bounce" 
                       style={{ animationDuration: '2s' }} />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-sm animate-pulse" />
                </div>
                
                {/* Outer glow ring */}
                <div className="absolute inset-0 w-8 h-12 border border-primary/30 rounded-full animate-ping" 
                     style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </div>

          {/* Main caption */}
          <div className={`mb-8 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <p className="text-lg font-light text-muted-foreground tracking-wide">
              <span className="text-primary/90 font-medium">Research-based</span> and{' '}
              <span className="text-accent/90 font-medium">constantly improving</span>
            </p>
          </div>

          {/* Horizontal line */}
          <div className={`mb-6 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}>
            <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto max-w-md" />
          </div>

          {/* Keywords line */}
          <div className={`transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="flex items-center justify-center space-x-6 text-sm font-mono tracking-widest">
              <span className="text-primary/80 hover:text-primary transition-colors cursor-default stellar-pulse">
                DEEP LEARNING
              </span>
              <div className="w-1 h-1 bg-primary/60 rounded-full" />
              <span className="text-accent/80 hover:text-accent transition-colors cursor-default stellar-pulse" 
                    style={{ animationDelay: '0.5s' }}>
                HIGH PRECISION
              </span>
              <div className="w-1 h-1 bg-accent/60 rounded-full" />
              <span className="text-primary/80 hover:text-primary transition-colors cursor-default stellar-pulse" 
                    style={{ animationDelay: '1s' }}>
                VISUAL TRUTH
              </span>
            </div>
          </div>

          {/* Subtle bottom glow */}
          <div className="mt-8 flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}