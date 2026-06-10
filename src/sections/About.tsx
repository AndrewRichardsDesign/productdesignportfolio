import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Briefcase, Coffee, Heart, MapPin, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useContent } from '@/content/ContentContext';
import { Editable } from '@/content/Editable';
import { EditableImage } from '@/content/EditableImage';

gsap.registerPlugin(ScrollTrigger);

const personalIcons: Record<string, LucideIcon> = {
  Coffee,
  Heart,
};

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: counterRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(
            { val: 0 },
            {
              val: value,
              duration: 2,
              ease: 'expo.out',
              onUpdate: function () {
                setCount(Math.floor(this.targets()[0].val));
              },
            }
          );
        },
        once: true,
      });
    });

    return () => ctx.revert();
  }, [value]);

  return (
    <span ref={counterRef} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

/** In admin mode, edit the counter as plain "value+suffix" text; parse back on blur. */
function EditableStatValue({ index }: { index: number }) {
  const { content, setText } = useContent();
  const stat = content.about.stats[index];
  const ref = useRef<HTMLSpanElement>(null);
  const display = `${stat.value}${stat.suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.innerText !== display) {
      el.innerText = display;
    }
  }, [display]);

  return (
    <span
      ref={ref}
      className="admin-editable tabular-nums"
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      title="Editing: number + suffix"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onBlur={(e) => {
        const text = e.currentTarget.innerText.trim();
        const m = text.match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);
        setText(`about.stats.${index}.value`, m ? Number(m[1]) : 0);
        setText(`about.stats.${index}.suffix`, m ? m[2] : text);
      }}
    >
      {display}
    </span>
  );
}

export default function About() {
  const { content, isAdmin } = useContent();
  const about = content.about;
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(
        contentRef.current?.querySelectorAll('.animate-item') || [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Image animation
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.1 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Stats animation
      gsap.fromTo(
        statsRef.current?.querySelectorAll('.stat-item') || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Skills tags animation
      gsap.fromTo(
        '.skill-tag',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.skills-container',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Content Column */}
          <div ref={contentRef} className="space-y-8">
            {/* Section Title */}
            <div className="animate-item">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <Editable as="span" path="about.headingLead" />{' '}
                <Editable as="span" path="about.headingHighlight" className="gradient-text" />
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <Editable as="span" path="about.location" className="text-sm" />
              </div>
            </div>

            {/* Bio */}
            <div className="animate-item space-y-4">
              <Editable
                as="p"
                path="about.bio1"
                multiline
                className="text-lg text-foreground/90 leading-relaxed"
              />
              <Editable
                as="p"
                path="about.bio2"
                multiline
                className="text-muted-foreground leading-relaxed"
              />
            </div>

            {/* Philosophy */}
            <div className="animate-item p-6 rounded-2xl bg-card/50 border border-border/30">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Editable as="h3" path="about.philosophyTitle" className="font-semibold mb-2" />
                  <Editable
                    as="p"
                    path="about.philosophyQuote"
                    multiline
                    className="text-sm text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="animate-item">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <Editable as="span" path="about.skillsTitle" />
              </h3>
              <div className="skills-container flex flex-wrap gap-2">
                {about.skills.map((_, i) => (
                  <Editable
                    key={i}
                    as="span"
                    path={`about.skills.${i}`}
                    className="skill-tag px-4 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200"
                  />
                ))}
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="animate-item">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <Editable as="span" path="about.experienceTitle" />
              </h3>
              <div className="space-y-4">
                {about.experiences.map((_, i) => (
                  <div
                    key={i}
                    className="relative pl-6 pb-4 border-l border-border/50 last:pb-0"
                  >
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-primary -translate-x-1/2" />
                    <Editable as="h4" path={`about.experiences.${i}.role`} className="font-medium text-sm" />
                    <Editable as="p" path={`about.experiences.${i}.company`} className="text-sm text-muted-foreground" />
                    <Editable as="p" path={`about.experiences.${i}.period`} className="text-xs text-muted-foreground/70 mt-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Touch */}
            <div className="animate-item flex items-center gap-6 text-sm text-muted-foreground">
              {about.personal.map((item, i) => {
                const Icon = personalIcons[item.icon] ?? Coffee;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <Editable as="span" path={`about.personal.${i}.text`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image Column */}
          <div className="lg:sticky lg:top-32">
            <div
              ref={imageRef}
              className="relative"
            >
              {/* Main Image */}
              <div className="relative aspect-[3/4] rounded-2xl lg:rounded-3xl overflow-hidden">
                <EditableImage
                  path="about.portrait"
                  altPath="about.portraitAlt"
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-primary/20" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 -z-10" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-8 right-8 px-4 py-3 rounded-xl bg-background/90 backdrop-blur-sm border border-border/50 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Editable as="p" path="about.badgeLabel" className="text-xs text-muted-foreground" />
                    <Editable as="p" path="about.badgeValue" className="font-semibold text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div
          ref={statsRef}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {about.stats.map((stat, i) => (
            <div
              key={i}
              className="stat-item text-center p-6 rounded-2xl bg-card/50 border border-border/30 hover:border-primary/20 transition-colors duration-300"
            >
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                {isAdmin ? (
                  <EditableStatValue index={i} />
                ) : (
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <Editable as="div" path={`about.stats.${i}.label`} className="text-sm text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
