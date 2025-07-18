"use client";

import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface AnimatedParticlesProps {
  particleCount?: number;
  className?: string;
}

export function AnimatedParticles({ 
  particleCount = 50, 
  className = '' 
}: AnimatedParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjust particle count for mobile
    const adjustedParticleCount = isMobile ? Math.min(particleCount, 30) : particleCount;

    // Initialize particles
    const initializeParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < adjustedParticleCount; i++) {
        particlesRef.current.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5, // 0.5 to 2.5px
          opacity: Math.random() * 0.6 + 0.2, // 0.2 to 0.8
          velocityX: (Math.random() - 0.5) * 0.3, // Very slow horizontal drift
          velocityY: (Math.random() - 0.5) * 0.2, // Very slow vertical drift
          twinkleSpeed: Math.random() * 0.02 + 0.005, // Slow twinkling
          twinkleOffset: Math.random() * Math.PI * 2
        });
      }
    };

    // Resize canvas to match container
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      // Reinitialize particles after resize
      initializeParticles();
    };

    // Initial setup
    resizeCanvas();

    // Animation loop
    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position with very slow drift
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width / window.devicePixelRatio;
        if (particle.x > canvas.width / window.devicePixelRatio) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height / window.devicePixelRatio;
        if (particle.y > canvas.height / window.devicePixelRatio) particle.y = 0;

        // Calculate twinkling effect
        const twinkle = Math.sin(currentTime * particle.twinkleSpeed + particle.twinkleOffset);
        const currentOpacity = particle.opacity * (0.3 + 0.7 * (twinkle + 1) / 2);

        // Draw particle
        ctx.save();
        ctx.globalAlpha = currentOpacity;
        
        // Create subtle glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, 'rgba(125, 211, 252, 1)');
        gradient.addColorStop(0.5, 'rgba(125, 211, 252, 0.5)');
        gradient.addColorStop(1, 'rgba(125, 211, 252, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a brighter center point
        ctx.globalAlpha = currentOpacity * 1.5;
        ctx.fillStyle = 'rgba(159, 159, 255, 1)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible, particleCount, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ 
        zIndex: 1,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 2s ease-in-out'
      }}
    />
  );
}