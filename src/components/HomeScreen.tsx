import React from 'react';
import { 
  Mic, 
  User, 
  Archive, 
  Sparkles, 
  ClipboardCheck, 
  TrendingUp, 
  MessageSquareText, 
  FileText,
  Volume2
} from 'lucide-react';

interface HomeScreenProps {
  navigate: (route: string) => void;
  onExploreServices?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  navigate,
  onExploreServices,
}) => {
  return (
    <div className="w-full bg-[#FAFCFF] min-h-[calc(100vh-140px)] flex flex-col justify-between" id="home-screen-container">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-[#0B1E38] tracking-tight leading-[1.15]">
                Your City. Your Problem. <br />
                <span className="text-[#0B1E38]">One Conversation.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Tell NagpurSetu what is wrong or what service you need—in Marathi, Hindi or English. You don't need to know which department to contact.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/talk')}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-[#EA580C] hover:bg-[#D94E07] text-white text-base font-semibold rounded-md shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                id="hero-talk-to-nagpursetu-button"
              >
                <Mic className="w-5 h-5 text-white" />
                <span>Talk to NagpurSetu</span>
              </button>

              <button
                onClick={() => onExploreServices ? onExploreServices() : navigate('/services')}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-base font-semibold rounded-md border border-slate-300 shadow-2xs transition-all cursor-pointer"
                id="hero-explore-services-button"
              >
                Explore Services
              </button>
            </div>
          </div>

          {/* Right Column: Stitch Conversation Visual Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#EEF3F8] border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs relative overflow-hidden">
              {/* User Bubble 1 */}
              <div className="flex items-start gap-3 justify-start max-w-md">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium shadow-2xs">
                  Mere area mein garbage nahi uthaya.
                </div>
              </div>

              {/* Bot Response Bubble (Light Blue) */}
              <div className="flex items-start justify-end pl-8 sm:pl-12">
                <div className="bg-[#D3E3FD] border border-blue-200/60 rounded-xl p-4 sm:p-5 text-slate-900 max-w-md space-y-2 shadow-2xs">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium leading-snug">
                      Understood. I have logged a Solid Waste Management case for your location.
                    </p>
                    <div className="w-8 h-8 rounded-lg bg-[#0B1E38] text-white flex items-center justify-center shrink-0">
                      <Archive className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 font-mono">
                    Case #1024 created
                  </div>
                </div>
              </div>

              {/* User Bubble 2 */}
              <div className="flex items-start gap-3 justify-start max-w-md pt-1">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium shadow-2xs font-['Noto_Sans_Devanagari']">
                  माझ्या रस्त्यावर मोठा खड्डा आहे.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="text-center space-y-2 mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E38]">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            From a simple sentence to swift civic action.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 hover:border-slate-300 transition-shadow hover:shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">1. Tell Us</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Speak or type your issue in your preferred language.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 hover:border-slate-300 transition-shadow hover:shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">2. We Understand</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our AI categorizes the problem and identifies the right department automatically.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 hover:border-slate-300 transition-shadow hover:shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">3. Team Assigned</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A case is created and immediately routed to the local civic officer.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 hover:border-slate-300 transition-shadow hover:shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">4. Tracked</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You receive a tracking link to follow progress until resolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to connect banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="bg-[#122A4E] rounded-2xl p-8 sm:p-12 text-center text-white space-y-5 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to connect with your city?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Report an issue or request a service in seconds without navigating complex department menus.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/talk')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#EA580C] hover:bg-[#D94E07] text-white text-base font-semibold rounded-md shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              id="cta-start-conversation-button"
            >
              <MessageSquareText className="w-5 h-5 text-white" />
              <span>Start Conversation</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
