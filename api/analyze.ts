import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function generateLocalAnalysis(problem: string, intent: string) {
  const lower = problem.toLowerCase();
  
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

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { problem, intent } = req.body || {};

  try {
    if (!problem) {
      return res.status(400).json({ error: "Il testo della problematica è richiesto." });
    }

    const apiKey = process.env.GEMINI_API_KEY || "";
    const hasGeminiKey = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";

    if (!hasGeminiKey) {
      console.log("No valid Gemini API Key. Using high-fidelity local generator fallback.");
      const fallbackResult = generateLocalAnalysis(problem, intent || "banishing");
      return res.status(200).json({ ...fallbackResult, isFallback: true });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemPrompt = `Sei l'archetipo dell'Alta Magia Operativa, esperto di Alchimia Ermetica e Astrologia Caldea.
Analizza la problematica fornita in termini di forze elementali (Fuoco, Acqua, Terra, Aria) e influenze planetarie.
Fornisci una diagnosi accurata e rispondi rigorosamente seguendo la struttura JSON richiesta.`;

    const promptText = `Problematica dell'operatore: "${problem}"
Inclinazione operativa selezionata: "${intent || "banishing"}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
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
    return res.status(200).json({ ...parsedResult, isFallback: false });

  } catch (error: any) {
    console.error("Gemini analysis error, falling back:", error);
    const fallback = generateLocalAnalysis(problem || "", intent || "banishing");
    return res.status(200).json({ ...fallback, isFallback: true, errorMsg: error.message });
  }
}
