"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface CanvasBackgroundProps {
  particleCount?: number;
  lineCount?: number;
  particleColor?: string;
  lineColor?: string;
  backgroundColor?: string;
  className?: string;
}

export default function CanvasBackground({
  particleCount = 60,
  lineCount = 5,
  particleColor = "#3b82f6",
  lineColor = "#3b82f6",
  backgroundColor = "black",
  className = "",
}: CanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const clickRef = useRef({ x: 0, y: 0, active: false, time: 0 });
  const animFrameRef = useRef<number>(0);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 2.5 + 1.5,
          color: particleColor,
          alpha: Math.random() * 0.4 + 0.3,
        });
      }
      particlesRef.current = particles;
    },
    [particleCount, particleColor]
  );

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initParticles(dimensions.width, dimensions.height);
    }
  }, [dimensions, initParticles]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleClick = (e: MouseEvent) => {
      clickRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
        time: Date.now(),
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = dimensions;
    if (width === 0 || height === 0) return;

    canvas.width = width;
    canvas.height = height;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const click = clickRef.current;

      // Deactivate click after 1.5 seconds
      if (click.active && Date.now() - click.time > 1500) {
        click.active = false;
      }

      particles.forEach((particle) => {
        // Mouse attraction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 250 && dist > 0) {
          const force = (250 - dist) / 250;
          particle.vx += (dx / dist) * force * 0.04;
          particle.vy += (dy / dist) * force * 0.04;
        }

        // Click explosion
        if (click.active) {
          const cdx = particle.x - click.x;
          const cdy = particle.y - click.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < 350 && cdist > 0) {
            const force = (350 - cdist) / 350;
            const explosionForce = force * 3 * (1 - (Date.now() - click.time) / 1500);
            particle.vx += (cdx / cdist) * explosionForce;
            particle.vy += (cdy / cdist) * explosionForce;
          }
        }

        // Apply velocity with damping
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.97;
        particle.vy *= 0.97;

        // Bounce off edges
        if (particle.x < 0) { particle.x = 0; particle.vx *= -0.8; }
        if (particle.x > width) { particle.x = width; particle.vx *= -0.8; }
        if (particle.y < 0) { particle.y = 0; particle.vy *= -0.8; }
        if (particle.y > height) { particle.y = height; particle.vy *= -0.8; }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw lines between nearby particles
      let lineDrawn = 0;
      for (let i = 0; i < particles.length && lineDrawn < lineCount; i++) {
        for (let j = i + 1; j < particles.length && lineDrawn < lineCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = lineColor;
            ctx.globalAlpha = (1 - dist / 180) * 0.35;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.globalAlpha = 1;
            lineDrawn++;
          }
        }
      }

      // Draw lines from mouse to nearby particles
      particles.forEach((particle) => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150 && dist > 0) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = lineColor;
          ctx.globalAlpha = (1 - dist / 150) * 0.5;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [dimensions, lineColor, backgroundColor, lineCount]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}