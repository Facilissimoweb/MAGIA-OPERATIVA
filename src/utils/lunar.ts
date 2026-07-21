export interface MoonPhaseData {
  cycleDay: string;
  illumination: number;
  phaseName: string;
  icon: "moon" | "circle" | "sun";
  advice: string;
  zodiacName: string;
  candle: string;
  work: string;
}

export function getMoonPhaseData(date: Date): MoonPhaseData {
  // Reference New Moon: 11 January 2024 11:57 UTC
  // Synodic month = 29.530588 days
  const refNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57)).getTime();
  const synodicMonth = 29.530588;
  const daysSinceRef = (date.getTime() - refNewMoon) / (1000 * 60 * 60 * 24);
  const cycleDay = ((daysSinceRef % synodicMonth) + synodicMonth) % synodicMonth;
  const illumination = Math.round((1 - Math.cos((cycleDay / synodicMonth) * 2 * Math.PI)) / 2 * 100);

  let phaseName = "";
  let icon: "moon" | "circle" | "sun" = "moon";
  let advice = "";
  let candle = "Bianca";
  let work = "Meditazione & Inizio";

  if (cycleDay < 1.84 || cycleDay > 27.68) {
    phaseName = "Luna Nuova (Novilunio)";
    icon = "circle";
    advice = "Fase di vuoto fertile e profonda introspezione. Ideale per pianificare intenzioni segrete, seminare progetti o effettuare purificazioni e bandi in silenzio ermetico.";
    candle = "Nera o Viola Scuro";
    work = "Introspezione & Bando Iniziale";
  } else if (cycleDay < 7.38) {
    phaseName = "Luna Crescente";
    icon = "moon";
    advice = "Le correnti cosmiche si espandono. Fase eccellente per riti di attrazione, propiziazione economica, stimolo professionale e consacrazione di nuovi talismani.";
    candle = "Verde o Dorata";
    work = "Attrazione, Salute & Consacrazione";
  } else if (cycleDay < 9.22) {
    phaseName = "Primo Quarto";
    icon = "moon";
    advice = "Sforzo e superamento delle prime resistenze materiali. Ottimo per rafforzare la volontà magica e infondere carica vitale ad amuleti protettivi.";
    candle = "Gialla o Rossa";
    work = "Sviluppo di Forza & Ostacoli";
  } else if (cycleDay < 12.91) {
    phaseName = "Gibbosa Crescente";
    icon = "moon";
    advice = "L'energia si avvicina al suo culmine. Ottimo momento per rifinire i preparativi dei riti, sintonizzare i dettagli dell'intento e accumulare concentrazione astrale.";
    candle = "Arancione o Porpora";
    work = "Focalizzazione & Accrescimento";
  } else if (cycleDay < 16.61) {
    phaseName = "Luna Piena (Plenilunio)";
    icon = "sun";
    advice = "Apogeo di splendore e potenza energetica. Fase ideale per la trance attiva, la carica diretta di sigilli grafici, la divinazione speculare e le evocazioni ad alto impatto.";
    candle = "Argento, Bianca o Rubino";
    work = "Massima Carica, Invocazione & Trance";
  } else if (cycleDay < 20.30) {
    phaseName = "Gibbosa Calante";
    icon = "moon";
    advice = "Energia di restituzione, ringraziamento e riflusso. Ideale per ringraziare le forze evocate, stabilizzare i successi conseguiti ed elaborare le intuizioni ricevute.";
    candle = "Azzurra o Blu Notte";
    work = "Ringraziamento, Consolidamento & Studio";
  } else if (cycleDay < 23.99) {
    phaseName = "Ultimo Quarto";
    icon = "moon";
    advice = "Rottura attiva di legami indesiderati ed eliminazione di scorie psichiche. Ottimo per eseguire tagli operativi energetici, allontanare avversari o bloccare invidie.";
    candle = "Rosso Cupo o Bruno";
    work = "Taglio di Vincoli & Distruzione Blocchi";
  } else {
    phaseName = "Luna Calante";
    icon = "moon";
    advice = "Fase finale di scarico e purificazione ermetica. Giorno eccellente per riti di scudo protettivo, purificazione profonda degli spazi e difesa psichica.";
    candle = "Nera o Grigia";
    work = "Protezione, Scudo, Purificazione Profonda";
  }

  // Sidereal month = 27.32166 days (for approximate zodiac calculations)
  const zodiacSigns = [
    "Ariete (Fuoco)",
    "Toro (Terra)",
    "Gemelli (Aria)",
    "Cancro (Acqua)",
    "Leone (Fuoco)",
    "Vergine (Terra)",
    "Bilancia (Aria)",
    "Scorpione (Acqua)",
    "Sagittario (Fuoco)",
    "Capricorno (Terra)",
    "Acquario (Aria)",
    "Pesci (Acqua)"
  ];
  const siderealMonth = 27.321661;
  const zodiacIndex = Math.floor(((((daysSinceRef / siderealMonth) * 12 + 9) % 12) + 12) % 12);
  const zodiacName = zodiacSigns[zodiacIndex];

  return {
    cycleDay: cycleDay.toFixed(1),
    illumination,
    phaseName,
    icon,
    advice,
    zodiacName,
    candle,
    work
  };
}
