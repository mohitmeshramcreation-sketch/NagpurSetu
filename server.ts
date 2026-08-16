import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Server-side AI Civic Classifier & Conversational Agent API
app.post("/api/ai/classify", async (req, res) => {
  try {
    const { text, history, language } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: "Text prompt is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return structured fallback if API key is not yet configured
      return res.json({
        source: 'local_fallback',
        intent: 'complaint',
        category: 'Solid Waste Management',
        department: 'Solid Waste Management',
        title: text.length > 50 ? text.substring(0, 50) + '...' : text,
        locationHint: '',
        wardHint: 'Dharampeth (Ward 4)',
        priority: 'Normal',
        slaDays: 2,
        detectedLanguage: language || 'en',
        conversationalReply: 'I have noted down your concern. Please confirm the exact street location or landmark in Nagpur so we can route this to the zonal ward team.',
        needsLocation: true,
        needsPhoto: true,
        suggestedAction: 'location_picker'
      });
    }

    const systemPrompt = `You are "NagpurSetu AI Assistant", the official intelligent civic intake agent for Nagpur Municipal Corporation (NMC).
Your goal is to understand citizens reporting civic problems (garbage, potholes, water supply, sewage, streetlights, sanitation, stray animals, encroachment, fallen trees, property tax/certificates) or tracking cases.
Citizens in Nagpur speak/type in Marathi (मराठी), Hindi (हिंदी), English, or Hinglish/Marathi-English.

CRITICAL LANGUAGE & SPEECH RULES:
1. DETECT THE USER'S EXACT LANGUAGE:
   - If user speaks/writes in Marathi (e.g., 'कचरा', 'रस्त्यावर खड्डा', 'पाणी येत नाही', 'तुंबली', 'दाखला', 'माझ्या घराजवळ', 'झाला आहे', 'मदत करा'): Set "detectedLanguage": "mr". Your "conversationalReply" MUST BE 100% IN NATURAL, POLITE MARATHI (मराठी) in Devanagari script (e.g. "नक्कीच, मी मदत करतो. कचरा कोणत्या ठिकाणी साचला आहे? कृपया आपले अचूक ठिकाण सांगा किंवा मॅपवर निवडा.").
   - If user speaks/writes in Hindi (e.g., 'कचरा नहीं उठाया', 'रोड पर गड्ढा है', 'पानी की समस्या', 'स्ट्रीट लाइट बंद है', 'शिकायत दर्ज करो', 'मदद चाहिए'): Set "detectedLanguage": "hi". Your "conversationalReply" MUST BE 100% IN NATURAL HINDI (हिंदी) in Devanagari script (e.g. "नमस्ते, मैंने आपकी शिकायत नोट कर ली है। कृपया सटीक स्थान या गली का नाम साझा करें।").
   - If user writes in Hinglish / Romanized Hindi/Marathi (e.g., 'kachra nahi uthaya', 'road kharab hai', 'pani nahi aa raha', 'light band hai'): Set "detectedLanguage": "hi". Your "conversationalReply" MUST BE IN FRIENDLY HINDI/HINGLISH or Devanagari Hindi so speech synthesis reads it fluently in Hindi.
   - If user speaks/writes in English: Set "detectedLanguage": "en". Your "conversationalReply" MUST BE IN POLITE ENGLISH.
   - If preference '${language || 'auto'}' is passed and user input is ambiguous, follow '${language || 'auto'}'.

Analyze the user's latest message and return a STRICT valid JSON object with the following fields:
- intent: one of ["complaint", "service_request", "track_case", "inquiry", "general"]
- category: A clear civic category name (e.g., "Solid Waste - Collection", "Roads & Traffic - Potholes", "Drainage & Sewage Overflow", "Water Works - Low Pressure", "Electrical - Streetlights", "Health & Sanitation", "Birth/Death & Property Tax")
- department: one of ["Solid Waste Management", "Roads & Traffic", "Water Works", "Electrical & Streetlights", "Drainage & Sewage", "Town Planning & Birth/Death", "Health & Sanitation", "Garden & Trees", "Fire & Emergency"]
- title: A concise, professional 3-7 word summary of the issue in English for municipal dispatch records (e.g. "Overflowing Waste Bin Near Variety Square", "Streetlight Malfunction on Wardha Road", "Low Water Pressure in Dharampeth")
- locationHint: any Nagpur locality/landmark/street mentioned in text (e.g. "Dharampeth", "Variety Square", "Laxmi Nagar", "Sitabuldi", "Manish Nagar", "Sadar", "Mahal", "Itwari", "Civil Lines", "Nandanvan"), or "" if none mentioned.
- wardHint: One of the 10 NMC Wards if identifiable ("Laxmi Nagar (Ward 1)", "Dharampeth (Ward 2)", "Hanuman Nagar (Ward 3)", "Dhantoli (Ward 4)", "Nehru Nagar (Ward 5)", "Gandhibagh (Ward 6)", "Sataranjipura (Ward 7)", "Lakadganj (Ward 8)", "Ashi Nagar (Ward 9)", "Mangalwari (Ward 10)"), or ""
- priority: "Emergency" | "High" | "Elevated" | "Normal" | "Low"
- slaDays: number of standard SLA days to fix (e.g. 1 for drainage/water emergency, 2 for garbage/pothole, 3 for streetlight, 5 for certificates)
- detectedLanguage: "en" | "hi" | "mr"
- conversationalReply: The empathetic, direct message to be spoken back to citizen in their language.
- needsLocation: boolean (true for physical civic issues like garbage, potholes, streetlights, drainage)
- needsPhoto: boolean (true if visual verification helps crews dispatch the right vehicle/equipment)
- suggestedAction: "location_picker" | "photo_upload" | "case_summary" | "duplicate_warning" | "categories"

Return ONLY the JSON object. Do not include markdown code block markers.`;

    const chatContext = history && Array.isArray(history) && history.length > 0
      ? `Recent Conversation Context:\n${history.map((h: any) => `${h.sender === 'user' ? 'Citizen' : 'NagpurSetu'}: ${h.text}`).join('\n')}\n\nLatest Citizen Message:\n"${text}"`
      : `Citizen Message:\n"${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: chatContext,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const replyText = response.text ? response.text.trim() : "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(replyText);
    } catch {
      // Clean possible fences if any
      const cleaned = replyText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json({
      source: 'gemini',
      intent: parsed.intent || 'complaint',
      category: parsed.category || 'Solid Waste Management',
      department: parsed.department || 'Solid Waste Management',
      title: parsed.title || text.substring(0, 40),
      locationHint: parsed.locationHint || '',
      wardHint: parsed.wardHint || '',
      priority: parsed.priority || 'Normal',
      slaDays: typeof parsed.slaDays === 'number' ? parsed.slaDays : 2,
      detectedLanguage: parsed.detectedLanguage || 'en',
      conversationalReply: parsed.conversationalReply || 'Thank you for reporting. Our civic team has registered this issue.',
      needsLocation: parsed.needsLocation ?? true,
      needsPhoto: parsed.needsPhoto ?? true,
      suggestedAction: parsed.suggestedAction || 'location_picker',
      duplicateRisk: false,
    });
  } catch (error: any) {
    console.error("AI classification error:", error);
    return res.status(500).json({ error: error.message || "Failed to process AI classification" });
  }
});

// Start server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
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
    console.log(`NagpurSetu server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
