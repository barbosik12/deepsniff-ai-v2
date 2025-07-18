"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Shield, Code, Lock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const features = [
  {
    icon: Zap,
    title: 'Real-time Detection',
    description: 'Analyze images and videos instantly using deep learning techniques based on real-world manipulated datasets. Get confidence scores indicating how likely content is fake.',
    gradient: 'from-primary to-accent'
  },
  {
    icon: Shield,
    title: 'Content Verification',
    description: 'Verify content before sharing to fight misinformation and synthetic media. Essential tool for exploring how AI understands visual truth.',
    gradient: 'from-accent to-primary'
  },
  {
    icon: Code,
    title: 'System Integration',
    description: 'Integrate deepfake detection into your applications with our robust system. Perfect for content moderation and verification workflows.',
    gradient: 'from-primary/80 to-accent/80'
  },
  {
    icon: Lock,
    title: 'Research-based',
    description: 'Built on advanced computer vision models and constantly improving. DeepSniff doesn\'t just detect — it learns from each analysis.',
    gradient: 'from-accent/80 to-primary/80'
  }
];

export function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-index') || '0');
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

    const cards = document.querySelectorAll('[data-index]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 heading-cosmic">
            🔍 How DeepSniff Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our neural network combines multiple detection methods to identify sophisticated deepfakes and manipulated media with high precision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isVisible = visibleCards.includes(index);
            
            return (
              <Card
                key={index}
                data-index={index}
                className={`card-cosmic group relative overflow-hidden transition-all duration-700 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardHeader className="relative z-10">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300 lunar-glow`}>
                    <IconComponent className="w-6 h-6 text-background" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-foreground">🎯 Why Use DeepSniff?</h3>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent p-4 lunar-glow">
                  <Shield className="w-8 h-8 text-background" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Verify Content</h4>
                <p className="text-muted-foreground">Check authenticity before sharing to prevent misinformation</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent to-primary p-4 lunar-glow">
                  <Zap className="w-8 h-8 text-background" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Fight Fakes</h4>
                <p className="text-muted-foreground">Combat synthetic media and digital manipulation</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/80 to-accent/80 p-4 lunar-glow">
                  <Code className="w-8 h-8 text-background" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Explore AI</h4>
                <p className="text-muted-foreground">Understand how AI perceives visual truth</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-card/30 rounded-lg border border-border/30">
              <p className="text-muted-foreground leading-relaxed">
                ⚠️ <strong className="text-foreground">This system is research-based and constantly improving.</strong> DeepSniff doesn't just detect — it learns from each analysis, becoming more accurate at spotting digital forgeries and synthetic content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}