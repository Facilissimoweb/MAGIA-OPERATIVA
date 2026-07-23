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

export interface InvolvedPerson {
  id: string;
  name: string;
  role: "Operatore" | "Richiedente" | "Bersaglio" | "Soggetto Coinvolto" | string;
  birthDate?: string;
  notes?: string;
}

export interface FetishItem {
  id: string;
  name: string;
  type: "foto" | "testimone_fisico" | "feticcio" | "simulacro_proiettivo";
  description: string;
  imageUrl?: string;
  elementalAffinity?: "Fuoco" | "Acqua" | "Terra" | "Aria" | "Spirito" | string;
}

export interface ProtectiveBanishment {
  title: string;
  timing: string;
  targetProtection: string;
  candle: string;
  incense: string;
  stone: string;
  formula: string;
  steps: string[];
}

export interface TimelineStep {
  id: string;
  title: string;
  status: "planned" | "in-progress" | "completed";
  date: string;
  planetaryTiming?: string;
  desc: string;
  actionType?: "apertura" | "diagnosi" | "feticci" | "bando_protezione" | "operazione" | "risposta_analizzata" | string;
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
  
  // Structured Investigation Dossier Fields
  involvedPeople?: InvolvedPerson[];
  investigationQuestion?: string;
  diagnosis?: Diagnosis | null;
  fetishes?: FetishItem[];
  protectiveBanishment?: ProtectiveBanishment | null;
  
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
