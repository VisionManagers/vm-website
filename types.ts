
export interface SolutionPackage {
  title: string;
  who: string;
  replaces: string;
  includes: string[];
  timeline: string;
  description: string;
}

export interface Testimonial {
  name: string;
  title: string;
  company: string;
  quote: string;
  image?: string;
}

export interface InsightPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  post_type: 'Brief' | 'Memo' | 'Notes';
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string | null;
  cta_icon: string | null;
  cta_heading: string | null;
  cta_body: string | null;
  cta_button_text: string | null;
  cta_button_link: string | null;
  cta_style: 'navy' | 'slate' | null;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  metric: string;
  metricLabel: string;
}
