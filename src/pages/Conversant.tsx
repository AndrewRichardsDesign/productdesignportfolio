import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/content/ContentContext';
import { Editable } from '@/content/Editable';

gsap.registerPlugin(ScrollTrigger);

function SectionHeader({
  number,
  eyebrowPath,
  titlePath,
  highlightPath,
}: {
  number: string;
  eyebrowPath: string;
  titlePath: string;
  highlightPath: string;
}) {
  return (
    <div className="mb-12 lg:mb-16">
      <div className="flex items-baseline gap-4 mb-4">
        <span className="text-sm font-mono text-primary/70 tracking-wider">{number}</span>
        <Editable
          as="span"
          path={eyebrowPath}
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
        />
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance max-w-3xl">
        <Editable as="span" path={titlePath} />{' '}
        <Editable as="span" path={highlightPath} className="gradient-text" />
      </h2>
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
      {children}
    </div>
  );
}

/** Renders an array of paragraph strings as individually editable <p> elements. */
function Paragraphs({ base, items }: { base: string; items: string[] }) {
  return (
    <>
      {items.map((_, i) => (
        <Editable key={i} as="p" multiline path={`${base}.${i}`} />
      ))}
    </>
  );
}

/** Renders an array of strings as editable pill/chips. */
function Chips({ base, items }: { base: string; items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((_, i) => (
        <Editable
          key={i}
          as="span"
          path={`${base}.${i}`}
          className="px-3 py-1.5 text-sm rounded-full bg-muted/60 text-foreground/85"
        />
      ))}
    </div>
  );
}

const tocItems = [
  { id: 'sec-01', n: '01' },
  { id: 'sec-02', n: '02' },
  { id: 'sec-03', n: '03' },
  { id: 'sec-04', n: '04' },
  { id: 'sec-05', n: '05' },
  { id: 'sec-06', n: '06' },
  { id: 'sec-07', n: '07' },
  { id: 'sec-08', n: '08' },
  { id: 'sec-09', n: '09' },
];

function SideToc() {
  const { content, isAdmin } = useContent();
  const labels = content.conversant.toc;
  const [activeId, setActiveId] = useState<string>(tocItems[0].id);

  useEffect(() => {
    const sections = tocItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Preserve the admin flag so scrolling doesn't drop out of edit mode.
      history.replaceState(null, '', isAdmin ? '#/conversant?admin' : '#/conversant');
    }
  };

  return (
    <nav
      aria-label="Section navigation"
      className="hidden xl:block fixed top-1/2 left-6 -translate-y-1/2 z-40"
    >
      <ol className="space-y-3 text-sm">
        {tocItems.map((item, i) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`group flex items-baseline gap-3 py-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span
                  className={`text-xs font-mono ${
                    isActive ? 'text-primary' : 'text-muted-foreground/70'
                  }`}
                >
                  {item.n}
                </span>
                <span
                  className={`relative leading-snug ${
                    isActive
                      ? 'underline underline-offset-4 decoration-primary decoration-2'
                      : 'no-underline'
                  }`}
                >
                  {labels[i]}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function Conversant() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { content, isAdmin } = useContent();
  const c = content.conversant;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <SideToc />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => isAdmin && e.preventDefault()}
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <Editable as="span" path="conversant.backToPortfolio" />
          </a>
          <Editable as="span" path="conversant.brand" className="text-sm font-semibold gradient-text" />
        </div>
      </div>

      {/* Hero */}
      <section className="relative pt-40 pb-24 sm:pt-48 sm:pb-32 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at 20% 20%, hsl(var(--primary) / 0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 0%, hsl(var(--accent) / 0.14) 0%, transparent 50%)',
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <Editable as="span" path="conversant.hero.status" className="text-xs font-medium text-primary tracking-wide" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-balance">
            <Editable as="span" path="conversant.hero.title" className="gradient-text" />
          </h1>
          <Editable
            as="p"
            path="conversant.hero.subtitle"
            multiline
            className="text-xl sm:text-2xl md:text-3xl text-foreground/80 max-w-3xl leading-snug mb-8 text-balance"
          />
          <Editable
            as="p"
            path="conversant.hero.intro"
            multiline
            className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed mb-10"
          />

          <div className="flex flex-wrap gap-2 mb-10">
            {c.hero.typeTags.map((_, i) => (
              <Editable
                key={i}
                as="span"
                path={`conversant.hero.typeTags.${i}`}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-card border border-border/50 text-foreground/80"
              />
            ))}
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl border-t border-border/40 pt-8">
            <div>
              <Editable as="dt" path="conversant.hero.roleLabel" className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 block" />
              <Editable as="dd" path="conversant.hero.roleValue" className="text-sm text-foreground/90" />
            </div>
            <div>
              <Editable as="dt" path="conversant.hero.platformLabel" className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 block" />
              <Editable as="dd" path="conversant.hero.platformValue" className="text-sm text-foreground/90" />
            </div>
            <div>
              <Editable as="dt" path="conversant.hero.surfaceLabel" className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 block" />
              <Editable as="dd" path="conversant.hero.surfaceValue" className="text-sm text-foreground/90" />
            </div>
          </dl>
        </div>
      </section>

      {/* 01 — Context */}
      <section id="sec-01" className="py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader number="01" eyebrowPath="conversant.context.eyebrow" titlePath="conversant.context.titleLead" highlightPath="conversant.context.titleHighlight" />
          </div>

          <div className="reveal">
            <Prose>
              <Paragraphs base="conversant.context.intro" items={c.context.intro} />
            </Prose>

            <div className="mt-10 rounded-2xl bg-primary/10 p-8 max-w-3xl">
              <Editable as="p" path="conversant.context.calloutEyebrow" className="text-xs uppercase tracking-[0.2em] text-primary mb-3" />
              <p className="text-xl sm:text-2xl font-semibold text-balance leading-snug">
                <Editable as="span" path="conversant.context.calloutLead" multiline />{' '}
                <Editable as="span" path="conversant.context.calloutHighlight" className="gradient-text" />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Goals */}
      <section id="sec-02" className="py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader number="02" eyebrowPath="conversant.goals.eyebrow" titlePath="conversant.goals.titleLead" highlightPath="conversant.goals.titleHighlight" />
          </div>

          <div className="reveal">
            <Prose>
              <Paragraphs base="conversant.goals.intro" items={c.goals.intro} />
            </Prose>
          </div>

          <div className="mt-16">
            <Editable as="h3" path="conversant.goals.designGoalsTitle" className="text-xl sm:text-2xl font-semibold mb-8 reveal" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c.goals.designGoals.map((_, i) => (
                <div
                  key={i}
                  className="reveal flex gap-4 rounded-2xl bg-muted/40 p-6"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <Editable as="p" path={`conversant.goals.designGoals.${i}`} multiline className="text-sm sm:text-base text-foreground/85 leading-relaxed" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Users */}
      <section id="sec-03" className="py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader number="03" eyebrowPath="conversant.users.eyebrow" titlePath="conversant.users.titleLead" highlightPath="conversant.users.titleHighlight" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 reveal">
              <Prose>
                <Paragraphs base="conversant.users.intro" items={c.users.intro} />
              </Prose>
            </div>

            <aside className="lg:col-span-5 reveal">
              <div className="rounded-2xl bg-muted/40 p-8">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-4">
                  <Users className="w-4 h-4" />
                  <Editable as="span" path="conversant.users.rolesLabel" />
                </div>
                <Chips base="conversant.users.roles" items={c.users.roles} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 04 — Problem */}
      <section id="sec-04" className="py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader number="04" eyebrowPath="conversant.problem.eyebrow" titlePath="conversant.problem.titleLead" highlightPath="conversant.problem.titleHighlight" />
          </div>

          <div className="reveal">
            <Prose>
              <Paragraphs base="conversant.problem.intro" items={c.problem.intro} />
            </Prose>
          </div>

          <div className="mt-16">
            <Editable as="h3" path="conversant.problem.problemsTitle" className="text-xl sm:text-2xl font-semibold mb-8 reveal" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c.problem.problems.map((_, i) => (
                <div
                  key={i}
                  className="reveal rounded-2xl bg-muted/40 p-6 hover:bg-muted/60 transition-colors"
                >
                  <Editable as="h4" path={`conversant.problem.problems.${i}.title`} className="font-semibold mb-2" />
                  <Editable as="p" path={`conversant.problem.problems.${i}.desc`} multiline className="text-sm text-muted-foreground leading-relaxed" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 reveal">
            <Prose>
              <Paragraphs base="conversant.problem.closing" items={c.problem.closing} />
            </Prose>
          </div>

          {/* Product challenge */}
          <div className="mt-16 reveal rounded-2xl bg-gradient-to-br from-primary/10 to-primary/[0.03] p-8 lg:p-10">
            <Editable as="p" path="conversant.problem.challengeLabel" className="text-xs uppercase tracking-[0.2em] text-primary mb-4" />
            <p className="text-xl sm:text-2xl font-semibold leading-snug text-balance mb-6 max-w-3xl">
              <Editable as="span" path="conversant.problem.challengeLead" multiline />{' '}
              <Editable as="span" path="conversant.problem.challengeHighlight" className="gradient-text" />
            </p>
            <Prose>
              <Paragraphs base="conversant.problem.challenge" items={c.problem.challenge} />
            </Prose>
          </div>
        </div>
      </section>

      {/* 05 — Solution */}
      <section id="sec-05" className="py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader number="05" eyebrowPath="conversant.solution.eyebrow" titlePath="conversant.solution.titleLead" highlightPath="conversant.solution.titleHighlight" />
          </div>

          <div className="reveal">
            <Prose>
              <Paragraphs base="conversant.solution.intro" items={c.solution.intro} />
            </Prose>
          </div>

          <div className="mt-16">
            <Editable as="h3" path="conversant.solution.highlightsTitle" className="text-xl sm:text-2xl font-semibold mb-8 reveal" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {c.solution.highlights.map((_, i) => (
                <div
                  key={i}
                  className="reveal rounded-2xl bg-muted/40 p-6 lg:p-7"
                >
                  <span className="text-xs font-mono text-primary/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Editable as="h4" path={`conversant.solution.highlights.${i}.title`} className="font-semibold mt-2 mb-2 text-balance" />
                  <Editable as="p" path={`conversant.solution.highlights.${i}.desc`} multiline className="text-sm text-muted-foreground leading-relaxed" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 06 — System structure */}
      <section id="sec-06" className="py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader number="06" eyebrowPath="conversant.system.eyebrow" titlePath="conversant.system.titleLead" highlightPath="conversant.system.titleHighlight" />
          </div>

          <div className="reveal">
            <Prose>
              <Paragraphs base="conversant.system.intro" items={c.system.intro} />
            </Prose>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.system.panels.map((_, i) => (
              <div
                key={i}
                className="reveal rounded-2xl bg-muted/40 p-6 flex flex-col gap-3"
              >
                <span className="text-xs font-mono text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Editable as="h3" path={`conversant.system.panels.${i}.title`} className="font-semibold" />
                <Editable as="p" path={`conversant.system.panels.${i}.desc`} multiline className="text-sm text-muted-foreground leading-relaxed" />
              </div>
            ))}
          </div>

          <div className="mt-12 reveal">
            <Prose>
              <Paragraphs base="conversant.system.closing" items={c.system.closing} />
            </Prose>
          </div>
        </div>
      </section>

      {/* 07 — Selected work */}
      <section id="sec-07" className="py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader number="07" eyebrowPath="conversant.selectedWork.eyebrow" titlePath="conversant.selectedWork.titleLead" highlightPath="conversant.selectedWork.titleHighlight" />
          </div>

          <div className="reveal">
            <Prose>
              <Paragraphs base="conversant.selectedWork.intro" items={c.selectedWork.intro} />
            </Prose>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {c.selectedWork.features.map((feature, i) => (
              <div
                key={i}
                className="reveal rounded-2xl bg-muted/40 p-8 lg:p-10 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-mono text-primary/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Editable as="span" path={`conversant.selectedWork.features.${i}.tag`} className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary" />
                </div>
                <Editable as="h3" path={`conversant.selectedWork.features.${i}.title`} className="text-xl lg:text-2xl font-semibold mb-4" />
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.desc.map((_, j) => (
                    <Editable key={j} as="p" multiline path={`conversant.selectedWork.features.${i}.desc.${j}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — Role & strategy */}
      <section id="sec-08" className="py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader number="08" eyebrowPath="conversant.role.eyebrow" titlePath="conversant.role.titleLead" highlightPath="conversant.role.titleHighlight" />
          </div>

          <div className="reveal">
            <Prose>
              <Paragraphs base="conversant.role.intro" items={c.role.intro} />
            </Prose>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="reveal rounded-2xl bg-muted/40 p-8">
              <Editable as="h4" path="conversant.role.initiativesLabel" className="text-xs uppercase tracking-[0.2em] text-primary mb-4" />
              <Chips base="conversant.role.initiatives" items={c.role.initiatives} />
            </div>
            <div className="reveal rounded-2xl bg-muted/40 p-8">
              <Editable as="h4" path="conversant.role.deliverablesLabel" className="text-xs uppercase tracking-[0.2em] text-primary mb-4" />
              <Chips base="conversant.role.deliverables" items={c.role.deliverables} />
            </div>
          </div>

          {/* Additional strategic work */}
          <div className="mt-16 reveal rounded-2xl bg-gradient-to-br from-primary/10 to-primary/[0.03] p-8 lg:p-10">
            <Editable as="h3" path="conversant.role.strategyTitle" className="text-xl sm:text-2xl font-semibold mb-5" />
            <Prose>
              <Paragraphs base="conversant.role.strategy" items={c.role.strategy} />
            </Prose>
          </div>

          {/* Constraints */}
          <div className="mt-16">
            <Editable as="h3" path="conversant.role.constraintsTitle" className="text-xl sm:text-2xl font-semibold mb-8 reveal" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c.role.constraints.map((_, i) => (
                <div
                  key={i}
                  className="reveal rounded-2xl bg-muted/40 p-6 lg:p-7"
                >
                  <Editable as="h4" path={`conversant.role.constraints.${i}.title`} className="font-semibold mb-2 text-balance" />
                  <Editable as="p" path={`conversant.role.constraints.${i}.desc`} multiline className="text-sm text-muted-foreground leading-relaxed" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 09 — Process & impact */}
      <section id="sec-09" className="py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader number="09" eyebrowPath="conversant.impact.eyebrow" titlePath="conversant.impact.titleLead" highlightPath="conversant.impact.titleHighlight" />
          </div>

          {/* Velocity & process */}
          <div className="reveal">
            <Editable as="h3" path="conversant.impact.processTitle" className="text-xl sm:text-2xl font-semibold mb-5" />
            <Prose>
              <Paragraphs base="conversant.impact.process" items={c.impact.process} />
            </Prose>
          </div>

          <div className="mt-10 reveal flex flex-wrap items-center gap-x-3 gap-y-3">
            {c.impact.processSteps.map((_, i) => (
              <span key={i} className="flex items-center gap-3">
                <Editable
                  as="span"
                  path={`conversant.impact.processSteps.${i}`}
                  className="px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium"
                />
                {i < c.impact.processSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                )}
              </span>
            ))}
          </div>

          {/* Measuring success */}
          <div className="mt-20 reveal">
            <Editable as="h3" path="conversant.impact.measuringTitle" className="text-xl sm:text-2xl font-semibold mb-5" />
            <Prose>
              <Paragraphs base="conversant.impact.measuring" items={c.impact.measuring} />
            </Prose>
          </div>

          {/* Collaboration */}
          <div className="mt-20 reveal">
            <Editable as="h3" path="conversant.impact.collaborationTitle" className="text-xl sm:text-2xl font-semibold mb-5" />
            <Prose>
              <Paragraphs base="conversant.impact.collaboration" items={c.impact.collaboration} />
            </Prose>
            <div className="mt-6">
              <Chips base="conversant.impact.collaborators" items={c.impact.collaborators} />
            </div>
          </div>

          {/* Design systems */}
          <div className="mt-20 reveal">
            <Editable as="h3" path="conversant.impact.designSystemsTitle" className="text-xl sm:text-2xl font-semibold mb-5" />
            <Prose>
              <Paragraphs base="conversant.impact.designSystems" items={c.impact.designSystems} />
            </Prose>
          </div>

          {/* What this demonstrates */}
          <div className="mt-20 reveal rounded-2xl bg-primary/10 p-8 lg:p-10">
            <Editable as="h3" path="conversant.impact.demonstratesTitle" className="text-xl sm:text-2xl font-semibold mb-5" />
            <Prose>
              <Paragraphs base="conversant.impact.demonstrates" items={c.impact.demonstrates} />
            </Prose>
          </div>

          {/* Confidentiality note */}
          <p className="mt-12 reveal text-xs text-muted-foreground/80 italic max-w-3xl">
            <Editable as="span" path="conversant.impact.confidentiality" multiline />
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
            <Editable as="span" path="conversant.footerCta.titleLead" />{' '}
            <Editable as="span" path="conversant.footerCta.titleHighlight" className="gradient-text" />{' '}
            <Editable as="span" path="conversant.footerCta.titleRest" />
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 gradient-bg text-white"
            >
              <a href="#contact" onClick={(e) => isAdmin && e.preventDefault()}>
                <Editable as="span" path="conversant.footerCta.getInTouch" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              <a href="#projects" onClick={(e) => isAdmin && e.preventDefault()} className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <Editable as="span" path="conversant.footerCta.backToProjects" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
