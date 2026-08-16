import React, { useState } from 'react';
import { 
  BarChart3, 
  Flame, 
  MapPin, 
  Download, 
  Filter, 
  ArrowUpRight, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Droplet, 
  Trash2, 
  Construction, 
  ShieldAlert, 
  Send,
  Globe2,
  Check
} from 'lucide-react';
import { COMMUNITY_INSIGHTS, HOTSPOT_CLUSTERS } from '../data/initialData';
import { HotspotCluster } from '../types';

interface AnalyticsScreenProps {
  navigate: (route: string) => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  navigate,
}) => {
  const [timeFilter, setTimeFilter] = useState<'Today' | '7 Days' | '30 Days'>('7 Days');
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotCluster | null>(HOTSPOT_CLUSTERS[0]);
  const [dispatchedUnits, setDispatchedUnits] = useState<Record<string, boolean>>({});

  const handleDispatchUnit = (insightId: string) => {
    setDispatchedUnits((prev) => ({ ...prev, [insightId]: true }));
  };

  return (
    <div className="w-full bg-[#FAFCFF] min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8" id="analytics-screen-container">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP HEADER (Matching Screen 6) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E38] tracking-tight">
                Analytics & Insights
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700 tracking-wider">
                DEMO DATA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Real-time civic intelligence across Nagpur municipal zones.
            </p>
          </div>

          {/* Time Range Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
            {(['Today', '7 Days', '30 Days'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  timeFilter === t
                    ? 'bg-white text-[#0B1E38] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id={`time-filter-${t.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 4 KPI CARDS (Matching Screen 6) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Reports
            </div>
            <div className="text-3xl font-extrabold text-[#0B1E38]">
              {timeFilter === 'Today' ? '142' : timeFilter === '7 Days' ? '2,481' : '9,820'}
            </div>
            <div className="text-xs text-emerald-600 font-bold">
              ↑ +12% from last week
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Resolution Rate
            </div>
            <div className="text-3xl font-extrabold text-[#0B1E38]">84.2%</div>
            <div className="text-xs text-slate-500 font-medium">
              Target: 90%
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Critical SLAs Breached
            </div>
            <div className="text-3xl font-extrabold text-red-600">42</div>
            <div className="text-xs text-red-600 font-bold">
              ↳ Action Required
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Avg Time to Resolve
            </div>
            <div className="text-3xl font-extrabold text-[#0B1E38]">3.2 Days</div>
            <div className="text-xs text-emerald-600 font-bold">
              ↳ -0.4 days
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Hotspot Map (Left) & Community Intelligence (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Problem Hotspot Map (Matching Screen 6) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#0B1E38]">
                Problem Hotspot Map
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/officer')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 inline mr-1" />
                  Filters
                </button>
                <button
                  onClick={() => alert('Hotspot report downloaded for NMC Ward Officers.')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 inline mr-1" />
                  Export
                </button>
              </div>
            </div>

            {/* Interactive Vector Map of Nagpur */}
            <div className="relative h-80 bg-[#E8EDF2] rounded-xl overflow-hidden border border-slate-200 p-4">
              <svg className="w-full h-full" viewBox="0 0 600 350">
                {/* Background Roads & Zones */}
                <rect width="600" height="350" fill="#E8EDF2" />
                
                {/* Nagpur Arterial Roads (WHC Road, Ring Road, Amravati Road, Wardha Road) */}
                <path d="M 50,180 Q 300,170 550,180" stroke="#CBD5E1" strokeWidth="8" fill="none" />
                <path d="M 300,30 Q 300,180 300,320" stroke="#CBD5E1" strokeWidth="8" fill="none" />
                <path d="M 120,40 Q 300,180 480,310" stroke="#FDE68A" strokeWidth="6" fill="none" />
                <path d="M 480,40 Q 300,180 120,310" stroke="#93C5FD" strokeWidth="6" fill="none" />

                {/* Outer Ring boundary */}
                <ellipse cx="300" cy="180" rx="240" ry="140" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" fill="none" />

                {/* Hotspot Circles */}
                {/* 1. Variety Sq / Dharampeth (High density) */}
                <circle cx="210" cy="160" r="32" fill="#EF4444" fillOpacity="0.25" />
                <circle cx="210" cy="160" r="16" fill="#EF4444" fillOpacity="0.6" />
                <circle
                  cx="210"
                  cy="160"
                  r="8"
                  fill="#B91C1C"
                  stroke="#FFF"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setSelectedHotspot(HOTSPOT_CLUSTERS[0])}
                />
                <text x="225" y="165" fontSize="11" fontWeight="bold" fill="#0F172A">Dharampeth (24)</text>

                {/* 2. Itwari Market (High density) */}
                <circle cx="420" cy="140" r="38" fill="#EF4444" fillOpacity="0.25" />
                <circle cx="420" cy="140" r="20" fill="#EF4444" fillOpacity="0.6" />
                <circle
                  cx="420"
                  cy="140"
                  r="8"
                  fill="#B91C1C"
                  stroke="#FFF"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setSelectedHotspot(HOTSPOT_CLUSTERS[1])}
                />
                <text x="435" y="145" fontSize="11" fontWeight="bold" fill="#0F172A">Itwari (31)</text>

                {/* 3. Sadar (Moderate density) */}
                <circle cx="270" cy="100" r="22" fill="#F59E0B" fillOpacity="0.3" />
                <circle
                  cx="270"
                  cy="100"
                  r="7"
                  fill="#D97706"
                  stroke="#FFF"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setSelectedHotspot(HOTSPOT_CLUSTERS[2])}
                />
                <text x="285" y="105" fontSize="11" fontWeight="bold" fill="#0F172A">Sadar (14)</text>

                {/* 4. Mahal (Moderate density) */}
                <circle cx="360" cy="200" r="25" fill="#F59E0B" fillOpacity="0.3" />
                <circle
                  cx="360"
                  cy="200"
                  r="7"
                  fill="#D97706"
                  stroke="#FFF"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setSelectedHotspot(HOTSPOT_CLUSTERS[3])}
                />
                <text x="375" y="205" fontSize="11" fontWeight="bold" fill="#0F172A">Mahal (19)</text>

                {/* 5. Laxmi Nagar */}
                <circle cx="200" cy="240" r="16" fill="#10B981" fillOpacity="0.3" />
                <circle
                  cx="200"
                  cy="240"
                  r="6"
                  fill="#059669"
                  stroke="#FFF"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setSelectedHotspot(HOTSPOT_CLUSTERS[4])}
                />
                <text x="215" y="245" fontSize="11" fontWeight="bold" fill="#0F172A">Laxmi Nagar (8)</text>
              </svg>

              {/* Map floating info badge for selected hotspot */}
              {selectedHotspot && (
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-3 shadow-md flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-red-600" />
                      <span>{selectedHotspot.name} — {selectedHotspot.ward}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {selectedHotspot.description}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-red-100 text-red-800 font-extrabold rounded-md text-xs shrink-0 ml-3">
                    {selectedHotspot.count} Reports
                  </span>
                </div>
              )}
            </div>

            {/* Density Legend */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>Low Density (&lt;10)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Moderate (10-20)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span>High Density (&gt;20)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Community Intelligence (Matching Screen 6) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
            <h2 className="text-lg font-extrabold text-[#0B1E38]">
              Community Intelligence
            </h2>

            <div className="space-y-4">
              {/* Insight 1: Surge in Road Damage */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                      <Construction className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Surge in Road Damage
                      </h3>
                      <p className="text-xs text-slate-600 leading-snug">
                        18 new pothole reports clustered around Ward 4 in the last 24 hours.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Ward 4 (Dharampeth)
                  </span>

                  <button
                    onClick={() => handleDispatchUnit('insight-1')}
                    disabled={dispatchedUnits['insight-1']}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      dispatchedUnits['insight-1']
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#0B1E38] hover:bg-[#152e52] text-white shadow-2xs'
                    }`}
                    id="dispatch-inspection-unit-btn"
                  >
                    {dispatchedUnits['insight-1'] ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Unit Dispatched
                      </span>
                    ) : (
                      'Dispatch Inspection Unit'
                    )}
                  </button>
                </div>
              </div>

              {/* Insight 2: Water Supply Disruption */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Water Supply Disruption
                    </h3>
                    <p className="text-xs text-slate-600 leading-snug">
                      Multiple low-pressure complaints originating from Dharampeth zone.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-semibold">Dharampeth Zone</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-md text-[11px]">
                    Status: Investigating
                  </span>
                </div>
              </div>

              {/* Insight 3: Waste Collection Delay */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Waste Collection Delay
                    </h3>
                    <p className="text-xs text-slate-600 leading-snug">
                      Consistent misses reported in route 12B over the weekend.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-semibold">Route 12B / Mangalwari</span>
                  <span className="text-slate-700 font-bold text-[11px]">
                    Assigned to: SWM Dept
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM METRICS: Department Distribution, SLA Trends, Language Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Cases by Department */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-extrabold text-[#0B1E38]">
              Cases by Department
            </h3>
            
            <div className="space-y-3 text-xs font-semibold">
              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Solid Waste Management</span>
                  <span className="font-bold">45%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0B1E38] h-full rounded-full w-[45%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Roads & Traffic</span>
                  <span className="font-bold">30%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#EA580C] h-full rounded-full w-[30%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Water Works</span>
                  <span className="font-bold">15%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full w-[15%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Public Health & Sanitation</span>
                  <span className="font-bold">10%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full w-[10%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: SLA Performance Trends */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-extrabold text-[#0B1E38]">
              Weekly SLA Compliance
            </h3>

            <div className="flex items-end justify-between h-36 pt-4 border-b border-slate-100 text-[10px] font-bold text-slate-500">
              {[
                { day: 'Mon', onTrack: 88, overdue: 12 },
                { day: 'Tue', onTrack: 92, overdue: 8 },
                { day: 'Wed', onTrack: 85, overdue: 15 },
                { day: 'Thu', onTrack: 90, overdue: 10 },
                { day: 'Fri', onTrack: 95, overdue: 5 },
                { day: 'Sat', onTrack: 82, overdue: 18 },
                { day: 'Sun', onTrack: 79, overdue: 21 },
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-1.5">
                  <div className="w-6 bg-slate-100 rounded-t-md flex flex-col justify-end h-28 overflow-hidden">
                    <div
                      style={{ height: `${item.overdue}%` }}
                      className="bg-red-400 w-full"
                      title={`Overdue: ${item.overdue}%`}
                    />
                    <div
                      style={{ height: `${item.onTrack}%` }}
                      className="bg-[#0B1E38] w-full"
                      title={`On Track: ${item.onTrack}%`}
                    />
                  </div>
                  <span>{item.day}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-slate-600 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B1E38]" />
                <span>Met SLA (&gt;88%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span>Overdue (&lt;12%)</span>
              </span>
            </div>
          </div>

          {/* Card 3: Language Usage Distribution */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-extrabold text-[#0B1E38]">
              Language Usage in Nagpur
            </h3>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>मराठी (Marathi)</span>
                  <span className="font-bold">55%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full w-[55%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>हिन्दी (Hindi)</span>
                  <span className="font-bold">30%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full w-[30%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>English</span>
                  <span className="font-bold">15%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-700 h-full rounded-full w-[15%]" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              NagpurSetu voice AI dynamically transitions between Marathi and Hindi spoken vernaculars without citizen configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
