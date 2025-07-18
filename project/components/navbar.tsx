"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { AuthButton } from '@/components/auth/auth-button';
import { Logo3D } from '@/components/effects/3d-logo';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navigateToPage = (path: string) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigateToPage('/');
  };

  if (!mounted) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'navbar-cosmic' 
        : 'bg-background/80 backdrop-blur-sm border-b border-primary/20'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4 cursor-pointer" onClick={handleLogoClick}>
            <div className="animate-fade-in-up">
              <Logo3D
                size={{ width: 40, height: 40 }}
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight brand-name font-space-grotesk">
              DeepSniff
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-foreground/80 hover:text-primary transition-colors font-semibold font-outfit"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-foreground/80 hover:text-primary transition-colors font-semibold font-outfit"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('api-demo')}
              className="text-foreground/80 hover:text-primary transition-colors font-semibold font-outfit"
            >
              Try System
            </button>
            <button
              onClick={() => scrollToSection('use-cases')}
              className="text-foreground/80 hover:text-primary transition-colors font-semibold font-outfit"
            >
              Use Cases
            </button>
            <button
              onClick={() => navigateToPage('/dashboard')}
              className="text-foreground/80 hover:text-primary transition-colors font-semibold font-outfit"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigateToPage('/supabase-test')}
              className="text-foreground/80 hover:text-primary transition-colors font-semibold font-outfit"
            >
              Test DB
            </button>
          </div>

          {/* Auth Button */}
          <div className="hidden md:flex items-center space-x-4">
            <AuthButton 
              className="btn-cosmic-primary font-semibold px-6 py-2" 
              showUserInfo={true}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:bg-primary/10"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-primary/20 navbar-cosmic">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection('features')}
                className="block px-3 py-2 text-foreground/80 hover:text-primary w-full text-left font-semibold font-outfit"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="block px-3 py-2 text-foreground/80 hover:text-primary w-full text-left font-semibold font-outfit"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection('api-demo')}
                className="block px-3 py-2 text-foreground/80 hover:text-primary w-full text-left font-semibold font-outfit"
              >
                Try System
              </button>
              <button
                onClick={() => scrollToSection('use-cases')}
                className="block px-3 py-2 text-foreground/80 hover:text-primary w-full text-left font-semibold font-outfit"
              >
                Use Cases
              </button>
              <button
                onClick={() => navigateToPage('/dashboard')}
                className="block px-3 py-2 text-foreground/80 hover:text-primary w-full text-left font-semibold font-outfit"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigateToPage('/supabase-test')}
                className="block px-3 py-2 text-foreground/80 hover:text-primary w-full text-left font-semibold font-outfit"
              >
                Test DB
              </button>
              <div className="px-3 py-2">
                <AuthButton className="w-full btn-cosmic-primary font-semibold" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}