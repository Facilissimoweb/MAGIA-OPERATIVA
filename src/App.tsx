import React, { useState, useEffect, useRef } from "react";
import {
  Compass,
  FolderSearch,
  Moon,
  Zap,
  MessageSquare,
  Book,
  Bookmark,
  Sparkles,
  Cpu,
  Flame,
  Droplets,
  Mountain,
  Wind,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FolderPlus,
  Wand2,
  ArrowLeft,
  Clock,
  PlusCircle,
  FolderOpen,
  Upload,
  X,
  FileText,
  Search,
  BookOpen,
  CheckCircle,
  HelpCircle,
  FileImage,
  Send,
  Share2,
  Download,
  Printer,
  Mail,
  MessageCircle,
  Menu,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Layers,
  ShieldCheck,
  Users,
  Link,
  Eye
} from "lucide-react";
import { jsPDF } from "jspdf";
import { getMoonPhaseData, MoonPhaseData } from "./utils/lunar";
import { GLOSSARY_DATABASE } from "./data/glossary";
import { ARCANI_MAGGIORI } from "./data/tarocchi";
import { Diagnosis, Ritual, Investigation, TimelineStep, MediaItem, ChatMessage, InvolvedPerson, FetishItem, ProtectiveBanishment } from "./types";

export default function App() {
  // Navigation & Engine Settings
  const [activeTab, setActiveTab] = useState<"diagnosi" | "dossier" | "luna" | "trance" | "egregora" | "glossario" | "grimorio" | "tarocchi">("diagnosi");
  const [engine, setEngine] = useState<"gemini" | "local">("gemini");
  const [isMoonBadgeFlash, setIsMoonBadgeFlash] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [operatorSignature, setOperatorSignature] = useState(() => {
    return localStorage.getItem("mo_operator_signature") || "Maria Teresa Rogani - Tarot Italia";
  });

  // Tarot State
  const [selectedTarotCardId, setSelectedTarotCardId] = useState<string | null>(null);
  const [tarotDrawType, setTarotDrawType] = useState<"single" | "three">("single");
  const [tarotQuestion, setTarotQuestion] = useState("");
  const [drawnCards, setDrawnCards] = useState<{ card: any; isReversed: boolean }[]>([]);
  const [tarotReading, setTarotReading] = useState<string | null>(null);
  const [isGeneratingReading, setIsGeneratingReading] = useState(false);
  const [tarotSubTab, setTarotSubTab] = useState<"compendio" | "stesa">("compendio");

  // Diagnosis State
  const [problemText, setProblemText] = useState("");
  const [intent, setIntent] = useState<"banishing" | "attraction" | "protection" | "transmutation">("banishing");
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);

  // Active Ritual State
  const [activeRitual, setActiveRitual] = useState<Ritual | null>(null);
  const [isGeneratingRitual, setIsGeneratingRitual] = useState(false);

  // Dossiers/Investigations State (Persistent)
  const [investigations, setInvestigations] = useState<Investigation[]>(() => {
    const saved = localStorage.getItem("mo_investigations");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: "inv-initial-1",
        title: "Operazione Sblocco Flusso Saturnino",
        archetype: "Saturno / Terra",
        description: "Indagine e manovra alchemica aperta per sciogliere blocchi materiali stagnanti e liberare il flusso economico represso.",
        createdDate: "2026-07-20",
        progress: 40,
        timeline: [
          {
            id: "st-1",
            title: "Apertura Fascicolo & Diagnosi",
            status: "completed",
            date: "2026-07-20",
            desc: "Problematica sottomessa all'Egregora. Rilevata forte rigidità Saturnina (Terra 85%) con scompensi dell'elemento Fuoco (Volontà)."
          },
          {
            id: "st-2",
            title: "Fumigazione e Bando di Pulizia",
            status: "in-progress",
            date: "2026-07-21",
            desc: "Impiegata resina di Mirra in Ora di Marte per tagliare i legami stagnanti residui dell'ambiente di lavoro."
          },
          {
            id: "st-3",
            title: "Focalizzazione e Proiezione Sigillo",
            status: "planned",
            date: "2026-07-22",
            desc: "Carica gnostica della Spada Caducea nella stazione di trance con Solfeggio chimica."
          }
        ],
        media: [
          {
            id: "m-initial-1",
            type: "text",
            name: "Equilibri_Astrali.txt",
            content: "Luna calante transita in Scorpione. Timing perfetto per riti di taglio, bando e interruzione dei legami restrittivi."
          }
        ]
      }
    ];
  });
  const [selectedInvId, setSelectedInvId] = useState<string | null>(null);

  // Linked Dossier ID for Egregora Chat
  const [linkedInvestigationId, setLinkedInvestigationId] = useState<string | null>(null);

  // Dossier Person Form State
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonRole, setNewPersonRole] = useState<string>("Richiedente");
  const [newPersonBirth, setNewPersonBirth] = useState("");
  const [newPersonNotes, setNewPersonNotes] = useState("");

  // Dossier Fetish Form State
  const [newFetishName, setNewFetishName] = useState("");
  const [newFetishType, setNewFetishType] = useState<"foto" | "testimone_fisico" | "feticcio" | "simulacro_proiettivo">("foto");
  const [newFetishElement, setNewFetishElement] = useState<"Fuoco" | "Acqua" | "Terra" | "Aria" | "Spirito">("Fuoco");
  const [newFetishDesc, setNewFetishDesc] = useState("");
  const [newFetishImgUrl, setNewFetishImgUrl] = useState("");

  // Timeline Step Modal State
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepStatus, setNewStepStatus] = useState<"planned" | "in-progress" | "completed">("planned");
  const [newStepDesc, setNewStepDesc] = useState("");

  // Egregora Chat State (Persistent)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("mo_chat");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: "greet",
        role: "model",
        text: "Salute a te, Operatore dell'Arte Ermetica. Io sono l'Egregora, la sintesi animica di questo Grimorio Operativo. Sotto quale transito astrale cerchi oggi la mia guida o corrispondenza?"
      }
    ];
  });
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Saved Rituals (Grimoire) State (Persistent)
  const [savedRituals, setSavedRituals] = useState<Ritual[]>(() => {
    const saved = localStorage.getItem("mo_grimoire");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Glossary State
  const [glossarySearch, setGlossarySearch] = useState("");
  const [glossaryCategory, setGlossaryCategory] = useState<"all" | "elementi" | "pianeti" | "strumenti" | "concetti">("all");

  // Lunar Calendar State
  const [selectedLunarDate, setSelectedLunarDate] = useState<Date>(new Date());
  const [displayedLunarMonth, setDisplayedLunarMonth] = useState<Date>(new Date());

  // Trance Stazione State
  const [chargePercent, setChargePercent] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0); // 0=In, 1=Hold Full, 2=Out, 3=Hold Empty
  const chargeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("mo_investigations", JSON.stringify(investigations));
  }, [investigations]);

  useEffect(() => {
    localStorage.setItem("mo_chat", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem("mo_grimoire", JSON.stringify(savedRituals));
  }, [savedRituals]);

  useEffect(() => {
    localStorage.setItem("mo_operator_signature", operatorSignature);
  }, [operatorSignature]);

  // Box Breathing cycle trainer timer
  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathPhase((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(breathInterval);
  }, []);

  // Web Audio Synth for Solfeggio tone (528Hz Transformation chime)
  const playMysticChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(528, ctx.currentTime); // Solfeggio Transformation and Love frequency
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 1.0);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.0);
    } catch (e) {
      console.warn("Audio synthesis not initialized (user interaction required first)", e);
    }
  };

  const playKeyClick = (pitch = 300) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  // Lunar Phase computations for current header & main pages
  const todayLunarData = getMoonPhaseData(new Date());
  const selectedLunarData = getMoonPhaseData(selectedLunarDate);

  // ----------------------------------------------------
  // ACTION HANDLERS
  // ----------------------------------------------------

  // 1. Submit problem for alchemical diagnosis
  const handleDiagnose = async () => {
    if (!problemText.trim()) return;
    setIsDiagnosing(true);
    playKeyClick(440);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: problemText, intent }),
      });
      const data = await res.json();
      setDiagnosis(data);
      // Automatically scroll to result or focus it
    } catch (e) {
      console.error("Diagnosis error:", e);
    } finally {
      setIsDiagnosing(false);
    }
  };

  // 2. Generate custom ritual script
  const handleGenerateRitual = async () => {
    if (!diagnosis) return;
    setIsGeneratingRitual(true);
    playKeyClick(600);

    try {
      const res = await fetch("/api/ritual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnosis }),
      });
      const data = await res.json();
      setActiveRitual(data);
      setActiveTab("grimorio"); // Move to view it
    } catch (e) {
      console.error("Ritual generation error:", e);
    } finally {
      setIsGeneratingRitual(false);
    }
  };

  // 3. Save Active Ritual to Grimoire Database
  const saveToGrimoire = (rit: Ritual) => {
    if (savedRituals.some((r) => r.title === rit.title)) {
      alert("Questa formula sacra è già custodita nel tuo Grimorio.");
      return;
    }
    setSavedRituals([rit, ...savedRituals]);
    playMysticChime();
    alert("Formula sacra inserita permanentemente nel Grimorio dell'Operatore.");
  };

  // 4. Dossier Creation from current Diagnosis
  const createDossierFromDiagnosis = () => {
    if (!diagnosis) return;
    playKeyClick(500);

    const todayStr = new Date().toISOString().split("T")[0];
    const newInv: Investigation = {
      id: `inv-${Date.now()}`,
      title: `Indagine: ${diagnosis.title}`,
      archetype: diagnosis.archetype,
      description: diagnosis.description,
      createdDate: todayStr,
      progress: 25,
      timeline: [
        {
          id: `st-new-1`,
          title: "Diagnosi Elementale ed Energetica",
          status: "completed",
          date: todayStr,
          desc: `Analisi iniziale completata via matrice esoterica. Archetipo prevalente: ${diagnosis.archetype}. Fuoco ${diagnosis.elements.fire}%, Acqua ${diagnosis.elements.water}%, Terra ${diagnosis.elements.earth}%, Aria ${diagnosis.elements.air}%.`
        },
        {
          id: `st-new-2`,
          title: "Allineamento della Volontà",
          status: "in-progress",
          date: todayStr,
          desc: "Identificazione del timing planetario ideale e preparazione dei suffumigi."
        },
        {
          id: `st-new-3`,
          title: "Trance di Caricamento Geometrico",
          status: "planned",
          date: todayStr,
          desc: "Incanalamento energetico del sigillo tracciato."
        }
      ],
      media: []
    };

    setInvestigations([newInv, ...investigations]);
    setSelectedInvId(newInv.id);
    setActiveTab("dossier");
  };

  // 5. Create blank custom dossier
  const createBlankDossier = () => {
    const title = prompt("Inserisci il titolo del nuovo Dossier d'Indagine:", "Operazione Purificazione Plesso");
    if (!title) return;

    const todayStr = new Date().toISOString().split("T")[0];
    const newInv: Investigation = {
      id: `inv-${Date.now()}`,
      title,
      archetype: "Generale / Intento Puro",
      description: "Nuovo dossier aperto dall'Operatore per coordinare, tracciare e caricare gli step di una pratica rituale complessa.",
      createdDate: todayStr,
      progress: 0,
      timeline: [
        {
          id: `st-${Date.now()}-1`,
          title: "Apertura Fascicolo",
          status: "completed",
          date: todayStr,
          desc: "Definizione dell'intento primordiale dell'opera magica."
        }
      ],
      media: []
    };

    setInvestigations([newInv, ...investigations]);
    setSelectedInvId(newInv.id);
  };

  // 6. Delete whole dossier
  const deleteDossier = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Sei sicuro di voler distruggere questo Dossier d'Indagine? Questa azione è irreversibile.")) return;
    setInvestigations(investigations.filter((inv) => inv.id !== id));
    if (selectedInvId === id) setSelectedInvId(null);
  };

  // 7. Add step to investigation timeline
  const addTimelineStep = () => {
    if (!newStepTitle.trim() || !selectedInvId) return;

    setInvestigations(
      investigations.map((inv) => {
        if (inv.id === selectedInvId) {
          const updatedTimeline = [
            ...inv.timeline,
            {
              id: `st-${Date.now()}`,
              title: newStepTitle,
              status: newStepStatus,
              date: new Date().toISOString().split("T")[0],
              desc: newStepDesc
            }
          ];

          // Recompute progress
          const completedCount = updatedTimeline.filter((s) => s.status === "completed").length;
          const progress = Math.round((completedCount / updatedTimeline.length) * 100);

          return {
            ...inv,
            timeline: updatedTimeline,
            progress
          };
        }
        return inv;
      })
    );

    // Reset inputs & close
    setNewStepTitle("");
    setNewStepDesc("");
    setNewStepStatus("planned");
    setIsStepModalOpen(false);
    playKeyClick(700);
  };

  // 8. Delete timeline step
  const deleteTimelineStep = (stepId: string) => {
    setInvestigations(
      investigations.map((inv) => {
        if (inv.id === selectedInvId) {
          const updatedTimeline = inv.timeline.filter((s) => s.id !== stepId);
          const completedCount = updatedTimeline.filter((s) => s.status === "completed").length;
          const progress = updatedTimeline.length ? Math.round((completedCount / updatedTimeline.length) * 100) : 0;

          return { ...inv, timeline: updatedTimeline, progress };
        }
        return inv;
      })
    );
  };

  // 9. File upload (Base64 storage in investigation media)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedInvId) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target?.result as string;
      const isImg = file.type.startsWith("image/");

      setInvestigations(
        investigations.map((inv) => {
          if (inv.id === selectedInvId) {
            const newItem: MediaItem = {
              id: `m-${Date.now()}`,
              type: isImg ? "image" : "text",
              name: file.name,
              url: isImg ? base64Data : null,
              content: isImg ? null : `File ${file.name} caricato con successo. Tipo: ${file.type}`
            };
            return {
              ...inv,
              media: [...inv.media, newItem]
            };
          }
          return inv;
        })
      );
      playKeyClick(650);
    };

    if (file.type.startsWith("image/")) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  // 10. Delete media file
  const deleteMedia = (mediaId: string) => {
    setInvestigations(
      investigations.map((inv) => {
        if (inv.id === selectedInvId) {
          return {
            ...inv,
            media: inv.media.filter((m) => m.id !== mediaId)
          };
        }
        return inv;
      })
    );
  };

  // 10a. Structured Dossier Management Handlers
  const addInvolvedPersonToInv = (invId: string) => {
    if (!newPersonName.trim()) return;
    const newP: InvolvedPerson = {
      id: `p-${Date.now()}`,
      name: newPersonName.trim(),
      role: newPersonRole,
      birthDate: newPersonBirth.trim() || undefined,
      notes: newPersonNotes.trim() || undefined
    };

    setInvestigations(prev => prev.map(inv => {
      if (inv.id === invId) {
        const people = [...(inv.involvedPeople || []), newP];
        return { ...inv, involvedPeople: people };
      }
      return inv;
    }));

    setNewPersonName("");
    setNewPersonBirth("");
    setNewPersonNotes("");
    playKeyClick(500);
  };

  const removeInvolvedPersonFromInv = (invId: string, personId: string) => {
    setInvestigations(prev => prev.map(inv => {
      if (inv.id === invId) {
        return {
          ...inv,
          involvedPeople: (inv.involvedPeople || []).filter(p => p.id !== personId)
        };
      }
      return inv;
    }));
  };

  const saveInvestigationQuestion = (invId: string, qText: string) => {
    setInvestigations(prev => prev.map(inv => {
      if (inv.id === invId) {
        return { ...inv, investigationQuestion: qText, description: qText };
      }
      return inv;
    }));
    playKeyClick(400);
  };

  const addFetishToInv = (invId: string) => {
    if (!newFetishName.trim()) return;
    const newF: FetishItem = {
      id: `f-${Date.now()}`,
      name: newFetishName.trim(),
      type: newFetishType,
      elementalAffinity: newFetishElement,
      description: newFetishDesc.trim() || "Testimone o feticcio impiegato nella proiezione energetica.",
      imageUrl: newFetishImgUrl.trim() || undefined
    };

    setInvestigations(prev => prev.map(inv => {
      if (inv.id === invId) {
        const fetishes = [...(inv.fetishes || []), newF];
        return { ...inv, fetishes };
      }
      return inv;
    }));

    setNewFetishName("");
    setNewFetishDesc("");
    setNewFetishImgUrl("");
    playKeyClick(500);
  };

  const removeFetishFromInv = (invId: string, fetishId: string) => {
    setInvestigations(prev => prev.map(inv => {
      if (inv.id === invId) {
        return {
          ...inv,
          fetishes: (inv.fetishes || []).filter(f => f.id !== fetishId)
        };
      }
      return inv;
    }));
  };

  const generateProtectiveBanishmentForInv = (invId: string) => {
    const inv = investigations.find(i => i.id === invId);
    if (!inv) return;

    const opSig = operatorSignature || "Maria Teresa Rogani (Operatore)";
    const peopleNames = (inv.involvedPeople && inv.involvedPeople.length > 0)
      ? inv.involvedPeople.map(p => `${p.name} (${p.role})`).join(", ")
      : "Operatore e Richiedente";

    const newBanish: ProtectiveBanishment = {
      title: `Bando Preliminare di Protezione Solenne per ${opSig}`,
      timing: "Da eseguire in Ora di Marte o Saturno, prima di ogni operazione magica o contatto con i feticci",
      targetProtection: `Schermatura integrale dell'Operatore (${opSig}) e dei soggetti (${peopleNames})`,
      candle: "Nera o Viola Scuro",
      incense: "Resina di Mirra, Benzoino e Salvia Bianca",
      stone: "Tormalina Nera, Ossidiana Nobile o Diaspro Rosso",
      formula: `Per la virtù del Cerchio Sacro e la sovranità della Volontà Inviolabile, io ${opSig} stabilisco un raggio di protezione impenetrabile attorno al mio tempio e alle parti coinvolte (${peopleNames}). Ogni larva, parassita astrale o influenza ostile è immediatamente bandita e dissolta nell'Aether primordiale. Nessuna forza disarmonica può varcare questa soglia. Così è, così sia.`,
      steps: [
        "Traccia un Cerchio di gesso o sale consacrato attorno alla stazione di lavoro.",
        "Accendi la candela di protezione e brucia suffumigio di Mirra e Salvia Bianca.",
        "Recita la formula incantatoria con voce ferma e centro addominale contratto.",
        "Visualizza una sfera di luce bianco-indaco impenetrabile che racchiude l'Operatore e il Richiedente."
      ]
    };

    setInvestigations(prev => prev.map(i => {
      if (i.id === invId) {
        const hasBanishStep = i.timeline.some(s => s.actionType === "bando_protezione" || s.title.includes("Bando"));
        let updatedTimeline = i.timeline;
        if (!hasBanishStep) {
          updatedTimeline = [
            ...i.timeline,
            {
              id: `st-banish-${Date.now()}`,
              title: "Bando Preliminare di Protezione",
              status: "completed",
              date: new Date().toISOString().split("T")[0],
              planetaryTiming: "Ora di Marte / Saturno",
              actionType: "bando_protezione",
              desc: `Bando di protezione solenne eseguito per ${opSig} e le parti coinvolte.`
            }
          ];
        }
        return { ...i, protectiveBanishment: newBanish, timeline: updatedTimeline };
      }
      return i;
    }));

    playMysticChime();
  };

  const calculatePlanetaryDatesForInv = (invId: string) => {
    const inv = investigations.find(i => i.id === invId);
    if (!inv) return;

    const baseDate = new Date();
    
    const stepTemplates = [
      {
        title: "1) Nomi e Dati Soggetti Coinvolti",
        offsetDays: 0,
        status: "completed" as const,
        timing: "Marte / Luna Crescente",
        desc: `Apertura fascicolo e archiviazione dati anagrafici e simbolici di Operatore e Richiedente.`
      },
      {
        title: "2) Domanda d'Indagine & Formulazione Quesito",
        offsetDays: 0,
        status: "completed" as const,
        timing: "Mercurio / Ora del Sole",
        desc: `Quesito: "${inv.investigationQuestion || inv.description}"`
      },
      {
        title: "3) Studio del Caso & Diagnosi Alchemica Generata",
        offsetDays: 1,
        status: "completed" as const,
        timing: "Giove / Luna Crescente",
        desc: `Analisi delle correnti elementali (Archetipo: ${inv.diagnosis?.archetype || inv.archetype}).`
      },
      {
        title: "4) Valutazione Feticci & Simulacri Immaginali",
        offsetDays: 2,
        status: "in-progress" as const,
        timing: "Luna / Ora di Venere",
        desc: `Preparazione e analisi proiettiva di foto, feticci e testimoni (${inv.fetishes?.length || 0} feticci caricati).`
      },
      {
        title: "5) Bando Preliminare di Protezione",
        offsetDays: 3,
        status: "in-progress" as const,
        timing: "Saturno / Luna Calante",
        desc: `Consacrazione dello scudo di protezione solenne per Operatore e parti coinvolte.`
      },
      {
        title: "6) Consacrazione Operativa & Carica Sigillo",
        offsetDays: 5,
        status: "planned" as const,
        timing: "Plenilunio / Ora del Sole",
        desc: `Operazione magica di trasmutazione, carica del sigillo e focalizzazione di trance.`
      },
      {
        title: "7) Sigillatura & Chiusura del Fascicolo",
        offsetDays: 8,
        status: "planned" as const,
        timing: "Giove / Luna Nuova",
        desc: `Verifica dei frutti manifestati e reintegrazione delle energie nel tempio.`
      }
    ];

    const updatedTimeline = stepTemplates.map((tpl, idx) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + tpl.offsetDays);
      const dateStr = d.toISOString().split("T")[0];
      const lunarInfo = getMoonPhaseData(d);

      return {
        id: `st-auto-${idx}-${Date.now()}`,
        title: tpl.title,
        status: tpl.status,
        date: dateStr,
        planetaryTiming: `${tpl.timing} • ${lunarInfo.phaseName} (${lunarInfo.zodiacName.split(" ")[0]})`,
        desc: tpl.desc
      };
    });

    const completedCount = updatedTimeline.filter(s => s.status === "completed").length;
    const progress = Math.round((completedCount / updatedTimeline.length) * 100);

    setInvestigations(prev => prev.map(i => {
      if (i.id === invId) {
        return { ...i, timeline: updatedTimeline, progress };
      }
      return i;
    }));

    playMysticChime();
  };

  // 10b. Export & Share functions
  const exportPDF = (inv: Investigation) => {
    const win = window.open("", "_blank");
    if (!win) {
      alert("I popup sono bloccati dal browser. Abilita i popup per visualizzare la stampa PDF.");
      return;
    }
    
    const timelineHTML = inv.timeline.map(step => `
      <div class="step-card">
        <div class="step-header">
          <span class="step-title">${step.title}</span>
          <span class="step-status status-${step.status}">${step.status === "completed" ? "Fatto" : step.status === "in-progress" ? "In Corso" : "Pianificato"}</span>
        </div>
        <div class="step-date">${step.date}</div>
        <div class="step-desc">${step.desc}</div>
      </div>
    `).join("");

    const mediaHTML = inv.media.map(item => `
      <div class="media-card">
        <span class="media-name">${item.name}</span>
        <span class="media-type">(${item.type})</span>
        ${item.type === "image" && item.url ? `<img src="${item.url}" class="media-img" />` : ""}
        ${item.type === "text" && item.content ? `<div class="media-content">${item.content}</div>` : ""}
      </div>
    `).join("");

    win.document.write(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <title>Dossier: ${inv.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #111827;
            margin: 0;
            padding: 40px;
            line-height: 1.6;
          }
          
          .header {
            border-bottom: 2px solid #dfb15b;
            padding-bottom: 20px;
            margin-bottom: 30px;
            text-align: center;
          }
          
          .system-title {
            font-family: 'Cinzel', serif;
            font-size: 11px;
            letter-spacing: 4px;
            color: #dfb15b;
            margin: 0 0 5px 0;
            text-transform: uppercase;
          }
          
          .title {
            font-family: 'Cinzel', serif;
            font-size: 24px;
            margin: 5px 0 10px 0;
            color: #111827;
          }
          
          .meta-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 15px;
            margin-bottom: 30px;
            font-size: 12px;
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          
          .meta-item strong {
            color: #374151;
          }
          
          .meta-item span {
            color: #111827;
            font-family: 'JetBrains Mono', monospace;
          }
          
          .description-box {
            border-left: 3px solid #dfb15b;
            padding-left: 15px;
            margin-bottom: 35px;
            font-style: italic;
            color: #374151;
            font-size: 14px;
          }
          
          .section-title {
            font-family: 'Cinzel', serif;
            font-size: 14px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
            margin-top: 40px;
            margin-bottom: 20px;
            color: #dfb15b;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          .step-card {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px dashed #e5e7eb;
          }
          
          .step-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
          }
          
          .step-title {
            font-weight: 600;
            font-size: 14px;
            color: #111827;
          }
          
          .step-status {
            font-size: 10px;
            text-transform: uppercase;
            padding: 3px 8px;
            border-radius: 12px;
            font-weight: bold;
          }
          
          .status-completed {
            background-color: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
          }
          
          .status-in-progress {
            background-color: #fffbeb;
            color: #b45309;
            border: 1px solid #fde68a;
          }
          
          .status-planned {
            background-color: #f3f4f6;
            color: #4b5563;
            border: 1px solid #e5e7eb;
          }
          
          .step-date {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            color: #6b7280;
            margin-bottom: 5px;
          }
          
          .step-desc {
            font-size: 13px;
            color: #4b5563;
          }
          
          .media-grid {
            display: grid;
            grid-template-cols: 1fr;
            gap: 20px;
          }
          
          .media-card {
            border: 1px solid #e5e7eb;
            padding: 15px;
            border-radius: 8px;
            background-color: #f9fafb;
          }
          
          .media-name {
            font-weight: 600;
            font-size: 12px;
            color: #111827;
          }
          
          .media-type {
            font-size: 10px;
            color: #6b7280;
            margin-left: 5px;
          }
          
          .media-img {
            max-width: 100%;
            max-height: 250px;
            display: block;
            margin-top: 10px;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
          }
          
          .media-content {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            background-color: #ffffff;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
            margin-top: 10px;
            white-space: pre-wrap;
            color: #374151;
          }
          
          .footer {
            margin-top: 60px;
            text-align: center;
            font-size: 10px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }

          .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: flex-end;
            text-align: right;
            page-break-inside: avoid;
          }
          .signature-box {
            display: inline-block;
            border-top: 1px solid #dfb15b;
            padding-top: 10px;
            min-width: 250px;
          }
          .signature-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #6b7280;
            margin-bottom: 6px;
          }
          .signature-value {
            font-family: 'Cinzel', serif;
            font-size: 13px;
            font-weight: bold;
            color: #111827;
            font-style: italic;
          }
          
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="system-title">MAGIA OPERATIVA • REPERTO ESOTERICO</h1>
          <h2 class="title">${inv.title}</h2>
        </div>
        
        <div class="meta-grid">
          <div class="meta-item"><strong>ARCHETIPO:</strong> <span>${inv.archetype}</span></div>
          <div class="meta-item"><strong>DATA APERTURA:</strong> <span>${inv.createdDate}</span></div>
          <div class="meta-item"><strong>PROGRESSO:</strong> <span>${inv.progress}%</span></div>
          <div class="meta-item"><strong>FASCICOLO ID:</strong> <span>${inv.id}</span></div>
        </div>
        
        <div class="description-box">
          "${inv.description}"
        </div>
        
        <div class="section-title">Timeline delle Operazioni</div>
        <div class="timeline-container">
          ${timelineHTML || '<p style="font-size:12px; color:#6b7280; font-style:italic;">Nessuno step registrato.</p>'}
        </div>
        
        <div class="section-title">Reperti e Allegati</div>
        <div class="media-grid">
          ${mediaHTML || '<p style="font-size:12px; color:#6b7280; font-style:italic;">Nessun reperto allegato.</p>'}
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-label">Operatore dell'Arte / Titolare</div>
            <div class="signature-value">${operatorSignature}</div>
          </div>
        </div>
        
        <div class="footer">
          Fascicolo autogestito tramite Magia Operativa - Sistema Operativo Esoterico • Tarot Italia.
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    win.document.close();
  };

  const exportJSON = (inv: Investigation) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inv, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Dossier_${inv.title.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportTXT = (inv: Investigation) => {
    let text = `==================================================\n`;
    text += `   MAGIA OPERATIVA - SISTEMA OPERATIVO ESOTERICO   \n`;
    text += `==================================================\n\n`;
    text += `DOSSIER: ${inv.title}\n`;
    text += `ARCHETIPO: ${inv.archetype}\n`;
    text += `DATA DI APERTURA: ${inv.createdDate}\n`;
    text += `PROGRESSO: ${inv.progress}%\n`;
    text += `ID FASCICOLO: ${inv.id}\n\n`;
    text += `DESCRIZIONE:\n"${inv.description}"\n\n`;
    text += `--------------------------------------------------\n`;
    text += `            TIMELINE DELLE OPERAZIONI             \n`;
    text += `--------------------------------------------------\n`;
    
    if (inv.timeline.length === 0) {
      text += `Nessuna fase registrata.\n`;
    } else {
      inv.timeline.forEach((step, idx) => {
        text += `[${idx + 1}] ${step.date} - ${step.title}\n`;
        text += `    Stato: ${step.status === "completed" ? "Fatto" : step.status === "in-progress" ? "In Corso" : "Pianificato"}\n`;
        text += `    Nota: ${step.desc}\n\n`;
      });
    }
    
    text += `--------------------------------------------------\n`;
    text += `                REPERTI ED ALLEGATI               \n`;
    text += `--------------------------------------------------\n`;
    
    if (inv.media.length === 0) {
      text += `Nessun reperto salvato.\n`;
    } else {
      inv.media.forEach((file) => {
        text += `- Nome: ${file.name}\n`;
        text += `  Tipo: ${file.type}\n`;
        if (file.type === "text" && file.content) {
          text += `  Contenuto: ${file.content}\n`;
        }
        text += `\n`;
      });
    }
    
    text += `==================================================\n`;
    text += `FIRMA DELL'OPERATORE:\n`;
    text += `${operatorSignature}\n`;
    text += `==================================================\n`;

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Dossier_${inv.title.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const shareWhatsApp = (inv: Investigation) => {
    const text = `*MAGIA OPERATIVA - DOSSIER* 🔮\n\n*Titolo:* ${inv.title}\n*Archetipo:* ${inv.archetype}\n*Progresso:* ${inv.progress}%\n\n"${inv.description}"\n\n*Timeline delle Operazioni:*\n${inv.timeline.map((t, idx) => `${idx + 1}. [${t.status === "completed" ? "✅ Fatto" : t.status === "in-progress" ? "⏳ In Corso" : "📌 Pianificato"}] *${t.title}*: ${t.desc}`).join("\n")}\n\n_A cura di: ${operatorSignature}_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const shareEmail = (inv: Investigation) => {
    const subject = `Magia Operativa - Dossier: ${inv.title}`;
    const body = `SISTEMA OPERATIVO ESOTERICO - DOSSIER D'INDAGINE: ${inv.title}\nARCHETIPO: ${inv.archetype}\nDATA APERTURA: ${inv.createdDate}\nPROGRESSO: ${inv.progress}%\n\nDESCRIZIONE:\n"${inv.description}"\n\nTIMELINE DELLE OPERAZIONI:\n${inv.timeline.map((t, idx) => `${idx + 1}. [${t.status === "completed" ? "Fatto" : t.status === "in-progress" ? "In Corso" : "Pianificato"}] ${t.title}: ${t.desc}`).join("\n\n")}\n\n==================================================\nFirma dell'Operatore:\n${operatorSignature}\nTarot Italia.`;
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_self");
  };

  // 11. Send Chat Message to Egregora
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}-user`,
      role: "user",
      text: chatInput
    };

    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setChatInput("");
    setIsChatting(true);
    playKeyClick(400);

    // Prepare active dossier context if linked or selected
    const activeInvId = linkedInvestigationId || selectedInvId;
    const activeInv = activeInvId ? investigations.find(i => i.id === activeInvId) : null;

    let dossierContextPayload = undefined;
    if (activeInv) {
      const peopleStr = (activeInv.involvedPeople && activeInv.involvedPeople.length > 0)
        ? activeInv.involvedPeople.map(p => `${p.name} (${p.role}${p.birthDate ? `, nascita: ${p.birthDate}` : ''})`).join("; ")
        : "Operatore";

      const fetishesStr = (activeInv.fetishes && activeInv.fetishes.length > 0)
        ? activeInv.fetishes.map(f => `${f.name} [Tipo: ${f.type}, Elemento: ${f.elementalAffinity || 'N/A'}]: ${f.description}`).join("; ")
        : "Nessun feticcio/simulacro caricato";

      const protectionStr = activeInv.protectiveBanishment
        ? `Formula: "${activeInv.protectiveBanishment.formula}" - Target: ${activeInv.protectiveBanishment.targetProtection}`
        : "Bando preliminare non ancora generato";

      dossierContextPayload = {
        title: activeInv.title,
        people: peopleStr,
        question: activeInv.investigationQuestion || activeInv.description,
        diagnosis: activeInv.diagnosis ? `${activeInv.diagnosis.archetype}: ${activeInv.diagnosis.description}` : activeInv.archetype,
        fetishes: fetishesStr,
        protection: protectionStr
      };
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: updatedHistory.slice(-10),
          dossierContext: dossierContextPayload
        }),
      });

      if (!res.ok) {
        throw new Error(`Il server ha risposto con stato ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Il server ha risposto con formato non valido (${contentType || "sconosciuto"})`);
      }

      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}-bot`,
          role: "model",
          text: data.response || "L'Egregora rimane in silenzio. Verifica le tue impostazioni o riprova.",
          isError: data.isError
        }
      ]);
      playKeyClick(500);

      // Auto scroll to bottom of the chat list
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (e: any) {
      console.error("Chat error:", e);
      setChatHistory((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}-bot-err`,
          role: "model",
          text: `Errore di Connessione: ${e.message || "Impossibile contattare l'Egregora. Verifica la tua connessione di rete."}`,
          isError: true
        }
      ]);
      // Auto scroll to bottom of the chat list
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } finally {
      setIsChatting(false);
    }
  };

  // Voice input recognition helpers (Assicura audio input)
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Il tuo browser o dispositivo non supporta l'inserimento vocale. Prova ad usare Chrome, Safari o Edge.");
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "it-IT";

      rec.onstart = () => {
        setIsListening(true);
        playKeyClick(200);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput((prev) => (prev ? prev + " " + transcript : transcript));
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Text-to-speech helpers (Ascolta risposta)
  const speakMessage = (text: string, msgId: string) => {
    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel(); // Stoppa l'audio corrente

    const cleanText = text.replace(/[*#_`]/g, ""); // Pulisce i caratteri markdown prima della lettura vocale
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "it-IT";
    utterance.rate = 1.05;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // PDF Export for chat (Scarica la chat in PDF)
  const downloadSingleMessagePDF = (msg: ChatMessage) => {
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(124, 58, 237); // Viola esoterico
      doc.text("RESPONSO SOLENNE DELL'EGREGORA", 20, 20);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Estratto del responso generato il: ${new Date().toLocaleDateString("it-IT")} alle ${new Date().toLocaleTimeString("it-IT")}`, 20, 26);
      doc.text(`Operatore: ${operatorSignature}`, 20, 31);

      const activeInvId = linkedInvestigationId || selectedInvId;
      const activeInv = activeInvId ? investigations.find(i => i.id === activeInvId) : null;
      let yStart = 37;

      if (activeInv) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(223, 177, 91); // Oro
        doc.text(`CASO/DOSSIER COLLEGATO: ${activeInv.title} (ID: ${activeInv.id})`, 20, yStart);
        yStart += 6;
      }

      doc.setDrawColor(226, 232, 240);
      doc.line(20, yStart, 190, yStart);
      yStart += 10;

      let yPos = yStart;
      doc.setFont("times", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(51, 65, 85);

      const lines = doc.splitTextToSize(msg.text, 170);
      lines.forEach((line: string) => {
        if (yPos > 275) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 20, yPos);
        yPos += 5.5;
      });

      doc.save(`Responso_Egregora_${Date.now()}.pdf`);
      playMysticChime();
    } catch (err: any) {
      console.error("Single message PDF generation failed:", err);
      alert(`Impossibile generare il PDF: ${err.message || err}`);
    }
  };

  const downloadChatPDF = () => {
    try {
      const doc = new jsPDF();

      // Intestazione con lo stile "Arte Ermetica"
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(124, 58, 237); // Colore viola
      doc.text("IL DIALOGO INTEGRALE CON L'EGREGORA", 20, 20);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Documento ufficiale generato il: ${new Date().toLocaleDateString("it-IT")} alle ${new Date().toLocaleTimeString("it-IT")}`, 20, 26);
      doc.text(`Firma dell'Operatore: ${operatorSignature}`, 20, 31);

      const activeInvId = linkedInvestigationId || selectedInvId;
      const activeInv = activeInvId ? investigations.find(i => i.id === activeInvId) : null;
      let yDivider = 35;

      if (activeInv) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(223, 177, 91);
        doc.text(`DOSSIER ASSOCIATO AL CONTESTO: ${activeInv.title}`, 20, 37);
        yDivider = 42;
      }

      // Linea divisoria
      doc.setDrawColor(226, 232, 240);
      doc.line(20, yDivider, 190, yDivider);

      let yPos = yDivider + 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      chatHistory.forEach((msg) => {
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }

        const roleHeader = msg.role === "user" ? "OPERATORE (TU):" : "L'EGREGORA (AI):";
        doc.setFont("helvetica", "bold");
        if (msg.role === "user") {
          doc.setTextColor(17, 24, 39);
        } else {
          doc.setTextColor(124, 58, 237);
        }
        doc.text(roleHeader, 20, yPos);
        yPos += 5.5;

        doc.setFont("times", "normal");
        doc.setTextColor(51, 65, 85);

        // Splitta il testo per farlo stare nei margini del foglio A4
        const lines = doc.splitTextToSize(msg.text, 170);
        lines.forEach((line: string) => {
          if (yPos > 275) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 20, yPos);
          yPos += 5.5;
        });

        yPos += 4.5; // Margine tra i messaggi
      });

      doc.save(`Dialogo_Egregora_${new Date().toISOString().split("T")[0]}.pdf`);
      playMysticChime();
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      alert(`Impossibile generare il PDF: ${err.message || err}`);
    }
  };

  // 12. Clear chat memory
  const clearChat = () => {
    if (confirm("Desideri svuotare la memoria dei dialoghi con l'Egregora?")) {
      setChatHistory([
        {
          id: "greet",
          role: "model",
          text: "La memoria è fluida come il mercurio. Dialogo azzerato. Sono pronta a ricominciare l'allineamento con la tua mente, Operatore."
        }
      ]);
    }
  };

  // TAROT DRAW LOGIC
  const handleDrawTarot = async () => {
    if (isGeneratingReading) return;
    setIsGeneratingReading(true);
    setTarotReading(null);
    playKeyClick(600);

    const count = tarotDrawType === "single" ? 1 : 3;
    const shuffled = [...ARCANI_MAGGIORI].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count).map((card) => ({
      card,
      isReversed: Math.random() < 0.5
    }));

    setDrawnCards(selected);

    const prompt = `Esegui una lettura rituale ed esoterica dei Tarocchi per la mia domanda: "${tarotQuestion || "Quale influsso energetico guida il mio cammino?"}".
Ho estratto le seguenti carte degli Arcani Maggiori del mazzo Rider-Waite-Smith:
${selected.map((dc, index) => `${index + 1}. Card: ${dc.card.name} (${dc.isReversed ? "Capovolta" : "Diritta"}) - Parole chiave: ${dc.card.keywords.join(", ")}\nSignificato generale: ${dc.isReversed ? dc.card.capovolta : dc.card.diritta}\nElemento ed Astrologia: ${dc.card.element} • ${dc.card.astrology}`).join("\n\n")}

Fornisci una risposta formattata splendidamente in Italiano con un tono estremamente solenne, ermetico, saggio e costruttivo (come l'Egregora dell'Alta Magia Operativa). Strutturala esattamente in questi quattro paragrafi ben definiti:
- 🌌 INTERPRETAZIONE ENERGETICA (Sintesi ermetica della stesa rispetto all'intento)
- 🎴 ANALISI DELLE CARTE E SIMBOLISMO (Esamina con cura ogni carta estratta, il suo simbolismo esoterico e il suo orientamento)
- 🧪 CONSIGLIO ALCHEMICO OPERATIVO (Un'azione pratica, visualizzazione, meditazione o rito consigliato in base agli elementi emersi per trasmutare l'energia)
- 🧭 DOMANDA MAIEUTICA (Una domanda profonda e penetrante per spronare l'Operatore all'azione consapevole)`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          history: []
        })
      });

      if (!res.ok) throw new Error("Server responded with error status");
      const data = await res.json();
      setTarotReading(data.response);
      playMysticChime();
    } catch (e: any) {
      console.error("Tarot reading fetch error:", e);
      let fallbackText = `🌌 **INTERPRETAZIONE ENERGETICA**\nLa tua domanda "${tarotQuestion || "Quale influsso energetico guida il mio cammino?"}" risuona profondamente nei piani astrali. L'estrazione rileva una forte concentrazione di energie di tipo ${selected.map(s => s.card.element).join(" / ")}. Nonostante la disconnessione della rete dall'Egregora, la saggezza dei simboli incisi si manifesta ugualmente nel tempio.\n\n🎴 **ANALISI DELLE CARTE E SIMBOLISMO**\n`;
      
      selected.forEach((dc, idx) => {
        const orientation = dc.isReversed ? "Capovolta" : "Diritta";
        fallbackText += `\n*Carta ${idx + 1}: ${dc.card.name} (${orientation})* — parole chiave: ${dc.card.keywords.join(", ")}.\nSignificato: ${dc.isReversed ? dc.card.capovolta : dc.card.diritta}\nSimbolismo chiave: ${dc.card.symbolism.map(s => `**${s.item}** (${s.meaning})`).join(", ")}.\n`;
      });

      fallbackText += `\n🧪 **CONSIGLIO ALCHEMICO OPERATIVO**\nMedita sulle carte estratte e sui loro colori dominanti (principalmente ${selected.map(s => s.card.color).join(" / ")}). Utilizza l'Elemento ${selected[0].card.element} per canalizzare o bandire le resistenze riscontrate. Accogli l'energia nella tua sfera personale seguendo questa guida: ${selected[0].card.accogliere.personale}\n\n🧭 **DOMANDA MAIEUTICA**\nSei pronto ad accogliere la verità celata nei tuoi simboli interiori per agire come unico sovrano del tuo destino?`;

      setTarotReading(fallbackText);
      playMysticChime();
    } finally {
      setIsGeneratingReading(false);
    }
  };

  // 13. Dynamic Interactive Sigil Press and Hold charging
  const startCharging = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsCharging(true);
    playKeyClick(528);

    chargeIntervalRef.current = setInterval(() => {
      setChargePercent((prev) => {
        if (prev >= 100) {
          clearInterval(chargeIntervalRef.current!);
          setIsCharging(false);
          playMysticChime();
          // Flash moon badge in header as a sweet minor visual easter egg
          setIsMoonBadgeFlash(true);
          setTimeout(() => setIsMoonBadgeFlash(false), 2000);
          return 100;
        }
        return prev + 1;
      });
    }, 45);
  };

  const stopCharging = () => {
    setIsCharging(false);
    if (chargeIntervalRef.current) {
      clearInterval(chargeIntervalRef.current);
    }
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    };
  }, []);


  // ----------------------------------------------------
  // CALENDAR DAYS COMPILER
  // ----------------------------------------------------
  const getDaysInMonthGrid = () => {
    const year = displayedLunarMonth.getFullYear();
    const month = displayedLunarMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();

    // Adjust start day index (Monday as 0, Sunday as 6)
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const cells = [];
    // Spacers
    for (let i = 0; i < startOffset; i++) {
      cells.push(null);
    }
    // Real days
    for (let d = 1; d <= numDays; d++) {
      cells.push(new Date(year, month, d));
    }
    return cells;
  };

  const handleMonthChange = (offset: number) => {
    const d = new Date(displayedLunarMonth);
    d.setMonth(d.getMonth() + offset);
    setDisplayedLunarMonth(d);
    playKeyClick(350);
  };

  const calendarDays = getDaysInMonthGrid();
  const monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  // Glossary filter helper
  const filteredGlossary = GLOSSARY_DATABASE.filter((item) => {
    const matchesCat = glossaryCategory === "all" || item.cat === glossaryCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.desc.toLowerCase().includes(glossarySearch.toLowerCase());
    return matchesCat && matchesSearch;
  });


  return (
    <div className="min-h-screen bg-[#080612] text-[#e2e8f0] font-sans selection:bg-[#dfb15b]/30 selection:text-[#dfb15b] flex flex-col justify-between">
      
      {/* HAMBURGER DRAWER MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex" id="hamburger-menu-container">
          {/* Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 bg-[#080612]/85 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => { setIsMenuOpen(false); playKeyClick(300); }}
            id="menu-backdrop"
          />
          
          {/* Menu Panel Drawer */}
          <div 
            className="relative w-72 max-w-[85vw] h-full bg-[#0d0a1d] border-r border-[#2b244d] p-5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto"
            id="menu-drawer"
          >
            <div className="space-y-6">
              {/* Drawer Title & Close Button */}
              <div className="flex items-center justify-between border-b border-[#2b244d]/60 pb-3">
                <div>
                  <h2 className="font-serif text-[#dfb15b] font-bold text-sm tracking-widest uppercase">
                    Grimorio Arcano
                  </h2>
                  <p className="text-[9px] text-purple-400/80 font-mono tracking-widest uppercase">
                    Menù Navigazione
                  </p>
                </div>
                <button
                  onClick={() => { setIsMenuOpen(false); playKeyClick(300); }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#dfb15b] hover:bg-[#120f24] border border-transparent hover:border-[#2b244d]/60 transition-all cursor-pointer"
                  id="close-menu-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Options List */}
              <div className="space-y-1.5">
                {[
                  { id: "diagnosi", label: "Diagnosi Elementale", icon: Compass, desc: "Firma Alchemica & Transiti" },
                  { id: "dossier", label: "Dossier d'Indagine", icon: FolderSearch, desc: "Gestione Fascicoli & Reperti" },
                  { id: "luna", label: "Calendario Lunare", icon: Moon, desc: "Fasi Lunari & Transiti" },
                  { id: "trance", label: "Stazione Trance", icon: Zap, desc: "Respirazione & Carica Sigillo" },
                  { id: "tarocchi", label: "Lettura dei Tarocchi", icon: Layers, desc: "Guida Arcani Maggiori & Stese" },
                  { id: "egregora", label: "Egregora Chat", icon: MessageSquare, desc: "Sintesi Animica dell'Opera" },
                  { id: "glossario", label: "Glossario Alchemico", icon: Book, desc: "Terminologia ed Elementi" },
                  { id: "grimorio", label: "Grimorio Formule", icon: Bookmark, desc: "Custodia Rituali Sacri" }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === "egregora" ? isChatOpen : activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === "egregora") {
                          setIsMenuOpen(false);
                          setIsChatOpen(true);
                          playKeyClick(400);
                          return;
                        }
                        setActiveTab(item.id as any);
                        setSelectedInvId(null);
                        setIsMenuOpen(false);
                        playKeyClick(300 + (isActive ? 100 : 0));
                      }}
                      className={`w-full flex items-center space-x-3.5 p-3 rounded-xl border transition-all text-left cursor-pointer group ${
                        isActive
                          ? "bg-[#1d1736] border-[#dfb15b]/80 text-[#dfb15b] shadow-md shadow-[#dfb15b]/5"
                          : "bg-[#120f24]/40 border-[#2b244d]/50 text-gray-400 hover:border-[#dfb15b]/30 hover:text-gray-200 hover:bg-[#120f24]"
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive ? "bg-[#dfb15b]/10 text-[#dfb15b]" : "bg-[#080612] text-gray-500 group-hover:text-[#dfb15b]/80"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-serif text-xs font-bold leading-tight tracking-wide">{item.label}</div>
                        <div className="text-[9px] text-gray-500 font-sans mt-0.5 group-hover:text-gray-400 transition-colors">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Esoteric Footer Info inside Sidebar */}
            <div className="border-t border-[#2b244d]/60 pt-4 mt-6 space-y-2">
              <div className="bg-[#080612]/60 p-2.5 rounded-lg border border-[#2b244d]/40 flex items-center justify-between text-[10px]">
                <div className="flex items-center space-x-1.5 text-gray-400">
                  <Moon className="w-3.5 h-3.5 text-[#dfb15b]" />
                  <span>Luna Odierna:</span>
                </div>
                <span className="font-mono text-[#dfb15b] font-semibold">{todayLunarData.phaseName.split(" ")[0]} ({todayLunarData.illumination}%)</span>
              </div>
              <div className="text-[8px] text-center text-gray-600 font-mono uppercase tracking-widest">
                Stato: Connessione Egregora Attiva
              </div>
            </div>
          </div>
        </div>
      )}
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-[#080612]/95 backdrop-blur-md border-b border-[#2b244d]/70 px-4 py-3 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {/* Hamburger Button */}
            <button
              onClick={() => { setIsMenuOpen(true); playKeyClick(350); }}
              className="text-[#dfb15b] hover:text-[#dfb15b]/80 p-1.5 bg-[#120f24] border border-[#2b244d] rounded-lg transition-all focus:outline-none cursor-pointer hover:border-[#dfb15b]/50"
              aria-label="Menu"
              id="hamburger-btn"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => { setActiveTab("diagnosi"); setSelectedInvId(null); }}>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-[#dfb15b]/60 flex items-center justify-center bg-[#120f24] gold-border-glow animate-pulse">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#dfb15b]" />
              </div>
              <div>
                <h1 className="font-serif text-xs md:text-sm font-bold tracking-widest text-[#dfb15b] gold-text-glow leading-none">
                  MAGIA OPERATIVA
                </h1>
                <p className="text-[8px] md:text-[9px] text-gray-400 mt-0.5 tracking-widest uppercase">
                  Sistema di Indagine ed Egregora
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Quick Lunar Transit Badge */}
            <button
              onClick={() => { setActiveTab("luna"); playKeyClick(400); }}
              className={`text-[10px] px-2.5 py-1 rounded-full border border-[#2b244d] bg-[#120f24] text-[#dfb15b] flex items-center space-x-1.5 hover:border-[#dfb15b] transition-all duration-300 ${
                isMoonBadgeFlash ? "bg-[#dfb15b]/25 border-[#dfb15b] scale-105" : ""
              }`}
              title="Apri Calendario Lunare"
            >
              <Moon className="w-3.5 h-3.5 text-[#dfb15b]" />
              <span className="font-semibold font-mono">{todayLunarData.phaseName.split(" ")[0]} {todayLunarData.illumination}%</span>
            </button>

          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-10 pb-48 space-y-12 overflow-x-hidden">

        {/* 1. VIEW: DIAGNOSI */}
        {activeTab === "diagnosi" && (
          <div className="space-y-4 animate-fadeIn">
            {/* Introductory Mythological Card */}
            <div className="bg-[#120f24] border border-[#2b244d] p-4 rounded-xl relative overflow-hidden shadow-xl">
              <div className="absolute -right-6 -bottom-6 opacity-5 text-[#dfb15b] pointer-events-none">
                <Compass className="w-36 h-36" />
              </div>
              <span className="text-[9px] text-[#dfb15b] uppercase tracking-widest font-bold block mb-1">
                Architettura Energetica
              </span>
              <h2 className="font-serif text-base font-bold text-white mb-1.5">
                Analizzatore di Firma Alchemica
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                Descrivi una problematica densa (blocchi fisici, ansia emotiva, ristagni lavorativi). L'Egregora effettuerà una diagnosi del profilo elementale, mapperà le influenze planetarie e forgerà la ritualità correttiva.
              </p>
            </div>

            {/* Input Form Card */}
            <div className="bg-[#120f24] border border-[#2b244d]/80 rounded-xl p-4 space-y-4 shadow-xl">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 flex justify-between">
                  <span>Situazione / Ostacolo da Manovrare</span>
                  <span className="text-[#dfb15b] text-[10px] font-mono">Matrice di indagine</span>
                </label>
                <textarea
                  id="problem-text-area"
                  rows={4}
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  placeholder="Es. Riscontro un persistente blocco emotivo e un senso di ansia soffocante che mi impedisce di evolvere a livello creativo. Avverto forti interferenze esterne e apatia..."
                  className="w-full bg-[#080612]/90 border border-[#2b244d] rounded-lg p-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#dfb15b] focus:ring-1 focus:ring-[#dfb15b] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">Inclinazione dell'Atto</label>
                  <select
                    value={intent}
                    onChange={(e) => setIntent(e.target.value as any)}
                    className="w-full bg-[#080612] border border-[#2b244d] rounded-lg p-2.5 text-xs text-gray-200 focus:border-[#dfb15b] focus:outline-none cursor-pointer"
                  >
                    <option value="banishing">Dissipazione / Bando</option>
                    <option value="attraction">Attrazione / Propiziazione</option>
                    <option value="protection">Scudo / Protezione Attiva</option>
                    <option value="transmutation">Trasmutazione Alchemica</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">Obiettivo Strutturale</label>
                  <div className="bg-[#080612] border border-[#2b244d] p-2 rounded-lg text-center text-xs text-gray-300 select-none">
                    <span className="font-semibold text-[#dfb15b] font-serif uppercase tracking-widest text-[9px]">Dossier & Rituale</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDiagnose}
                disabled={isDiagnosing || !problemText.trim()}
                className="w-full bg-gradient-to-r from-[#dfb15b] via-[#e2be75] to-amber-600 hover:brightness-110 disabled:brightness-50 text-[#080612] font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                {isDiagnosing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#080612] border-t-transparent rounded-full animate-spin"></span>
                    <span className="font-serif tracking-widest text-xs">Consultazione Matrix...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="font-serif tracking-widest text-xs uppercase">Analizza & Genera Operatività</span>
                  </>
                )}
              </button>
            </div>

            {/* DIAGNOSIS RESULT CONTAINER */}
            {diagnosis && (
              <div className="bg-[#120f24] border border-[#dfb15b]/40 rounded-xl p-4 space-y-4 shadow-xl gold-border-glow animate-fadeIn">
                <div className="flex justify-between items-start border-b border-[#2b244d]/60 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#dfb15b] font-bold">Diagnosi Conclusa</span>
                    <h3 className="font-serif text-base font-bold text-white mt-0.5">{diagnosis.title}</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-900/40 border border-[#7c3aed] text-purple-300 rounded-full text-[10px] font-semibold font-mono">
                    {diagnosis.archetype}
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed italic border-l-2 border-[#dfb15b] pl-3">
                  "{diagnosis.description}"
                </p>

                {/* Elemental Bars */}
                <div className="space-y-3 pt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Profilo Elementale Rilevato</span>
                  
                  <div className="space-y-2">
                    {/* Fire Bar */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-red-400 flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> Fuoco (Volontà / Azione)</span>
                        <span className="font-bold">{diagnosis.elements.fire}%</span>
                      </div>
                      <div className="w-full bg-[#080612] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full transition-all duration-1000" style={{ width: `${diagnosis.elements.fire}%` }} />
                      </div>
                    </div>

                    {/* Water Bar */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-cyan-400 flex items-center gap-1"><Droplets className="w-3.5 h-3.5" /> Acqua (Emozione / Flusso)</span>
                        <span className="font-bold">{diagnosis.elements.water}%</span>
                      </div>
                      <div className="w-full bg-[#080612] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full transition-all duration-1000" style={{ width: `${diagnosis.elements.water}%` }} />
                      </div>
                    </div>

                    {/* Earth Bar */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-amber-500 flex items-center gap-1"><Mountain className="w-3.5 h-3.5" /> Terra (Materia / Struttura)</span>
                        <span className="font-bold">{diagnosis.elements.earth}%</span>
                      </div>
                      <div className="w-full bg-[#080612] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-600 h-full rounded-full transition-all duration-1000" style={{ width: `${diagnosis.elements.earth}%` }} />
                      </div>
                    </div>

                    {/* Air Bar */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-indigo-300 flex items-center gap-1"><Wind className="w-3.5 h-3.5" /> Aria (Intelletto / Idee)</span>
                        <span className="font-bold">{diagnosis.elements.air}%</span>
                      </div>
                      <div className="w-full bg-[#080612] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-indigo-400 h-full rounded-full transition-all duration-1000" style={{ width: `${diagnosis.elements.air}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fallback alert if applicable */}
                {diagnosis.isFallback && (
                  <div className="text-[10px] text-amber-300/80 bg-amber-950/20 border border-amber-800/40 p-2 rounded-lg leading-relaxed font-mono">
                    * Risposta elaborata tramite Algoritmo Ermetico Locale. Per abilitare l'AI predittiva ad ampio raggio, configura la tua chiave segreta in Impostazioni.
                  </div>
                )}

                {/* Sub-actions */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#2b244d]/50">
                  <button
                    onClick={handleGenerateRitual}
                    disabled={isGeneratingRitual}
                    className="bg-[#7c3aed]/20 hover:bg-[#7c3aed]/35 border border-[#7c3aed] text-purple-200 font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    {isGeneratingRitual ? (
                      <span className="w-3.5 h-3.5 border-2 border-purple-200 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Wand2 className="w-3.5 h-3.5" />
                    )}
                    <span className="font-serif">Crea Formula Rito</span>
                  </button>

                  <button
                    onClick={createDossierFromDiagnosis}
                    className="bg-[#dfb15b]/10 hover:bg-[#dfb15b]/20 border border-[#dfb15b]/50 text-[#dfb15b] font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span className="font-serif">Apri Fascicolo Indagine</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsChatOpen(true);
                      setChatInput(`Vorrei discutere la mia diagnosi: "${diagnosis.title}" (Archetipo ${diagnosis.archetype}). Come posso riequilibrare i miei elementi?`);
                      playKeyClick(400);
                    }}
                    className="col-span-2 mt-1 w-full bg-gradient-to-r from-[#dfb15b]/15 to-[#7c3aed]/15 hover:from-[#dfb15b]/25 hover:to-[#7c3aed]/25 border border-[#dfb15b]/35 text-[#dfb15b] font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#dfb15b]" />
                    <span className="font-serif">Discuti la Diagnosi con l'Egregora</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. VIEW: DOSSIER ARCHIVE */}
        {activeTab === "dossier" && (
          <div className="space-y-4 animate-fadeIn">
            {!selectedInvId ? (
              <>
                <div className="bg-[#120f24] border border-[#2b244d] p-4 rounded-xl flex justify-between items-center shadow-lg">
                  <div>
                    <span className="text-[9px] text-[#dfb15b] uppercase tracking-widest font-bold block">
                      Memoria del Grimorio
                    </span>
                    <h2 className="font-serif text-base font-bold text-white">Dossier Indagine Attivi</h2>
                  </div>
                  <button
                    onClick={createBlankDossier}
                    className="bg-[#dfb15b] text-[#080612] px-3 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="font-serif">Nuovo Dossier</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {investigations.length === 0 ? (
                    <div className="text-center py-12 bg-[#120f24]/50 border border-dashed border-[#2b244d] rounded-xl">
                      <FolderSearch className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-400 font-serif">Nessun dossier d'indagine aperto.</p>
                      <button onClick={createBlankDossier} className="mt-2 text-xs text-[#dfb15b] underline">Crea il primo fascicolo</button>
                    </div>
                  ) : (
                    investigations.map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => { setSelectedInvId(inv.id); playKeyClick(450); }}
                        className="bg-[#120f24] border border-[#2b244d] p-4 rounded-xl space-y-3 hover:border-[#dfb15b]/40 transition-all duration-300 cursor-pointer shadow-md group relative"
                      >
                        <button
                          onClick={(e) => deleteDossier(inv.id, e)}
                          className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-red-400 bg-[#080612]/80 border border-[#2b244d] hover:border-red-500/40 rounded-md transition-all z-10"
                          title="Elimina Fascicolo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="space-y-1">
                          <span className="text-[9px] text-[#dfb15b] uppercase font-bold tracking-wider">{inv.archetype}</span>
                          <h3 className="font-serif text-sm font-bold text-white group-hover:text-[#dfb15b] transition-colors pr-8">{inv.title}</h3>
                        </div>

                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{inv.description}</p>

                        <div className="flex justify-between items-center text-[10px] pt-2 border-t border-[#2b244d]/40 text-gray-400 font-mono">
                          <span>Timeline: {inv.timeline.length} fasi</span>
                          <span>File: {inv.media.length}</span>
                          <span className="text-[#dfb15b] font-bold">Progresso: {inv.progress}%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              // INDIVIDUAL DOSSIER EXPANDED VIEW
              (() => {
                const inv = investigations.find((i) => i.id === selectedInvId);
                if (!inv) return null;
                const isLinked = linkedInvestigationId === inv.id;

                return (
                  <div className="space-y-5 animate-fadeIn pb-12">
                    {/* Back Button and Folder Title Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-[#120f24] border border-[#2b244d] p-3 rounded-xl shadow-lg">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => { setSelectedInvId(null); playKeyClick(300); }}
                          className="p-2.5 bg-[#080612] border border-[#2b244d] hover:border-[#dfb15b]/60 rounded-lg text-gray-300 hover:text-[#dfb15b] transition-all cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div>
                          <span className="text-[9px] text-[#dfb15b] uppercase tracking-widest font-semibold block">Dossier d'Indagine Operativo</span>
                          <h2 className="font-serif text-base font-bold text-white">{inv.title}</h2>
                        </div>
                      </div>

                      {/* Link to Chat Context Button (Req #9) */}
                      <button
                        onClick={() => {
                          if (isLinked) {
                            setLinkedInvestigationId(null);
                          } else {
                            setLinkedInvestigationId(inv.id);
                            setIsChatOpen(true);
                          }
                          playKeyClick(500);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer border ${
                          isLinked
                            ? "bg-purple-950/60 border-purple-500 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                            : "bg-[#080612] border-[#2b244d] hover:border-[#dfb15b]/60 text-gray-300 hover:text-[#dfb15b]"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#dfb15b]" />
                        <span>{isLinked ? "Caso Collegato alla Chat (Scollega)" : "Collega Contesto Chat"}</span>
                      </button>
                    </div>

                    {/* QUICK ACTIONS & EXPORT BAR (Req #8) */}
                    <div className="bg-[#120f24] border border-[#2b244d] rounded-xl p-4 space-y-3 shadow-lg">
                      <div className="flex justify-between items-center border-b border-[#2b244d]/60 pb-2">
                        <h3 className="font-serif text-xs md:text-sm font-bold text-[#dfb15b] flex items-center gap-1.5">
                          <Share2 className="w-4 h-4" />
                          <span>Esportazione Completa Dossier (PDF & Condivisione)</span>
                        </h3>
                        <span className="text-[10px] text-gray-400 font-mono">ID: {inv.id}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          onClick={() => { exportPDF(inv); playKeyClick(500); }}
                          className="bg-[#080612] border border-[#dfb15b]/50 hover:border-[#dfb15b] text-[#dfb15b] py-2.5 px-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 font-serif font-bold transition-all shadow-md cursor-pointer"
                        >
                          <Printer className="w-4 h-4 text-[#dfb15b]" />
                          <span>Scarica PDF Dossier</span>
                        </button>

                        <button
                          onClick={() => { calculatePlanetaryDatesForInv(inv.id); }}
                          className="bg-purple-950/30 border border-purple-500/40 hover:border-purple-400 text-purple-200 py-2.5 px-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 font-serif transition-all cursor-pointer"
                          title="Calcola date ottimali secondo calendario lunare e planetario"
                        >
                          <Moon className="w-4 h-4 text-purple-400" />
                          <span>Calcola Date Luna/Pianeti</span>
                        </button>

                        <button
                          onClick={() => { exportTXT(inv); playKeyClick(400); }}
                          className="bg-[#080612] border border-[#2b244d] text-gray-300 py-2.5 px-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 font-serif transition-all hover:text-white cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-[#dfb15b]" />
                          <span>File TXT</span>
                        </button>

                        <button
                          onClick={() => { shareWhatsApp(inv); playKeyClick(400); }}
                          className="bg-[#128c7e]/15 border border-[#128c7e]/50 text-[#25d366] py-2.5 px-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 font-serif transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </button>
                      </div>

                      {/* Operator Signature Line */}
                      <div className="flex items-center space-x-2 pt-2 border-t border-[#2b244d]/40 text-xs">
                        <span className="text-gray-400 text-[10px] font-mono uppercase">Firma Operatore:</span>
                        <input
                          type="text"
                          value={operatorSignature}
                          onChange={(e) => setOperatorSignature(e.target.value)}
                          placeholder="Maria Teresa Rogani - Tarot Italia"
                          className="bg-[#080612] border border-[#2b244d] focus:border-[#dfb15b] rounded px-2 py-1 text-xs text-white flex-1 outline-none font-serif"
                        />
                      </div>
                    </div>

                    {/* SECTION 1: NOMI E DATI DELLE PERSONE COINVOLTE (Req #1) */}
                    <div className="bg-[#120f24] border border-[#2b244d] rounded-xl p-4 space-y-3.5 shadow-lg">
                      <div className="flex justify-between items-center border-b border-[#2b244d]/60 pb-2.5">
                        <h3 className="font-serif text-xs md:text-sm font-bold text-[#dfb15b] flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#dfb15b]" />
                          <span>1) Nomi e Dati delle Persone Coinvolte</span>
                        </h3>
                        <span className="text-[10px] text-gray-400 font-mono">{(inv.involvedPeople || []).length} soggetti</span>
                      </div>

                      {/* Display Existing Persons */}
                      <div className="space-y-2">
                        {(!inv.involvedPeople || inv.involvedPeople.length === 0) ? (
                          <p className="text-xs text-gray-500 italic">Nessun soggetto ancora registrato in questo fascicolo.</p>
                        ) : (
                          inv.involvedPeople.map((person) => (
                            <div key={person.id} className="bg-[#080612] border border-[#2b244d] p-3 rounded-lg flex justify-between items-start text-xs">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-serif font-bold text-white text-sm">{person.name}</span>
                                  <span className="text-[9px] bg-[#dfb15b]/10 border border-[#dfb15b]/40 text-[#dfb15b] px-2 py-0.5 rounded-full uppercase font-mono">{person.role}</span>
                                </div>
                                {person.birthDate && (
                                  <div className="text-[10px] text-gray-400 font-mono">Nascita: {person.birthDate}</div>
                                )}
                                {person.notes && (
                                  <p className="text-gray-300 text-[11px] italic">{person.notes}</p>
                                )}
                              </div>
                              <button
                                onClick={() => removeInvolvedPersonFromInv(inv.id, person.id)}
                                className="text-gray-500 hover:text-red-400 p-1"
                                title="Rimuovi Persona"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Person Form */}
                      <div className="bg-[#080612]/60 border border-[#2b244d]/60 p-3 rounded-lg space-y-2 text-xs">
                        <span className="text-[10px] font-mono text-[#dfb15b] uppercase tracking-wider block">Aggiungi Soggetto al Dossier</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Nome Completo / Pseudonimo *"
                            value={newPersonName}
                            onChange={(e) => setNewPersonName(e.target.value)}
                            className="bg-[#120f24] border border-[#2b244d] rounded p-2 text-white outline-none focus:border-[#dfb15b]"
                          />
                          <select
                            value={newPersonRole}
                            onChange={(e) => setNewPersonRole(e.target.value)}
                            className="bg-[#120f24] border border-[#2b244d] rounded p-2 text-white outline-none focus:border-[#dfb15b]"
                          >
                            <option value="Richiedente">Richiedente / Cliente</option>
                            <option value="Target / Bersaglio">Target / Bersaglio</option>
                            <option value="Operatore">Operatore dell'Arte</option>
                            <option value="Terza Parte">Terza Parte Coinvolta</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Data e luogo di nascita (es. 14/05/1988 Roma)"
                            value={newPersonBirth}
                            onChange={(e) => setNewPersonBirth(e.target.value)}
                            className="bg-[#120f24] border border-[#2b244d] rounded p-2 text-white outline-none focus:border-[#dfb15b]"
                          />
                          <input
                            type="text"
                            placeholder="Note o dettagli simbolici"
                            value={newPersonNotes}
                            onChange={(e) => setNewPersonNotes(e.target.value)}
                            className="bg-[#120f24] border border-[#2b244d] rounded p-2 text-white outline-none focus:border-[#dfb15b]"
                          />
                        </div>
                        <button
                          onClick={() => addInvolvedPersonToInv(inv.id)}
                          className="w-full bg-[#dfb15b]/20 border border-[#dfb15b]/50 text-[#dfb15b] py-1.5 rounded font-serif text-xs font-semibold hover:bg-[#dfb15b]/30 transition-all cursor-pointer"
                        >
                          + Inserisci Soggetto nel Fascicolo
                        </button>
                      </div>
                    </div>

                    {/* SECTION 2: LA MIA DOMANDA D'INDAGINE (Req #2 - Immediately following involved persons) */}
                    <div className="bg-[#120f24] border border-amber-500/40 rounded-xl p-4 space-y-3 shadow-lg">
                      <div className="flex justify-between items-center border-b border-[#2b244d]/60 pb-2">
                        <h3 className="font-serif text-xs md:text-sm font-bold text-amber-400 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-amber-400" />
                          <span>2) Domanda d'Indagine dell'Operatore</span>
                        </h3>
                        <span className="text-[9px] text-amber-400/80 font-mono uppercase">Formulazione Quesito</span>
                      </div>
                      
                      <div className="space-y-2">
                        <textarea
                          value={inv.investigationQuestion || inv.description}
                          onChange={(e) => saveInvestigationQuestion(inv.id, e.target.value)}
                          placeholder="Inserisci qui il quesito centrale d'indagine..."
                          rows={3}
                          className="w-full bg-[#080612] border border-[#2b244d] focus:border-amber-400 rounded-lg p-3 text-xs text-amber-100 outline-none font-serif leading-relaxed"
                        />
                        <p className="text-[10px] text-gray-400 italic">
                          Il quesito d'indagine viene inviato direttamente all'Egregora nella chat e incluso nell'intestazione del PDF.
                        </p>
                      </div>
                    </div>

                    {/* SECTION 3: RISPOSTA ANALIZZATA E GENERATA NELLA TIMELINE (Req #3) */}
                    <div className="bg-[#120f24] border border-purple-500/40 rounded-xl p-4 space-y-3 shadow-lg">
                      <div className="flex justify-between items-center border-b border-[#2b244d]/60 pb-2">
                        <h3 className="font-serif text-xs md:text-sm font-bold text-purple-300 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-purple-400" />
                          <span>3) Risposta Analizzata e Generata dall'Egregora</span>
                        </h3>
                        <button
                          onClick={() => {
                            setLinkedInvestigationId(inv.id);
                            setIsChatOpen(true);
                            playKeyClick(400);
                          }}
                          className="text-[10px] text-purple-300 bg-purple-900/40 border border-purple-500/50 px-2.5 py-1 rounded-lg hover:bg-purple-800/50 font-serif"
                        >
                          Apri Chat Egregora →
                        </button>
                      </div>

                      <div className="bg-[#080612] border border-[#2b244d] p-3 rounded-lg space-y-2">
                        {chatHistory.length > 1 ? (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono text-purple-400 uppercase">Ultimo responso salvato dalla chat:</span>
                            <p className="text-xs text-gray-200 font-serif line-clamp-4 italic bg-[#120f24] p-2.5 rounded border border-[#2b244d]/80">
                              "{chatHistory.filter(m => m.role === 'model').slice(-1)[0]?.text || "In attesa di consulto..."}"
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">
                            Nessuna risposta analizzata in chat per questo fascicolo. Clicca su 'Apri Chat Egregora' in alto per iniziare.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* SECTION 4: APERTURA FASCICOLO E DIAGNOSI (Req #4) */}
                    <div className="bg-[#120f24] border border-[#2b244d] rounded-xl p-4 space-y-3.5 shadow-lg">
                      <div className="flex justify-between items-center border-b border-[#2b244d]/60 pb-2">
                        <h3 className="font-serif text-xs md:text-sm font-bold text-[#dfb15b] flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#dfb15b]" />
                          <span>4) Apertura Fascicolo e Diagnosi Alchemica del Caso</span>
                        </h3>
                        <span className="text-[10px] text-[#dfb15b] font-mono font-bold uppercase">{inv.archetype}</span>
                      </div>

                      {inv.diagnosis ? (
                        <div className="bg-[#080612] border border-[#2b244d] p-3 rounded-lg space-y-2">
                          <p className="text-xs text-gray-300 italic">{inv.diagnosis.description}</p>
                          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#2b244d]/40 text-center font-mono text-[10px]">
                            <div className="bg-red-950/20 border border-red-500/30 p-1.5 rounded text-red-300">🔥 Fuoco {inv.diagnosis.elements.fire}%</div>
                            <div className="bg-blue-950/20 border border-blue-500/30 p-1.5 rounded text-blue-300">💧 Acqua {inv.diagnosis.elements.water}%</div>
                            <div className="bg-amber-950/20 border border-amber-500/30 p-1.5 rounded text-amber-300">⛰️ Terra {inv.diagnosis.elements.earth}%</div>
                            <div className="bg-sky-950/20 border border-sky-500/30 p-1.5 rounded text-sky-300">💨 Aria {inv.diagnosis.elements.air}%</div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#080612] border border-[#2b244d] p-3 rounded-lg text-xs text-gray-400 italic">
                          Fascicolo aperto sotto l'archetipo {inv.archetype}. Diagnosi elementale predefinita in corso.
                        </div>
                      )}
                    </div>

                    {/* SECTION 5: VALUTAZIONE FETICCI, FOTO E SIMULACRI IMMAGINALI (Req #5) */}
                    <div className="bg-[#120f24] border border-[#2b244d] rounded-xl p-4 space-y-3.5 shadow-lg">
                      <div className="flex justify-between items-center border-b border-[#2b244d]/60 pb-2.5">
                        <h3 className="font-serif text-xs md:text-sm font-bold text-[#dfb15b] flex items-center gap-2">
                          <Eye className="w-4 h-4 text-[#dfb15b]" />
                          <span>5) Valutazione Feticci, Foto e Simulacri Immaginali</span>
                        </h3>
                        <span className="text-[10px] text-gray-400 font-mono">{(inv.fetishes || []).length} feticci</span>
                      </div>

                      {/* Fetish List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(!inv.fetishes || inv.fetishes.length === 0) ? (
                          <p className="col-span-2 text-xs text-gray-500 italic">Nessun feticcio, foto o testimone immaginale ancora caricato.</p>
                        ) : (
                          inv.fetishes.map((fetish) => (
                            <div key={fetish.id} className="bg-[#080612] border border-[#2b244d] p-3 rounded-lg space-y-1.5 text-xs relative">
                              <button
                                onClick={() => removeFetishFromInv(inv.id, fetish.id)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-400 p-1"
                                title="Rimuovi Feticcio"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <div className="flex items-center space-x-2">
                                <span className="font-serif font-bold text-white">{fetish.name}</span>
                                <span className="text-[8px] uppercase bg-purple-950/60 border border-purple-500/40 text-purple-300 px-1.5 py-0.5 rounded font-mono">{fetish.type}</span>
                              </div>
                              <div className="text-[10px] text-[#dfb15b] font-mono">Affinità: {fetish.elementalAffinity || 'Aether'}</div>
                              <p className="text-gray-300 text-[11px] leading-relaxed">{fetish.description}</p>
                              {fetish.imageUrl && (
                                <img src={fetish.imageUrl} alt={fetish.name} className="w-full h-20 object-cover rounded border border-[#2b244d] mt-1" />
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Fetish Form */}
                      <div className="bg-[#080612]/60 border border-[#2b244d]/60 p-3 rounded-lg space-y-2 text-xs">
                        <span className="text-[10px] font-mono text-[#dfb15b] uppercase tracking-wider block">Registra Feticcio / Foto / Testimone</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Nome Feticcio / Foto *"
                            value={newFetishName}
                            onChange={(e) => setNewFetishName(e.target.value)}
                            className="bg-[#120f24] border border-[#2b244d] rounded p-2 text-white outline-none focus:border-[#dfb15b]"
                          />
                          <select
                            value={newFetishType}
                            onChange={(e) => setNewFetishType(e.target.value as any)}
                            className="bg-[#120f24] border border-[#2b244d] rounded p-2 text-white outline-none focus:border-[#dfb15b]"
                          >
                            <option value="foto">Foto della Persona</option>
                            <option value="testimone_fisico">Testimone Fisico (Capelli/Firma)</option>
                            <option value="feticcio">Feticcio / Doliola di Cera</option>
                            <option value="simulacro_proiettivo">Simulacro Immaginale Proiettivo</option>
                          </select>
                          <select
                            value={newFetishElement}
                            onChange={(e) => setNewFetishElement(e.target.value as any)}
                            className="bg-[#120f24] border border-[#2b244d] rounded p-2 text-white outline-none focus:border-[#dfb15b]"
                          >
                            <option value="Fuoco">🔥 Fuoco</option>
                            <option value="Acqua">💧 Acqua</option>
                            <option value="Terra">⛰️ Terra</option>
                            <option value="Aria">💨 Aria</option>
                            <option value="Spirito">✨ Spirito / Aether</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          placeholder="Descrizione proiettiva (es. foto caricata con intenti di trasmutazione)"
                          value={newFetishDesc}
                          onChange={(e) => setNewFetishDesc(e.target.value)}
                          className="bg-[#120f24] border border-[#2b244d] rounded p-2 text-white outline-none focus:border-[#dfb15b] w-full"
                        />
                        <button
                          onClick={() => addFetishToInv(inv.id)}
                          className="w-full bg-[#dfb15b]/20 border border-[#dfb15b]/50 text-[#dfb15b] py-1.5 rounded font-serif text-xs font-semibold hover:bg-[#dfb15b]/30 transition-all cursor-pointer"
                        >
                          + Registra Feticcio nel Fascicolo
                        </button>
                      </div>
                    </div>

                    {/* SECTION 6: BANDO PRELIMINARE DI PROTEZIONE (Req #6) */}
                    <div className="bg-[#120f24] border border-purple-500/40 rounded-xl p-4 space-y-3 shadow-lg">
                      <div className="flex justify-between items-center border-b border-[#2b244d]/60 pb-2">
                        <h3 className="font-serif text-xs md:text-sm font-bold text-purple-300 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-purple-400" />
                          <span>6) Bando Preliminare di Protezione (Operatore e Parti)</span>
                        </h3>
                        <button
                          onClick={() => generateProtectiveBanishmentForInv(inv.id)}
                          className="text-[10px] text-purple-200 bg-purple-900/50 border border-purple-500 px-2.5 py-1 rounded-lg hover:bg-purple-800 font-serif font-semibold"
                        >
                          ⚡ {inv.protectiveBanishment ? "Rigenera Bando" : "Genera Bando Solenne"}
                        </button>
                      </div>

                      {inv.protectiveBanishment ? (
                        <div className="bg-[#080612] border border-purple-500/30 p-3.5 rounded-lg space-y-2 text-xs">
                          <h4 className="font-serif font-bold text-purple-300 text-sm">{inv.protectiveBanishment.title}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-300 font-mono">
                            <div> Timing: <span className="text-purple-200">{inv.protectiveBanishment.timing}</span></div>
                            <div> Targets: <span className="text-purple-200">{inv.protectiveBanishment.targetProtection}</span></div>
                            <div> Corrispondenze: Candela {inv.protectiveBanishment.candle}, Incenso {inv.protectiveBanishment.incense}</div>
                          </div>
                          <div className="bg-purple-950/30 border-l-2 border-purple-500 p-2.5 rounded text-purple-100 font-serif italic text-xs leading-relaxed">
                            "{inv.protectiveBanishment.formula}"
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic bg-[#080612] p-3 rounded-lg border border-[#2b244d]">
                          Nessun bando di protezione solenne ancora generato. Clicca su 'Genera Bando Solenne' per consacrare lo scudo di schermatura per Operatore e soggetti coinvolti.
                        </p>
                      )}
                    </div>

                    {/* SECTION 7: TIMELINE DEGLI STEP OPERATIVI E TIMING LUNARE/PLANETARIO (Req #7) */}
                    <div className="bg-[#120f24] border border-[#2b244d] rounded-xl p-4 space-y-4 shadow-lg">
                      <div className="flex justify-between items-center border-b border-[#2b244d]/60 pb-3">
                        <h3 className="font-serif text-xs md:text-sm font-bold text-[#dfb15b] flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>7) Timeline degli Step Operativi (Calcolo Lunare & Planetario)</span>
                        </h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => calculatePlanetaryDatesForInv(inv.id)}
                            className="text-[10px] text-purple-300 bg-purple-950/40 border border-purple-500/50 px-2 py-1 rounded-lg hover:bg-purple-900/50 flex items-center gap-1 cursor-pointer font-serif"
                            title="Calcola in autonomia le date migliori per tutti gli step"
                          >
                            <Moon className="w-3 h-3" />
                            <span>Auto-Calcola Date</span>
                          </button>
                          <button
                            onClick={() => setIsStepModalOpen(true)}
                            className="text-[10px] text-[#dfb15b] bg-[#dfb15b]/10 border border-[#dfb15b]/40 px-2 py-1 rounded-lg hover:bg-[#dfb15b]/20 flex items-center gap-1 cursor-pointer font-serif uppercase tracking-widest"
                          >
                            <PlusCircle className="w-3 h-3" />
                            <span>Aggiungi Fase</span>
                          </button>
                        </div>
                      </div>

                      {/* Timeline Steps Display */}
                      <div className="relative pl-5 py-1 space-y-4 before:absolute before:left-[7px] before:top-2.5 before:bottom-2.5 before:w-[1px] before:bg-[#2b244d]">
                        {inv.timeline.length === 0 ? (
                          <p className="text-xs text-gray-500 italic pl-2">Nessun passaggio ritmico registrato. Clicca su 'Auto-Calcola Date' per popolare la timeline.</p>
                        ) : (
                          inv.timeline.map((step, idx) => (
                            <div key={step.id} className="relative group/step bg-[#080612]/70 p-2.5 rounded-lg border border-[#2b244d]/60">
                              {/* Left dot marker */}
                              <div className={`absolute -left-[22.5px] top-3.5 w-2 h-2 rounded-full border border-[#080612] ${
                                step.status === "completed"
                                  ? "bg-emerald-500 shadow-[0_0_6px_#10b981]"
                                  : step.status === "in-progress"
                                  ? "bg-[#dfb15b] shadow-[0_0_6px_#dfb15b]"
                                  : "bg-gray-600"
                              }`} />

                              <div className="flex justify-between items-start">
                                <div className="space-y-0.5">
                                  <h4 className="font-serif text-xs font-bold text-white group-hover/step:text-[#dfb15b] transition-colors">
                                    {step.title}
                                  </h4>
                                  <div className="text-[10px] text-purple-300 font-mono">
                                    📅 {step.date} {step.planetaryTiming && `• 🌙 ${step.planetaryTiming}`}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                  <span className={`text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                    step.status === "completed"
                                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                                      : step.status === "in-progress"
                                      ? "bg-[#dfb15b]/10 border-[#dfb15b]/40 text-[#dfb15b]"
                                      : "bg-gray-800 border-gray-700 text-gray-400"
                                  }`}>
                                    {step.status === "completed" ? "Fatto" : step.status === "in-progress" ? "In Corso" : "Pianificato"}
                                  </span>
                                  <button
                                    onClick={() => deleteTimelineStep(step.id)}
                                    className="text-gray-600 hover:text-red-400 p-1 opacity-0 group-hover/step:opacity-100 transition-opacity"
                                    title="Rimuovi Fase"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-gray-300 mt-1 pl-0.5 leading-relaxed">{step.desc}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* MEDIA ARCHIVE */}
                    <div className="bg-[#120f24] border border-[#2b244d] rounded-xl p-4 space-y-4 shadow-lg">
                      <div className="flex justify-between items-center border-b border-[#2b244d]/60 pb-3">
                        <h3 className="font-serif text-xs md:text-sm font-bold text-[#dfb15b] flex items-center gap-1.5">
                          <FolderOpen className="w-4 h-4" />
                          <span>Allegati e Documenti Multimediali</span>
                        </h3>
                        <label className="cursor-pointer text-[10px] bg-[#7c3aed]/20 border border-[#7c3aed]/60 text-purple-200 px-2.5 py-1 rounded-lg hover:bg-[#7c3aed]/35 flex items-center gap-1 font-serif uppercase tracking-widest">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Carica file</span>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            accept="image/*,text/*,.pdf"
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Upload grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {inv.media.length === 0 ? (
                          <p className="col-span-2 text-xs text-gray-500 italic text-center py-4">Nessun file o reperto salvato in questo fascicolo.</p>
                        ) : (
                          inv.media.map((file) => (
                            <div key={file.id} className="bg-[#080612] border border-[#2b244d] p-2.5 rounded-lg space-y-2 text-xs relative group overflow-hidden shadow-sm">
                              <button
                                onClick={() => deleteMedia(file.id)}
                                className="absolute top-1.5 right-1.5 p-1 bg-[#080612]/95 border border-[#2b244d] hover:border-red-500/40 text-red-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                title="Elimina File"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {file.type === "image" ? (
                                <>
                                  <img src={file.url || ""} className="w-full h-24 object-cover rounded border border-[#2b244d]/60" alt={file.name} />
                                  <span className="text-[10px] text-gray-300 truncate block font-mono pr-5">{file.name}</span>
                                </>
                              ) : (
                                <div className="space-y-1.5">
                                  <div className="flex items-center space-x-1.5 text-[#dfb15b]">
                                    <FileText className="w-4 h-4" />
                                    <span className="font-semibold truncate block max-w-[80%] font-serif text-[11px]">{file.name}</span>
                                  </div>
                                  <p className="text-[10px] text-gray-400 line-clamp-3 leading-relaxed font-mono">{file.content}</p>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* 3. VIEW: LUNAR CALENDAR */}
        {activeTab === "luna" && (
          <div className="space-y-4 animate-fadeIn">
            {/* Interactive Moon Status Card */}
            <div className="bg-[#120f24] border border-[#dfb15b]/45 rounded-xl p-4 space-y-3 shadow-xl gold-border-glow relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-[#dfb15b] uppercase tracking-widest font-bold block mb-0.5">Transito Astrologico Odierno</span>
                  <h2 className="font-serif text-lg font-bold text-white">{todayLunarData.phaseName}</h2>
                  <p className="text-xs text-purple-300 font-serif font-medium mt-0.5">Transito in {todayLunarData.zodiacName}</p>
                </div>
                <div className="w-14 h-14 rounded-full border border-[#dfb15b]/40 bg-[#080612]/80 flex items-center justify-center text-[#dfb15b] shadow-inner">
                  {todayLunarData.icon === "circle" ? (
                    <div className="w-9 h-9 rounded-full border border-gray-600 border-dashed" />
                  ) : todayLunarData.icon === "sun" ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#dfb15b] to-amber-500 shadow-[0_0_15px_#dfb15b]" />
                  ) : (
                    <Moon className="w-8 h-8 text-[#dfb15b] fill-current" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#2b244d]/50">
                <div className="bg-[#080612]/60 p-2.5 rounded-lg border border-[#2b244d] font-mono">
                  <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Illuminazione</span>
                  <span className="font-bold text-[#dfb15b] text-sm">{todayLunarData.illumination}%</span>
                </div>
                <div className="bg-[#080612]/60 p-2.5 rounded-lg border border-[#2b244d] font-mono">
                  <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Età Lunare</span>
                  <span className="font-bold text-gray-200 text-sm">{todayLunarData.cycleDay} giorni</span>
                </div>
              </div>

              <div className="bg-[#080612]/90 border-l-2 border-[#dfb15b] p-3 rounded-r-lg text-xs leading-relaxed">
                <span className="text-[9px] uppercase font-bold text-[#dfb15b] tracking-widest block mb-0.5">Direttiva Operativa del Giorno</span>
                <p className="text-gray-300 italic">"{todayLunarData.advice}"</p>
              </div>
            </div>

            {/* MONTH SELECTOR & GRID */}
            <div className="bg-[#120f24] border border-[#2b244d] p-4 rounded-xl space-y-4 shadow-lg">
              <div className="flex justify-between items-center border-b border-[#2b244d]/60 pb-3">
                <button
                  onClick={() => handleMonthChange(-1)}
                  className="p-2 bg-[#080612] border border-[#2b244d] hover:border-[#dfb15b] rounded-lg text-gray-300 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <h3 className="font-serif text-sm md:text-base font-bold text-[#dfb15b] tracking-wider">
                    {monthNames[displayedLunarMonth.getMonth()]} {displayedLunarMonth.getFullYear()}
                  </h3>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest block mt-0.5">Mande e Transiti Lunari</span>
                </div>
                <button
                  onClick={() => handleMonthChange(1)}
                  className="p-2 bg-[#080612] border border-[#2b244d] hover:border-[#dfb15b] rounded-lg text-gray-300 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Days Week Headers */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Lun</span><span>Mar</span><span>Mer</span><span>Gio</span><span>Ven</span><span>Sab</span><span>Dom</span>
              </div>

              {/* Monthly calendar cells */}
              <div className="grid grid-cols-7 gap-1.5 text-xs">
                {calendarDays.map((cellDate, index) => {
                  if (!cellDate) {
                    return <div key={`empty-${index}`} className="h-11 border border-transparent" />;
                  }

                  const dayNum = cellDate.getDate();
                  const cellData = getMoonPhaseData(cellDate);
                  
                  // Check if cell is the selected date
                  const isSelected =
                    selectedLunarDate.getDate() === dayNum &&
                    selectedLunarDate.getMonth() === cellDate.getMonth() &&
                    selectedLunarDate.getFullYear() === cellDate.getFullYear();

                  const isToday =
                    new Date().getDate() === dayNum &&
                    new Date().getMonth() === cellDate.getMonth() &&
                    new Date().getFullYear() === cellDate.getFullYear();

                  let glowDotColor = "bg-gray-600";
                  if (cellData.illumination > 85) glowDotColor = "bg-[#dfb15b] shadow-[0_0_8px_#dfb15b]";
                  else if (cellData.illumination > 40) glowDotColor = "bg-purple-400";

                  return (
                    <button
                      key={`day-${dayNum}`}
                      onClick={() => { setSelectedLunarDate(cellDate); playKeyClick(300); }}
                      className={`h-11 border rounded-lg p-0.5 flex flex-col items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#dfb15b] bg-[#dfb15b]/15 text-[#dfb15b]"
                          : isToday
                          ? "border-purple-500 bg-purple-900/10 text-purple-300 font-bold"
                          : "border-[#2b244d]/60 bg-[#080612]/70 text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      <span className="text-[10px] font-mono leading-none mt-0.5">{dayNum}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${glowDotColor}`} />
                      <span className="text-[8px] text-gray-400 font-mono leading-none mb-0.5">{cellData.illumination}%</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SELECTION DAY DETAILS SCREEN */}
            <div className="bg-[#120f24] border border-[#2b244d] p-4 rounded-xl space-y-3 shadow-lg">
              <div className="flex justify-between items-center border-b border-[#2b244d]/60 pb-2">
                <h4 className="font-serif text-xs md:text-sm font-bold text-[#dfb15b]">
                  Dettaglio: {selectedLunarDate.getDate()} {monthNames[selectedLunarDate.getMonth()]} {selectedLunarDate.getFullYear()}
                </h4>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-950/40 border border-[#7c3aed] text-purple-300 font-mono">
                  {selectedLunarData.zodiacName.split(" ")[0]}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed italic">"{selectedLunarData.advice}"</p>
              
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5">
                <div className="bg-[#080612] p-2.5 rounded border border-[#2b244d] text-gray-300">
                  <strong className="text-[#dfb15b] block text-[9px] uppercase tracking-wider mb-0.5">Colore Candela</strong>
                  <span className="font-serif">{selectedLunarData.candle}</span>
                </div>
                <div className="bg-[#080612] p-2.5 rounded border border-[#2b244d] text-gray-300">
                  <strong className="text-[#dfb15b] block text-[9px] uppercase tracking-wider mb-0.5">Consiglio Rituale</strong>
                  <span className="font-serif">{selectedLunarData.work}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. VIEW: TRANCE & SIGIL STATION */}
        {activeTab === "trance" && (
          <div className="space-y-4 text-center animate-fadeIn">
            <div className="bg-[#120f24] border border-[#2b244d] p-4 rounded-xl space-y-1.5 shadow-lg">
              <h2 className="font-serif text-base font-bold text-[#dfb15b] tracking-wider">Stazione di Trance & Carica</h2>
              <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                Rallenta i pensieri ed allineati al ritmo del Box Breathing. Mantieni premuto sul Sigillo geometrico sottostante per canalizzare l'intento.
              </p>
            </div>

            {/* Breathing coach layout */}
            <div className="bg-[#120f24] border border-[#2b244d]/70 rounded-xl p-4 flex items-center justify-between shadow-md">
              <div className="text-left space-y-0.5">
                <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Guida alla Respirazione Quadrata</span>
                <span className="text-xs font-bold text-[#dfb15b] font-serif tracking-wider">
                  {breathPhase === 0 && "INSPIRAZIONE (4s)"}
                  {breathPhase === 1 && "RITENZIONE PIENO (4s)"}
                  {breathPhase === 2 && "ESPIRAZIONE (4s)"}
                  {breathPhase === 3 && "RITENZIONE VUOTO (4s)"}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full border border-[#dfb15b]/40 flex items-center justify-center bg-[#080612] shadow-inner">
                {/* Visual pulse indicator */}
                <div className={`w-5 h-5 rounded-full bg-[#dfb15b] ${isCharging ? "" : "breathe-circle"}`} />
              </div>
            </div>

            {/* Interactive Vector Sigil wrapper */}
            <div className="relative py-4 flex flex-col items-center justify-center">
              <div
                id="sigil-interactive-container"
                onMouseDown={startCharging}
                onMouseUp={stopCharging}
                onMouseLeave={stopCharging}
                onTouchStart={startCharging}
                onTouchEnd={stopCharging}
                className="relative w-60 h-60 rounded-full border-2 border-[#dfb15b]/35 flex items-center justify-center bg-[#120f24] hover:border-[#dfb15b]/80 shadow-2xl overflow-hidden cursor-pointer touch-none transition-all duration-300"
              >
                {/* Pulsing solar-flair aura */}
                <div className={`absolute inset-0 bg-[#dfb15b]/10 transition-all duration-500 rounded-full ${
                  isCharging ? "scale-105 opacity-100 ring-4 ring-[#dfb15b]/20" : "scale-95 opacity-0"
                }`} />

                {/* Classical Alchemy compass background spinning */}
                <svg className="absolute inset-0 w-full h-full sigil-animation pointer-events-none opacity-40" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#dfb15b" strokeWidth="0.8" strokeDasharray="3,5" />
                  <circle cx="100" cy="100" r="72" fill="none" stroke="#7c3aed" strokeWidth="0.5" />
                  <polygon points="100,10 178,145 22,145" fill="none" stroke="#dfb15b" strokeWidth="0.6" />
                  <polygon points="100,190 22,55 178,55" fill="none" stroke="#7c3aed" strokeWidth="0.6" />
                </svg>

                {/* Mystical Vector Centerpiece */}
                <svg className="w-36 h-36 text-[#dfb15b] z-10 select-none pointer-events-none" viewBox="0 0 100 100">
                  <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <polygon points="50,22 74,64 26,64" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="50" cy="50" r="8" fill="currentColor" />
                  {/* Surrounding astrological dots */}
                  <circle cx="20" cy="20" r="1.5" fill="currentColor" />
                  <circle cx="80" cy="20" r="1.5" fill="currentColor" />
                  <circle cx="20" cy="80" r="1.5" fill="currentColor" />
                  <circle cx="80" cy="80" r="1.5" fill="currentColor" />
                </svg>
              </div>

              {/* Progress bar controller */}
              <div className="mt-6 w-full space-y-2">
                <button
                  onMouseDown={startCharging}
                  onMouseUp={stopCharging}
                  onTouchStart={startCharging}
                  onTouchEnd={stopCharging}
                  className="w-full bg-[#120f24] border border-[#dfb15b]/80 hover:bg-[#dfb15b]/10 text-[#dfb15b] font-serif font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md select-none touch-none cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isCharging ? "PROIEZIONE ATTIVA..." : "TIENI PREMUTO PER PROIETTARE"}</span>
                </button>

                <div className="w-full bg-[#120f24] border border-[#2b244d] rounded-full h-3 overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-[#dfb15b] via-amber-400 to-[#7c3aed] h-full rounded-full transition-all duration-100"
                    style={{ width: `${chargePercent}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                  <span>Carica Operativa: {chargePercent}%</span>
                  {chargePercent === 100 && <span className="text-emerald-400 font-bold flex items-center gap-0.5"><CheckCircle className="w-3 h-3" /> Fatto</span>}
                  <button onClick={() => { setChargePercent(0); playKeyClick(300); }} className="text-[#dfb15b] underline font-serif">Azzera</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. VIEW: EGREGORA CHAT */}
        {activeTab === "egregora" && (
          <div className="bg-[#120f24] border border-[#dfb15b]/30 rounded-2xl overflow-hidden flex flex-col h-[75vh] shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-fadeIn" id="egregora-fullpage-chat">
            {/* Header info bar */}
            <div className="p-4 bg-[#080612]/90 border-b border-[#2b244d] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-purple-900/40 border border-[#7c3aed] flex items-center justify-center text-purple-300 shadow-md">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#dfb15b] tracking-wider">L'Egregora del Tempio</h3>
                  <p className="text-[10px] text-gray-400 font-mono">Consulente Ermetico • llama-3.3-70b-versatile</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearChat}
                  className="text-xs text-gray-400 hover:text-white underline font-serif cursor-pointer px-2 py-1 rounded hover:bg-white/5 transition-all"
                >
                  Azzera Memoria
                </button>
              </div>
            </div>

            {/* Linked Dossier Context Banner */}
            {(linkedInvestigationId || selectedInvId) && (
              <div className="px-4 py-2 bg-[#dfb15b]/10 border-b border-[#dfb15b]/30 flex items-center justify-between text-xs text-[#dfb15b] font-serif">
                <div className="flex items-center gap-2 truncate">
                  <Link className="w-4 h-4 shrink-0 text-[#dfb15b]" />
                  <span className="truncate">Contesto Attivo: <strong>{investigations.find(i => i.id === (linkedInvestigationId || selectedInvId))?.title || "Dossier Selezionato"}</strong></span>
                </div>
                {linkedInvestigationId && (
                  <button
                    onClick={() => setLinkedInvestigationId(null)}
                    className="text-[10px] text-gray-400 hover:text-white underline shrink-0 ml-2 cursor-pointer font-sans"
                  >
                    Scollega
                  </button>
                )}
              </div>
            )}

            {/* Chat list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm bg-[#0b081a]/30" id="fullpage-chat-container">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex items-start ${msg.role === "user" ? "justify-end space-x-3" : "space-x-3"}`}>
                  {msg.role !== "user" && (
                    <div className="w-8 h-8 rounded-full bg-[#120f24] border border-[#dfb15b]/45 flex items-center justify-center text-[#dfb15b] shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#dfb15b]/10 border border-[#dfb15b]/45 text-gray-100 rounded-tr-none font-serif"
                      : msg.isError 
                        ? "bg-red-950/40 border border-red-500/40 text-red-200 rounded-tl-none font-mono text-xs"
                        : "bg-[#080612] border border-[#2b244d]/80 text-gray-200 rounded-tl-none font-serif"
                  }`}>
                    {msg.text}
                    
                    {/* Controls for model response */}
                    {msg.role === "model" && !msg.isError && (
                      <div className="mt-3 pt-2 border-t border-[#2b244d]/60 flex items-center justify-end gap-2 text-xs">
                        <button
                          onClick={() => downloadSingleMessagePDF(msg)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#120f24] hover:bg-[#dfb15b]/15 text-[#dfb15b] border border-[#2b244d] hover:border-[#dfb15b]/50 transition-all cursor-pointer font-sans text-[11px]"
                          title="Scarica questa risposta in PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF Risposta</span>
                        </button>
                        <button
                          onClick={() => speakMessage(msg.text, msg.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-all cursor-pointer font-sans text-[11px] ${
                            speakingMessageId === msg.id 
                              ? "bg-amber-500/20 text-amber-300 border-amber-500 animate-pulse" 
                              : "bg-[#120f24] text-gray-400 hover:text-gray-200 border-[#2b244d]"
                          }`}
                          title={speakingMessageId === msg.id ? "Ferma Lettura" : "Ascolta Risposta"}
                        >
                          {speakingMessageId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span>{speakingMessageId === msg.id ? "Stop" : "Ascolta"}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-[#dfb15b] text-[#080612] flex items-center justify-center font-bold text-xs font-serif shrink-0 mt-0.5 shadow-sm">
                      OP
                    </div>
                  )}
                </div>
              ))}

              {isChatting && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#120f24] border border-[#7c3aed]/50 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 animate-spin">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-[#080612]/80 border border-[#2b244d]/80 p-3.5 rounded-2xl rounded-tl-none text-gray-400 italic font-mono text-xs">
                    L'Egregora sta consultando i transiti astrali...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (chatInput.trim() && !isChatting) {
                  handleSendChatMessage();
                }
              }}
              className="p-2.5 sm:p-4 bg-[#080612]/95 border-t border-[#2b244d] flex items-center gap-1.5 sm:gap-2.5 shrink-0 w-full"
            >
              {/* PDF Download Button */}
              <button
                type="button"
                onClick={downloadChatPDF}
                disabled={chatHistory.length <= 1}
                className="p-2.5 sm:p-3 bg-[#120f24] text-gray-400 hover:text-[#dfb15b] hover:bg-[#dfb15b]/10 rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer border border-[#2b244d] shrink-0"
                title="Scarica Chat in PDF"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Speech Input Button */}
              <button
                type="button"
                onClick={startListening}
                className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer shrink-0 ${
                  isListening 
                    ? "bg-red-500/15 text-red-400 border-red-500 animate-pulse" 
                    : "bg-[#120f24] text-gray-400 hover:text-[#dfb15b] hover:bg-[#dfb15b]/10 border-[#2b244d]"
                }`}
                title={isListening ? "Ascolto attivo... Clicca per fermare" : "Invia messaggio vocale"}
              >
                {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Rivolgi la tua domanda..."
                className="flex-1 min-w-0 bg-[#120f24] border border-[#2b244d] rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#dfb15b] transition-all font-serif"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatting}
                className="bg-[#dfb15b] text-[#080612] p-2.5 sm:p-3 rounded-xl hover:brightness-110 disabled:brightness-50 transition-all cursor-pointer shadow-md shrink-0 flex items-center justify-center min-w-[40px]"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-[#080612]" />
              </button>
            </form>
          </div>
        )}

        {/* VIEW: LETTURA DEI TAROCCHI */}
        {activeTab === "tarocchi" && (
          <div className="space-y-6 animate-fadeIn" id="tarocchi-view">
            {/* Header description block */}
            <div className="bg-[#120f24] border border-[#dfb15b]/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#dfb15b]/5 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-[#dfb15b] uppercase tracking-widest font-bold block mb-1 font-mono">
                    Il Viaggio del Matto • Arcani Maggiori
                  </span>
                  <h2 className="font-serif text-xl font-bold text-white tracking-wide">
                    La Guida Iniziatica ai Tarocchi
                  </h2>
                  <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
                    Sulla base del compendio di Lisa Butterworth, gli Arcani Maggiori sono ventidue epici archetipi e grandi lezioni di vita che illuminano la nostra esistenza materiale, emotiva e spirituale.
                  </p>
                </div>
                {/* Mode selector buttons */}
                <div className="flex bg-[#080612] p-1 rounded-xl border border-[#2b244d] self-start md:self-center shrink-0">
                  <button
                    onClick={() => { setTarotSubTab("compendio"); playKeyClick(300); }}
                    className={`px-3.5 py-1.5 text-xs font-serif font-bold rounded-lg transition-all cursor-pointer ${
                      tarotSubTab === "compendio"
                        ? "bg-[#dfb15b] text-[#080612] shadow-md"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    Compendio Arcani
                  </button>
                  <button
                    onClick={() => { setTarotSubTab("stesa"); playKeyClick(300); }}
                    className={`px-3.5 py-1.5 text-xs font-serif font-bold rounded-lg transition-all cursor-pointer ${
                      tarotSubTab === "stesa"
                        ? "bg-[#dfb15b] text-[#080612] shadow-md"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    Stesa Rituale
                  </button>
                </div>
              </div>
            </div>

            {/* TAB 1: COMPENDIO ARCANI MAGGIORI */}
            {tarotSubTab === "compendio" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cards Grid List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-[#120f24]/50 border border-[#2b244d]/50 p-4 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-gray-300 font-serif">Seleziona un Arcano per rivelarne i misteri celati:</span>
                    <span className="text-[10px] text-[#dfb15b] font-mono uppercase tracking-wider">{ARCANI_MAGGIORI.length} Archetipi Attivi</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ARCANI_MAGGIORI.map((card) => {
                      const isSelected = selectedTarotCardId === card.id;
                      return (
                        <button
                          key={card.id}
                          onClick={() => { setSelectedTarotCardId(card.id); playKeyClick(400); }}
                          className={`flex flex-col items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group text-center h-44 ${
                            isSelected
                              ? "bg-[#1d1736] border-[#dfb15b] shadow-lg shadow-[#dfb15b]/5"
                              : "bg-[#120f24] border-[#2b244d] hover:border-[#dfb15b]/40 hover:bg-[#120f24]/80"
                          }`}
                        >
                          <div className="w-full flex justify-between items-center text-[10px] font-mono">
                            <span className="text-[#dfb15b] font-bold">{card.roman}</span>
                            <span className="text-gray-500 font-semibold uppercase">{card.element}</span>
                          </div>

                          <div className="flex flex-col items-center justify-center py-2">
                            <div className={`w-12 h-16 border rounded-lg flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover:scale-105 ${
                              isSelected ? "border-[#dfb15b] bg-[#dfb15b]/5" : "border-gray-700 bg-[#080612]"
                            }`}>
                              <span className="font-serif text-lg font-bold text-[#dfb15b]">{card.roman}</span>
                            </div>
                            <span className="font-serif text-xs font-bold text-gray-200 block group-hover:text-[#dfb15b] transition-colors">
                              {card.name}
                            </span>
                          </div>

                          <div className="text-[8px] text-gray-500 font-mono tracking-wider truncate w-full">
                            {card.astrology}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detail panel */}
                <div className="lg:col-span-1">
                  {(() => {
                    const selectedCard = ARCANI_MAGGIORI.find(c => c.id === selectedTarotCardId) || ARCANI_MAGGIORI[9]; // Defaults to L'Eremita if nothing selected yet
                    return (
                      <div className="bg-[#120f24] border border-[#dfb15b]/30 rounded-2xl p-5 shadow-xl space-y-5 sticky top-24">
                        <div className="bg-[#080612] border border-[#2b244d] rounded-xl p-4 text-center space-y-2 relative overflow-hidden">
                          <div className="absolute top-2 left-2 text-xs font-mono text-[#dfb15b] font-bold">
                            {selectedCard.roman}
                          </div>
                          <div className="absolute top-2 right-2 text-[9px] font-mono text-gray-400 uppercase">
                            {selectedCard.element} • {selectedCard.astrology}
                          </div>

                          <div className="w-20 h-28 border-2 border-[#dfb15b] rounded-xl flex items-center justify-center mx-auto bg-[#120f24]/80 shadow-inner my-2">
                            <div className="text-center">
                              <span className="font-serif text-2xl font-bold text-[#dfb15b] block">{selectedCard.roman}</span>
                              <span className="text-[8px] text-gray-400 tracking-widest uppercase block mt-1">Tarot</span>
                            </div>
                          </div>

                          <h3 className="font-serif text-base font-bold text-[#dfb15b] tracking-wider mt-2">
                            {selectedCard.name}
                          </h3>

                          <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                            {selectedCard.keywords.map((kw, i) => (
                              <span key={i} className="text-[9px] bg-purple-950/45 text-purple-300 border border-purple-800/40 px-2 py-0.5 rounded-full font-serif font-semibold">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">La Carta e l'Iconografia</h4>
                          <p className="text-xs text-gray-300 leading-relaxed font-serif">
                            {selectedCard.description}
                          </p>
                        </div>

                        <div className="space-y-2 pt-1 border-t border-[#2b244d]">
                          <h4 className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Simbolismo ed Ermetismo</h4>
                          <div className="space-y-2">
                            {selectedCard.symbolism.map((sym, i) => (
                              <div key={i} className="text-xs font-serif bg-[#080612]/50 p-2 rounded-lg border border-[#2b244d]/60">
                                <span className="text-[#dfb15b] font-bold block">{sym.item}</span>
                                <span className="text-gray-400 text-[11px] block mt-0.5 leading-relaxed">{sym.meaning}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2.5 pt-2 border-t border-[#2b244d] text-xs">
                          <div className="space-y-1 bg-[#0f172a]/20 p-3 rounded-lg border border-emerald-950/40">
                            <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest uppercase block">▲ DIRITTA (La Via Maestra)</span>
                            <p className="text-gray-200 leading-relaxed font-serif">{selectedCard.diritta}</p>
                          </div>
                          <div className="space-y-1 bg-[#270000]/10 p-3 rounded-lg border border-red-950/30">
                            <span className="text-[10px] font-mono font-bold text-red-400 tracking-widest uppercase block">▼ CAPOVOLTA (La Deviazione / Blocco)</span>
                            <p className="text-gray-300 leading-relaxed font-serif">{selectedCard.capovolta}</p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-[#2b244d]">
                          <h4 className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Accogliere l'Energia dell'Arcano</h4>
                          <div className="grid grid-cols-1 gap-2 text-[11px] font-serif">
                            <div className="bg-[#080612]/40 p-2.5 rounded-lg">
                              <span className="text-purple-300 font-bold block mb-0.5">Sfera Personale:</span>
                              <span className="text-gray-400 leading-relaxed block">{selectedCard.accogliere.personale}</span>
                            </div>
                            <div className="bg-[#080612]/40 p-2.5 rounded-lg">
                              <span className="text-[#dfb15b] font-bold block mb-0.5">Relazioni:</span>
                              <span className="text-gray-400 leading-relaxed block">{selectedCard.accogliere.relazioni}</span>
                            </div>
                            <div className="bg-[#080612]/40 p-2.5 rounded-lg">
                              <span className="text-emerald-300 font-bold block mb-0.5">Lavoro / Obiettivi:</span>
                              <span className="text-gray-400 leading-relaxed block">{selectedCard.accogliere.lavoro}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* TAB 2: STESA RITUALE DELLE CARTE */}
            {tarotSubTab === "stesa" && (
              <div className="space-y-6">
                <div className="bg-[#120f24] border border-[#2b244d] rounded-2xl p-5 shadow-lg space-y-4">
                  <div>
                    <span className="text-[9px] text-[#dfb15b] uppercase tracking-widest font-bold block mb-0.5">Centra il tuo Intento</span>
                    <h3 className="font-serif text-sm font-bold text-white">Consulto Rituale con l'Egregora</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">Modalità di Lettura</label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => { setTarotDrawType("single"); playKeyClick(300); }}
                          className={`flex-1 p-3 rounded-xl border text-center font-serif text-xs font-bold transition-all cursor-pointer ${
                            tarotDrawType === "single"
                              ? "bg-[#dfb15b]/15 border-[#dfb15b] text-[#dfb15b]"
                              : "bg-[#080612]/80 border-[#2b244d] text-gray-400 hover:border-gray-700"
                          }`}
                        >
                          Estrai 1 Carta (Mantra / Sblocco)
                        </button>
                        <button
                          onClick={() => { setTarotDrawType("three"); playKeyClick(300); }}
                          className={`flex-1 p-3 rounded-xl border text-center font-serif text-xs font-bold transition-all cursor-pointer ${
                            tarotDrawType === "three"
                              ? "bg-[#dfb15b]/15 border-[#dfb15b] text-[#dfb15b]"
                              : "bg-[#080612]/80 border-[#2b244d] text-gray-400 hover:border-gray-700"
                          }`}
                        >
                          Estrai 3 Carte (Passato, Presente, Futuro)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">La tua Domanda Ermetica (Opzionale)</label>
                      <input
                        type="text"
                        value={tarotQuestion}
                        onChange={(e) => setTarotQuestion(e.target.value)}
                        placeholder="Es: Quale forza sbloccherà la mia situazione lavorativa stagnante?"
                        className="w-full bg-[#080612] border border-[#2b244d] rounded-xl px-3 py-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#dfb15b] font-serif"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleDrawTarot}
                      disabled={isGeneratingReading}
                      className="px-6 py-3.5 bg-gradient-to-r from-[#dfb15b] to-amber-600 text-[#080612] font-serif font-bold text-xs rounded-xl shadow-md hover:brightness-110 active:scale-95 disabled:brightness-50 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 animate-spin-slow" />
                      <span>{isGeneratingReading ? "Consultazione Astrale..." : "Mescola e Estrai Carte"}</span>
                    </button>
                  </div>
                </div>

                {drawnCards.length > 0 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-[#080612]/90 border border-[#2b244d] rounded-2xl p-6 shadow-inner space-y-4">
                      <h4 className="text-center font-serif text-xs font-bold text-[#dfb15b] tracking-widest uppercase">
                        {tarotDrawType === "single" ? "La Carta del Destino Estratta" : "La Trinità Temporale Estratta"}
                      </h4>

                      <div className="flex flex-wrap justify-center gap-6 py-4">
                        {drawnCards.map((dc, index) => (
                          <div key={index} className="flex flex-col items-center space-y-2">
                            {tarotDrawType === "three" && (
                              <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-semibold block mb-1 bg-purple-950/30 px-2 py-0.5 rounded border border-purple-900/30">
                                {index === 0 ? "1. PASSATO" : index === 1 ? "2. PRESENTE" : "3. FUTURO"}
                              </span>
                            )}

                            <div className="relative group w-36 h-56 bg-[#120f24] border-2 border-[#dfb15b]/80 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between p-4 transition-all duration-500 hover:scale-105 hover:shadow-[#dfb15b]/10">
                              <div className="absolute inset-0 bg-gradient-to-b from-[#dfb15b]/5 via-transparent to-[#080612] pointer-events-none" />
                              
                              <div className="relative z-10 flex justify-between items-center text-[9px] font-mono">
                                <span className="text-[#dfb15b] font-bold">{dc.card.roman}</span>
                                <span className="text-gray-500 font-semibold">{dc.card.element}</span>
                              </div>

                              <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
                                {dc.isReversed && (
                                  <span className="text-[8px] bg-red-950/50 text-red-400 border border-red-900/40 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider mb-2">
                                    Capovolta
                                  </span>
                                )}
                                
                                <div className={`w-10 h-14 border rounded-lg flex items-center justify-center bg-[#080612]/90 shadow-inner ${
                                  dc.isReversed ? "rotate-180 border-red-800/40 text-red-400" : "border-[#dfb15b]/55 text-[#dfb15b]"
                                }`}>
                                  <span className="font-serif text-base font-bold">{dc.card.roman}</span>
                                </div>
                              </div>

                              <div className="relative z-10 text-center space-y-1">
                                <span className="font-serif text-xs font-bold text-gray-200 block leading-tight truncate">
                                  {dc.card.name}
                                </span>
                                <span className="text-[8px] text-gray-500 block truncate font-mono tracking-wider">
                                  {dc.card.astrology}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {tarotReading && (
                      <div className="bg-[#120f24] border border-[#dfb15b]/30 rounded-2xl p-6 shadow-xl space-y-4 animate-fadeIn" id="tarot-reading-container">
                        <div className="flex items-center justify-between border-b border-[#2b244d] pb-3">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-5 h-5 text-[#dfb15b] animate-pulse" />
                            <h4 className="font-serif text-sm font-bold text-[#dfb15b] tracking-wider uppercase">Il Responso dell'Egregora</h4>
                          </div>
                          
                          <button
                            onClick={() => speakMessage(tarotReading, "tarot-reading-tts")}
                            className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-serif ${
                              speakingMessageId === "tarot-reading-tts"
                                ? "bg-[#dfb15b]/10 text-[#dfb15b] border-[#dfb15b] animate-pulse"
                                : "bg-[#080612] text-gray-400 hover:text-white border-[#2b244d]"
                            }`}
                            title="Ascolta Responso"
                          >
                            {speakingMessageId === "tarot-reading-tts" ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            <span>{speakingMessageId === "tarot-reading-tts" ? "Ferma Voce" : "Ascolta Lettura"}</span>
                          </button>
                        </div>

                        <div className="text-xs text-gray-200 leading-relaxed font-serif space-y-4 whitespace-pre-line bg-[#080612]/30 p-4 rounded-xl border border-[#2b244d]/50">
                          {tarotReading}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 6. VIEW: GLOSSARIO */}
        {activeTab === "glossario" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-[#120f24] border border-[#2b244d] p-4 rounded-xl space-y-3 shadow-lg">
              <div>
                <span className="text-[9px] text-[#dfb15b] uppercase tracking-widest font-bold block mb-0.5">Compendio Ermetico</span>
                <h2 className="font-serif text-base font-bold text-white">Glossario Esoterico Operativo</h2>
              </div>

              {/* Search input field */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Cerca termini (es. Saturno, Atame, Box Breathing, Egregora)..."
                  className="w-full bg-[#080612] border border-[#2b244d] rounded-lg pl-9 pr-3 py-2.5 text-xs text-gray-200 focus:border-[#dfb15b] focus:outline-none focus:ring-1 focus:ring-[#dfb15b] outline-none font-serif"
                />
              </div>

              {/* Categorization scroll filter bar */}
              <div className="flex space-x-1.5 overflow-x-auto pb-1 text-[10px]">
                {(["all", "elementi", "pianeti", "strumenti", "concetti"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setGlossaryCategory(cat); playKeyClick(250); }}
                    className={`px-3 py-1.5 rounded-full font-serif font-bold transition-all shrink-0 capitalize cursor-pointer ${
                      glossaryCategory === cat
                        ? "bg-[#dfb15b] text-[#080612] shadow-md"
                        : "bg-[#080612] border border-[#2b244d] text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    {cat === "all" ? "Tutti i Termini" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms grid display */}
            <div className="space-y-2.5">
              {filteredGlossary.length === 0 ? (
                <div className="text-center py-10 bg-[#120f24]/30 border border-dashed border-[#2b244d] rounded-xl">
                  <HelpCircle className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 italic font-serif">Nessun lemma alchemico corrisponde ai filtri impostati.</p>
                </div>
              ) : (
                filteredGlossary.map((item) => (
                  <details
                    key={item.term}
                    className="bg-[#120f24] border border-[#2b244d] rounded-lg text-xs overflow-hidden group transition-all duration-300"
                  >
                    <summary className="p-3 font-serif font-semibold text-[#dfb15b] hover:text-[#f5c873] flex justify-between items-center cursor-pointer select-none">
                      <span>{item.term}</span>
                      <span className="text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#080612] border border-[#2b244d] text-gray-400 font-mono">
                        {item.cat}
                      </span>
                    </summary>
                    <div className="p-3.5 pt-0 text-gray-300 leading-relaxed border-t border-[#2b244d]/30 font-serif">
                      {item.desc}
                    </div>
                  </details>
                ))
              )}
            </div>
          </div>
        )}

        {/* 7. VIEW: GRIMORIO / GRIMOIRE (SAVED RITUALS) */}
        {activeTab === "grimorio" && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Direct ritual generated screen */}
            {activeRitual && (
              <div className="bg-[#120f24] border border-[#dfb15b]/50 rounded-xl p-5 space-y-4 shadow-xl gold-border-glow animate-fadeIn">
                <div className="flex justify-between items-start border-b border-[#2b244d]/80 pb-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#dfb15b] font-bold block">Formula Evocativa Recente</span>
                    <h2 className="font-serif text-base md:text-lg font-bold text-white mt-0.5">{activeRitual.title}</h2>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => { saveToGrimoire(activeRitual); playKeyClick(500); }}
                      className="p-2 bg-[#080612] border border-[#2b244d] text-[#dfb15b] hover:bg-[#dfb15b]/10 rounded-lg transition-colors shadow-sm"
                      title="Salva nel Grimorio Permanente"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setActiveRitual(null); playKeyClick(300); }}
                      className="p-2 bg-[#080612] border border-[#2b244d] text-gray-400 hover:text-white rounded-lg transition-colors shadow-sm"
                      title="Chiudi"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Correspondences Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-[#080612]/90 p-2.5 rounded-lg border border-[#2b244d] font-serif">
                    <span className="text-gray-400 block text-[9px] uppercase tracking-widest mb-0.5">Timing Celso</span>
                    <span className="font-medium text-[#dfb15b]">{activeRitual.timing}</span>
                  </div>
                  <div className="bg-[#080612]/90 p-2.5 rounded-lg border border-[#2b244d] font-serif">
                    <span className="text-gray-400 block text-[9px] uppercase tracking-widest mb-0.5">Fiamma di Candela</span>
                    <span className="font-medium text-[#dfb15b]">{activeRitual.candle}</span>
                  </div>
                  <div className="bg-[#080612]/90 p-2.5 rounded-lg border border-[#2b244d] font-serif">
                    <span className="text-gray-400 block text-[9px] uppercase tracking-widest mb-0.5">Suffumigio / Incenso</span>
                    <span className="font-medium text-[#dfb15b]">{activeRitual.incense}</span>
                  </div>
                  <div className="bg-[#080612]/90 p-2.5 rounded-lg border border-[#2b244d] font-serif">
                    <span className="text-gray-400 block text-[9px] uppercase tracking-widest mb-0.5">Pietra di Supporto</span>
                    <span className="font-medium text-[#dfb15b]">{activeRitual.stone}</span>
                  </div>
                </div>

                {/* Spell Chant */}
                <div className="bg-[#080612]/90 border-l-2 border-[#dfb15b] p-3.5 rounded-r-lg">
                  <span className="text-[9px] uppercase font-bold text-[#dfb15b] tracking-widest block mb-0.5">Formula di Intonazione Vocalica</span>
                  <p className="font-serif text-xs text-gray-200 italic leading-relaxed">
                    "{activeRitual.formula}"
                  </p>
                </div>

                {/* Steps List */}
                <div className="space-y-2">
                  <h4 className="font-serif text-[10px] uppercase font-bold text-[#dfb15b] tracking-widest">Passaggi Pratici della Pratica</h4>
                  <ol className="space-y-1.5 text-xs text-gray-300 list-decimal list-inside leading-relaxed font-serif pl-0.5">
                    {activeRitual.steps.map((st, i) => (
                      <li key={i} className="pl-1">{st}</li>
                    ))}
                  </ol>
                </div>

                <button
                  onClick={() => { setActiveTab("trance"); playKeyClick(400); }}
                  className="w-full bg-gradient-to-r from-[#dfb15b] to-amber-600 text-[#080612] font-serif font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Apri Stazione di Caricamento Sigillo</span>
                </button>
              </div>
            )}

            {/* Archive layout */}
            <div className="bg-[#120f24] border border-[#2b244d] p-4 rounded-xl flex justify-between items-center shadow-md">
              <div>
                <span className="text-[9px] text-[#dfb15b] uppercase tracking-widest font-bold block mb-0.5">Compendio dei Riti</span>
                <h2 className="font-serif text-base font-bold text-white">Grimorio dell'Operatore</h2>
              </div>
              <BookOpen className="w-5 h-5 text-[#dfb15b]" />
            </div>

            <div className="space-y-3">
              {savedRituals.length === 0 ? (
                <div className="text-center py-12 bg-[#120f24]/50 border border-dashed border-[#2b244d] rounded-xl">
                  <Book className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-serif">Grimorio vuoto. Genera una formula rituale nella scheda Diagnosi.</p>
                </div>
              ) : (
                savedRituals.map((rit, idx) => (
                  <div key={idx} className="bg-[#120f24] border border-[#2b244d] p-4 rounded-xl space-y-3 shadow-md relative group">
                    <button
                      onClick={() => {
                        if (confirm("Desideri cancellare questa formula dal Grimorio permanente?")) {
                          setSavedRituals(savedRituals.filter((_, i) => i !== idx));
                          playKeyClick(300);
                        }
                      }}
                      className="absolute top-4 right-4 text-gray-500 hover:text-red-400 p-1 bg-[#080612]/80 border border-[#2b244d] rounded-md transition-all opacity-0 group-hover:opacity-100"
                      title="Elimina Formula"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-0.5">
                      <span className="text-[9px] text-[#dfb15b] uppercase font-bold tracking-wider">{rit.timing}</span>
                      <h3 className="font-serif text-sm font-bold text-white pr-8">{rit.title}</h3>
                    </div>

                    <p className="text-xs text-gray-400 italic leading-relaxed border-l border-[#dfb15b]/40 pl-2">
                      "{rit.formula}"
                    </p>

                    <div className="grid grid-cols-3 gap-1.5 text-[9px] pt-1.5 font-serif text-gray-400">
                      <div>Candela: <span className="text-white">{rit.candle}</span></div>
                      <div>Incenso: <span className="text-white">{rit.incense}</span></div>
                      <div>Cristallo: <span className="text-white">{rit.stone}</span></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* DIALOG STEP TIMELINE ADD MODAL */}
      {isStepModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080612]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#120f24] border border-[#2b244d] w-full max-w-sm rounded-xl p-4 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsStepModalOpen(false)}
              className="absolute top-3.5 right-3.5 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-[#2b244d] pb-2">
              <h3 className="font-serif text-sm font-bold text-[#dfb15b] tracking-wider">Aggiungi Fase Pratica</h3>
            </div>

            <div className="space-y-3.5 text-xs font-serif">
              <div className="space-y-1">
                <label className="block text-gray-400 font-bold uppercase tracking-wider text-[10px]">Titolo Fase</label>
                <input
                  type="text"
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  placeholder="Es. Consacrazione dell'Atame o Bando"
                  className="w-full bg-[#080612] border border-[#2b244d] rounded-lg p-2.5 text-gray-200 focus:border-[#dfb15b] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-400 font-bold uppercase tracking-wider text-[10px]">Stato Operativo</label>
                <select
                  value={newStepStatus}
                  onChange={(e) => setNewStepStatus(e.target.value as any)}
                  className="w-full bg-[#080612] border border-[#2b244d] rounded-lg p-2.5 text-gray-200 focus:border-[#dfb15b] focus:outline-none cursor-pointer"
                >
                  <option value="planned">Pianificato</option>
                  <option value="in-progress">In Corso</option>
                  <option value="completed">Completato (Fatto)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-gray-400 font-bold uppercase tracking-wider text-[10px]">Annotazioni Rituali</label>
                <textarea
                  rows={3}
                  value={newStepDesc}
                  onChange={(e) => setNewStepDesc(e.target.value)}
                  placeholder="Indica sensazioni avvertite, corrispondenze utilizzate o transiti orari favorevoli..."
                  className="w-full bg-[#080612] border border-[#2b244d] rounded-lg p-2.5 text-gray-200 focus:border-[#dfb15b] focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={addTimelineStep}
              disabled={!newStepTitle.trim()}
              className="w-full bg-[#dfb15b] hover:brightness-110 disabled:brightness-50 text-[#080612] font-serif font-bold py-2.5 rounded-lg text-xs shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Registra nel Fascicolo
            </button>
          </div>
        </div>
      )}

      {/* CLASSIC FLOATING CHAT WIDGET */}
      <div className={`fixed z-50 flex flex-col items-end pointer-events-none transition-all duration-300 ${
        isChatOpen 
          ? "inset-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full h-[100dvh] sm:h-auto sm:w-auto" 
          : "bottom-6 right-6"
      }`} id="floating-chat-widget">
        {/* Chat window pane */}
        {isChatOpen && (
          <div className="w-full sm:w-96 h-full sm:h-[520px] max-h-[100dvh] sm:max-h-[520px] bg-[#0f0c23] sm:bg-[#0f0c23]/95 border-0 sm:border border-[#dfb15b]/45 rounded-none sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden backdrop-blur-md mb-0 sm:mb-4 pointer-events-auto animate-fadeIn animate-duration-300" id="egregora-chat-pane">
            {/* Header */}
            <div className="p-3.5 sm:p-3 bg-[#080612]/90 border-b border-[#2b244d] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-900/30 border border-[#7c3aed] flex items-center justify-center text-purple-300 shrink-0">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-xs font-bold text-[#dfb15b] tracking-wider">L'Egregora dell'Arte</h3>
                  <p className="text-[9px] text-gray-400 font-mono">llama-3.3-70b-versatile • Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearChat}
                  className="text-[11px] sm:text-[10px] text-gray-400 hover:text-white underline font-serif cursor-pointer p-1 rounded hover:bg-white/5 transition-all"
                  title="Azzera Memoria"
                  id="btn-clear-chat"
                >
                  Azzera
                </button>
                <button
                  onClick={() => { setIsChatOpen(false); playKeyClick(300); }}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs bg-[#120f24] text-gray-300 hover:text-white hover:bg-white/10 border border-[#2b244d] transition-all cursor-pointer"
                  id="btn-close-chat"
                >
                  <X className="w-4 h-4 text-[#dfb15b]" />
                  <span className="font-serif">Chiudi</span>
                </button>
              </div>
            </div>

            {/* Linked Dossier Context Banner in Floating Chat */}
            {(linkedInvestigationId || selectedInvId) && (
              <div className="px-3 py-1.5 bg-[#dfb15b]/10 border-b border-[#dfb15b]/30 flex items-center justify-between text-[11px] text-[#dfb15b] font-serif shrink-0">
                <div className="flex items-center gap-1.5 truncate">
                  <Link className="w-3.5 h-3.5 shrink-0 text-[#dfb15b]" />
                  <span className="truncate">Caso: <strong>{investigations.find(i => i.id === (linkedInvestigationId || selectedInvId))?.title || "Dossier Selezionato"}</strong></span>
                </div>
                {linkedInvestigationId && (
                  <button
                    onClick={() => setLinkedInvestigationId(null)}
                    className="text-[9px] text-gray-400 hover:text-white underline shrink-0 ml-1 cursor-pointer font-sans"
                  >
                    Scollega
                  </button>
                )}
              </div>
            )}

            {/* Chat List */}
            <div className="flex-1 p-3.5 sm:p-3 overflow-y-auto space-y-3.5 text-xs bg-[#0b081a]/40" id="chat-messages-container">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex items-start ${msg.role === "user" ? "justify-end space-x-2" : "space-x-2"}`}>
                  {msg.role !== "user" && (
                    <div className="w-7 h-7 rounded-full bg-[#120f24] border border-[#dfb15b]/40 flex items-center justify-center text-[#dfb15b] shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#dfb15b]/10 border border-[#dfb15b]/45 text-gray-150 rounded-tr-none font-serif text-xs"
                      : msg.isError 
                        ? "bg-red-950/40 border border-red-500/40 text-red-200 rounded-tl-none font-mono text-[11px]"
                        : "bg-[#080612] border border-[#2b244d]/80 text-gray-300 rounded-tl-none font-serif text-xs"
                  }`}>
                    {msg.text}
                    
                    {/* Controls for model response */}
                    {msg.role === "model" && !msg.isError && (
                      <div className="mt-2 pt-1.5 border-t border-[#2b244d]/50 flex items-center justify-end gap-1.5 text-[10px]">
                        <button
                          onClick={() => downloadSingleMessagePDF(msg)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#120f24] hover:bg-[#dfb15b]/15 text-[#dfb15b] border border-[#2b244d] hover:border-[#dfb15b]/50 transition-all cursor-pointer font-sans"
                          title="Scarica questo responso in PDF"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF Risposta</span>
                        </button>
                        <button
                          onClick={() => speakMessage(msg.text, msg.id)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-all cursor-pointer font-sans ${
                            speakingMessageId === msg.id 
                              ? "bg-amber-500/20 text-amber-300 border-amber-500 animate-pulse" 
                              : "bg-[#120f24] text-gray-400 hover:text-gray-200 border-[#2b244d]"
                          }`}
                          title={speakingMessageId === msg.id ? "Ferma Lettura" : "Ascolta Risposta"}
                          id={`btn-tts-${msg.id}`}
                        >
                          {speakingMessageId === msg.id ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          <span>{speakingMessageId === msg.id ? "Stop" : "Ascolta"}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-[#dfb15b] text-[#080612] flex items-center justify-center font-bold text-[9px] font-serif shrink-0 mt-0.5 shadow-sm">
                      OP
                    </div>
                  )}
                </div>
              ))}

              {isChatting && (
                <div className="flex items-start space-x-2">
                  <div className="w-7 h-7 rounded-full bg-[#120f24] border border-[#7c3aed]/50 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 animate-spin">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-[#080612]/80 border border-[#2b244d]/80 p-2.5 rounded-xl rounded-tl-none text-gray-400 italic font-mono text-[10px]">
                    L'Egregora sta consultando i transiti astrali...
                  </div>
                </div>
              )}
              
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (chatInput.trim() && !isChatting) {
                  handleSendChatMessage();
                }
              }}
              className="p-2.5 sm:p-3 bg-[#080612]/95 border-t border-[#2b244d] flex items-center gap-1.5 sm:gap-2 pb-3 shrink-0 w-full"
            >
              {/* PDF Download Button */}
              <button
                type="button"
                onClick={downloadChatPDF}
                disabled={chatHistory.length <= 1}
                className="p-2.5 sm:p-2 bg-[#120f24] text-gray-400 hover:text-[#dfb15b] hover:bg-[#dfb15b]/10 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer border border-[#2b244d] shrink-0"
                title="Scarica Chat PDF"
                id="btn-download-chat-pdf"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Speech Input Button */}
              <button
                type="button"
                onClick={startListening}
                className={`p-2.5 sm:p-2 rounded-lg border transition-all cursor-pointer shrink-0 ${
                  isListening 
                    ? "bg-red-500/10 text-red-400 border-red-500 animate-pulse" 
                    : "bg-[#120f24] text-gray-400 hover:text-[#dfb15b] hover:bg-[#dfb15b]/10 border-[#2b244d]"
                }`}
                title={isListening ? "Ascolto attivo... Premi per fermare" : "Invia messaggio vocale"}
                id="btn-voice-input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Chiedi all'Egregora..."
                className="flex-1 min-w-0 bg-[#120f24] border border-[#2b244d] rounded-lg px-3 py-2 text-sm sm:text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#dfb15b] transition-all font-serif"
                id="chat-text-input"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatting}
                className="bg-[#dfb15b] text-[#080612] p-2.5 sm:p-2.5 rounded-lg hover:brightness-110 disabled:brightness-50 transition-all cursor-pointer shadow-md shrink-0 flex items-center justify-center min-w-[38px] min-h-[38px]"
                id="btn-send-chat"
              >
                <Send className="w-4 h-4 text-[#080612]" />
              </button>
            </form>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          onClick={() => { setIsChatOpen(!isChatOpen); playKeyClick(400); }}
          className={`pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-tr from-[#dfb15b] to-[#7c3aed] text-white items-center justify-center shadow-[0_4px_20px_rgba(223,177,91,0.4)] hover:scale-105 transition-all active:scale-95 cursor-pointer relative ${
            isChatOpen ? "hidden sm:flex" : "flex"
          }`}
          id="btn-chat-toggle"
        >
          {isChatOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
          
          {/* Subtle indicator beacon */}
          {!isChatOpen && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-[#080612]"></span>
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
