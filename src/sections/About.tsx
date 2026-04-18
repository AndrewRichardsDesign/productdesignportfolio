import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Briefcase, Coffee, Heart, MapPin, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 8, suffix: '+', label: 'Years Experience' },
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 30, suffix: '+', label: 'Happy Clients' },
  { value: 12, suffix: '', label: 'Design Awards' },
];

const skills = [
  'UI/UX Design',
  'Design Systems',
  'User Research',
  'Prototyping',
  'Brand Strategy',
  'Motion Design',
  'Figma',
  'Adobe Creative Suite',
];

const experiences = [
  {
    role: 'Senior Product Designer',
    company: 'Tech Innovations Inc.',
    period: '2021 - Present',
    description: 'Leading design for enterprise SaaS products, managing a team of 4 designers.',
  },
  {
    role: 'Product Designer',
    company: 'Digital Agency Studio',
    period: '2018 - 2021',
    description: 'Designed mobile and web experiences for Fortune 500 clients.',
  },
  {
    role: 'UI/UX Designer',
    company: 'StartupXYZ',
    period: '2016 - 2018',
    description: 'Built design systems and user interfaces from the ground up.',
  },
];

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

export default function About() {
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
                About <span className="gradient-text">Me</span>
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>

            {/* Bio */}
            <div className="animate-item space-y-4">
              <p className="text-lg text-foreground/90 leading-relaxed">
                I&apos;m a senior digital product designer with over 8 years of experience 
                crafting digital experiences that matter. My approach combines strategic 
                thinking with pixel-perfect execution, ensuring every design decision 
                serves both user needs and business goals.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I believe great design is invisible—it simply works. My process is rooted 
                in empathy, validated by research, and refined through iteration. I&apos;ve 
                had the privilege of working with startups and Fortune 500 companies alike, 
                helping them transform complex challenges into intuitive solutions.
              </p>
            </div>

            {/* Philosophy */}
            <div className="animate-item p-6 rounded-2xl bg-card/50 border border-border/30">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Design Philosophy</h3>
                  <p className="text-sm text-muted-foreground">
                    &ldquo;Design is not just what it looks like and feels like. 
                    Design is how it works.&rdquo; — Steve Jobs
                  </p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="animate-item">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Skills & Expertise
              </h3>
              <div className="skills-container flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-tag px-4 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="animate-item">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Experience
              </h3>
              <div className="space-y-4">
                {experiences.map((exp, i) => (
                  <div
                    key={i}
                    className="relative pl-6 pb-4 border-l border-border/50 last:pb-0"
                  >
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-primary -translate-x-1/2" />
                    <h4 className="font-medium text-sm">{exp.role}</h4>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{exp.period}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Touch */}
            <div className="animate-item flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4" />
                <span>Coffee enthusiast</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Cat lover</span>
              </div>
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
                <img
                  src="/about-portrait.jpg"
                  alt="Portrait"
                  className="w-full h-full object-cover"
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
                    <p className="text-xs text-muted-foreground">Recognition</p>
                    <p className="font-semibold text-sm">Top Designer 2024</p>
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
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-item text-center p-6 rounded-2xl bg-card/50 border border-border/30 hover:border-primary/20 transition-colors duration-300"
            >
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
