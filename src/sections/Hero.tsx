import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, ChevronRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation - split characters
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll('.char');
        gsap.fromTo(
          chars,
          { opacity: 0, rotateX: 90, translateZ: -100 },
          {
            opacity: 1,
            rotateX: 0,
            translateZ: 0,
            duration: 0.8,
            ease: 'expo.out',
            stagger: 0.03,
            delay: 0.3,
          }
        );
      }

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, filter: 'blur(20px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          ease: 'smooth',
          delay: 0.8,
        }
      );

      // CTA buttons animation
      gsap.fromTo(
        ctaRef.current?.children || [],
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
          stagger: 0.1,
          delay: 1.1,
        }
      );

      // Floating shapes animation
      const shapes = shapesRef.current?.querySelectorAll('.shape');
      shapes?.forEach((shape, i) => {
        gsap.to(shape, {
          y: 'random(-20, 20)',
          x: 'random(-10, 10)',
          rotation: 'random(-5, 5)',
          duration: 'random(4, 8)',
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.2,
        });
      });

      // Scroll indicator bounce
      gsap.to('.scroll-indicator', {
        y: 10,
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 2,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = heroRef.current?.offsetHeight || 0;
      const progress = Math.min(scrollY / heroHeight, 1);

      if (titleRef.current) {
        titleRef.current.style.transform = `translateY(${-scrollY * 0.3}px)`;
        titleRef.current.style.opacity = String(1 - progress * 1.5);
      }

      if (subtitleRef.current) {
        subtitleRef.current.style.transform = `translateY(${-scrollY * 0.2}px)`;
        subtitleRef.current.style.opacity = String(1 - progress * 2);
      }

      if (shapesRef.current) {
        shapesRef.current.style.transform = `translateY(${-scrollY * 0.1}px) translateZ(${-scrollY * 0.5}px)`;
        shapesRef.current.style.opacity = String(1 - progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const titleText = 'Digital Product Designer';

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 animate-gradient" />
      
      {/* Mesh Gradient Overlay */}
      <div 
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 20% 30%, hsl(var(--primary) / 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, hsl(var(--accent) / 0.2) 0%, transparent 50%)',
        }}
      />

      {/* Floating Geometric Shapes */}
      <div
        ref={shapesRef}
        className="absolute inset-0 pointer-events-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Shape 1 - Circle */}
        <div
          className="shape absolute top-[15%] left-[10%] w-32 h-32 rounded-full border border-primary/20"
          style={{ transform: 'translateZ(-100px)' }}
        />
        {/* Shape 2 - Square */}
        <div
          className="shape absolute top-[25%] right-[15%] w-24 h-24 border border-accent/20 rotate-45"
          style={{ transform: 'translateZ(-150px)' }}
        />
        {/* Shape 3 - Ring */}
        <div
          className="shape absolute bottom-[30%] left-[20%] w-20 h-20 rounded-full border-2 border-primary/10"
          style={{ transform: 'translateZ(-200px)' }}
        />
        {/* Shape 4 - Triangle (using clip-path) */}
        <div
          className="shape absolute bottom-[20%] right-[10%] w-28 h-28 bg-gradient-to-br from-primary/10 to-transparent"
          style={{ 
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            transform: 'translateZ(-120px)'
          }}
        />
        {/* Shape 5 - Small dots */}
        <div className="shape absolute top-[40%] left-[5%] w-3 h-3 rounded-full bg-primary/30" />
        <div className="shape absolute top-[60%] right-[25%] w-2 h-2 rounded-full bg-accent/30" />
        <div className="shape absolute bottom-[40%] left-[30%] w-4 h-4 rounded-full bg-primary/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 opacity-0 animate-fade-in"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Available for new projects</span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {titleText.split('').map((char, i) => (
            <span
              key={i}
              className="char inline-block"
              style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Crafting immersive digital experiences that captivate, convert, and inspire. 
          I transform complex problems into elegant solutions.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => scrollToSection('#projects')}
            className="group relative overflow-hidden rounded-full px-8 py-6 text-base font-medium gradient-bg text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              View My Work
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => scrollToSection('#contact')}
            className="group rounded-full px-8 py-6 text-base font-medium border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Get in Touch
            </span>
          </Button>
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto opacity-0 animate-fade-in"
          style={{ animationDelay: '1.4s', animationFillMode: 'forwards' }}
        >
          {[
            { value: '8+', label: 'Years Experience' },
            { value: '50+', label: 'Projects Delivered' },
            { value: '30+', label: 'Happy Clients' },
            { value: '12', label: 'Design Awards' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs font-medium uppercase tracking-wider">Scroll to explore</span>
        <ArrowDown className="w-5 h-5" />
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
