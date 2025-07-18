"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Upload, Brain, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const steps = [
  {
    icon: Upload,
    title: 'Upload',
    description: 'Submit your video content through our secure system or web interface. We support all major video formats.',
    step: '01'
  },
  {
    icon: Brain,
    title: 'Analyze',
    description: 'Our neural network processes each frame using advanced computer vision and deep learning algorithms.',
    step: '02'
  },
  {
    icon: CheckCircle,
    title: 'Detect',
    description: 'Receive detailed analysis results with confidence scores and highlighted regions of concern.',
    step: '03'
  }
];

export function HowItWorksSection() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.getAttribute('data-step') || '0');
            setVisibleSteps(prev => {
              const updated = new Set(prev);
              updated.add(stepIndex);
              return Array.from(updated);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    const stepElements = document.querySelectorAll('[data-step]');
    stepElements.forEach(step => observer.observe(step));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="section-cosmic-alt py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 heading-cosmic">
            How DeepSniff Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined process makes deepfake detection accessible and reliable. From upload to results in seconds.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary to-accent opacity-50"></div>
            
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isVisible = visibleSteps.includes(index);
              
              return (
                <div
                  key={index}
                  data-step={index}
                  className={`relative transition-all duration-700 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <Card className="card-cosmic relative overflow-hidden group">
                    <CardContent className="p-8 text-center">
                      {/* Step number */}
                      <div className="absolute top-4 right-4 text-6xl font-bold text-primary/20 group-hover:text-primary/30 transition-colors font-mono">
                        {step.step}
                      </div>
                      
                      {/* Icon */}
                      <div className="relative z-10 w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 lunar-glow">
                        <IconComponent className="w-8 h-8 text-background" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Mobile connection line */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden w-0.5 h-8 bg-gradient-to-b from-primary to-accent opacity-50 mx-auto mt-4"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}