import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, Users, Target, Lightbulb } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/content/ContentContext';
import { Editable } from '@/content/Editable';
import { EditableImage } from '@/content/EditableImage';

gsap.registerPlugin(ScrollTrigger);

const highlightIcons: Record<string, LucideIcon> = {
  Target,
  Lightbulb,
  Users,
};

export default function CaseStudies() {
  const { content } = useContent();
  const caseStudies = content.caseStudies.items;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation with stagger
      const cards = cardsContainerRef.current?.querySelectorAll('.case-study-card');
      if (cards) {
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, x: i % 2 === 0 ? -60 : 60 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="case-studies"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <Editable as="span" path="caseStudies.headingLead" />{' '}
            <Editable as="span" path="caseStudies.headingHighlight" className="gradient-text" />
          </h2>
          <Editable
            as="p"
            path="caseStudies.subtitle"
            multiline
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          />
        </div>

        {/* Case Studies Cards */}
        <div ref={cardsContainerRef} className="space-y-12 lg:space-y-20">
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              className={`case-study-card group relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[3/2] rounded-2xl lg:rounded-3xl overflow-hidden">
                  <EditableImage
                    path={`caseStudies.items.${index}.image`}
                    alt={study.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-expo-out group-hover:scale-105"
                    wrapperClassName="w-full h-full"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  
                  {/* Stats Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4 sm:gap-8">
                    {study.stats.map((_, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 rounded-xl bg-background/80 backdrop-blur-sm text-center"
                      >
                        <Editable
                          as="div"
                          path={`caseStudies.items.${index}.stats.${i}.value`}
                          className="text-lg sm:text-xl font-bold gradient-text"
                        />
                        <Editable
                          as="div"
                          path={`caseStudies.items.${index}.stats.${i}.label`}
                          className="text-xs text-muted-foreground"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <Editable as="span" path={`caseStudies.items.${index}.duration`} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <Editable as="span" path={`caseStudies.items.${index}.team`} />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <Editable
                    as="h3"
                    path={`caseStudies.items.${index}.title`}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 group-hover:text-primary transition-colors duration-300"
                  />
                  <Editable
                    as="p"
                    path={`caseStudies.items.${index}.subtitle`}
                    className="text-lg text-muted-foreground"
                  />
                </div>

                {/* Highlights */}
                <div className="space-y-4">
                  {study.highlights.map((highlight, i) => {
                    const Icon = highlightIcons[highlight.icon] ?? Target;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/30 hover:border-primary/20 transition-colors duration-300"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <Editable
                            as="h4"
                            path={`caseStudies.items.${index}.highlights.${i}.title`}
                            className="font-semibold mb-1"
                          />
                          <Editable
                            as="p"
                            path={`caseStudies.items.${index}.highlights.${i}.desc`}
                            multiline
                            className="text-sm text-muted-foreground"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <Button
                  variant="outline"
                  className="group/btn rounded-full px-6 py-5 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Editable as="span" path="caseStudies.readMore" />
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
