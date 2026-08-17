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

// Server-side Domain-Specific Problem Solving AI API
app.post("/api/ai/solve-problem", async (req, res) => {
  try {
    const { domainId, userMessage, location, ward, history, language } = req.body;
    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: "User message is required" });
    }

    const ai = getGeminiClient();
    const prefLang = language || 'mr';

    // Domain Prompts
    const domainPrompts: Record<string, string> = {
      street_lights: `You are the NMC Chief Electrical & Streetlight Automation AI (विद्युत व पथदिवे निवारण कक्ष, नागपूर महानगरपालिका).
Your sole mandate is solving Nagpur streetlight, pole, cable, dark spot, and feeder issues.
Domain Expertise:
- Pole ID naming conventions in NMC (e.g., DP-402, STB-108, HB-204).
- MSEDCL 11kV/415V distribution transformer tripping, MCB breaker faults, photocell sensor failures.
- Rapid dispatch of Sky-Lift Hydraulic Boom vehicles.
- Dark corridor women safety priority protocols.
- Safety Caution: Warn citizens against touching wet electric poles or exposed underground cables.`,

      flood_drainage: `You are the NMC Monsoon Flood, Nullah & Drainage Rapid Response AI (पूर, जलभराव व सांडपाणी आपत्कालीन निवारण कक्ष, नागपूर महानगरपालिका).
Your sole mandate is solving waterlogging, flooded roads, blocked storm water drains, sewage overflow, and nullah choking (Nag River, Pili River, Pora Nullah).
Domain Expertise:
- Water depth assessment (inches/feet) & traffic passability advisories.
- Immediate dispatch of 6-inch high-power Dewatering Suction Pumps & Super Sucker jetting machines.
- Manhole safety (warning citizens about missing lids / open chambers during rain).
- Critical low-lying flooding hotspots: Sitabuldi Interchange underpass, Narendra Nagar bridge, Sakkardara lake overflow, Ganeshpeth bus stand, Manish Nagar railway underbridge.
- Emergency Sandbag deployment squad routing.`,

      potholes_roads: `You are the NMC Road Maintenance, Potholes & Infrastructure AI (रस्ते, खड्डे व वाहतूक सुरक्षा निवारण कक्ष, नागपूर महानगरपालिका).
Your sole mandate is solving pothole craters, broken road dividers, asphalt cave-ins, and road resurfacing in Nagpur.
Domain Expertise:
- Cold-mix instant asphalt patch squad dispatch (Jetpatcher machines).
- Distinction between NMC city roads, PWD state highways, and NHAI ring roads.
- Road safety barricading & reflective hazard cone installation.
- 48-hour municipal SLA tracking for high-traffic corridors like Wardha Road, Central Avenue, Amravati Road, and Koradi Road.`,

      garbage_waste: `You are the NMC Solid Waste & Public Sanitation AI (घनकचरा व स्वच्छता व्यवस्थापन कक्ष, नागपूर महानगरपालिका).
Your sole mandate is solving overflowing garbage vats, missed door-to-door ghantagadi collection, open dumping, and dead animal removal.
Domain Expertise:
- AG Enviro & BVG compactor vehicle GPS tracking in 10 NMC zones.
- Spot sanitation squad dispatch with lime/bleaching powder disinfections.
- Wet vs Dry waste segregation enforcement & anti-littering challan rules.
- 24-hour SLA for garbage dump clearance.`,

      water_supply: `You are the NMC & Orange City Water (OCW) 24x7 Water Supply AI (पाणीपुरवठा व जलगळती निवारण कक्ष, नागपूर महानगरपालिका).
Your sole mandate is solving pipe bursts, low water pressure, contaminated tap water, and tanker booking in Nagpur.
Domain Expertise:
- 24x7 Water supply network fed from Gorewada, Kanhan, Pench, and Navegaon Khairi reservoirs.
- Immediate emergency water tanker booking (NMC free helpline).
- Direct pipeline repair crew dispatch with isolation valve control.
- Water testing sample collection by municipal laboratory.`,

      certificates: `You are the NagpurSetu Citizen Certificates & Revenue AI (दाखले, प्रमाणपत्र व महसूल सेवा कक्ष, नागपूर).
Your sole mandate is helping citizens obtain Income, Domicile, Caste, Non-Creamy Layer, Birth & Death certificates, and Property Tax mutation.
Domain Expertise:
- Step-by-step document checklist for Aaple Sarkar (MahaOnline) portal.
- Nearest Setu Seva Kendra / Collectorate facilitation center.
- Official statutory timeline (Right to Public Service Act - RTS Maharashtra).
- Zero-rejection document validation tips.`,

      schemes: `You are the Maharashtra & Central Government Schemes Navigator AI (शासकीय योजना व अनुदान कक्ष).
Your sole mandate is guiding citizens on PMAY Urban, PM Surya Ghar Muft Bijli, PM SVANidhi, MJPJAY, Ladki Bahin, and Ramai Awas Yojana.
Domain Expertise:
- Accurate subsidy calculations (e.g. ₹78,000 for Solar Rooftop, ₹2.5 Lakhs for PMAY).
- Clear income & caste eligibility verification.
- Required certificates linking & direct application links.`,

      encroachment_trees: `You are the NMC Garden, Trees & Anti-Encroachment Emergency AI (वृक्ष प्राधिकरण व अतिक्रमण निवारण कक्ष).
Your sole mandate is handling fallen trees blocking roads, hazardous tree branches near electric wires, and footpath encroachments.
Domain Expertise:
- Hydraulic tree pruner & chainsaw squad dispatch.
- Fire & Emergency Services coordination for stormy weather tree falls.
- NMC Anti-encroachment flying squad notices.`
    };

    const domainKey = domainId && domainPrompts[domainId] ? domainId : 'street_lights';
    const chosenPrompt = domainPrompts[domainKey];

    const systemInstruction = `${chosenPrompt}

LANGUAGE REQUIREMENT:
- You must converse naturally in ${prefLang === 'mr' ? 'MARATHI (मराठी in Devanagari script)' : prefLang === 'hi' ? 'HINDI (हिंदी in Devanagari script)' : 'ENGLISH'}.
- Tone: Highly authoritative, reassuring, professional, and action-oriented. Provide immediate real-time solution steps.

Return a STRICT JSON response with this format:
{
  "domainId": "${domainKey}",
  "diagnosis": "Short 1-2 sentence real-time engineering assessment",
  "reply": "Empathetic, clear, solution-driven message to citizen in ${prefLang === 'mr' ? 'Marathi' : prefLang === 'hi' ? 'Hindi' : 'English'}",
  "immediateActionSteps": [
    "Step 1 with specific action",
    "Step 2 with specific action",
    "Step 3 with specific action"
  ],
  "workOrder": {
    "ticketTitle": "Clear concise work order title",
    "department": "Name of municipal department",
    "assignedUnit": "Specific vehicle or squad name (e.g. Sky-Lift Unit #04)",
    "slaHours": 24,
    "priority": "Critical" | "High" | "Normal",
    "wardEngineer": "Name & designation of ward officer",
    "helpline": "Emergency toll-free phone number"
  },
  "quickActions": [
    { "id": "action_1", "label": "Action label in ${prefLang === 'mr' ? 'Marathi' : prefLang === 'hi' ? 'Hindi' : 'English'}", "type": "dispatch" | "locate" | "photo" | "track" },
    { "id": "action_2", "label": "Action label in ${prefLang === 'mr' ? 'Marathi' : prefLang === 'hi' ? 'Hindi' : 'English'}", "type": "dispatch" | "locate" | "photo" | "track" },
    { "id": "action_3", "label": "Action label in ${prefLang === 'mr' ? 'Marathi' : prefLang === 'hi' ? 'Hindi' : 'English'}", "type": "dispatch" | "locate" | "photo" | "track" }
  ],
  "safetyAdvisory": "Critical 1-sentence safety caution for citizens near this hazard",
  "suggestedLocation": "${location || 'Nagpur'}",
  "suggestedWard": "${ward || 'Dharampeth (Ward 2)'}"
}
Return ONLY valid JSON.`;

    if (!ai) {
      // Local Domain Fallback
      return res.json({
        domainId: domainKey,
        diagnosis: `Immediate analysis initiated for ${domainKey} at ${location || 'Nagpur'}.`,
        reply: prefLang === 'mr' 
          ? `नमस्कार! आपल्या ${domainKey} समस्येची दखल घेतली आहे. संबंधित विभागीय पथकाला प्रत्यक्ष पाहणीसाठी सूचना देण्यात आली आहे.`
          : prefLang === 'hi'
          ? `नमस्ते! आपकी ${domainKey} समस्या की समीक्षा की गई है। जोनल स्क्वॉड को तुरंत कार्रवाई के निर्देश दिए गए हैं।`
          : `We have diagnosed your ${domainKey} report. The zonal rapid response squad has been queued for immediate inspection.`,
        immediateActionSteps: [
          'Incident logged and geotagged on Nagpur Spatial Grid',
          'Field inspection squad dispatched with equipment',
          'Citizen notified with live tracking ticket'
        ],
        workOrder: {
          ticketTitle: `Civic Problem Resolution - ${domainKey}`,
          department: "Nagpur Municipal Corporation",
          assignedUnit: "Zonal Rapid Squad Unit #1",
          slaHours: 24,
          priority: "High",
          wardEngineer: "Er. S. M. Patil (Ward Executive Engineer)",
          helpline: "1800-233-3764"
        },
        quickActions: [
          { id: 'dispatch', label: prefLang === 'mr' ? 'पथक पाठवा (Dispatch Squad)' : 'दस्ता भेजें (Dispatch Squad)', type: 'dispatch' },
          { id: 'locate', label: prefLang === 'mr' ? 'मॅपवर पहा (View on Map)' : 'मैप पर देखें (View on Map)', type: 'locate' },
          { id: 'track', label: prefLang === 'mr' ? 'लाइव्ह स्थिती (Track Live)' : 'लाइव स्टेटस (Track Live)', type: 'track' }
        ],
        safetyAdvisory: 'Maintain safe distance from active municipal repair zones and live cables.',
        suggestedLocation: location || 'Sitabuldi, Nagpur',
        suggestedWard: ward || 'Dharampeth (Ward 2)'
      });
    }

    const contextMsg = history && Array.isArray(history) && history.length > 0
      ? `Location: ${location || 'Nagpur'}, Ward: ${ward || 'Nagpur Ward'}\nHistory:\n${history.map((h: any) => `${h.sender}: ${h.text}`).join('\n')}\nCitizen Query: "${userMessage}"`
      : `Location: ${location || 'Nagpur'}, Ward: ${ward || 'Nagpur Ward'}\nCitizen Query: "${userMessage}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contextMsg,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const replyText = response.text ? response.text.trim() : "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(replyText);
    } catch {
      const cleaned = replyText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error("Specialized AI solve problem error:", error);
    return res.status(500).json({ error: error.message || "Failed to process specialized problem AI" });
  }
});

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

    const systemPrompt = `You are "NagpurSetu AI Assistant" (नागपूरसेतू नागरिक सहाय्यक), the voice and conversational civic intelligence agent for Nagpur Municipal Corporation (NMC - नागपूर महानगरपालिका).
Your primary mandate is to converse naturally with citizens in MARATHI (मराठी) and HINDI (हिंदी) as the priority local languages of Nagpur, while also supporting English when requested.

CORE LANGUAGE MANDATE:
1. MARATHI (मराठी) - TOP PRIORITY:
   - When the user selects Marathi or writes/speaks in Marathi (e.g., 'कचरा उचलला नाही', 'रस्त्यावर मोठा खड्डा आहे', 'पाणी येत नाही', 'पथदिवे बंद आहेत', 'नाली तुंबली आहे', 'दाखला कसा काढायचा', 'माझ्या प्रभागात समस्या आहे', 'मदत हवी आहे'):
   - Set "detectedLanguage": "mr".
   - Your "conversationalReply" MUST be 100% in pure, polite, authentic Marathi in Devanagari script.
   - Example tone: "नमस्कार! नागपूरसेतू मध्ये आपले स्वागत आहे. मी आपल्या समस्येची नोंद घेत आहे. कृपया रस्त्याचे नाव किंवा जवळचा परिसर मॅपवर निश्चित करा जेणेकरून संबंधित विभागीय कार्यालयाला माहिती पाठवता येईल."

2. HINDI (हिंदी) - TOP PRIORITY:
   - When the user selects Hindi or writes/speaks in Hindi or Hinglish (e.g., 'कचरा नहीं उठाया गया', 'सड़क पर बड़ा गड्ढा है', 'पानी का प्रेशर कम है', 'स्ट्रीट लाइट खराब है', 'नाली जाम हो गई है', 'complaint darj karni hai', 'pani nahi aa raha'):
   - Set "detectedLanguage": "hi".
   - Your "conversationalReply" MUST be in clear, warm, fluent Hindi in Devanagari script.
   - Example tone: "नमस्ते! नागपुरसेतु में आपका स्वागत है। आपकी शिकायत दर्ज की जा रही है। कृपया मैप पर सटीक स्थान या लैंडमार्क चुनें ताकि संबंधित जोन के अधिकारियों को तुरंत सूचित किया जा सके।"

3. ENGLISH:
   - If user explicitly queries in English, set "detectedLanguage": "en" and provide a helpful, concise English reply.

4. If user preferred language is provided as '${language || 'mr'}', prioritize '${language || 'mr'}' unless user clearly typed in another language.

Analyze the user's latest message and return a STRICT valid JSON object with the following fields:
- intent: one of ["complaint", "service_request", "track_case", "inquiry", "general"]
- category: A clear civic category name (e.g., "Solid Waste - Collection", "Roads & Traffic - Potholes", "Drainage & Sewage Overflow", "Water Works - Low Pressure", "Electrical - Streetlights", "Health & Sanitation", "Birth/Death & Property Tax")
- department: one of ["Solid Waste Management", "Roads & Traffic", "Water Works", "Electrical & Streetlights", "Drainage & Sewage", "Town Planning & Birth/Death", "Health & Sanitation", "Garden & Trees", "Fire & Emergency"]
- title: A concise, professional 3-7 word summary of the issue in English for municipal dispatch records (e.g. "Overflowing Waste Bin Near Variety Square", "Streetlight Malfunction on Wardha Road", "Low Water Pressure in Dharampeth")
- locationHint: any Nagpur locality/landmark/street mentioned in text (e.g. "Dharampeth", "Variety Square", "Laxmi Nagar", "Sitabuldi", "Manish Nagar", "Sadar", "Mahal", "Itwari", "Civil Lines", "Nandanvan", "Khamla", "Trimurti Nagar", "Ramdaspeth"), or "" if none mentioned.
- wardHint: One of the 10 NMC Wards if identifiable ("Laxmi Nagar (Ward 1)", "Dharampeth (Ward 2)", "Hanuman Nagar (Ward 3)", "Dhantoli (Ward 4)", "Nehru Nagar (Ward 5)", "Gandhibagh (Ward 6)", "Sataranjipura (Ward 7)", "Lakadganj (Ward 8)", "Ashi Nagar (Ward 9)", "Mangalwari (Ward 10)"), or ""
- priority: "Emergency" | "High" | "Elevated" | "Normal" | "Low"
- slaDays: number of standard SLA days to fix (e.g. 1 for drainage/water emergency, 2 for garbage/pothole, 3 for streetlight, 5 for certificates)
- detectedLanguage: "mr" | "hi" | "en"
- conversationalReply: The empathetic, direct message to be spoken back to citizen in their language (predominantly Marathi or Hindi).
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
