import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, Users, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const caseStudies = [
  {
    id: 1,
    title: 'Revolutionizing Banking for Gen Z',
    subtitle: 'Complete redesign of mobile banking experience',
    image: '/case-study-banking.jpg',
    stats: [
      { label: 'User Engagement', value: '+47%' },
      { label: 'App Store Rating', value: '4.8' },
      { label: 'Daily Active Users', value: '2M+' },
    ],
    highlights: [
      { icon: Target, title: 'Challenge', desc: 'Simplify complex financial operations for young users' },
      { icon: Lightbulb, title: 'Solution', desc: 'Gamified savings goals with intuitive visual feedback' },
      { icon: Users, title: 'Impact', desc: '3x increase in savings account openings' },
    ],
    duration: '6 months',
    team: '5 designers',
  },
  {
    id: 2,
    title: 'Healthcare at Your Fingertips',
    subtitle: 'Telemedicine platform design',
    image: '/case-study-telemedicine.jpg',
    stats: [
      { label: 'Patient Satisfaction', value: '94%' },
      { label: 'Booking Conversion', value: '+62%' },
      { label: 'Video Call Quality', value: '99.9%' },
    ],
    highlights: [
      { icon: Target, title: 'Challenge', desc: 'Reduce friction in virtual healthcare access' },
      { icon: Lightbulb, title: 'Solution', desc: 'One-tap appointment booking with smart matching' },
      { icon: Users, title: 'Impact', desc: '500K+ virtual consultations monthly' },
    ],
    duration: '8 months',
    team: '8 designers',
  },
  {
    id: 3,
    title: 'The Future of Online Learning',
    subtitle: 'EdTech platform transformation',
    image: '/case-study-edtech.jpg',
    stats: [
      { label: 'Course Completion', value: '+38%' },
      { label: 'Student Engagement', value: '4.5h/day' },
      { label: 'NPS Score', value: '72' },
    ],
    highlights: [
      { icon: Target, title: 'Challenge', desc: 'Combat low engagement in online courses' },
      { icon: Lightbulb, title: 'Solution', desc: 'Interactive progress tracking with social features' },
      { icon: Users, title: 'Impact', desc: '1M+ active learners worldwide' },
    ],
    duration: '10 months',
    team: '12 designers',
  },
  {
    id: 4,
    title: 'Sustainable Fashion Marketplace',
    subtitle: 'Eco-conscious e-commerce experience',
    image: '/case-study-fashion.jpg',
    stats: [
      { label: 'Conversion Rate', value: '+28%' },
      { label: 'Avg Order Value', value: '$127' },
      { label: 'Return Rate', value: '-15%' },
    ],
    highlights: [
      { icon: Target, title: 'Challenge', desc: 'Build trust in sustainable fashion claims' },
      { icon: Lightbulb, title: 'Solution', desc: 'Transparent impact metrics for each product' },
      { icon: Users, title: 'Impact', desc: '250K+ eco-conscious shoppers' },
    ],
    duration: '5 months',
    team: '4 designers',
  },
];

export default function CaseStudies() {
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
            Case <span className="gradient-text">Studies</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deep dives into my most impactful projects, from discovery to delivery.
          </p>
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
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-expo-out group-hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  
                  {/* Stats Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4 sm:gap-8">
                    {study.stats.map((stat, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 rounded-xl bg-background/80 backdrop-blur-sm text-center"
                      >
                        <div className="text-lg sm:text-xl font-bold gradient-text">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
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
                    <span>{study.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{study.team}</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                    {study.title}
                  </h3>
                  <p className="text-lg text-muted-foreground">{study.subtitle}</p>
                </div>

                {/* Highlights */}
                <div className="space-y-4">
                  {study.highlights.map((highlight, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/30 hover:border-primary/20 transition-colors duration-300"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <highlight.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{highlight.title}</h4>
                        <p className="text-sm text-muted-foreground">{highlight.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  variant="outline"
                  className="group/btn rounded-full px-6 py-5 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    Read Full Case Study
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
