const fs = require("fs");
const path = require("path");
const { GoogleGenAI, createUserContent } = require("@google/genai");

const apiKey = (process.env.GEMINI_API_KEY ?? "").trim();
const ai = new GoogleGenAI({ apiKey });
const modelName = "gemini-2.0-flash";

let cacheName;          // se riusciamo a creare la cache
let smallContext = null; // se il contesto è “piccolo”, lo teniamo qui per spedirlo inline

const SYSTEM_INSTRUCTION =
  "Sei un esperto di canottaggio, personal trainer specializzato nel canottaggio, sai tutto di tutte le specialità di canottaggio,conosci i venti e il meteo e i luoghi dove si allenano ogni società";

async function ensureContext() {
  if (cacheName || smallContext !== null) return;

  const filePath = path.resolve(__dirname, "../../../file.txt");
  

  let text = "";
  if (fs.existsSync(filePath)) {
    text = fs.readFileSync(filePath, "utf-8") ?? "";
  }
  if (!text.trim()) {
    console.warn("Attenzione: file.txt è vuoto.");
  }

  // Stima molto grezza: 4 caratteri per token
  const estimatedTokens = Math.ceil(text.length / 4);

  if (estimatedTokens >= 4096) {
    //  abbastanza grande , usiamo la Cache API
    const cache = await ai.caches.create({
      model: modelName,
      config: {
        contents: createUserContent(text),
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    cacheName = cache.name;

    await ai.caches.update({
      name: cacheName,
      config: { ttl: `${2 * 3600}s` }, // 2 ore
    });
  } else {
    //  troppo piccolo per la cache , lo spediremo inline ad ogni richiesta
    smallContext = text; // può essere stringa vuota, va bene
  }
}

exports.sendMessage = async (req, res) => {
  try {
    if (!apiKey) throw new Error("GEMINI_API_KEY non impostata nel backend");
    if (!req.body) throw new Error("Body mancante: assicurati di avere app.use(express.json())");

    const { message, history = [] } = req.body || {};
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "messaggio mancante" });
    }

    await ensureContext();

    // Costruzione dei contents multi-turno
    const contents = [
      // Se non abbiamo cache, includiamo il “context piccolo” all’inizio
      ...(smallContext ? [{ role: "user", parts: [{ text: smallContext }] }] : []),
      ...history.map((t) => ({
        role: t.role === "model" ? "model" : "user",
        parts: [{ text: String(t.text ?? "") }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    // Se abbiamo cache la usiamo; altrimenti passiamo solo la systemInstruction
    const resp = await ai.models.generateContent({
      model: modelName,
      contents,
      config: cacheName
        ? { cachedContent: cacheName }                 // cache con TTL
        : { systemInstruction: SYSTEM_INSTRUCTION },   // niente cache → systemInstruction inline
    });

    const text = typeof resp.text === "function" ? await resp.text() : resp.text;
    return res.json({ text });
  } catch (err) {
    console.error("Errore /AiChat:", err);
    return res.status(500).json({ error: err.message });
  }
};


