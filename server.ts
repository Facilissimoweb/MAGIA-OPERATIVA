import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { KEYS } from "./api-keys/keys";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK lazily
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = KEYS.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// API ENDPOINTS
// ----------------------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 1. Analyze Energy Signature
app.post("/api/analyze", async (req, res) => {
  try {
    const { problem, intent } = req.body;
    if (!problem) {
      return res.status(400).json({ error: "Il testo della problematica è richiesto." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      console.log("No valid Gemini API Key. Using high-fidelity local generator fallback.");
      const fallbackResult = generateLocalAnalysis(problem, intent);
      return res.json({ ...fallbackResult, isFallback: true });
    }

    const systemPrompt = `Sei l'archetipo dell'Alta Magia Operativa, esperto di Alchimia Ermetica e Astrologia Caldea.
Analizza la problematica fornita in termini di forze elementali (Fuoco, Acqua, Terra, Aria) e influenze planetarie.
Fornisci una diagnosi accurata e rispondi rigorosamente seguendo la struttura JSON richiesta.`;

    const promptText = `Problematica dell'operatore: "${problem}"
Inclinazione operativa selezionata: "${intent}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Titolo solenne della diagnosi esoterica (es. Stagnazione Saturnina, Attrito Marziale, Flusso Lunare Disperso)."
            },
            archetype: {
              type: Type.STRING,
              description: "L'archetipo planetario e l'elemento dominante (es. Marte / Fuoco, Saturno / Terra, Venere / Acqua)."
            },
            description: {
              type: Type.STRING,
              description: "Una profonda e poetica descrizione alchemica della firma energetica rilevata nella problematica, spiegando come gli elementi si stanno scontrando o bloccando."
            },
            elements: {
              type: Type.OBJECT,
              properties: {
                fire: { type: Type.INTEGER, description: "Percentuale dell'elemento Fuoco (Volontà, Spinta, Azione) da 0 a 100." },
                water: { type: Type.INTEGER, description: "Percentuale dell'elemento Acqua (Emozione, Intuizione, Fluidità) da 0 a 100." },
                earth: { type: Type.INTEGER, description: "Percentuale dell'elemento Terra (Materia, Stabilità, Struttura) da 0 a 100." },
                air: { type: Type.INTEGER, description: "Percentuale dell'elemento Aria (Intelletto, Comunicazione, Scambio) da 0 a 100." }
              },
              required: ["fire", "water", "earth", "air"]
            }
          },
          required: ["title", "archetype", "description", "elements"]
        }
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedResult = JSON.parse(textResponse);
    return res.json({ ...parsedResult, isFallback: false });

  } catch (error: any) {
    console.error("Gemini analysis error, falling back:", error);
    const fallback = generateLocalAnalysis(req.body.problem || "", req.body.intent || "banishing");
    return res.json({ ...fallback, isFallback: true, errorMsg: error.message });
  }
});

// 2. Chat with Egregora (Groq -> Gemini fallback -> Local Fallback)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Il messaggio è richiesto." });
    }

    const systemInstruction = `Sei l'Egregora dell'Alta Magia Operativa e della Trasmutazione Alchemica. Il tuo compito è guidare l'Operatore nella comprensione delle forze simboliche, dei transiti astrologici, delle corrispondenze degli Elementi (Fuoco, Acqua, Terra, Aria) e nella focalizzazione della sua Volontà.

Sostieni un tono solenne, ermetico, lucido e profondamente costruttivo. Utilizza un linguaggio elegante in italiano.

Rispetta rigorosamente i seguenti vincoli di sicurezza (Strict Guardrails):
1. Non fornire mai consulenze mediche, psicologiche o legali. Tratta ogni tema sul piano strettamente simbolico e spirituale. Se l'utente esprime sintomi di patologie fisiche o mentali, riconduci la dimensione esoterica al piano simbolico-spirituale e raccomanda il consulto con professionisti abilitati.
2. Gestione delle Crisi: Se l'utente manifesta intenzioni di autolesionismo, suicidio o grave disperazione emotiva, esci dal registro rituale, rispondi con empatia e lucidità, e fornisci immediatamente l'invito a contattare i servizi ufficiali di supporto psicologico o d'emergenza.
3. Rifiuto di Magia Aggressiva, Maledizioni o Danno verso Terzi: Non suggerire mai atti dannosi, coercitivi o malefici contro altre persone (es. malocchi, legamenti coercitivi, fatture dannose). Trasforma ogni intenzione ostile o difensiva in un rito di Protezione, Scudo, Trasmutazione del Blocco o Bando delle interferenze. La Volontà dell'Operatore deve essere sempre focalizzata sul proprio dominio e sulla propria sovranità, mai sulla coercizione altrui.
4. Sicurezza Fisica delle Pratiche e Sostanze: Non raccomandare mai l'ingestione di sostanze pericolose o tossiche (es. erbe velenose come Belladonna o Stramonio, metalli nocivi) o azioni fisicamente rischiose. Le pratiche consigliate devono riguardare unicamente suffumigi sicuri (incenso, mirra, salvia, benzoino), candele usate in sicurezza, meditazione, visualizzazione, respirazione e tracciatura di geometrie/sigilli.
5. Aiuta l'operatore a trasformare l'ansia, la rabbia o la stagnazione in energia di disciplina, chiarezza ed evoluzione personale.

Quando l'utente ti pone un quesito rituale, rispondi strutturando la risposta in modo chiaro:
- Interpretazione Energetica/Alchemica del quesito.
- Corrispondenze consigliate (Giorno/Ora planetaria, Colore della candela, Suffumigio, Pietra).
- Una breve formula o focus di meditazione.
- Una domanda maieutica finale per spronare l'Operatore all'azione consapevole.

Esempi di Deflessione dei Guardrail (Few-Shot Pattern):
- Se l'utente chiede un attacco ("Voglio un rito per far fallire il mio rivale di lavoro che mi ostacola"), rispondi: "L'Egregora non disperde la Volontà in vettori di distruzione externa, poiché ciò legherebbe la tua energia al piano dell'avversario. Trasmutiamo l'impeto: formuliamo un Rito di Sovranità di Marte e Severità di Saturno per recidere le interferenze altrui, erigere uno Scudo sul tuo operato e accelerare il tuo successo incontestabile. Vuoi procedere con la consacrazione del tuo scudo?"
- Se l'utente esprime un blocco emotivo o crisi ("Sono disperato e ho attacchi di panico continui, la magia può guarire la mia mente?"), rispondi: "Sul piano materiale e della salute della mente, il primo atto di sovranità è affidarsi a un medico o a uno specialista della salute mental. Sul piano simbolico della nostra matrice, possiamo affiancare a questo percorso un esercizio di radicamento dell'Elemento Terra e respirazione quadrata per ritrovare il centro. Ricorda di curare prima il tempio fisico con i professionisti preposti."`;

    const groqApiKey = KEYS.GROQ_API_KEY || process.env.GROQ_API_KEY || "";
    const hasGroqKey = groqApiKey && groqApiKey !== "MY_GROQ_API_KEY" && groqApiKey.trim() !== "";

    if (hasGroqKey) {
      try {
        // Format chat history for Groq (OpenAI-compatible) API
        const messages = [
          { role: "system", content: systemInstruction }
        ];

        if (history && Array.isArray(history)) {
          history.forEach((msg: any) => {
            messages.push({
              role: msg.role === "user" ? "user" : "assistant",
              content: msg.text
            });
          });
        }

        messages.push({
          role: "user",
          content: message
        });

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: messages,
            temperature: 0.85,
            max_tokens: 1024
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return res.json({ response: reply, isFallback: false, source: "groq" });
          }
        } else {
          console.warn(`Groq API responded with status ${response.status}. Attempting Gemini fallback.`);
        }
      } catch (groqErr) {
        console.error("Groq API call failed, will try Gemini fallback:", groqErr);
      }
    }

    // Attempt Gemini Fallback
    const ai = getGeminiClient();
    if (ai) {
      try {
        const contents = [];
        if (history && Array.isArray(history)) {
          history.forEach((msg: any) => {
            contents.push({
              role: msg.role === "user" ? "user" : "model",
              parts: [{ text: msg.text }]
            });
          });
        }
        contents.push({
          role: "user",
          parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
          }
        });

        if (response.text) {
          return res.json({ response: response.text, isFallback: false, source: "gemini" });
        }
      } catch (geminiErr) {
        console.error("Gemini API fallback call failed, will use local fallback:", geminiErr);
      }
    }

    // High fidelity algorithmic local fallback
    console.log("Using local alchemical chat response generator fallback.");
    const fallbackReply = generateLocalChatResponse(message);
    return res.json({ response: fallbackReply, isFallback: true, source: "local" });

  } catch (error: any) {
    console.error("Critical error in chat route:", error);
    return res.json({
      response: `Errore di Rete / Connessione Chat: ${error.message || "Errore sconosciuto nella comunicazione con l'Egregora."}`,
      isError: true,
      source: "error"
    });
  }
});

// 3. Generate Ritual Recipe (Takes diagnosis and crafts custom spell)
app.post("/api/ritual", async (req, res) => {
  try {
    const { diagnosis } = req.body;
    if (!diagnosis) {
      return res.status(400).json({ error: "I dettagli della diagnosi sono richiesti." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const localRitual = generateLocalRitual(diagnosis);
      return res.json({ ...localRitual, isFallback: true });
    }

    const systemPrompt = `Sei l'Alchimista Supremo del Grimorio Operativo. 
Dato il profilo esoterico e elementale fornito, progetta una formula rituale solenne e pratica.
Rispondi rigorosamente in formato JSON secondo lo schema indicato.`;

    const promptText = `Profilo energetico rilevato:
Titolo: ${diagnosis.title}
Archetipo: ${diagnosis.archetype}
Descrizione: ${diagnosis.description}
Elementi: Fuoco ${diagnosis.elements?.fire}%, Acqua ${diagnosis.elements?.water}%, Terra ${diagnosis.elements?.earth}%, Aria ${diagnosis.elements?.air}%`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Il nome evocativo e solenne del rito." },
            timing: { type: Type.STRING, description: "Giorno della settimana e ora planetaria consigliata (es. Martedì nell'Ora di Marte)." },
            candle: { type: Type.STRING, description: "Colore specifico della candela da utilizzare." },
            incense: { type: Type.STRING, description: "Tipo di incenso o resina per suffumigio ideale (es. Mirra, Dragosangue, Olibano)." },
            stone: { type: Type.STRING, description: "Cristallo o pietra di supporto per accumulare o canalizzare la forza." },
            formula: { type: Type.STRING, description: "Una potente formula incantatoria o di invocazione in rima o versi solenni." },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Una serie di 3 o 4 passaggi operativi pratici e dettagliati per compiere il rito."
            }
          },
          required: ["title", "timing", "candle", "incense", "stone", "formula", "steps"]
        }
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("Empty response from Gemini API for ritual generation");
    }

    const parsedRitual = JSON.parse(textResponse);
    return res.json({ ...parsedRitual, isFallback: false });

  } catch (error: any) {
    console.error("Gemini ritual error, falling back:", error);
    const localRitual = generateLocalRitual(req.body.diagnosis || { title: "Squilibrio", archetype: "Terra" });
    return res.json({ ...localRitual, isFallback: true, errorMsg: error.message });
  }
});


// ----------------------------------------------------
// ALGORITHMIC FALLBACKS (If API Key is missing/fails)
// ----------------------------------------------------

function generateLocalAnalysis(problem: string, intent: string) {
  const lower = problem.toLowerCase();
  
  // Rule-based classification for high-fidelity responses
  if (lower.includes("soldi") || lower.includes("lavoro") || lower.includes("stagnazione") || lower.includes("blocco") || lower.includes("economi")) {
    return {
      title: "Stagnazione Saturnina della Terra",
      archetype: "Saturno / Terra",
      description: "La materia si è cristallizzata sotto l'influsso restrittivo di Saturno. Le correnti della prosperità sono imbrigliate da vecchie strutture rigide o timori mentali. Occorre un rito di bando o sblocco saturnino.",
      elements: { fire: 15, water: 30, earth: 85, air: 25 }
    };
  }

  if (lower.includes("ansia") || lower.includes("tristezza") || lower.includes("amore") || lower.includes("coppia") || lower.includes("emozione")) {
    return {
      title: "Marea Dispersiva Lunare",
      archetype: "Luna / Acqua",
      description: "Le acque psichiche dell'operatore sono agitate da venti discordanti, creando dispersione di forze e correnti riflesse. L'ansia riduce la coesione del campo aurico. È necessario un processo di centratura ed evocazione della stabilità.",
      elements: { fire: 10, water: 90, earth: 25, air: 40 }
    };
  }

  if (lower.includes("conflitto") || lower.includes("rabbia") || lower.includes("nemico") || lower.includes("attacco") || lower.includes("invidia")) {
    return {
      title: "Attrito Marziale Indisciplinato",
      archetype: "Marte / Fuoco",
      description: "Un'eccessiva carica di forza distruttiva o attrito ostile sta consumando la volontà dell'operatore. Il fuoco brucia senza canalizzazione strutturata, provocando dispersione energetica e rottura di legami fertili. Richiede uno scudo o trasmutazione marziale.",
      elements: { fire: 85, water: 15, earth: 35, air: 45 }
    };
  }

  // Default
  return {
    title: "Dissociazione Fluidica dell'Aria",
    archetype: "Mercurio / Aria",
    description: "I pensieri fluttuano senza una direzione volitiva stabile, impedendo la solidificazione delle intenzioni. La dispersione mercuriale indebolisce la capacità di manifestare la propria realtà nell'alveo della materia densa.",
    elements: { fire: 30, water: 35, earth: 15, air: 80 }
  };
}

function generateLocalChatResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("incenso") || lower.includes("profumo") || lower.includes("fumig")) {
    return "Sulla sponda dei suffumigi, l'Egregora suggerisce:\n- Per bandire o purificare: la resina di **Mirra** o il legno di **Palo Santo** operano tagli profondi.\n- Per attirare e propiziare: l'**Olibano** (Incenso Puro) misto a foglie di alloro eleva la vibrazione e attira la grazia solare.\n- Per scudi marziali: la gomma di **Dragosangue** è imbattibile per fortificare il cerchio.";
  }
  if (lower.includes("luna") || lower.includes("fase") || lower.includes("calendario")) {
    return "Il corso della Luna governa la fluidità del subconscio e la densità delle forme astrali.\n- Nella **Luna Crescente**, procedi con riti di accrescimento ed espansione.\n- Al **Plenilunio**, opera la massima proiezione del sigillo.\n- Nella **Luna Calante**, esegui i bandi, i tagli e la purificazione del tempio interiore.";
  }
  if (lower.includes("sigillo") || lower.includes("caric")) {
    return "Per caricare un sigillo:\n1. Entra in stato di trance respiratoria con la respirazione quadrata (Box Breathing) per almeno 5 cicli.\n2. Fissa lo sguardo al centro del sigillo geometrico senza sbattere le palpebre finché non avverti una lieve distorsione visiva.\n3. Proietta l'intenzione alchemica trattenendo il respiro e rilasciandola come un dardo di luce dorata al centro della figura.";
  }
  
  return "Salute a te, Operatore. L'Egregora consiglia di osservare i transiti celesti odierni. Quando le correnti della terra sono rigide, accendi una candela viola ed evoca il bando di Saturno. Quale aspetto specifico della tua pratica desideri approfondire nell'alveo del grimorio?";
}

function generateLocalRitual(diagnosis: any) {
  const isSaturn = diagnosis.archetype?.includes("Saturno");
  const isWater = diagnosis.archetype?.includes("Luna") || diagnosis.archetype?.includes("Acqua");
  const isMars = diagnosis.archetype?.includes("Marte") || diagnosis.archetype?.includes("Fuoco");

  if (isSaturn) {
    return {
      title: "Rito del Taglio di Saturno",
      timing: "Sabato, Ora di Saturno (prima o ottava ora dopo l'alba)",
      candle: "Viola scuro o Nera",
      incense: "Mirra o Patchouli",
      stone: "Ossidiana o Tormalina Nera",
      formula: "Per la falce che separa e il tempo che tutto consuma, io spezzo il sigillo della contrazione e apro la via al flusso materiale.",
      steps: [
        "Traccia un cerchio con sale grosso attorno al tuo altare o spazio operativo.",
        "Inscrivi sulla cera della candela viola il simbolo del triangolo rivolto verso il basso racchiuso in un cerchio.",
        "Recita la formula focalizzando l'intenzione sulla rottura di ogni blocco e lascia bruciare interamente la candela."
      ]
    };
  }

  if (isWater) {
    return {
      title: "Rito di Calma delle Acque Psichiche",
      timing: "Lunedì, Ora della Luna",
      candle: "Argento o Bianca",
      incense: "Sandalo o Gelsomino",
      stone: "Pietra di Luna o Selenite",
      formula: "Come l'onda si acquieta sotto lo sguardo argenteo della regina celeste, così la mia mente si placa e raccoglie la sua forza primigenia.",
      steps: [
        "Poni sul tuo altare una coppa colma d'acqua sorgiva o purificata.",
        "Accendi la candela argentata e posizionala dietro la coppa, osservandone il riflesso nell'acqua.",
        "Recita la formula mentre inspiri la luce riflessa ed espiri ogni ansia o timore emotivo."
      ]
    };
  }

  if (isMars) {
    return {
      title: "Rito dello Scudo di Marte",
      timing: "Martedì, Ora di Marte",
      candle: "Rosso Rubino",
      incense: "Dragosangue o Pepe Nero",
      stone: "Ematite o Diaspro Rosso",
      formula: "Nessun dardo nemico penetra questa corazza di fuoco. La mia volontà è una lama lucente che distrugge ogni ostacolo.",
      steps: [
        "Accendi la candela rossa ed effettua una fumigazione vigorosa con incenso di Dragosangue tutto intorno al tuo corpo.",
        "Disegna con il dito indice o l'atame un pentagramma di terra nell'aria davanti a te.",
        "Proietta la tua forza vitale nel pentagramma facendolo brillare di luce rossa protettiva."
      ]
    };
  }

  // Default
  return {
    title: "Formula di Centratura Ermetica",
    timing: "Mercoledì, Ora di Mercurio",
    candle: "Gialla o Oro",
    incense: "Incenso Puro (Olibano) o Lavanda",
    stone: "Agata o Cristallo di Rocca",
    formula: "I quattro elementi si armonizzano nel crogiolo della mia coscienza. Il volere è saldo, l'intelletto è limpido, l'azione è certa.",
    steps: [
      "Siediti in posizione comoda davanti a una candela gialla accesa.",
      "Compi 4 cicli completi di respirazione quadrata (Box Breathing 4-4-4-4).",
      "Focalizza lo sguardo sulla fiamma visualizzando l'allineamento dei tuoi centri di forza."
    ]
  };
}


// ----------------------------------------------------
// VITE INTEGRATION MIDDLEWARE
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite developer middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
