"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Logo3DProps {
  className?: string;
  onClick?: () => void;
  size?: {
    width: number;
    height: number;
  };
}

export function Logo3D({ 
  className = '', 
  onClick, 
  size = { width: 520, height: 520 } 
}: Logo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [logoClicked, setLogoClicked] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to logo center
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      
      setMousePosition({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  const handleLogoClick = () => {
    setLogoClicked(true);
    setTimeout(() => setLogoClicked(false), 600);
    onClick?.();
  };

  const getTransform = () => {
    if (logoClicked) {
      return 'perspective(1000px) rotateX(15deg) rotateY(5deg) rotateZ(-2deg) scale(1.15)';
    }

    if (isHovered) {
      const rotateX = mousePosition.y * -15; // Invert Y for natural feel
      const rotateY = mousePosition.x * 15;
      const rotateZ = mousePosition.x * -5;
      const scale = 1.08 + Math.abs(mousePosition.x * 0.02) + Math.abs(mousePosition.y * 0.02);
      
      return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
    }

    return 'perspective(1000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';
  };

  const getFilter = () => {
    if (logoClicked) {
      return `
        drop-shadow(0 0 60px rgba(125, 211, 252, 1.0)) 
        drop-shadow(0 0 120px rgba(159, 159, 255, 0.8)) 
        drop-shadow(0 15px 35px rgba(0, 0, 0, 0.4))
        hue-rotate(15deg)
        brightness(1.3)
        contrast(1.1)
      `;
    }

    if (isHovered) {
      const intensity = Math.abs(mousePosition.x) + Math.abs(mousePosition.y);
      const hueShift = intensity * 10;
      const brightness = 1.1 + intensity * 0.1;
      
      return `
        drop-shadow(0 0 ${30 + intensity * 30}px rgba(125, 211, 252, ${0.7 + intensity * 0.3})) 
        drop-shadow(0 0 ${60 + intensity * 40}px rgba(159, 159, 255, ${0.4 + intensity * 0.2}))
        hue-rotate(${hueShift}deg)
        brightness(${brightness})
        contrast(1.05)
      `;
    }

    return `
      drop-shadow(0 0 30px rgba(125, 211, 252, 0.5)) 
      drop-shadow(0 0 60px rgba(159, 159, 255, 0.3))
      brightness(1)
      contrast(1)
    `;
  };

  return (
    <div 
      ref={containerRef}
      className={`logo-3d-container ${className}`}
      style={{
        width: size.width,
        height: size.height,
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onClick={handleLogoClick}
    >
      {/* Main logo container */}
      <div
        ref={logoRef}
        className="logo-3d-main relative w-full h-full cursor-pointer"
        style={{
          transform: getTransform(),
          filter: getFilter(),
          transition: isHovered ? 'transform 0.1s ease-out, filter 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.3s ease',
          transformStyle: 'preserve-3d',
          willChange: 'transform, filter'
        }}
      >
        {/* Logo image */}
        <Image
          src="https://i.postimg.cc/BvvRnPMq/c3e1820a-10e4-4d00-8b18-b8ed5a526871.png"
          alt="DeepSniff 3D metallic eye logo"
          width={size.width}
          height={size.height}
          className="w-full h-full object-contain"
          style={{
            transform: `translateZ(20px)`,
            transformStyle: 'preserve-3d'
          }}
          priority
        />

        {/* 3D depth layers - subtle and minimal */}
        <div 
          className="absolute inset-0"
          style={{
            transform: 'translateZ(-10px)',
            filter: 'blur(1px)',
            opacity: isHovered ? 0.1 : 0.05,
            transition: 'opacity 0.3s ease',
            background: 'radial-gradient(circle, rgba(125, 211, 252, 0.05) 0%, transparent 70%)'
          }}
        />

        {/* Floating particles - very subtle */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-primary/30 rounded-full"
            style={{
              left: `${25 + (i * 12)}%`,
              top: `${35 + (i % 3) * 15}%`,
              transform: `
                translateZ(${5 + i * 3}px) 
                translateX(${Math.sin(Date.now() * 0.001 + i) * 5}px)
                translateY(${Math.cos(Date.now() * 0.001 + i) * 5}px)
              `,
              animation: `floatParticle${i} ${4 + i * 0.5}s ease-in-out infinite`,
              opacity: isVisible ? 0.4 : 0,
              transition: 'opacity 1s ease'
            }}
          />
        ))}
      </div>

      <style jsx>{`
        ${[...Array(6)].map((_, i) => `
          @keyframes floatParticle${i} {
            0%, 100% { 
              transform: translateZ(${5 + i * 3}px) translateX(0px) translateY(0px) scale(1);
              opacity: 0.3;
            }
            50% { 
              transform: translateZ(${10 + i * 3}px) translateX(${(i % 2 ? 1 : -1) * 8}px) translateY(${(i % 3 ? 1 : -1) * 8}px) scale(1.1);
              opacity: 0.6;
            }
          }
        `).join('')}

        .logo-3d-container {
          position: relative;
          display: inline-block;
        }

        .logo-3d-main {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        /* Enhanced mobile optimizations */
        @media (max-width: 768px) {
          .logo-3d-container {
            perspective: 800px;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .logo-3d-main {
            transform: scale(1) !important;
            filter: drop-shadow(0 0 20px rgba(125, 211, 252, 0.4)) !important;
            transition: none !important;
          }
          
          .logo-3d-container div {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}