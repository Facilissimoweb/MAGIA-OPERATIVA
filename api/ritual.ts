import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function generateLocalRitual(diagnosis: any) {
  const isSaturn = diagnosis.archetype?.includes("Saturno") || diagnosis.title?.toLowerCase().includes("saturn") || diagnosis.description?.toLowerCase().includes("saturn");
  const isWater = diagnosis.archetype?.includes("Luna") || diagnosis.archetype?.includes("Acqua") || diagnosis.title?.toLowerCase().includes("lunare") || diagnosis.description?.toLowerCase().includes("ansia");
  const isMars = diagnosis.archetype?.includes("Marte") || diagnosis.archetype?.includes("Fuoco") || diagnosis.title?.toLowerCase().includes("marte") || diagnosis.description?.toLowerCase().includes("rabbia");

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
    formula: "I quattro elementi si armonizzano nel crogiolo della mia coscienza. Il volere è saldo, l'intelletto è limpido, l'action è certa.",
    steps: [
      "Siediti in posizione comoda davanti a una candela gialla accesa.",
      "Compi 4 cicli completi di respirazione quadrata (Box Breathing 4-4-4-4).",
      "Focalizza lo sguardo sulla fiamma visualizzando l'allineamento dei tuoi centri di forza."
    ]
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

  const { diagnosis } = req.body || {};

  try {
    if (!diagnosis) {
      return res.status(400).json({ error: "I dettagli della diagnosi sono richiesti." });
    }

    const apiKey = process.env.GEMINI_API_KEY || "";
    const hasGeminiKey = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";

    if (!hasGeminiKey) {
      const localRitual = generateLocalRitual(diagnosis);
      return res.status(200).json({ ...localRitual, isFallback: true });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemPrompt = `Sei l'Alchimista Supremo del Grimorio Operativo. 
Dato il profilo esoterico e elementale fornito, progetta una formula rituale solenne e pratica.
Rispondi rigorosamente in formato JSON secondo lo schema indicato.`;

    const promptText = `Profilo energetico rilevato:
Titolo: ${diagnosis.title}
Archetipo: ${diagnosis.archetype}
Descrizione: ${diagnosis.description}
Elementi: Fuoco ${diagnosis.elements?.fire}%, Acqua ${diagnosis.elements?.water}%, Terra ${diagnosis.elements?.earth}%, Aria ${diagnosis.elements?.air}%`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
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
    return res.status(200).json({ ...parsedRitual, isFallback: false });

  } catch (error: any) {
    console.error("Gemini ritual error, falling back:", error);
    const localRitual = generateLocalRitual(diagnosis || { title: "Squilibrio", archetype: "Terra" });
    return res.status(200).json({ ...localRitual, isFallback: true, errorMsg: error.message });
  }
}
