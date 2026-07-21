import dotenv from "dotenv";

dotenv.config();

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

export default async function handler(req: any, res: any) {
  // Add CORS headers
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

  try {
    const { message, history } = req.body || {};

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

    const groqApiKey = process.env.GROQ_API_KEY || "";
    const hasGroqKey = groqApiKey && groqApiKey !== "MY_GROQ_API_KEY" && groqApiKey.trim() !== "";

    if (hasGroqKey) {
      try {
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
            return res.status(200).json({ response: reply, isFallback: false, source: "groq" });
          }
        } else {
          const errorText = await response.text();
          console.warn(`Groq API responded with status ${response.status}: ${errorText}`);
        }
      } catch (groqErr) {
        console.error("Groq API call failed:", groqErr);
      }
    } else {
      console.warn("No GROQ_API_KEY environment variable detected.");
    }

    // High-fidelity local algorithmic fallback
    const fallbackReply = generateLocalChatResponse(message);
    return res.status(200).json({ response: fallbackReply, isFallback: true, source: "local" });

  } catch (error: any) {
    console.error("Vercel Serverless Function critical chat error:", error);
    return res.status(200).json({
      response: `Errore di Connessione / Rete nell'Endpoint: ${error.message || "Errore di connessione con l'Egregora."}`,
      isError: true,
      source: "error"
    });
  }
}
