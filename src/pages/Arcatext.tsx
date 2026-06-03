import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  ArrowRight,
  PenLine,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  GraduationCap,
  Languages,
  MessageSquareText,
  Bot,
  KeyboardIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const meta = {
  role: 'Founder · Product Designer · iOS Developer',
  type: ['AI Translation Keyboard', 'Language-Learning Tool', 'Messaging Companion'],
  status: 'In development',
};

const productLoop = [
  {
    step: 'Write',
    icon: PenLine,
    desc: 'Start with something the user actually wants to say — to a friend, a penpal, a class, or an AI.',
  },
  {
    step: 'Reword',
    icon: Sparkles,
    desc: 'Translate or refine the message while preserving intent, tone, and language-specific nuance.',
  },
  {
    step: 'Check',
    icon: ShieldCheck,
    desc: 'Inspect the result before sending. Reverse translation and alternates build trust in the output.',
  },
  {
    step: 'Clarify',
    icon: HelpCircle,
    desc: 'Resolve ambiguity — homographs, gender, formality, script — so meaning stays in the user’s control.',
  },
  {
    step: 'Learn',
    icon: GraduationCap,
    desc: 'Turn each interaction into vocabulary, grammar, and confidence the user can build on over time.',
  },
];

const problems = [
  {
    title: 'Learning is disconnected from real life',
    desc: 'Scripted exercises rarely prepare learners for the unpredictable, personal conversations they actually want to have.',
  },
  {
    title: 'Generic paths over personal goals',
    desc: 'Guided systems decide what to learn next, even when those lessons ignore the relationships and topics that motivate the user.',
  },
  {
    title: 'Translators solve the message, not the moment',
    desc: 'Most tools produce a result without explaining why a translation works — or how meaning shifts through tone, gender, or context.',
  },
  {
    title: 'Nuance is hidden in a black box',
    desc: 'Users often need to adjust gender, register, or word choice, but those decisions are buried inside the translation engine.',
  },
  {
    title: 'Unfamiliar scripts add a second barrier',
    desc: 'For Japanese, Arabic, Hindi, Korean, Thai, Armenian, and others, the writing system is its own challenge on top of the language.',
  },
];

const opportunities = [
  {
    title: 'Use natural conversations as lessons',
    desc: 'Every message becomes a chance to learn vocabulary, grammar, tone, and cultural nuance in context.',
  },
  {
    title: 'Give users control over meaning',
    desc: 'Treat translation as a dialogue — clarify ambiguity, compare alternatives, adjust nuance.',
  },
  {
    title: 'Turn translation into feedback',
    desc: 'Reverse translation, synonyms, and homograph clarification build confidence instead of blind copying.',
  },
  {
    title: 'Bridge scripts with romanization',
    desc: 'Romanization connects meaning, pronunciation, and native script — letting learners participate before full literacy.',
  },
  {
    title: 'Learn from real behavior',
    desc: 'Real conversations reveal recurring words, grammar gaps, and topics — the foundation for an adaptive learning path.',
  },
];

const decisions = [
  {
    n: '01',
    title: 'Embed learning inside the writing surface',
    desc: 'A keyboard sits inside iMessage, WhatsApp, HelloTalk, Instagram, dating apps, email — meeting users where their relationships already exist instead of asking them to leave the conversation.',
  },
  {
    n: '02',
    title: 'Treat translation as a learning interaction',
    desc: 'Most translators present a single output and expect trust. Arcatext lets users inspect, compare, reverse-check, and clarify — shifting the product from translator to learning companion.',
  },
  {
    n: '03',
    title: 'Make nuance controllable',
    desc: 'Expose hidden translation decisions: gender, tone, formality, script, regional variation. Translation isn’t one fixed answer — it’s a set of meaning decisions.',
  },
  {
    n: '04',
    title: 'Support confidence before sending',
    desc: 'The Check experience reduces the fear of sending something wrong, awkward, or unintended — supporting both communication and learning confidence.',
  },
  {
    n: '05',
    title: 'Design for multiple fluency levels',
    desc: 'Beginner: a safe communication assistant. Intermediate: a feedback tool. Advanced: a nuance tool. The product reveals depth as the user grows.',
  },
  {
    n: '06',
    title: 'Use real conversations as the curriculum',
    desc: 'Instead of a fixed sequence, the user’s actual writing becomes the source of learning — making the path personal, relevant, and emotionally meaningful.',
  },
];

const outcomes = [
  {
    title: 'Gathered feedback from students and teachers',
    desc: 'Mapped current learning behaviors, classroom practices, and the role conversational practice could play alongside existing methods.',
  },
  {
    title: 'Defined the product vision',
    desc: 'Shaped Arcatext around a central insight: written conversation can become a personalized language-learning environment.',
  },
  {
    title: 'Built a web-based proof of concept',
    desc: 'Used HTML, JavaScript, and the ChatGPT API to validate the core Reword behavior before committing to the iOS keyboard.',
  },
  {
    title: 'Designed the MVP translation keyboard',
    desc: 'Shipped the first product surface inside existing messaging apps, supporting users in real communication contexts.',
  },
  {
    title: 'Built the Reword experience',
    desc: 'The core translation interaction — transforming an original message into a natural target-language version while preserving intent.',
  },
  {
    title: 'Designed the Check experience',
    desc: 'A pre-send verification flow that addresses a major trust issue: users copying translations without knowing whether the output matches intent.',
  },
  {
    title: 'Added nuance controls',
    desc: 'Speaker gender, recipient gender, group-chat gender, alphabet/script options, synonyms, reverse translation, and homograph clarification.',
  },
  {
    title: 'Developed a scalable language-resource strategy',
    desc: 'A structured translation pool for common messages and variations — a path toward faster responses, lower AI cost, and reusable linguistic data.',
  },
  {
    title: 'Established the platform roadmap',
    desc: 'The MVP keyboard is the foundation for AI conversation partners, progress insights, personalized learning paths, and teacher tools.',
  },
];

const caseStudies = [
  {
    title: 'Translation Keyboard UX',
    question: 'How might we design a keyboard experience that feels lightweight, fast, and useful inside any messaging app?',
  },
  {
    title: 'Check View',
    question: 'How might we help users trust a translation before sending it?',
  },
  {
    title: 'Homograph Clarification',
    question: 'How might we help users control meaning when one word has multiple possible interpretations?',
  },
  {
    title: 'Gender-Aware Translation',
    question: 'How might we make gendered language visible and controllable without overwhelming the user?',
  },
  {
    title: 'Learning Insights',
    question: 'How might real conversations become measurable progress?',
  },
];

function SectionHeader({
  number,
  eyebrow,
  title,
  highlight,
}: {
  number: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
}) {
  return (
    <div className="mb-12 lg:mb-16">
      <div className="flex items-baseline gap-4 mb-4">
        <span className="text-sm font-mono text-primary/70 tracking-wider">{number}</span>
        {eyebrow && (
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </span>
        )}
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance max-w-3xl">
        {title}{' '}
        {highlight && <span className="gradient-text">{highlight}</span>}
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

export default function Arcatext() {
  const rootRef = useRef<HTMLDivElement>(null);

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
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a
            href="#home"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </a>
          <span className="text-sm font-semibold gradient-text">Arcatext</span>
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
            <span className="text-xs font-medium text-primary tracking-wide">
              {meta.status}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-balance">
            <span className="gradient-text">Arcatext</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-foreground/80 max-w-3xl leading-snug mb-10 text-balance">
            A translation keyboard that turns real conversations into the lesson —
            then gives you the insight to grow.
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {meta.type.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-card border border-border/50 text-foreground/80"
              >
                {t}
              </span>
            ))}
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl border-t border-border/40 pt-8">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Role
              </dt>
              <dd className="text-sm text-foreground/90">{meta.role}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Platform
              </dt>
              <dd className="text-sm text-foreground/90">iOS · Custom keyboard</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Surface
              </dt>
              <dd className="text-sm text-foreground/90">
                Any messaging app (iMessage, WhatsApp, HelloTalk, …)
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 01 — Overview */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader number="01" eyebrow="Overview" title="What is" highlight="Arcatext?" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 reveal">
              <Prose>
                <p>
                  Arcatext is a language-learning product designed to make the complexity and
                  nuance of language more accessible — and the learning process more natural,
                  engaging, and practical.
                </p>
                <p>
                  The first phase, a translation keyboard, helps users turn real conversations
                  with friends, penpals, and AI into personalized language-learning experiences.
                  Instead of forcing learners through generic lessons, Arcatext helps them learn
                  from the conversations they actually want to have.
                </p>
                <p>
                  It combines context-aware translation, clarification tools, and language
                  exposure so users can communicate across languages with greater fluency,
                  accuracy, and confidence.
                </p>
              </Prose>
            </div>

            <aside className="lg:col-span-5 reveal">
              <div className="rounded-2xl bg-muted/40 p-8">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-4">
                  <Languages className="w-4 h-4" />
                  Product type
                </div>
                <ul className="space-y-3 text-foreground/90">
                  <li className="flex items-center gap-3">
                    <KeyboardIcon className="w-4 h-4 text-primary/70" />
                    AI translation keyboard
                  </li>
                  <li className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-primary/70" />
                    Language-learning tool
                  </li>
                  <li className="flex items-center gap-3">
                    <MessageSquareText className="w-4 h-4 text-primary/70" />
                    Messaging companion
                  </li>
                  <li className="flex items-center gap-3">
                    <Bot className="w-4 h-4 text-primary/70" />
                    Future AI conversation platform
                  </li>
                </ul>
              </div>
            </aside>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-20">
            <div className="reveal">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Origin</h3>
              <Prose>
                <p>
                  Arcatext began as a personal attempt to make multilingual texting feel more
                  fluid. Early exploration exposed the friction of existing translator keyboards
                  and copy-paste workflows, which shifted the project from a conceptual messaging
                  app optimization into a true product able to create value in any messaging app.
                </p>
              </Prose>
            </div>
            <div className="reveal">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                The focus on reading and writing
              </h3>
              <Prose>
                <p>
                  Language learning involves reading, writing, speaking, listening, vocabulary,
                  grammar, and tone. While many tools support guided lessons or speaking
                  practice, the biggest opportunity was in reading and writing — especially in
                  real texting conversations.
                </p>
                <p>
                  Messaging gives learners time to pause, revise, compare, and understand
                  language before responding. That made it the ideal entry point: a way to turn
                  everyday conversations into personalized learning moments.
                </p>
              </Prose>
            </div>
          </div>

          <div className="mt-20 reveal">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">My role</h3>
            <Prose>
              <p>
                I led Arcatext as a founder-designer, taking the product from early concept
                through research, MVP design, implementation, pricing strategy, and launch
                preparation.
              </p>
              <p>
                My role spanned product strategy, UX architecture, interaction design, AI
                behavior design, front-end and back-end development, and business formation. I
                created the LLC, developed the iOS app, designed the core translation keyboard
                experience, and built the foundation for Arcatext to evolve from an MVP into a
                broader language-learning platform.
              </p>
              <p>
                A major shift in the project was learning to work across strategy, design,
                technology, and business at the same time. Product direction, technical
                feasibility, AI behavior, implementation, pricing, and interaction design were
                not separate tracks — they constantly shaped each other.
              </p>
            </Prose>
          </div>
        </div>
      </section>

      {/* 02 — Problem / Opportunity */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader
              number="02"
              eyebrow="Problem / Opportunity"
              title="Most language-learning tools separate practice from"
              highlight="real communication."
            />
          </div>

          <div className="reveal">
            <Prose>
              <p>
                Learners spend time on scripted exercises, flashcards, grammar drills, and
                guided lessons — but those activities don’t always prepare them for the
                conversations they actually want to have. Real communication is personal,
                unpredictable, emotional, and full of nuance.
              </p>
              <p>
                A learner may know vocabulary from an app but still struggle when texting a
                friend, replying to a penpal, navigating tone, choosing the right level of
                formality, reading an unfamiliar script, or understanding why one translation
                sounds natural and another does not.
              </p>
              <p>
                Translation tools solve part of the problem, but they usually focus on producing
                a result rather than helping the user learn from the moment. They translate the
                message, but rarely expose the decisions behind the translation.
              </p>
            </Prose>

            <div className="mt-10 rounded-2xl bg-primary/10 p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
                The opportunity
              </p>
              <p className="text-xl sm:text-2xl font-semibold text-balance leading-snug">
                What if everyday messages could become personalized
                <span className="gradient-text"> language-learning moments?</span>
              </p>
            </div>
          </div>

          {/* Problems */}
          <div className="mt-20">
            <h3 className="text-xl sm:text-2xl font-semibold mb-8 reveal">Key problems</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {problems.map((p) => (
                <div
                  key={p.title}
                  className="reveal rounded-2xl bg-muted/40 p-6 hover:bg-muted/60 transition-colors"
                >
                  <h4 className="font-semibold mb-2">{p.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="mt-16">
            <h3 className="text-xl sm:text-2xl font-semibold mb-8 reveal">
              Product opportunities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map((o) => (
                <div
                  key={o.title}
                  className="reveal rounded-2xl bg-gradient-to-br from-primary/10 to-primary/[0.03] p-6"
                >
                  <h4 className="font-semibold mb-2">{o.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{o.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 reveal">
            <Prose>
              <p>
                Before Arcatext, practicing through texting often meant a multi-step process
                just to get a translation: translating outgoing messages, using separate tools
                to understand incoming messages, re-translating earlier messages to maintain
                context, and still having limited control over gender, homographs, script, and
                tone.
              </p>
              <p>
                Arcatext reduces that friction by bringing translation, context, and
                clarification into one integrated writing experience.
              </p>
            </Prose>
          </div>
        </div>
      </section>

      {/* 03 — Strategy */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader
              number="03"
              eyebrow="Strategy"
              title="Balancing the learner, the product, the system, and the"
              highlight="market."
            />
          </div>

          <div className="reveal">
            <Prose>
              <p>
                Product strategy meant constantly weighing the relationship between the learner,
                the product experience, the technical system, and the market — prioritizing what
                would reduce friction now while setting up the product for a broader
                language-learning platform later.
              </p>
            </Prose>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                title: 'Start where learners already communicate',
                desc: 'Build Arcatext as a keyboard so it works inside iMessage, WhatsApp, HelloTalk, Instagram, dating apps, and email — available at the exact moment a user needs help.',
              },
              {
                title: 'Messaging app vs. keyboard',
                desc: 'Evaluated building a new messaging app, but learners were unlikely to move existing conversations or convince contacts to switch platforms. The keyboard meets users where their relationships already exist.',
              },
              {
                title: 'Competitive review',
                desc: 'Existing translation keyboards introduced cost, usability, or reliability issues. That pushed the product toward a purpose-built keyboard focused on one-tap translation and minimal interruption to the texting flow.',
              },
              {
                title: 'Serve multiple language levels',
                desc: 'Beginners get a safe communication assistant. Intermediates get a feedback tool. Advanced learners get a nuance tool. The product grows with the user.',
              },
              {
                title: 'Leverage real relationships first',
                desc: 'Begin with the conversations users already care about — friends, penpals, classmates, partners, exchange partners — then expand into 24/7 AI conversations once the core learning loop is established.',
              },
              {
                title: 'Build toward a personalized learning system',
                desc: 'Repeated communication becomes structured insight: vocabulary, grammar patterns, translation choices, confidence gaps. The foundation for adaptive practice and teacher tools.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="reveal rounded-2xl bg-muted/40 p-6 lg:p-8"
              >
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 reveal rounded-2xl bg-muted/40 p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
              Strategic planning artifact
            </p>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">
              A four-phase product strategy canvas
            </h3>
            <Prose>
              <p>
                To map the product beyond the MVP, I created a strategy canvas organizing
                Arcatext across four phases: an integrated translation keyboard, an AI
                conversation platform, data-driven learning insights, and teacher tools. The
                canvas mapped target users, competitive disruption, feature evolution, revenue
                streams, and long-term AI infrastructure — connecting near-term UX decisions to
                a scalable product strategy.
              </p>
            </Prose>
          </div>
        </div>
      </section>

      {/* 04 — Product System */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader
              number="04"
              eyebrow="Product System"
              title="Built around a"
              highlight="simple loop."
            />
          </div>

          <div className="reveal mb-12">
            <div className="flex flex-wrap items-center gap-3 text-lg sm:text-xl font-semibold">
              {productLoop.map((s, i) => (
                <span key={s.step} className="flex items-center gap-3">
                  <span className="px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {s.step}
                  </span>
                  {i < productLoop.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {productLoop.map((s, i) => (
              <div
                key={s.step}
                className="reveal rounded-2xl bg-muted/40 p-6 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{s.step}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 reveal">
            <Prose>
              <p>
                The product system is designed to make translation useful in the moment while
                also turning that moment into learning. The Reword experience supports
                context-aware translation, grammar correction, tone refinement, and
                language-specific options like speaker gender, recipient gender, group gender,
                and script preferences. The Check experience helps users verify meaning before
                sending, so they avoid blindly sending text they don’t understand.
              </p>
            </Prose>
          </div>
        </div>
      </section>

      {/* 05 — Key Design Decisions */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader
              number="05"
              eyebrow="Key Design Decisions"
              title="Design principle:"
              highlight="minimize interruption."
            />
          </div>

          <div className="reveal">
            <Prose>
              <p>
                Every interaction needed to preserve the flow of texting rather than pull the
                user into a separate learning task.
              </p>
            </Prose>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {decisions.map((d) => (
              <div
                key={d.n}
                className="reveal rounded-2xl bg-muted/40 p-6 lg:p-8 hover:bg-muted/60 transition-colors"
              >
                <span className="text-sm font-mono text-primary/70">{d.n}</span>
                <h3 className="text-lg lg:text-xl font-semibold mt-2 mb-3">{d.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Execution / Outcomes */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader
              number="06"
              eyebrow="Execution / Outcomes"
              title="What I built and"
              highlight="shipped."
            />
          </div>

          <ol className="space-y-4">
            {outcomes.map((o, i) => (
              <li
                key={o.title}
                className="reveal flex gap-6 rounded-2xl bg-muted/40 p-6"
              >
                <span className="text-sm font-mono text-primary/70 pt-0.5 shrink-0 w-8">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-semibold mb-1">{o.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{o.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 07 — Deeper Case Studies */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <SectionHeader
              number="07"
              eyebrow="Deeper Case Studies"
              title="Focused looks at the most complex"
              highlight="design problems."
            />
          </div>

          <div className="reveal">
            <Prose>
              <p>
                The Arcatext project page tells the high-level product story. Individual case
                studies go deeper on the specific design problems that shaped the product.
              </p>
            </Prose>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseStudies.map((cs, i) => (
              <a
                key={cs.title}
                href="#"
                className="reveal group rounded-2xl bg-muted/40 p-6 lg:p-8 hover:bg-muted/70 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-primary/70">
                      Case {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg lg:text-xl font-semibold mt-2 mb-3 group-hover:text-primary transition-colors">
                      {cs.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      {cs.question}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
            Want to talk about <span className="gradient-text">Arcatext</span> or
            language-learning design?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 gradient-bg text-white"
            >
              <a href="#contact">Get in Touch</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              <a href="#projects" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
