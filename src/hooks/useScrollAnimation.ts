import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function useScrollAnimation(
  animationCallback: (gsapInstance: typeof gsap, scrollTrigger: typeof ScrollTrigger) => gsap.core.Timeline | gsap.core.Tween | void,
  deps: unknown[] = []
) {
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const result = animationCallback(gsap, ScrollTrigger);
      if (result && result.scrollTrigger) {
        triggerRef.current = result.scrollTrigger as ScrollTrigger;
      }
    });

    return () => {
      ctx.revert();
    };
  }, deps);

  return triggerRef;
}

export function useFadeInOnScroll(
  elementRef: React.RefObject<HTMLElement>,
  options: ScrollAnimationOptions = {}
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const {
      start = 'top 80%',
      toggleActions = 'play none none reverse',
    } = options;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: element,
            start,
            toggleActions,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [elementRef, options]);
}

export function useStaggerReveal(
  containerRef: React.RefObject<HTMLElement>,
  childSelector: string,
  options: ScrollAnimationOptions & { stagger?: number } = {}
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll(childSelector);
    if (children.length === 0) return;

    const {
      start = 'top 80%',
      toggleActions = 'play none none reverse',
      stagger = 0.1,
    } = options;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        { opacity: 0, y: 40, rotateY: -15 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.7,
          ease: 'expo.out',
          stagger,
          scrollTrigger: {
            trigger: container,
            start,
            toggleActions,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [containerRef, childSelector, options]);
}

export function useParallax(
  elementRef: React.RefObject<HTMLElement>,
  speed: number = 0.5
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [elementRef, speed]);
}
