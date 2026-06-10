import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeProvider } from '@/hooks/useTheme';
import { ContentProvider } from '@/content/ContentContext';
import { AdminBar } from '@/content/AdminBar';
import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import Projects from '@/sections/Projects';
import CaseStudies from '@/sections/CaseStudies';
import About from '@/sections/About';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';
import Arcatext from '@/pages/Arcatext';

gsap.registerPlugin(ScrollTrigger);

/**
 * Resolves the current page and whether admin (inline editing) mode is active.
 * Admin mode is enabled by `#/admin` (home) or an `?admin` flag on any route,
 * e.g. `#/arcatext?admin`.
 */
function parseLocation(): { route: string; isAdmin: boolean } {
  const hash = window.location.hash;
  const path = hash.startsWith('#/') ? hash.slice(2).split('?')[0] : '';
  const query = hash.split('?')[1] ?? '';
  const adminFlag = new URLSearchParams(query).has('admin');
  if (path === 'admin') return { route: '', isAdmin: true };
  return { route: path, isAdmin: adminFlag };
}

function App() {
  const [{ route, isAdmin }, setLocation] = useState(() => parseLocation());

  useEffect(() => {
    const onHashChange = () => {
      setLocation(parseLocation());
      ScrollTrigger.refresh();
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    gsap.config({ nullTargetWarn: false });
    ScrollTrigger.refresh();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(0);
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [route]);

  return (
    <ThemeProvider>
      <ContentProvider isAdmin={isAdmin}>
        <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
          {route === 'arcatext' ? (
            <Arcatext />
          ) : (
            <>
              <Navigation />
              <main>
                <Hero />
                <Projects />
                <CaseStudies />
                <About />
                <Contact />
              </main>
              <Footer />
            </>
          )}

          <div
            className="fixed inset-0 pointer-events-none -z-10"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 50%)',
            }}
          />

          <AdminBar />
        </div>
      </ContentProvider>
    </ThemeProvider>
  );
}

export default App;
