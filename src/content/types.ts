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
  timeframe: string;
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
    portrait: string;
    portraitAlt: string;
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
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    projectTypeDefault: string;
    projectTypeOptions: { value: string; label: string }[];
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
  arcatext: ArcatextContent;
  conversant: ConversantContent;
  usaa: UsaaContent;
}

export interface TitledItem {
  title: string;
  desc: string;
}

export interface ArcatextLoopStep {
  step: string;
  icon: string;
  desc: string;
}

export interface ArcatextDecision {
  n: string;
  title: string;
  desc: string;
}

export interface ArcatextInsight {
  title: string;
  desc: string;
  response: string;
}

export interface ArcatextResponse {
  insight: string;
  response: string;
}

export interface ArcatextQuestion {
  n: string;
  q: string;
}

export interface ArcatextContent {
  backToPortfolio: string;
  brand: string;
  toc: string[];
  hero: {
    status: string;
    title: string;
    subtitle: string;
    typeTags: string[];
    roleLabel: string;
    roleValue: string;
    platformLabel: string;
    platformValue: string;
    surfaceLabel: string;
    surfaceValue: string;
  };
  overview: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    productTypeLabel: string;
    productTypeList: string[];
    originTitle: string;
    origin: string[];
    readingWritingTitle: string;
    readingWriting: string[];
    roleTitle: string;
    role: string[];
  };
  problem: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    opportunityEyebrow: string;
    opportunityLead: string;
    opportunityHighlight: string;
    problemsTitle: string;
    problems: TitledItem[];
    opportunitiesTitle: string;
    opportunities: TitledItem[];
    closing: string[];
  };
  strategy: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    second: string[];
    quoteLead: string;
    quoteHighlight: string;
    cards: TitledItem[];
    artifactEyebrow: string;
    artifactTitle: string;
    artifact: string[];
  };
  productSystem: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    loop: ArcatextLoopStep[];
    closing: string[];
  };
  decisions: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    items: ArcatextDecision[];
  };
  execution: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    discoveryTitle: string;
    discovery: string[];
    synthesisTitle: string;
    synthesis: string[];
    directionalTitle: string;
    directionalInsights: ArcatextInsight[];
    soWhatLabel: string;
    soWhatLead: string;
    soWhatHighlight: string;
    soWhat: string[];
    insightToResponseTitle: string;
    productResponses: ArcatextResponse[];
    competitiveTitle: string;
    competitive: string[];
    shippedTitle: string;
    outcomes: TitledItem[];
    launchEyebrow: string;
    launchLead: string;
    launchHighlight: string;
    launch: string[];
    launchQuestions: ArcatextQuestion[];
    plannedSignalsLabel: string;
    launchSignals: string[];
  };
  caseStudies: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    items: { title: string; question: string }[];
  };
  footerCta: {
    titleLead: string;
    titleHighlight: string;
    titleRest: string;
    getInTouch: string;
    backToProjects: string;
  };
}

export interface ConversantPanel {
  title: string;
  desc: string;
}

export interface ConversantFeature {
  title: string;
  tag: string;
  desc: string[];
}

export interface ConversantContent {
  backToPortfolio: string;
  brand: string;
  toc: string[];
  hero: {
    status: string;
    title: string;
    subtitle: string;
    intro: string;
    typeTags: string[];
    roleLabel: string;
    roleValue: string;
    platformLabel: string;
    platformValue: string;
    surfaceLabel: string;
    surfaceValue: string;
  };
  context: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    calloutEyebrow: string;
    calloutLead: string;
    calloutHighlight: string;
  };
  goals: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    designGoalsTitle: string;
    designGoals: string[];
  };
  users: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    rolesLabel: string;
    roles: string[];
  };
  problem: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    problemsTitle: string;
    problems: TitledItem[];
    closing: string[];
    challengeLabel: string;
    challengeLead: string;
    challengeHighlight: string;
    challenge: string[];
  };
  solution: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    highlightsTitle: string;
    highlights: TitledItem[];
  };
  system: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    panels: ConversantPanel[];
    closing: string[];
  };
  selectedWork: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    features: ConversantFeature[];
  };
  role: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    initiativesLabel: string;
    initiatives: string[];
    deliverablesLabel: string;
    deliverables: string[];
    strategyTitle: string;
    strategy: string[];
    constraintsTitle: string;
    constraints: TitledItem[];
  };
  impact: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    processTitle: string;
    process: string[];
    processSteps: string[];
    measuringTitle: string;
    measuring: string[];
    collaborationTitle: string;
    collaboration: string[];
    collaborators: string[];
    designSystemsTitle: string;
    designSystems: string[];
    demonstratesTitle: string;
    demonstrates: string[];
    confidentiality: string;
  };
  footerCta: {
    titleLead: string;
    titleHighlight: string;
    titleRest: string;
    getInTouch: string;
    backToProjects: string;
  };
}

export interface UsaaFeature {
  title: string;
  desc: string[];
  bullets: string[];
}

export interface UsaaContent {
  backToPortfolio: string;
  brand: string;
  toc: string[];
  hero: {
    status: string;
    title: string;
    subtitle: string;
    intro: string;
    roleIntro: string;
    typeTags: string[];
    roleLabel: string;
    roleValue: string;
    platformLabel: string;
    platformValue: string;
    surfaceLabel: string;
    surfaceValue: string;
  };
  context: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    calloutEyebrow: string;
    calloutLead: string;
    calloutHighlight: string;
  };
  goals: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    designGoalsTitle: string;
    designGoals: string[];
  };
  needs: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    memberLabel: string;
    memberNeeds: string[];
    businessLabel: string;
    businessNeeds: string[];
  };
  problem: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    problemsTitle: string;
    problems: TitledItem[];
    closing: string[];
  };
  solution: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    highlightsTitle: string;
    highlights: TitledItem[];
    structureTitle: string;
    structure: string[];
    contentRoles: TitledItem[];
  };
  challenge: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    approachesTitle: string;
    approaches: TitledItem[];
    closing: string[];
  };
  selectedWork: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    features: UsaaFeature[];
  };
  role: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    intro: string[];
    workLabel: string;
    work: string[];
    closing: string;
  };
  impact: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    processTitle: string;
    process: string[];
    measuringTitle: string;
    measuring: string[];
    demonstratesTitle: string;
    demonstrates: string[];
    confidentiality: string;
  };
  footerCta: {
    titleLead: string;
    titleHighlight: string;
    titleRest: string;
    getInTouch: string;
    backToProjects: string;
  };
}
