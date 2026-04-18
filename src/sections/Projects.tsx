import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'Fintech Dashboard Redesign',
    description: 'Transforming complex financial data into intuitive visualizations for better decision making.',
    image: '/project-fintech.jpg',
    tags: ['UI/UX Design', 'Dashboard', 'Data Visualization'],
    link: '#',
  },
  {
    id: 2,
    title: 'E-commerce Experience',
    description: 'Crafting a seamless shopping journey that converts visitors into loyal customers.',
    image: '/project-ecommerce.jpg',
    tags: ['E-commerce', 'UX Research', 'Conversion Optimization'],
    link: '#',
  },
  {
    id: 3,
    title: 'Healthcare App',
    description: 'Simplifying patient care through thoughtful design and intuitive interactions.',
    image: '/project-healthcare.jpg',
    tags: ['Mobile App', 'Healthcare', 'Accessibility'],
    link: '#',
  },
  {
    id: 4,
    title: 'SaaS Platform',
    description: 'Building scalable design systems for enterprise-level software solutions.',
    image: '/project-saas.jpg',
    tags: ['SaaS', 'Design System', 'Enterprise'],
    link: '#',
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, clipPath: 'inset(100% 0 0 0)' },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0 0 0)',
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger animation
      const cards = cardsRef.current?.querySelectorAll('.project-card');
      if (cards) {
        cards.forEach((card, i) => {
          const direction = i % 2 === 0 ? -90 : 90;
          gsap.fromTo(
            card,
            { opacity: 0, rotateY: direction },
            {
              opacity: 1,
              rotateY: 0,
              duration: 0.7,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
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
      id="projects"
      className="relative py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Selected <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A curated collection of work that showcases my approach to solving complex design challenges.
          </p>
        </div>

        {/* Projects Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          style={{ perspective: '1000px' }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card group relative"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: `rotate(${index % 2 === 0 ? '-1' : '1'}deg)`,
              }}
            >
              <a
                href={project.link}
                className="block relative overflow-hidden rounded-2xl lg:rounded-3xl bg-card border border-border/50 transition-all duration-500 ease-expo-out hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-expo-out group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* View Project Button */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-expo-out">
                    <ArrowUpRight className="w-5 h-5 text-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl lg:text-2xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm lg:text-base mb-4">
                    {project.description}
                  </p>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-expo-out">
                    <span>View Project</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-sm font-medium"
          >
            View All Projects
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
