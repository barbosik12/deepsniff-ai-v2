"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Users, Search, Building } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const useCases = [
  {
    icon: Camera,
    title: 'Media Forensics',
    description: 'Verify authenticity of news content, social media posts, and digital evidence. Essential for journalists and fact-checkers.',
    gradient: 'from-primary to-accent'
  },
  {
    icon: Users,
    title: 'Social Platforms',
    description: 'Protect users from harmful deepfake content. Automated moderation and content verification at scale.',
    gradient: 'from-accent to-primary'
  },
  {
    icon: Search,
    title: 'Research',
    description: 'Academic institutions and researchers studying AI safety, media manipulation, and digital forensics.',
    gradient: 'from-primary/80 to-accent/80'
  },
  {
    icon: Building,
    title: 'Government & NGOs',
    description: 'Combat disinformation campaigns and protect democratic processes. Verify official communications and statements.',
    gradient: 'from-accent/80 to-primary/80'
  }
];

export function UseCasesSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-usecase') || '0');
            setVisibleCards(prev => {
              const updated = new Set(prev);
              updated.add(cardIndex);
              return Array.from(updated);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = document.querySelectorAll('[data-usecase]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="use-cases" ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 heading-cosmic">
            Built for Critical Applications
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From newsrooms to government agencies, DeepSniff provides the reliability and accuracy needed for high-stakes deepfake detection.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            const isVisible = visibleCards.includes(index);
            
            return (
              <Card
                key={index}
                data-usecase={index}
                className={`card-cosmic group relative overflow-hidden transition-all duration-700 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${useCase.gradient} p-4 mb-4 group-hover:scale-110 transition-transform duration-300 lunar-glow`}>
                    <IconComponent className="w-8 h-8 text-background" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {useCase.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-muted-foreground leading-relaxed text-sm">
                    {useCase.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-semibold mb-8 text-foreground">Trusted by Industry Leaders</h3>
          <div className="flex justify-center items-center space-x-12 opacity-70">
            <div className="text-sm font-mono tracking-wider text-muted-foreground stellar-pulse">SECURITY AGENCIES</div>
            <div className="w-2 h-2 bg-primary rounded-full status-cosmic"></div>
            <div className="text-sm font-mono tracking-wider text-muted-foreground stellar-pulse">NEWS ORGANIZATIONS</div>
            <div className="w-2 h-2 bg-primary rounded-full status-cosmic"></div>
            <div className="text-sm font-mono tracking-wider text-muted-foreground stellar-pulse">TECH PLATFORMS</div>
          </div>
        </div>
      </div>
    </section>
  );
}