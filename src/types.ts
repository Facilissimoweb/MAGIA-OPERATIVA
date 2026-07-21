export interface ElementProfile {
  fire: number;
  water: number;
  earth: number;
  air: number;
}

export interface Diagnosis {
  title: string;
  archetype: string;
  description: string;
  elements: ElementProfile;
  isFallback?: boolean;
}

export interface Ritual {
  title: string;
  timing: string;
  candle: string;
  incense: string;
  stone: string;
  formula: string;
  steps: string[];
  isFallback?: boolean;
}

export interface TimelineStep {
  id: string;
  title: string;
  status: "planned" | "in-progress" | "completed";
  date: string;
  desc: string;
}

export interface MediaItem {
  id: string;
  type: "image" | "text";
  name: string;
  url?: string | null;
  content?: string | null;
}

export interface Investigation {
  id: string;
  title: string;
  archetype: string;
  description: string;
  createdDate: string;
  progress: number;
  timeline: TimelineStep[];
  media: MediaItem[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  isError?: boolean;
}

export interface GlossaryItem {
  term: string;
  cat: "elementi" | "pianeti" | "strumenti" | "concetti";
  desc: string;
}
