import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Linkedin, Dribbble, Twitter, Instagram, Github, Mail, ArrowUpRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:bg-[#0077b5]/10 hover:text-[#0077b5]' },
  { name: 'Dribbble', icon: Dribbble, href: '#', color: 'hover:bg-[#ea4c89]/10 hover:text-[#ea4c89]' },
  { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:bg-[#1da1f2]/10 hover:text-[#1da1f2]' },
  { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:bg-[#e4405f]/10 hover:text-[#e4405f]' },
  { name: 'GitHub', icon: Github, href: '#', color: 'hover:bg-foreground/10' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.contact-title',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.contact-title',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Form animation
      gsap.fromTo(
        formRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Form fields stagger
      gsap.fromTo(
        '.form-field',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Social links animation
      gsap.fromTo(
        '.social-link',
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.social-links',
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', projectType: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, hsl(var(--primary) / 0.2) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="contact-title text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Let&apos;s Create Something{' '}
            <span className="gradient-text">Amazing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? I&apos;d love to hear about it. Drop me a message 
            and let&apos;s start the conversation.
          </p>
        </div>

        {/* Contact Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="form-field space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Your Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-12 rounded-xl bg-card/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
              />
            </div>

            {/* Email Field */}
            <div className="form-field space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12 rounded-xl bg-card/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
              />
            </div>
          </div>

          {/* Project Type Field */}
          <div className="form-field space-y-2">
            <Label htmlFor="projectType" className="text-sm font-medium">
              Project Type
            </Label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              required
              className="w-full h-12 px-4 rounded-xl bg-card/50 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-foreground outline-none"
            >
              <option value="" disabled>Select a project type</option>
              <option value="web-design">Web Design</option>
              <option value="mobile-app">Mobile App Design</option>
              <option value="brand-identity">Brand Identity</option>
              <option value="design-system">Design System</option>
              <option value="consultation">Consultation</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Message Field */}
          <div className="form-field space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Tell me about your project
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="I'm looking for a designer to help me with..."
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="rounded-xl bg-card/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="form-field">
            <Button
              type="submit"
              disabled={isSubmitted}
              className="w-full sm:w-auto group relative overflow-hidden rounded-full px-8 py-6 text-base font-medium gradient-bg text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-100"
            >
              {isSubmitted ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Message Sent!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </span>
              )}
            </Button>
          </div>
        </form>

        {/* Alternative Contact */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Prefer email? Reach me at{' '}
            <a
              href="mailto:hello@designer.com"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              <Mail className="w-3 h-3" />
              hello@designer.com
            </a>
          </p>
        </div>

        {/* Social Links */}
        <div className="social-links mt-12 flex justify-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`social-link w-12 h-12 rounded-full bg-card/50 border border-border/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary/30 ${social.color}`}
              aria-label={social.name}
            >
              <social.icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Download Resume
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              View Dribbble
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Schedule a Call
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
