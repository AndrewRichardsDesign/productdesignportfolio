import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeProvider } from '@/hooks/useTheme';
import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import Projects from '@/sections/Projects';
import CaseStudies from '@/sections/CaseStudies';
import About from '@/sections/About';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Configure GSAP defaults
    gsap.config({
      nullTargetWarn: false,
    });

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    // Handle reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(0);
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main>
          <Hero />
          <Projects />
          <CaseStudies />
          <About />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Background Gradient */}
        <div 
          className="fixed inset-0 pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 50%)',
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
