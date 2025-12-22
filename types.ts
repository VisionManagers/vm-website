
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
  type: 'Brief' | 'Memo' | 'Notes';
  title: string;
  summary: string;
  date: string;
}
