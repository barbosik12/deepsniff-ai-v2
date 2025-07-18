import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { FeaturesSection } from '@/components/features-section';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { ApiDemoSection } from '@/components/api-demo-section';
import { UseCasesSection } from '@/components/use-cases-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { BottomTechSection } from '@/components/bottom-tech-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ApiDemoSection />
      <UseCasesSection />
      <TestimonialsSection />
      <BottomTechSection />
      <Footer />
    </main>
  );
}