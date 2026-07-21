export interface TarotCard {
  id: string;
  number: number;
  roman: string;
  name: string;
  keywords: string[];
  element: "Fuoco" | "Acqua" | "Aria" | "Terra" | "Spirito";
  astrology: string;
  color: string;
  description: string;
  diritta: string;
  capovolta: string;
  symbolism: { item: string; meaning: string }[];
  accogliere: {
    personale: string;
    relazioni: string;
    lavoro: string;
  };
}

export const ARCANI_MAGGIORI: TarotCard[] = [
  {
    id: "matto",
    number: 0,
    roman: "0",
    name: "Il Matto",
    keywords: ["Nuovi inizi", "Spontaneità", "Fede incrollabile", "Innocenza", "Libertà"],
    element: "Aria",
    astrology: "Urano",
    color: "Giallo",
    description: "Un giovane viandante si staglia sul ciglio di un precipizio, lo sguardo rivolto verso l'alto. Accompagnato da un cagnolino bianco, reca con sé un piccolo fardello e una rosa bianca, simbolo di purezza.",
    diritta: "Rappresenta uno stato di ingenuità e apertura mentale ideale quando si intraprende il cammino verso l'illuminazione. Simboleggia un salto di fede, infinite possibilità e l'inizio di una meravigliosa avventura senza pregiudizi.",
    capovolta: "Indica sventatezza, irresponsabilità, blocchi dovuti alla paura dell'ignoto o un comportamento sconsiderato che rasenta la follia. Esitazione eccessiva o avventatezza nociva.",
    symbolism: [
      { item: "Precipizio", meaning: "Il confine dell'ignoto e il salto nel vuoto." },
      { item: "Cagnolino bianco", meaning: "L'istinto animale fedele che avverte dei pericoli fisici." },
      { item: "Fardello", meaning: "Le esperienze passate ridotte all'essenziale, non ancora pesanti." }
    ],
    accogliere: {
      personale: "Inizia qualcosa di completamente nuovo senza farti frenare dalle aspettative esterne.",
      relazioni: "Porta freschezza ed entusiasmo nei tuoi rapporti; concediti di essere vulnerabile.",
      lavoro: "Esplora carriere non convenzionali o avvia un progetto innovativo azzardando con fiducia."
    }
  },
  {
    id: "mago",
    number: 1,
    roman: "I",
    name: "Il Mago",
    keywords: ["Manifestazione", "Forza di volontà", "Iniziativa", "Risorse mentali", "Abilità"],
    element: "Aria",
    astrology: "Mercurio",
    color: "Rosso / Giallo",
    description: "In piedi davanti a un tavolo su cui sono disposti i quattro simboli degli Arcani Minori (bastone, coppa, spada, denaro). Ha un braccio proteso verso il cielo e l'altro verso la terra, canalizzando l'energia cosmica.",
    diritta: "Indica che possiedi tutti gli strumenti materiali e spirituali per plasmare la tua realtà. È il momento di focalizzare la tua Volontà incrollabile per manifestare i tuoi desideri profondi.",
    capovolta: "Rivelazione di inganni, manipolazioni, energia sprecata o abilità usate per scopi egoistici ed effimeri. Mancanza di pianificazione o esitazione nel momento decisivo.",
    symbolism: [
      { item: "Quattro Simboli", meaning: "Rappresentano la maestria sui quattro elementi naturali (Fuoco, Acqua, Aria, Terra)." },
      { item: "Lemniscata (∞)", meaning: "La natura infinita della mente e dell'energia spirituale canalizzata." },
      { item: "Gesto delle mani", meaning: "Il principio ermetico di corrispondenza: 'Come sopra, così sotto'." }
    ],
    accogliere: {
      personale: "Riconosci il tuo potere personale e agisci per dare forma visibile alle tue idee.",
      relazioni: "Comunica con chiarezza magnetica ed onestà assoluta per sbloccare i conflitti di coppia.",
      lavoro: "Sfrutta al massimo le tue competenze tecniche ed intellettuali per promuovere il tuo valore."
    }
  },
  {
    id: "papessa",
    number: 2,
    roman: "II",
    name: "La Papessa",
    keywords: ["Intuizione", "Inconscio", "Mistero", "Saggezza interiore", "Silenzio"],
    element: "Acqua",
    astrology: "Luna",
    color: "Blu / Viola",
    description: "Seduta sul trono tra due colonne, una nera (Boaz) e una bianca (Jachin). Regge tra le mani un rotolo della legge semivelato, simbolo di conoscenze nascoste.",
    diritta: "Rappresenta l'invito a rallentare, connettersi con il proprio intuito profondo e attendere che i segreti si svelino spontaneamente. Custode del tempio interiore e della conoscenza ermetica.",
    capovolta: "Indica segreti svelati con malizia, superficialità distruttiva, ignoranza dei segnali intuitivi o freddezza emotiva che isola l'operatore.",
    symbolism: [
      { item: "Colonne Boaz e Jachin", meaning: "I pilastri della dualità cosmica (luce e oscurità, conscio e inconscio)." },
      { item: "Rotolo della Tora", meaning: "La legge divina e la conoscenza esoterica velata agli occhi profani." },
      { item: "Corona lunare", meaning: "Il legame indissolubile con i cicli dell'inconscio e la ricezione magnetica." }
    ],
    accogliere: {
      personale: "Dedica del tempo al silenzio o alla meditazione ermetica per ascoltare la voce del tuo intuito.",
      relazioni: "Non affrettare le cose; permetti all'intimità di crescere attraverso la comprensione profonda.",
      lavoro: "Usa la discrezione ed analizza approfonditamente i dettagli prima di firmare contratti o alleanze."
    }
  },
  {
    id: "imperatrice",
    number: 3,
    roman: "III",
    name: "L'Imperatrice",
    keywords: ["Abbondanza", "Femminilità", "Natura", "Creatività", "Nutrimento"],
    element: "Terra",
    astrology: "Venere",
    color: "Verde / Rosa",
    description: "Una figura regale siede circondata da un lussureggiante campo di grano dorato e foreste. Indossa una veste decorata con melograni, simboli di fertilità assoluta.",
    diritta: "Esprime l'energia fertile della creazione, la bellezza sensoriale e la prosperità materiale. È favorevole per nascite di progetti artistici, rigenerazione fisica e connessione con la natura.",
    capovolta: "Segnala blocchi creativi, dipendenza emotiva, tendenza a soffocare gli altri per iperprotettività o sterilità d'intento. Spreco di risorse.",
    symbolism: [
      { item: "Melograni", meaning: "La fertilità, l'abbondanza dei frutti della terra e della mente." },
      { item: "Grano dorato", meaning: "Il raccolto maturo e il nutrimento materiale assicurato." },
      { item: "Scudo con simbolo di Venere", meaning: "L'amore incondizionato e la forza generatrice dell'universo." }
    ],
    accogliere: {
      personale: "Coltiva l'amore per te stesso ed apprezza la bellezza nei piccoli piaceri sensoriali.",
      relazioni: "Nutri i legami affettivi con generosità, calore e armonia espressiva.",
      lavoro: "Consenti alle tue idee di maturare organicamente senza forzare artificialmente i tempi."
    }
  },
  {
    id: "imperatore",
    number: 4,
    roman: "IV",
    name: "L'Imperatore",
    keywords: ["Autorità", "Struttura", "Controllo", "Protezione paterna", "Ordine stabile"],
    element: "Terra",
    astrology: "Ariete",
    color: "Rosso / Marrone",
    description: "Un sovrano saggio e severo siede su un trono di pietra massiccia decorato con teste di ariete. Impugna lo scettro dell'Ankh e un globo dorato, indossando una solida armatura metallica.",
    diritta: "Simboleggia la capacità di stabilire confini chiari, imporre la disciplina, strutturare i progetti e regnare sovrano sulla propria vita materiale con pragmatismo e autorità protettiva.",
    capovolta: "Indica tirannia, rigidità mentale paralizzante, abuso di potere, mancanza di disciplina o ribellione contro l'ordine costituito che sfocia nel caos.",
    symbolism: [
      { item: "Trono di pietra", meaning: "La stabilità immutabile delle strutture terrene." },
      { item: "Teste di Ariete", meaning: "La determinazione infuocata, il coraggio pionieristico e la leadership." },
      { item: "Scettro Ankh", meaning: "Il potere sovrano sulla vita, la morte e la manifestazione terrena." }
    ],
    accogliere: {
      personale: "Stabilisci regole chiare nella tua routine quotidiana per massimizzare la produttività personale.",
      relazioni: "Offri stabilità energetica e confini sani a chi ami, senza scadere nel controllo ossessivo.",
      lavoro: "Organizza le tue finanze e le tue mansioni lavorative con rigore geometrico ed efficienza."
    }
  },
  {
    id: "papa",
    number: 5,
    roman: "V",
    name: "Il Papa",
    keywords: ["Tradizione", "Insegnamento", "Valori morali", "Istituzioni", "Guida spirituale"],
    element: "Terra",
    astrology: "Toro",
    color: "Rosso / Blu",
    description: "Seduto in trono dinanzi a due discepoli, compie un gesto di benedizione esoterica. Impugna una tripla croce e ha due chiavi incrociate ai suoi piedi.",
    diritta: "Rappresenta l'apprendimento formale, il rispetto per i codici morali ed esoterici consolidati, l'iniziazione spirituale e l'accesso ad antiche verità tramandate con sapienza.",
    capovolta: "Esprime anticonformismo radicale, dogmatismo soffocante, ipocrisia, falsi profeti o la necessità di liberarsi da vecchi schemi obsoleti che non risuonano più.",
    symbolism: [
      { item: "Chiavi incrociate", meaning: "L'accesso ai misteri celesti e terrestri, lo sblocco dell'inconscio." },
      { item: "Triplo Regno", meaning: "Il dominio spirituale sui tre mondi: Celeste, Terrestre e Infero." },
      { item: "Gesto di Benedizione", meaning: "La trasmissione del sacro e l'allineamento con l'ordine cosmico." }
    ],
    accogliere: {
      personale: "Studia un'antica disciplina o dedicati alla lettura di testi sapienziali per espandere il tuo intelletto.",
      relazioni: "Condividi valori spirituali o filosofici profondi con le persone a te vicine.",
      lavoro: "Cerca un mentore esperto o adoperati per agire nel rispetto delle regole comunitarie consolidate."
    }
  },
  {
    id: "amanti",
    number: 6,
    roman: "VI",
    name: "Gli Amanti",
    keywords: ["Scelte", "Relazioni", "Armonia", "Valori personali", "Unione"],
    element: "Aria",
    astrology: "Gemelli",
    color: "Viola / Rosa",
    description: "Una coppia nuda nel Giardino dell'Eden benedetta da un angelo luminoso nel cielo. Sullo sfondo si stagliano l'Albero della Vita e l'Albero della Conoscenza del Bene e del Male con il serpente.",
    diritta: "Simboleggia l'armonia degli opposti (maschile e femminile), la necessità di compiere una scelta fondamentale dettata dall'allineamento con i propri valori spirituali ed il potere dell'amore purificatore.",
    capovolta: "Indica disarmonia interiore, conflitti relazionali, scelte sbagliate fatte per pressione sociale o allontanamento dai propri valori etici primari.",
    symbolism: [
      { item: "Angelo Raffaele", meaning: "La benedizione spirituale, la guarigione emotiva e l'armonia cosmica." },
      { item: "Serpente nell'albero", meaning: "La tentazione, il libero arbitrio e la necessità di scegliere consapevolmente." },
      { item: "Coppia nuda", meaning: "L'onestà assoluta, la vulnerabilità e la purezza originaria degli opposti." }
    ],
    accogliere: {
      personale: "Fai chiarezza dentro di te per allineare i tuoi pensieri e le tue azioni quotidiane.",
      relazioni: "Comunica con amorevole trasparenza e accetta l'altro per come è, senza maschere.",
      lavoro: "Prendi decisioni professionali basandoti su ciò che risuona sinceramente con la tua etica interiore."
    }
  },
  {
    id: "carro",
    number: 7,
    roman: "VII",
    name: "Il Carro",
    keywords: ["Vittoria", "Controllo della volontà", "Determinazione", "Successo", "Direzione chiara"],
    element: "Acqua",
    astrology: "Cancro",
    color: "Giallo / Blu",
    description: "Un coraggioso guerriero incoronato guida un carro trainato da due sfingi opposte (una nera e una bianca). Il carro è sormontato da un baldacchino stellato.",
    diritta: "Rappresenta il trionfo ottenuto grazie al controllo rigoroso della Volontà e della disciplina. Le forze opposte della mente sono domate per viaggiare uniti in un'unica direzione trionfale.",
    capovolta: "Indica mancanza di controllo, direzione errata, ostacoli imprevisti dovuti all'arroganza o collasso energetico causato dallo sperpero della volontà.",
    symbolism: [
      { item: "Sfingi bianca e nera", meaning: "La dualità della mente (emozione e ragione) domata dalla Volontà dell'Operatore." },
      { item: "Baldacchino stellato", meaning: "L'influenza e la protezione delle leggi celesti sul cammino dell'eroe." },
      { item: "Armatura con Lune", meaning: "La capacità di cavalcare le maree emotive personali per vincere." }
    ],
    accogliere: {
      personale: "Prendi in mano le redini delle tue decisioni e agisci con ferma determinazione.",
      relazioni: "Supera i conflitti concentrando gli sforzi su obiettivi comuni tangibili e costruttivi.",
      lavoro: "Affronta le sfide professionali con coraggio, pianificando mosse audaci e difendendo il tuo spazio."
    }
  },
  {
    id: "forza",
    number: 8,
    roman: "VIII",
    name: "La Forza",
    keywords: ["Coraggio", "Compassione", "Pazienza", "Potere interiore", "Integrazione degli istinti"],
    element: "Fuoco",
    astrology: "Leone",
    color: "Giallo / Rosso",
    description: "Una donna incoronata di fiori chiude dolcemente ma con ferma determinazione le fauci di un leone ruggente. Sopra la sua testa brilla il simbolo dell'infinito.",
    diritta: "Simboleggia la maestria interiore, dove la forza bruta e gli istinti più selvaggi sono integrati ed addomesticati non con la violenza, ma con la pazienza, la compassione e la dolcezza magnetica.",
    capovolta: "Rappresenta debolezza d'animo, collera incontrollata, impulsi primordiali distruttivi o blocco energetico causato dalla repressione delle proprie emozioni.",
    symbolism: [
      { item: "Leone", meaning: "Le passioni primitive, gli istinti ancestrali, la rabbia e l'ego indomito." },
      { item: "Ghirlanda di fiori", meaning: "La forza della bellezza, della cura e della morbidezza che doma la ferocia." },
      { item: "Simbolo dell'infinito", meaning: "Il potere spirituale eterno che trascende la mera forza fisica." }
    ],
    accogliere: {
      personale: "Accetta ed integra le tue parti d'ombra (rabbia, paura) con amorevole comprensione.",
      relazioni: "Rispondi alle provocazioni altrui con calma regale, disinnescando l'aggressività con la grazia.",
      lavoro: "Affronta la pressione sul lavoro dimostrando resilienza metodica ed autorevolezza tranquilla."
    }
  },
  {
    id: "eremita",
    number: 9,
    roman: "IX",
    name: "L'Eremita",
    keywords: ["Solitudine", "Introspezione", "Scoperta di sé", "Saggezza interiore", "Guida"],
    element: "Terra",
    astrology: "Vergine",
    color: "Viola",
    description: "Il solitario Eremita è un uomo saggio e anziano in cima a una vetta innevata. Ha raggiunto un livello di consapevolezza spirituale dopo un lungo e impegnato viaggio alla scoperta di sé; il suo percorso continua, illuminato un passo alla volta.",
    diritta: "L'energia dell'Eremita guarda silenziosamente dentro di voi e lascia spazio alla ricerca dell'anima per trovare le risposte che cercate. Prendetevi del tempo per rallentare e allontanarvi dalle distrazioni frenetiche del mondo esterno. Il vostro intuito vi illuminerà la strada.",
    capovolta: "La solitudine dell'Eremita, normalmente positiva, si trasforma in isolamento sterile o rifiuto ostinato del confronto. Indica che vi sentite distanti dagli amici o dalla famiglia, rintanati in casa provando un senso di solitudine sempre più grande. Ritrovate l'equilibrio connettendovi alla comunità.",
    symbolism: [
      { item: "Lanterna", meaning: "Simbolo di guida esoterica, illumina ogni singolo passo lungo il cammino dell'anima." },
      { item: "Cima della montagna", meaning: "Rappresenta l'elevazione spirituale, la solitudine sublime e la conquista della conoscenza." },
      { item: "Bastone", meaning: "Indica una guida salda, equilibrata e fedele sulla quale poggiare la propria Volontà." }
    ],
    accogliere: {
      personale: "Fate una passeggiata in solitaria senza una destinazione precisa e vedete dove vi porta il vostro centro.",
      relazioni: "Se siete single, approfittatene per imparare ad amarvi profondamente prima di accogliere un altro.",
      lavoro: "Prendetevi del tempo per comprendere qual è il vostro vero obiettivo personale e come perseguirlo."
    }
  },
  {
    id: "ruota",
    number: 10,
    roman: "X",
    name: "La Ruota della Fortuna",
    keywords: ["Cambiamento", "Destino", "Cicli", "Punto di svolta", "Opportunità"],
    element: "Fuoco",
    astrology: "Giove",
    color: "Blu / Giallo",
    description: "Una grande ruota incisa con lettere ebraiche ed alchemiche ruota nel cielo, circondata da creature mitologiche alate che leggono antichi libri.",
    diritta: "Rappresenta la natura ciclica dell'esistenza. Ogni evento, gioia o sofferenza, è transitorio. Un cambiamento inaspettato del destino è alle porte: sappi cavalcare la marea favorevole.",
    capovolta: "Segnale di resistenza al cambiamento, sfortuna temporanea dovuta a fattori esterni o il ripetersi ossessivo dello stesso errore karmico dovuto a mancata consapevolezza.",
    symbolism: [
      { item: "Sfingi e Anubi", meaning: "L'ascesa e la discesa delle anime nella giostra del tempo e dello spazio." },
      { item: "Lettere ROTA / TARO", meaning: "La legge cosmica immutabile (Taro, Rota, Orat, Tora)." },
      { item: "Quattro Creature Alate", meaning: "La stabilità dei quattro segni fissi dello zodiaco (Leone, Toro, Scorpione, Acquario)." }
    ],
    accogliere: {
      personale: "Accetta che la vita sia fatta di alti e bassi; coltiva il tuo centro imperturbabile.",
      relazioni: "Se un legame è stagnante, preparati ad accogliere nuovi cicli ed evoluzioni spontanee.",
      lavoro: "Sii pronto a cogliere al volo un'occasione improvvisa di avanzamento o a cambiare strategia."
    }
  },
  {
    id: "giustizia",
    number: 11,
    roman: "XI",
    name: "La Giustizia",
    keywords: ["Equilibrio", "Verità", "Karma", "Causa ed effetto", "Onestà"],
    element: "Aria",
    astrology: "Bilancia",
    color: "Verde / Blu",
    description: "Una figura severa siede tra due pilastri. Regge una bilancia d'oro perfettamente in equilibrio con la mano sinistra ed una spada a doppio taglio puntata verso l'alto con la destra.",
    diritta: "Indica che la verità verrà a galla. Ogni azione risponde alla ferrea legge di causa ed effetto. Agisci con onestà intellettuale ed integrità totale; sarai pesato con equità assoluta.",
    capovolta: "Segnala ingiustizie subite o commesse, disonestà verso se stessi, pregiudizi mentali o rifiuto di assumersi la responsabilità delle proprie azioni passate.",
    symbolism: [
      { item: "Spada a doppio taglio", meaning: "La logica tagliente che separa la verità dall'illusione, recidendo il superfluo." },
      { item: "Bilancia d'oro", meaning: "La ponderazione equa, l'armonia interiore e la giustizia karmica universale." },
      { item: "Mantello rosso e fermaglio", meaning: "L'energia attiva ed il nucleo solido che sostiene la legge morale." }
    ],
    accogliere: {
      personale: "Valuta le tue scelte oggettivamente, senza farti accecare da scuse ed auto-giustificazioni.",
      relazioni: "Risolvi le incomprensioni basando il dialogo sul rispetto reciproco ed equità assoluta.",
      lavoro: "Assicurati che tutti gli accordi commerciali siano scritti, trasparenti ed equi per entrambe le parti."
    }
  },
  {
    id: "appeso",
    number: 12,
    roman: "XII",
    name: "L'Appeso",
    keywords: ["Sacrificio", "Nuova prospettiva", "Pausa", "Lasciare andare", "Fede"],
    element: "Acqua",
    astrology: "Nettuno",
    color: "Blu / Giallo",
    description: "Un uomo appeso per un piede a un ramo a forma di T (croce tau). La gamba libera è piegata a formare un 4. Il suo volto è sereno ed è circondato da un'aureola di luce dorata.",
    diritta: "Invita alla sospensione volontaria dell'azione. A volte l'unico modo per avanzare è fermarsi, sacrificare l'ego materiale e guardare il mondo da una prospettiva completamente capovolta.",
    capovolta: "Denota resistenza a lasciare andare il passato, sforzo inutile che porta alla stagnazione o vittimismo autodistruttivo che impedisce l'evoluzione.",
    symbolism: [
      { item: "Aureola splendente", meaning: "L'illuminazione spirituale ottenuta attraverso la sottomissione pacifica al destino." },
      { item: "Gambe incrociate a 4", meaning: "Il trionfo dello spirito sulla materia che si arrende all'alto." },
      { item: "Albero vivente", meaning: "La stasi che nasconde in realtà una linfa fertile e una crescita invisibile." }
    ],
    accogliere: {
      personale: "Arrenditi agli eventi che non puoi controllare e cerca il significato nascosto in questo blocco.",
      relazioni: "Smetti di cercare di forzare i comportamenti del partner; dai tempo al tempo.",
      lavoro: "Se un progetto è fermo, usalo come opportunità per rivederne i dettagli da un'angolazione diversa."
    }
  },
  {
    id: "morte",
    number: 13,
    roman: "XIII",
    name: "La Morte",
    keywords: ["Fine", "Trasformazione radicale", "Transizione", "Eliminazione del vecchio", "Rinascita"],
    element: "Acqua",
    astrology: "Scorpione",
    color: "Nero",
    description: "Uno scheletro in armatura nera cavalca un maestoso destriero bianco, recando un vessillo con una rosa bianca a cinque petali. Ai suoi piedi giacciono re, fanciulli e sacerdoti.",
    diritta: "Non preannuncia una fine fisica, bensì una necessaria, radicale e purificatrice transmutazione alchemica. Il vecchio deve morire per far posto alla luce rigeneratrice del nuovo giorno.",
    capovolta: "Indica resistenza ostinata al cambiamento inevitabile, paura ossessiva della fine, stagnazione dolorosa dovuta a attaccamenti malsani del passato.",
    symbolism: [
      { item: "Destriero bianco", meaning: "La purezza dell'intento divino e l'inevitabilità della forza trasformatrice." },
      { item: "Rosa a cinque petali", meaning: "Il simbolo alchemico della rinascita, dell'amore e della bellezza risorta." },
      { item: "Sole che sorge", meaning: "La promessa di un nuovo giorno splendente aldilà della transizione oscura." }
    ],
    accogliere: {
      personale: "Fai spazio nella tua mente recidendo abitudini, relazioni tossiche o pensieri stagnanti.",
      relazioni: "Permetti a un rapporto ormai esaurito di trasformarsi o chiudersi per liberare entrambi.",
      lavoro: "Non aggrapparti a una posizione lavorativa obsoleta; apriti a nuove e radicali prospettive."
    }
  },
  {
    id: "temperanza",
    number: 14,
    roman: "XIV",
    name: "La Temperanza",
    keywords: ["Equilibrio", "Moderazione", "Alchimia interiore", "Guarigione", "Armonia fluida"],
    element: "Fuoco",
    astrology: "Sagittario",
    color: "Azzurro / Blu",
    description: "Un angelo alato con un triangolo sul petto versa dolcemente un liquido luminoso da una coppa all'altra, senza versarne una sola goccia. Un piede poggia sulla terra e uno sull'acqua.",
    diritta: "Rappresenta l'arte della sintesi alchemica, il perfetto dosaggio degli opposti. Invita alla moderazione, alla pazienza e alla guarigione interiore attraverso la quiete spirituale.",
    capovolta: "Denota squilibrio, eccessi dannosi, mancanza di coordinazione, conflitti interiori insanabili o dispersione caotica delle proprie energie vitali.",
    symbolism: [
      { item: "Versare il liquido", meaning: "La miscelazione armonica degli opposti (conscio/inconscio, spirito/materia)." },
      { item: "Piede in acqua e sulla terra", meaning: "La capacità di bilanciare le emozioni profonde con il radicamento materiale." },
      { item: "Sentiero verso i monti", meaning: "Il cammino spirituale continuo verso l'elevazione suprema." }
    ],
    accogliere: {
      personale: "Trova il giusto compromesso tra dovere e piacere, calmando la tua tempesta emotiva.",
      relazioni: "Ascolta attivamente il partner e adotta un approccio basato sulla diplomazia e dolcezza.",
      lavoro: "Integra metodologie diverse e collabora armoniosamente per ottimizzare il flusso lavorativo."
    }
  },
  {
    id: "diavolo",
    number: 15,
    roman: "XV",
    name: "Il Diavolo",
    keywords: ["Dipendenza", "Ombra", "Attaccamento materiale", "Sessualità", "Illusione di schiavitù"],
    element: "Terra",
    astrology: "Capricorno",
    color: "Nero / Rosso",
    description: "Una figura cornuta e alata siede sopra un blocco di pietra a cui sono incatenati un uomo e una donna nudi. Le catene al loro collo sono in realtà lasche ed ampie.",
    diritta: "Rivelazione delle nostre dipendenze materiali, paure e ossessioni represse nell'Ombra. L'Egregora avverte: la schiavitù è spesso un'illusione della mente, le cui catene possono essere rimosse in ogni istante.",
    capovolta: "Rappresenta l'inizio della liberazione da vizi, abitudini nocive o legami oppressivi. Presa di coscienza spirituale e rottura degli schemi oscuri.",
    symbolism: [
      { item: "Catene lasche", meaning: "L'illusione di essere imprigionati dalle circostanze esterne." },
      { item: "Fiaccola rivolta in basso", meaning: "Lo spreco dell'energia vitale e creativa utilizzata solo per fini distruttivi." },
      { item: "Mano alzata in saluto", meaning: "La falsa benedizione che inganna e seduce i sensi materiali." }
    ],
    accogliere: {
      personale: "Affronta onestamente i tuoi vizi o le tue abitudini nocive per spezzare l'autolimitazione.",
      relazioni: "Identifica dinamiche di possesso geloso o dipendenza affettiva nel rapporto e sanale.",
      lavoro: "Usa la tua ambizione materiale come carburante, ma evita di vendere la tua etica per il guadagno economico."
    }
  },
  {
    id: "torre",
    number: 16,
    roman: "XVI",
    name: "La Torre",
    keywords: ["Crollo improvviso", "Rivelazione", "Liberazione", "Sconvolgimento", "Verità distruttiva"],
    element: "Fuoco",
    astrology: "Marte",
    color: "Rosso",
    description: "Una torre di pietra costruita sull'orgoglio viene colpita da un fulmine abbagliante. La corona dorata sulla cima viene scalzata e due figure umane precipitano nel vuoto.",
    diritta: "Un fulmine di verità squarcia le illusioni. Sebbene doloroso, il crollo improvviso delle strutture obsolete è l'unico modo per liberarsi da una prigione mentale e ricostruire sulle fondamenta della verità.",
    capovolta: "Indica che stai evitando un disastro imminente per pura paura del cambiamento, prolungando una situazione insostenibile che è comunque destinata a crollare.",
    symbolism: [
      { item: "Fulmine", meaning: "L'intervento divino improvviso, la scintilla di intuizione fulminante che distrugge l'illusione." },
      { item: "Corona scalzata", meaning: "La caduta dell'ego superbo e delle false certezze terrene." },
      { item: "Fiamme dorate", meaning: "La purificazione energetica che accompagna la distruzione del superfluo." }
    ],
    accogliere: {
      personale: "Lascia cadere le maschere e le bugie che racconti a te stesso; abbraccia la verità nuda.",
      relazioni: "Se un rapporto si basa su falsità, affronta la crisi apertamente per ricostruire su basi oneste.",
      lavoro: "Accetta un fallimento temporaneo come un'opportunità indispensabile per ripensare da zero il tuo percorso."
    }
  },
  {
    id: "stella",
    number: 17,
    roman: "XVII",
    name: "La Stella",
    keywords: ["Speranza", "Fede", "Ispirazione", "Serenità", "Rinnovamento spirituale"],
    element: "Aria",
    astrology: "Acquario",
    color: "Blu / Giallo",
    description: "Una fanciulla nuda poggia un ginocchio a terra ed un piede sull'acqua. Versa acqua vitale sia sulla terra arida (nutrendola) sia nella sorgente d'acqua, sotto un cielo trapuntato da otto grandi stelle luminose.",
    diritta: "Rappresenta un periodo di profonda guarigione emotiva, pace interiore ritrovata e rinnovata fiducia nel cammino cosmico. Sei protetto e guidato da una stella di pura speranza spirituale.",
    capovolta: "Segnale di pessimismo paralizzante, mancanza di fede, senso di smarrimento o disconnessione dal proprio scopo spirituale primario.",
    symbolism: [
      { item: "Grande Stella Centrale", meaning: "La guida spirituale suprema, la luce interiore pura e immutabile." },
      { item: "Versare l'acqua", meaning: "Il nutrimento del mondo materiale e la rigenerazione infinita delle emozioni." },
      { item: "Ibis/Uccello sacro nell'albero", meaning: "La saggezza segreta di Thot che osserva silenziosamente la fioritura." }
    ],
    accogliere: {
      personale: "Riconnettiti con la tua parte spirituale e permetti al tuo cuore ferito di guarire senza fretta.",
      relazioni: "Porta sincerità, pace ed un'ispirazione pura all'interno dei tuoi rapporti intimi.",
      lavoro: "Abbi fede nel tuo talento e prosegui la tua attività con ottimismo ed etica impeccabile."
    }
  },
  {
    id: "luna",
    number: 18,
    roman: "XVIII",
    name: "La Luna",
    keywords: ["Illusione", "Paura", "Inconscio", "Sogni", "Inganno visivo"],
    element: "Acqua",
    astrology: "Pesci",
    color: "Azzurro / Blu",
    description: "Una luna piena splende tra due torri minacciose. Ai suoi piedi, un cane e un lupo ululano spaventati, mentre un gambero emerge faticosamente dalle acque profonde.",
    diritta: "La via è avvolta dalle ombre e dalle illusioni. Invita ad affrontare le paure più recondite dell'inconscio, senza farsi ingannare dalle apparenze o dalle proiezioni della mente spaventata.",
    capovolta: "Indica liberazione dalle paure, risveglio da un incubo mentale, segreti svelati o il superamento graduale di un'illusione che ti teneva prigioniero.",
    symbolism: [
      { item: "Cane e Lupo", meaning: "La parte addomesticata e la parte selvaggia della psiche umana dinnanzi all'ignoto." },
      { item: "Gambero che emerge", meaning: "La coscienza nascente che emerge faticosamente dalle profondità insondate dell'inconscio." },
      { item: "Gocce dorate cadenti", meaning: "L'influsso magico e fecondante dello spirito lunare sulla mente terrena." }
    ],
    accogliere: {
      personale: "Esplora i tuoi sogni e accetta le tue paure irrazionali senza cercare di reprimerle.",
      relazioni: "Fai attenzione a non proiettare sul partner i tuoi timori e le tue vecchie ferite non guarite.",
      lavoro: "Fidati del tuo sesto senso ed evita alleanze dubbie o accordi poco chiari in questo momento."
    }
  },
  {
    id: "sole",
    number: 19,
    roman: "XIX",
    name: "Il Sole",
    keywords: ["Vitalità", "Successo", "Verità solare", "Gioia", "Chiarezza assoluta"],
    element: "Fuoco",
    astrology: "Sole",
    color: "Giallo / Arancione",
    description: "Un fanciullo felice cavalca un destriero bianco tenendo alto un vessillo rosso fuoco, sotto i raggi radiosi di un sole immenso. Sullo sfondo crescono alti girasoli dorati.",
    diritta: "È la massima espressione di gioia, vitalità fisica e chiarezza intellettuale. Ogni ombra viene dissipata dalla calda luce solare. Successo, celebrazione e purificazione d'intenti.",
    capovolta: "Segnala un successo parziale o ritardato, un temporaneo oscuramento della vitalità, eccesso di orgoglio infantile o difficoltà a godere appieno dei traguardi raggiunti.",
    symbolism: [
      { item: "Girasoli dorati", meaning: "La fioritura fertile guidata costantemente dalla luce spirituale." },
      { item: "Bambino nudo sul cavallo", meaning: "L'innocenza riconquistata e la totale assenza di difese o barriere mentali." },
      { item: "Vessillo rosso", meaning: "La vitalità fluente, la passione purificata e l'azione trionfante nel mondo." }
    ],
    accogliere: {
      personale: "Esprimi liberamente il tuo entusiasmo interiore e celebra i tuoi successi con gioia pulita.",
      relazioni: "Porta calore, trasparenza ed allegria nei tuoi rapporti quotidiani di coppia.",
      lavoro: "Prendi l'iniziativa lavorativa con fiducia assoluta; la tua leadership naturale sarà riconosciuta."
    }
  },
  {
    id: "giudizio",
    number: 20,
    roman: "XX",
    name: "Il Giudizio",
    keywords: ["Risveglio", "Chiamata", "Perdono", "Rinnovamento", "Valutazione interiore"],
    element: "Fuoco",
    astrology: "Plutone",
    color: "Blu / Giallo",
    description: "L'arcangelo Gabriele suona una tromba celeste adorna di una bandiera con croce rossa. Dalle tombe scoperte emergono uomini, donne e bambini oranti.",
    diritta: "Rappresenta una chiamata spirituale irrinunciabile, il risveglio della coscienza dopo un lungo letargo. È il momento dell'auto-perdono e della rinascita radiosa verso una nuova vita elevata.",
    capovolta: "Indica rifiuto ostinato di ascoltare la chiamata del destino, rimpianti dolorosi che ti legano al passato o severità eccessiva nel giudicare se stessi.",
    symbolism: [
      { item: "Tromba dell'Angelo", meaning: "La chiamata suprema alla consapevolezza cosmica e al risveglio dell'anima." },
      { item: "Bare aperte nell'acqua", meaning: "L'uscita dai vecchi confini stagnanti e l'inizio del cammino immortale." },
      { item: "Mani protese", meaning: "La resa incondizionata dello spirito dinnanzi alla grandezza dell'universo." }
    ],
    accogliere: {
      personale: "Perdona i tuoi errori passati e accogli la nuova versione di te stesso che bussa alla porta.",
      relazioni: "Risolvi i vecchi rancori di coppia parlando con assoluta onestà liberatoria.",
      lavoro: "Segui la tua vera vocazione professionale, anche se ciò richiede un radicale cambio di rotta."
    }
  },
  {
    id: "mondo",
    number: 21,
    roman: "XXI",
    name: "Il Mondo",
    keywords: ["Realizzazione", "Integrazione", "Successo totale", "Completamento", "Libertà cosmica"],
    element: "Terra",
    astrology: "Saturno",
    color: "Viola / Verde",
    description: "Una figura danzante nuda, drappeggiata in seta viola, regge due bacchette d'oro. È circondata da una corona d'alloro intrecciata e dai quattro simboli degli Evangelisti negli angoli.",
    diritta: "La realizzazione suprema del viaggio dell'Operatore. Ogni tassello è al suo posto, gli elementi sono integrati, il cerchio si chiude in un trionfo di armonia, libertà e successo cosmico.",
    capovolta: "Segnala un successo quasi raggiunto che necessita ancora di un ultimo piccolo sforzo, un ciclo rimasto aperto che richiede di essere chiuso definitivamente per avanzare.",
    symbolism: [
      { item: "Corona d'Alloro", meaning: "La vittoria suprema sul piano materiale e spirituale, la protezione eterna." },
      { item: "Quattro Creature", meaning: "I quattro elementi (Fuoco, Acqua, Aria, Terra) perfettamente bilanciati e sottomessi." },
      { item: "Due Bacchette", meaning: "L'equilibrio assoluto delle forze attive e ricettive della creazione cosmica." }
    ],
    accogliere: {
      personale: "Celebra il tuo cammino spirituale e gioisci per la tua evoluzione interiore e libertà riconquistata.",
      relazioni: "Vivi il rapporto di coppia in uno stato di pienezza emotiva e armonia integrata.",
      lavoro: "Concludi con orgoglio i tuoi progetti correnti e preparati ad aprirti a traguardi ancora più elevati."
    }
  }
];
