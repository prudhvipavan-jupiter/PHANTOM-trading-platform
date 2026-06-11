import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const FuturisticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // JARVIS-style particles - more structured and tech-like
    const particles: Particle[] = [];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // JARVIS-style particle system
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particles as small glowing dots
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 255, ${particle.opacity})`;
        ctx.fill();

        // Draw connections between nearby particles (JARVIS network effect)
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(0, 242, 255, ${0.1 * (1 - distance / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full futuristic-canvas" />
      
      {/* JARVIS-style gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/20" />
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-600/10 via-transparent to-cyan-600/10" />
      
      {/* JARVIS holographic grid */}
      <div className="absolute inset-0 opacity-15">
        <motion.div
          className="absolute inset-0 jarvis-grid"
          animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* JARVIS scanning lines */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        animate={{ y: [0, window.innerHeight] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
        animate={{ x: [0, window.innerWidth] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {/* JARVIS corner elements */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-400 opacity-60" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-cyan-400 opacity-60" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-cyan-400 opacity-60" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-400 opacity-60" />

      {/* JARVIS floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full"
        animate={{ 
          scale: [1, 2, 1],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-cyan-300 rounded-full"
        animate={{ 
          scale: [1, 1.8, 1],
          opacity: [0.4, 0.9, 0.4]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default FuturisticBackground; 