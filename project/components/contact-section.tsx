"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, ArrowRight, CheckCircle } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contact" className="section-cosmic-alt py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 heading-cosmic">
              Get Started with DeepSniff
            </h2>
            <p className="text-xl text-muted-foreground">
              Ready to protect your organization from deepfakes? Get in touch with our team.
            </p>
          </div>

          {/* Centered Response Time block */}
          <div className="flex justify-center mb-16">
            <Card className="card-cosmic w-full max-w-2xl">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-foreground text-2xl">
                  <Clock className="w-6 h-6 text-primary" />
                  Response Time
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Our team is ready to help you implement deepfake detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-card/30 rounded-lg border border-border/30">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent p-3 lunar-glow">
                      <Mail className="w-6 h-6 text-background" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Business Inquiries</h4>
                    <p className="text-sm text-muted-foreground mb-3">business@deepsniff.ai</p>
                    <div className="text-xs text-primary font-medium">
                      Response: 24 hours
                    </div>
                  </div>
                  
                  <div className="text-center p-6 bg-card/30 rounded-lg border border-border/30">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent to-primary p-3 lunar-glow">
                      <CheckCircle className="w-6 h-6 text-background" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Technical Support</h4>
                    <p className="text-sm text-muted-foreground mb-3">support@deepsniff.ai</p>
                    <div className="text-xs text-primary font-medium">
                      Response: 4-6 hours
                    </div>
                  </div>
                  
                  <div className="text-center p-6 bg-card/30 rounded-lg border border-border/30">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/80 to-accent/80 p-3 lunar-glow">
                      <ArrowRight className="w-6 h-6 text-background" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Press & Media</h4>
                    <p className="text-sm text-muted-foreground mb-3">press@deepsniff.ai</p>
                    <div className="text-xs text-primary font-medium">
                      Response: 48 hours
                    </div>
                  </div>
                </div>
                
                {/* Team status */}
                <div className="mt-8 pt-6 border-t border-border/30 text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full status-cosmic"></div>
                    <span className="text-sm font-medium text-foreground">Team available 24/7</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Our global team ensures rapid response times across all time zones
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional information at bottom */}
          <div className="text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-semibold mb-6 text-foreground">Ready to Get Started?</h3>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                Join leading organizations already using DeepSniff to protect against deepfakes. 
                Our team will work with you to implement the perfect solution for your needs.
              </p>
              
              <div className="grid sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent p-4 lunar-glow">
                    <Mail className="w-8 h-8 text-background" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Quick Setup</h4>
                  <p className="text-muted-foreground">Get started in minutes with our simple system integration</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent to-primary p-4 lunar-glow">
                    <CheckCircle className="w-8 h-8 text-background" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Expert Support</h4>
                  <p className="text-muted-foreground">Dedicated team to help you succeed with implementation</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/80 to-accent/80 p-4 lunar-glow">
                    <ArrowRight className="w-8 h-8 text-background" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Scale Easily</h4>
                  <p className="text-muted-foreground">Grow from prototype to production seamlessly</p>
                </div>
              </div>

              {/* Additional contacts */}
              <div className="mt-16 pt-12 border-t border-border/20">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">Sales</h5>
                    <p className="text-sm text-muted-foreground">sales@deepsniff.ai</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">Partnerships</h5>
                    <p className="text-sm text-muted-foreground">partners@deepsniff.ai</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">Research</h5>
                    <p className="text-sm text-muted-foreground">research@deepsniff.ai</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">General</h5>
                    <p className="text-sm text-muted-foreground">hello@deepsniff.ai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}