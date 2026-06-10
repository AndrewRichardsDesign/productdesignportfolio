export interface NavLink {
  name: string;
  href: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

export interface CaseStudyStat {
  label: string;
  value: string;
}

export interface CaseStudyHighlight {
  icon: string;
  title: string;
  desc: string;
}

export interface CaseStudyItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  duration: string;
  team: string;
  stats: CaseStudyStat[];
  highlights: CaseStudyHighlight[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
}

export interface PersonalItem {
  icon: string;
  text: string;
}

export interface AboutStat {
  value: number;
  suffix: string;
  label: string;
}

export interface SocialLink {
  name: string;
  icon: string;
  href: string;
}

export interface SiteContent {
  nav: {
    logo: string;
    links: NavLink[];
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scrollText: string;
    stats: HeroStat[];
  };
  projects: {
    headingLead: string;
    headingHighlight: string;
    subtitle: string;
    viewProject: string;
    viewAll: string;
    items: ProjectItem[];
  };
  caseStudies: {
    headingLead: string;
    headingHighlight: string;
    subtitle: string;
    readMore: string;
    items: CaseStudyItem[];
  };
  about: {
    headingLead: string;
    headingHighlight: string;
    location: string;
    bio1: string;
    bio2: string;
    philosophyTitle: string;
    philosophyQuote: string;
    skillsTitle: string;
    skills: string[];
    experienceTitle: string;
    experiences: Experience[];
    personal: PersonalItem[];
    badgeLabel: string;
    badgeValue: string;
    stats: AboutStat[];
  };
  contact: {
    headingLead: string;
    headingHighlight: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    projectTypeLabel: string;
    messageLabel: string;
    submitLabel: string;
    submittedLabel: string;
    altContactText: string;
    email: string;
    social: SocialLink[];
    quickLinks: NavLink[];
  };
  footer: {
    copyright: string;
    madeWithPre: string;
    madeWithPost: string;
    links: NavLink[];
  };
}
