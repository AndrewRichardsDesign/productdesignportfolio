import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Linkedin, Dribbble, Twitter, Instagram, Github, Mail, ArrowUpRight, CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useContent } from '@/content/ContentContext';
import { Editable } from '@/content/Editable';

gsap.registerPlugin(ScrollTrigger);

const socialIcons: Record<string, LucideIcon> = {
  Linkedin,
  Dribbble,
  Twitter,
  Instagram,
  Github,
};

const socialColors: Record<string, string> = {
  Linkedin: 'hover:bg-[#0077b5]/10 hover:text-[#0077b5]',
  Dribbble: 'hover:bg-[#ea4c89]/10 hover:text-[#ea4c89]',
  Twitter: 'hover:bg-[#1da1f2]/10 hover:text-[#1da1f2]',
  Instagram: 'hover:bg-[#e4405f]/10 hover:text-[#e4405f]',
  Github: 'hover:bg-foreground/10',
};

export default function Contact() {
  const { content } = useContent();
  const contact = content.contact;
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
            <Editable as="span" path="contact.headingLead" />{' '}
            <Editable as="span" path="contact.headingHighlight" className="gradient-text" />
          </h2>
          <Editable
            as="p"
            path="contact.subtitle"
            multiline
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          />
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
                <Editable as="span" path="contact.nameLabel" />
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={contact.namePlaceholder}
                value={formData.name}
                onChange={handleChange}
                required
                className="h-12 rounded-xl bg-card/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
              />
            </div>

            {/* Email Field */}
            <div className="form-field space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                <Editable as="span" path="contact.emailLabel" />
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={contact.emailPlaceholder}
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
              <Editable as="span" path="contact.projectTypeLabel" />
            </Label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              required
              className="w-full h-12 px-4 rounded-xl bg-card/50 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-foreground outline-none"
            >
              <option value="" disabled>{contact.projectTypeDefault}</option>
              {contact.projectTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Message Field */}
          <div className="form-field space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              <Editable as="span" path="contact.messageLabel" />
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder={contact.messagePlaceholder}
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
                  <Editable as="span" path="contact.submittedLabel" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <Editable as="span" path="contact.submitLabel" />
                </span>
              )}
            </Button>
          </div>
        </form>

        {/* Alternative Contact */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <Editable as="span" path="contact.altContactText" />{' '}
            <a
              href={`mailto:${contact.email}`}
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              <Mail className="w-3 h-3" />
              <Editable as="span" path="contact.email" />
            </a>
          </p>
        </div>

        {/* Social Links */}
        <div className="social-links mt-12 flex justify-center gap-4">
          {contact.social.map((social) => {
            const Icon = socialIcons[social.icon] ?? Github;
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`social-link w-12 h-12 rounded-full bg-card/50 border border-border/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary/30 ${socialColors[social.icon] ?? ''}`}
                aria-label={social.name}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {contact.quickLinks.map((quickLink, i) => (
              <a
                key={i}
                href={quickLink.href}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Editable as="span" path={`contact.quickLinks.${i}.name`} />
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
