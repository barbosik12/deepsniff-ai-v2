"use client";

import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { AuthButton } from '@/components/auth/auth-button';
import { Logo3D } from '@/components/effects/3d-logo';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components that use client-side APIs to prevent hydration errors
const WaterRippleEffect = dynamic(() => import('@/components/effects/water-ripple').then(mod => ({ default: mod.WaterRippleEffect })), {
  ssr: false
});

const AnimatedParticles = dynamic(() => import('@/components/effects/animated-particles').then(mod => ({ default: mod.AnimatedParticles })), {
  ssr: false
});

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(true);
  const [logoClicked, setLogoClicked] = useState(false);
  const [logoSize, setLogoSize] = useState({ width: 520, height: 520 });

  useEffect(() => {
    // Calculate logo size based on window width after component mounts
    const calculateLogoSize = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        let size;
        if (width < 640) {
          size = { width: 280, height: 280 };
        } else if (width < 768) {
          size = { width: 350, height: 350 };
        } else if (width < 1024) {
          size = { width: 420, height: 420 };
        } else if (width < 1280) {
          size = { width: 480, height: 480 };
        } else {
          size = { width: 520, height: 520 };
        }
        setLogoSize(size);
      }
    };

    calculateLogoSize();
    window.addEventListener('resize', calculateLogoSize);
    
    return () => {
      window.removeEventListener('resize', calculateLogoSize);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    setLogoClicked(true);
    setTimeout(() => setLogoClicked(false), 600);
    
    // Optional: Add some interaction like scrolling to features
    scrollToSection('features');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Water Ripple Effect Background */}
      <WaterRippleEffect />
      
      {/* Animated Star Particles */}
      <AnimatedParticles 
        particleCount={45}
        className="opacity-60"
      />
      
      {/* Fallback cosmic grid background for mobile/non-WebGL */}
      <div className="absolute inset-0 bg-cosmic-grid" style={{ zIndex: 0 }} />
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" style={{ zIndex: 2 }} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto text-center">
          {/* 3D Logo - Enhanced with immersive effects */}
          <div className={`mb-8 sm:mb-10 pt-8 sm:pt-0 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="animate-fade-in-up inline-block">
              <Logo3D
                onClick={handleLogoClick}
                size={logoSize}
                className="mx-auto"
              />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span className="text-foreground font-space-grotesk">Expose Deepfakes with </span>
            <span className="heading-cosmic brand-name">
              DeepSniff
            </span>
          </h1>

          {/* Subtext */}
          <p className={`text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Powerful AI-powered system trained to detect and expose deepfakes.
            Whether it's a manipulated photo or synthetic video, DeepSniff spots digital forgeries with high precision — helping you separate truth from deception.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <AuthButton
              size="lg"
              className="btn-cosmic-primary px-8 py-6 text-lg font-semibold rounded-xl group cta-enhanced"
            />
            
            <Button
              size="lg"
              onClick={() => scrollToSection('api-demo')}
              className="btn-cosmic-secondary px-8 py-6 text-lg font-semibold rounded-xl group cta-enhanced"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Try Detection Live
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className={`mt-16 text-muted-foreground transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-sm mb-4 text-cosmic-glow font-outfit">Research-based and constantly improving</p>
            <div className="flex justify-center items-center space-x-8 opacity-70">
              <div className="text-xs font-mono tracking-wider stellar-pulse font-space-grotesk">DEEP LEARNING</div>
              <div className="w-1 h-1 bg-primary rounded-full status-cosmic"></div>
              <div className="text-xs font-mono tracking-wider stellar-pulse font-space-grotesk">HIGH PRECISION</div>
              <div className="w-1 h-1 bg-primary rounded-full status-cosmic"></div>
              <div className="text-xs font-mono tracking-wider stellar-pulse font-space-grotesk">VISUAL TRUTH</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}