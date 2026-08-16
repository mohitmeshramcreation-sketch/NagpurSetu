import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Paperclip, 
  MapPin, 
  Send, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  Bot, 
  User, 
  Camera, 
  Crosshair, 
  Construction, 
  Trash2, 
  Droplets, 
  Lightbulb, 
  Wrench, 
  MoreHorizontal, 
  X,
  HelpCircle,
  CheckCircle,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { classifyUserMessage, ClassificationResult } from '../services/aiClassifier';
import { SpeechService } from '../services/speech';
import { CaseItem, ChatMessage, Department } from '../types';

interface TalkScreenProps {
  navigate: (route: string) => void;
  onProceedToReview: (draft: {
    problemSummary: string;
    rawInput: string;
    category: string;
    department: Department;
    location: string;
    ward: string;
    photoUrl?: string;
  }) => void;
}

export const TalkScreen: React.FC<TalkScreenProps> = ({
  navigate,
  onProceedToReview,
}) => {
  // State
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recentCases, setRecentCases] = useState<CaseItem[]>([]);
  const [helpMeModeActive, setHelpMeModeActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Garbage Pickup');
  
  // Current extraction state for ongoing report
  const [currentLocation, setCurrentLocation] = useState('42 Dharampeth Extension, Nagpur');
  const [currentWard, setCurrentWard] = useState('Dharampeth (Ward 4)');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'
  );
  const [activeClassification, setActiveClassification] = useState<ClassificationResult | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapPickerOpen, setMapPickerOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load recent cases
  useEffect(() => {
    const all = StorageService.getCases();
    setRecentCases(all.slice(0, 3));
  }, []);

  // Scroll to bottom on message update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, hasStartedConversation]);

  // Handle voice speech
  const toggleListening = () => {
    if (isListening) {
      SpeechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      const started = SpeechService.startListening(
        'hi',
        ({ transcript, isFinal }) => {
          setInputText(transcript);
          if (isFinal) {
            setIsListening(false);
            if (transcript.trim().length > 0) {
              handleSendMessage(transcript);
            }
          }
        },
        (err) => {
          setIsListening(false);
          console.warn('Speech err:', err);
        },
        () => {
          setIsListening(false);
        }
      );
      if (!started) {
        setIsListening(false);
      }
    }
  };

  // Send message
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!text) return;

    // Reset input
    setInputText('');

    // If starting fresh
    if (!hasStartedConversation) {
      setHasStartedConversation(true);
      setHelpMeModeActive(true);
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);

    // AI Classification
    const classification = classifyUserMessage(text);
    setActiveClassification(classification);

    // Auto-update selected category in help me mode
    if (classification.category.includes('Road')) setSelectedCategory('Road & Potholes');
    else if (classification.category.includes('Solid') || classification.category.includes('Waste')) setSelectedCategory('Garbage Pickup');
    else if (classification.category.includes('Water')) setSelectedCategory('Water Supply');
    else if (classification.category.includes('Electric') || classification.category.includes('Streetlight')) setSelectedCategory('Streetlight Issue');
    else if (classification.category.includes('Drainage') || classification.category.includes('Sewage')) setSelectedCategory('Drainage & Sewage');

    // Instant AI response with zero delay
    const botMsg: ChatMessage = {
      id: `msg-bot-${Date.now()}`,
      sender: 'assistant',
      text: classification.conversationalReply,
      timestamp: 'Just now',
      widgetType: classification.needsLocation ? 'location_picker' : undefined,
    };

    setMessages((prev) => [...prev, botMsg]);
    SpeechService.speak(classification.conversationalReply, classification.detectedLanguage);
  };

  // Quick Prompt click
  const handleTrySaying = (prompt: string) => {
    setInputText(prompt);
    handleSendMessage(prompt);
  };

  // Handle Location Sharing
  const handleShareLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setCurrentLocation('Near Variety Square, Dharampeth, Nagpur - 440010');
          setCurrentWard('Dharampeth (Ward 4)');
          
          const confirmMsg: ChatMessage = {
            id: `msg-loc-${Date.now()}`,
            sender: 'assistant',
            text: '📍 Location pinned: 42 Dharampeth Extension, Nagpur (Ward 4). Everything looks set! Would you like to review and submit the report?',
            timestamp: 'Just now',
            widgetType: 'case_summary',
          };
          setMessages((prev) => [...prev, confirmMsg]);
        },
        (err) => {
          setIsLocating(false);
          setCurrentLocation('42 Dharampeth Extension, Nagpur');
          const confirmMsg: ChatMessage = {
            id: `msg-loc-${Date.now()}`,
            sender: 'assistant',
            text: '📍 Address set: 42 Dharampeth Extension, Nagpur. You can now attach a photo or review your report.',
            timestamp: 'Just now',
            widgetType: 'case_summary',
          };
          setMessages((prev) => [...prev, confirmMsg]);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      setCurrentLocation('42 Dharampeth Extension, Nagpur');
    }
  };

  // Handle Photo upload
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setUploadedPhotoUrl(objectUrl);

      const photoMsg: ChatMessage = {
        id: `msg-photo-${Date.now()}`,
        sender: 'user',
        text: `Attached photo evidence: ${file.name}`,
        timestamp: 'Just now',
        meta: { photoUrl: objectUrl },
      };

      setMessages((prev) => [...prev, photoMsg]);

      const reply: ChatMessage = {
        id: `msg-bot-photo-${Date.now()}`,
        sender: 'assistant',
        text: 'Photo received. Our civic inspection squad will use this to dispatch the right vehicle. Tap "Review Report" to finalize.',
        timestamp: 'Just now',
        widgetType: 'case_summary',
      };
      setMessages((prev) => [...prev, reply]);
    }
  };

  // Proceed to review
  const handleProceed = () => {
    const summary = activeClassification
      ? activeClassification.title
      : 'Garbage has not been collected near your house.';
    const dept = activeClassification ? activeClassification.department : 'Solid Waste Management';
    const cat = activeClassification ? activeClassification.category : 'Solid Waste - Collection';
    const raw = messages.filter((m) => m.sender === 'user').map((m) => m.text).join(' ') || 'Mere area mein garbage pickup nahi hua.';

    onProceedToReview({
      problemSummary: summary,
      rawInput: raw,
      category: cat,
      department: dept,
      location: currentLocation,
      ward: currentWard,
      photoUrl: uploadedPhotoUrl,
    });
  };

  const categoriesList = [
    { id: 'Road & Potholes', icon: Construction, label: 'Road &\nPotholes' },
    { id: 'Garbage Pickup', icon: Trash2, label: 'Garbage\nPickup' },
    { id: 'Water Supply', icon: Droplets, label: 'Water\nSupply' },
    { id: 'Streetlight Issue', icon: Lightbulb, label: 'Streetlight\nIssue' },
    { id: 'Drainage & Sewage', icon: Wrench, label: 'Drainage &\nSewage' },
    { id: 'Something Else', icon: MoreHorizontal, label: 'Something\nElse' },
  ];

  return (
    <div className="w-full bg-[#FAFCFF] min-h-[calc(100vh-140px)] flex flex-col justify-between" id="talk-screen-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/*,.pdf"
        className="hidden"
        id="hidden-file-input"
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {!hasStartedConversation ? (
          /* SCREEN 2: What do you need help with? */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Main Prompt Area */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E38] tracking-tight">
                  What do you need help with?
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                  Tell us what happened. You don't need to know which department handles it.
                </p>
              </div>

              {/* Input Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Tell NagpurSetu what happened..."
                  className="w-full h-32 sm:h-36 resize-none text-base text-slate-800 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
                  id="talk-main-textarea"
                />

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Attach photo or document"
                      id="talk-attach-button"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleShareLocation}
                      className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Add your location"
                      id="talk-location-button"
                    >
                      <MapPin className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={inputText.trim() ? () => handleSendMessage() : toggleListening}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer ${
                      inputText.trim()
                        ? 'bg-[#0B1E38] hover:bg-[#152e52] text-white'
                        : isListening
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-[#0B1E38] hover:bg-[#152e52] text-white'
                    }`}
                    id="talk-mic-or-send-button"
                  >
                    {inputText.trim() ? (
                      <Send className="w-5 h-5" />
                    ) : isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Try Saying Section */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  TRY SAYING...
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      handleTrySaying(
                        "There's a massive pothole near Variety Square causing traffic."
                      )
                    }
                    className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left text-xs sm:text-sm text-slate-700 hover:text-slate-900 transition-all shadow-2xs group flex items-start gap-2.5 cursor-pointer"
                    id="prompt-pothole"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>"There's a massive pothole near Variety Square causing traffic."</span>
                  </button>

                  <button
                    onClick={() =>
                      handleTrySaying("माझ्या घराजवळ कचरा उचलला गेला नाही...")
                    }
                    className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left text-xs sm:text-sm text-slate-700 hover:text-slate-900 transition-all shadow-2xs group flex items-start gap-2.5 font-['Noto_Sans_Devanagari'] cursor-pointer"
                    id="prompt-garbage-marathi"
                  >
                    <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>"माझ्या घराजवळ कचरा उचलला गेला नाही..."</span>
                  </button>

                  <button
                    onClick={() =>
                      handleTrySaying("स्ट्रीट लाइट तीन दिन से बंद है...")
                    }
                    className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left text-xs sm:text-sm text-slate-700 hover:text-slate-900 transition-all shadow-2xs group flex items-start gap-2.5 font-['Noto_Sans_Devanagari'] cursor-pointer"
                    id="prompt-streetlight-hindi"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>"स्ट्रीट लाइट तीन दिन से बंद है..."</span>
                  </button>
                </div>
              </div>

              {/* Help Me Guide Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setHasStartedConversation(true);
                    setHelpMeModeActive(true);
                    setMessages([
                      {
                        id: 'welcome-guide',
                        sender: 'assistant',
                        text: 'Namaskar! NagpurSetu Help Mode is active. You can speak in Hindi, Marathi or English, or tap one of the common categories below.',
                        timestamp: 'Just now',
                      },
                    ]);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-md text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs transition-colors cursor-pointer"
                  id="help-me-guide-button"
                >
                  <HelpCircle className="w-4 h-4 text-slate-700" />
                  <span>Help Me Guide</span>
                </button>
              </div>
            </div>

            {/* Right Sidebar: Recent Activity */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-[#0B1E38]">
                    Recent Activity
                  </h2>
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>

                <div className="space-y-4 divide-y divide-slate-100">
                  {recentCases.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/cases/${item.id}`)}
                      className="pt-3 first:pt-0 space-y-1.5 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-500 group-hover:text-blue-900 font-semibold">
                          {item.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            item.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : item.status === 'Resolved'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-800 font-medium line-clamp-2 leading-snug">
                        {item.title}
                      </p>

                      <div className="text-[11px] text-slate-400">
                        {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => navigate('/cases')}
                    className="w-full flex items-center justify-center gap-1 text-xs font-bold text-[#0B1E38] hover:text-blue-700 transition-colors py-1 cursor-pointer"
                    id="view-all-cases-sidebar-link"
                  >
                    <span>View All Cases</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SCREEN 3: Active Conversation & Help Me Mode */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Top Navigation & Status */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0B1E38] text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    NagpurSetu Assistant
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Online • Instant NMC Routing</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleProceed}
                  className="px-4 py-2 bg-[#0B1E38] hover:bg-[#152e52] text-white text-xs font-semibold rounded-md shadow-xs transition-all cursor-pointer"
                  id="active-chat-review-report-button"
                >
                  Review Report &rarr;
                </button>
              </div>
            </div>

            {/* Date divider */}
            <div className="flex items-center justify-center">
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
                Today
              </span>
            </div>

            {/* Messages Flow */}
            <div className="space-y-4 pb-4">
              {messages.map((msg) => (
                <React.Fragment key={msg.id}>
                  {msg.sender === 'user' ? (
                    <div className="flex justify-end">
                      <div className="bg-[#E5E7EB] text-slate-900 rounded-2xl rounded-tr-xs px-4 py-3 text-sm max-w-lg shadow-2xs font-medium">
                        {msg.text}
                        {msg.meta?.photoUrl && (
                          <div className="mt-2 rounded-lg overflow-hidden border border-slate-300">
                            <img
                              src={msg.meta.photoUrl}
                              alt="Upload preview"
                              className="w-full h-36 object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 justify-start max-w-2xl">
                      <div className="w-8 h-8 rounded-full bg-[#0B1E38] text-white flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>

                      <div className="space-y-3 w-full">
                        {/* Bot Bubble */}
                        <div className="bg-[#122A4E] text-white rounded-2xl rounded-tl-xs p-4 sm:p-5 text-sm space-y-4 shadow-sm">
                          <p className="leading-relaxed font-medium">
                            {msg.text}
                          </p>

                          {/* Embedded Map Picker Preview in Message */}
                          <div className="bg-white rounded-xl overflow-hidden text-slate-800 border border-slate-200">
                            {/* Map Snapshot Visual */}
                            <div className="relative h-32 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                              {/* Simulated clean vector styled map view of Nagpur */}
                              <svg className="w-full h-full object-cover" viewBox="0 0 400 150">
                                <rect width="400" height="150" fill="#E8ECEF" />
                                <path d="M 0,40 Q 150,60 400,20" stroke="#CBD5E1" strokeWidth="12" fill="none" />
                                <path d="M 50,150 Q 180,90 350,0" stroke="#FDE68A" strokeWidth="8" fill="none" />
                                <path d="M 200,150 L 220,0" stroke="#93C5FD" strokeWidth="6" fill="none" />
                                <circle cx="190" cy="75" r="8" fill="#EF4444" stroke="#FFF" strokeWidth="2" />
                              </svg>

                              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                <button
                                  onClick={handleShareLocation}
                                  disabled={isLocating}
                                  className="flex items-center gap-2 px-4 py-2 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold rounded-lg shadow-md border border-slate-200 transition-all cursor-pointer"
                                  id="chat-share-location-button"
                                >
                                  <Crosshair className={`w-4 h-4 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
                                  <span>{isLocating ? 'Detecting Location...' : 'Share Current Location'}</span>
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() => setMapPickerOpen(true)}
                              className="w-full p-3 text-left flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100 cursor-pointer"
                              id="chat-select-on-map-button"
                            >
                              <div>
                                <span className="block text-slate-900 font-bold">Select on Map</span>
                                <span className="text-[11px] text-slate-500 font-normal">
                                  {currentLocation}
                                </span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>

                          {/* Photo Upload Card */}
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 text-center cursor-pointer transition-colors"
                            id="chat-add-photo-dropzone"
                          >
                            <div className="w-9 h-9 rounded-full bg-white/20 text-white mx-auto flex items-center justify-center mb-2">
                              <Camera className="w-4 h-4" />
                            </div>
                            <div className="text-xs font-bold text-white">
                              Add a photo (Optional)
                            </div>
                            <div className="text-[11px] text-slate-300 mt-0.5">
                              Helps workers find the exact spot faster
                            </div>
                          </div>
                        </div>

                        {msg.widgetType === 'case_summary' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-blue-900">
                                Ready for submission
                              </div>
                              <div className="text-[11px] text-blue-700">
                                Problem categorized and mapped to {currentWard}
                              </div>
                            </div>
                            <button
                              onClick={handleProceed}
                              className="px-4 py-2 bg-[#0B1E38] hover:bg-[#152e52] text-white text-xs font-bold rounded-md shadow-xs transition-all cursor-pointer"
                            >
                              Proceed to Review
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Help Me Mode Active Section */}
            {helpMeModeActive && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                  <span>🤝 Help Me Mode Active</span>
                </div>
                <p className="text-xs text-slate-600">
                  Tap a category if this is related to something else:
                </p>

                {/* 6 Categories Grid matching Screenshot 3 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categoriesList.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const IconComp = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          handleSendMessage(`This is regarding ${cat.id}`);
                        }}
                        className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#D3E3FD] border-blue-400 text-[#0B1E38] shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        } ${cat.id === 'Something Else' ? 'border-dashed' : ''}`}
                        id={`category-pill-${cat.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold whitespace-pre-line leading-tight">
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Persistent Input Bar */}
            <div className="sticky bottom-4 bg-white border border-slate-300 rounded-full px-4 py-2 shadow-md flex items-center gap-3">
              <button
                onClick={toggleListening}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:text-slate-800'
                }`}
                id="active-chat-mic-button"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type or say it in Hindi/Marathi..."
                className="w-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
                id="active-chat-input"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Attach photo"
                id="active-chat-clip-button"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-full bg-[#0B1E38] hover:bg-[#152e52] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer"
                id="active-chat-send-button"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Map Picker Modal */}
      {mapPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0B1E38]">Select Spot in Nagpur</h3>
              <button onClick={() => setMapPickerOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-slate-600">
                Select a recognized locality or landmark in Nagpur:
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {[
                  { name: '42 Dharampeth Extension, Nagpur', ward: 'Dharampeth (Ward 4)' },
                  { name: 'Variety Square, West High Court Road', ward: 'Dharampeth (Ward 4)' },
                  { name: 'Shivaji Hall, 8-Rasta Square, Laxmi Nagar', ward: 'Laxmi Nagar (Ward 7)' },
                  { name: 'Civil Lines, Near High Court Bench', ward: 'Civil Lines (Ward 1)' },
                  { name: 'Mangalwari Main Square & Market', ward: 'Mangalwari (Ward 2)' },
                  { name: 'Congress Nagar T-Point, Dhantoli', ward: 'Dhantoli (Ward 5)' },
                  { name: 'Gandhi Gate, Mahal Heritage Area', ward: 'Gandhibagh (Ward 6)' },
                  { name: 'Itwari Central Wholesale Market', ward: 'Itwari (Ward 9)' },
                ].map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => {
                      setCurrentLocation(loc.name);
                      setCurrentWard(loc.ward);
                      setMapPickerOpen(false);
                    }}
                    className="p-3 text-left border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{loc.name}</div>
                      <div className="text-slate-500 text-[11px]">{loc.ward}</div>
                    </div>
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
