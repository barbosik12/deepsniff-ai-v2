"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const testimonials = [
  {
    id: 1,
    quote: "I tried DeepSniff on a few viral clips, and it instantly gave me clarity. It's fast, simple, and honestly something everyone should have in their digital toolbox.",
    name: "Dumitru Boaghe",
    position: "CEO at MI Moldova",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  },
  {
    id: 2,
    quote: "You come here to know if it's fake or not — that's it. DeepSniff delivers exactly that: a simple, clean tool that gives users instant clarity by analyzing videos and revealing the truth.",
    name: "Andrey Vinitsky",
    position: "CEO at Graphy.app",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  },
  {
    id: 3,
    quote: "As someone who's spent years defending democracies from disinformation, I see DeepSniff as a frontline ally. It's the kind of precision tool I wish we had during high-stakes campaigns and election monitoring.",
    name: "James Holtum",
    position: "Director Strategy at SADF",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format&q=80&sat=-100"
  }
];

export function TestimonialsSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-testimonial') || '0');
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

    const cards = document.querySelectorAll('[data-testimonial]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-background via-background/98 to-background relative overflow-hidden">
      {/* Dark cosmic background with subtle stars */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-primary/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-40" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 heading-cosmic">
              What Our Clients Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Trusted by industry leaders, researchers, and organizations worldwide for reliable deepfake detection.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => {
              const isVisible = visibleCards.includes(index);
              
              return (
                <Card
                  key={testimonial.id}
                  data-testimonial={index}
                  className={`card-cosmic group relative overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardContent className="p-8 relative z-10">
                    {/* Quote Icon */}
                    <div className="absolute top-6 left-6 w-8 h-8 text-primary/40 group-hover:text-primary/60 transition-colors duration-300">
                      <Quote className="w-full h-full" />
                    </div>

                    {/* Quote Text */}
                    <div className="mt-8 mb-8">
                      <blockquote className="text-foreground leading-relaxed italic text-lg group-hover:text-primary/90 transition-colors duration-300">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary/60 transition-colors duration-300">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        {/* Subtle glow around avatar */}
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Name and Position */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                          {testimonial.position}
                        </p>
                      </div>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </CardContent>

                  {/* Animated border on hover */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-lg transition-colors duration-300" />
                </Card>
              );
            })}
          </div>

          {/* Bottom Stats */}
          <div className="mt-20 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card/20 backdrop-blur-sm p-8 rounded-lg border border-border/30">
                <h3 className="text-2xl font-semibold mb-6 text-foreground">Trusted Worldwide</h3>
                
                <div className="grid sm:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">500+</div>
                    <p className="text-sm text-muted-foreground">Organizations Protected</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent mb-2">99.2%</div>
                    <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                    <p className="text-sm text-muted-foreground">Support Available</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/20">
                  <p className="text-muted-foreground leading-relaxed">
                    Join industry leaders who trust DeepSniff to protect their organizations from sophisticated deepfakes and synthetic media threats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}