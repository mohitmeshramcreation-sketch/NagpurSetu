import React, { useState } from 'react';
import { MapPin, Navigation, Search, Check, Layers, Compass, Crosshair } from 'lucide-react';

export interface NagpurLocation {
  name: string;
  landmark: string;
  ward: string;
  zone: string;
  lat: number;
  lng: number;
}

export const NAGPUR_LOCALITIES: NagpurLocation[] = [
  { name: '42 Dharampeth Extension, Nagpur', landmark: 'Near Coffee House, West High Court Rd', ward: 'Dharampeth (Ward 4)', zone: 'Zone 2 (Dharampeth)', lat: 21.1438, lng: 79.0645 },
  { name: 'Variety Square, Sitabuldi', landmark: 'Maharajbagh Rd / Central Junction', ward: 'Dharampeth (Ward 4)', zone: 'Zone 2 (Dharampeth)', lat: 21.1466, lng: 79.0806 },
  { name: 'Shivaji Hall, 8-Rasta Square, Laxmi Nagar', landmark: 'Opposite VNIT gate road', ward: 'Laxmi Nagar (Ward 1)', zone: 'Zone 1 (Laxmi Nagar)', lat: 21.1219, lng: 79.0669 },
  { name: 'Civil Lines, Near High Court Bench', landmark: 'Palm Road / Judicial Enclave', ward: 'Civil Lines (Ward 1)', zone: 'Zone 2 (Dharampeth)', lat: 21.1578, lng: 79.0734 },
  { name: 'Mangalwari Main Square & Market', landmark: 'Sadar Bazar connecting link', ward: 'Mangalwari (Ward 10)', zone: 'Zone 10 (Mangalwari)', lat: 21.1712, lng: 79.0834 },
  { name: 'Congress Nagar T-Point, Dhantoli', landmark: 'Near Rahate Colony Metro Station', ward: 'Dhantoli (Ward 4)', zone: 'Zone 4 (Dhantoli)', lat: 21.1287, lng: 79.0851 },
  { name: 'Gandhi Gate, Mahal Heritage Precinct', landmark: 'Old City Center / Tilak Statue', ward: 'Gandhibagh (Ward 6)', zone: 'Zone 6 (Gandhibagh)', lat: 21.1441, lng: 79.1098 },
  { name: 'Itwari Wholesale Cloth Market', landmark: 'Near Shahid Chowk / Central Avenue', ward: 'Sataranjipura (Ward 7)', zone: 'Zone 7 (Sataranjipura)', lat: 21.1542, lng: 79.1165 },
  { name: 'Manish Nagar Main T-Point', landmark: 'Railway Underbridge / Somalwada', ward: 'Laxmi Nagar (Ward 1)', zone: 'Zone 1 (Laxmi Nagar)', lat: 21.0963, lng: 79.0772 },
  { name: 'Medical Square, Hanuman Nagar', landmark: 'GMC Hospital Front Gate', ward: 'Hanuman Nagar (Ward 3)', zone: 'Zone 3 (Hanuman Nagar)', lat: 21.1345, lng: 79.0961 },
  { name: 'Nandanvan Main Road & Water Tank', landmark: 'Near KDK College Square', ward: 'Nehru Nagar (Ward 5)', zone: 'Zone 5 (Nehru Nagar)', lat: 21.1365, lng: 79.1302 },
  { name: 'Kalamna Market Yard, Lakadganj', landmark: 'Central Agriculture Produce Hub', ward: 'Lakadganj (Ward 8)', zone: 'Zone 8 (Lakadganj)', lat: 21.1685, lng: 79.1458 },
];

interface NagpurMapViewerProps {
  selectedLocation: string;
  selectedWard?: string;
  onSelectLocation?: (loc: NagpurLocation) => void;
  height?: string;
  interactive?: boolean;
}

export const NagpurMapViewer: React.FC<NagpurMapViewerProps> = ({
  selectedLocation,
  selectedWard,
  onSelectLocation,
  height = 'h-48',
  interactive = true,
}) => {
  const [activeItem, setActiveItem] = useState<NagpurLocation>(() => {
    const found = NAGPUR_LOCALITIES.find(
      (l) => l.name.toLowerCase().includes(selectedLocation.toLowerCase()) || selectedLocation.toLowerCase().includes(l.name.toLowerCase())
    );
    return found || NAGPUR_LOCALITIES[0];
  });

  const [searchQuery, setSearchQuery] = useState('');

  const handlePinClick = (loc: NagpurLocation) => {
    setActiveItem(loc);
    if (onSelectLocation) {
      onSelectLocation(loc);
    }
  };

  const filtered = NAGPUR_LOCALITIES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.landmark.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`w-full ${height} bg-slate-900 rounded-xl overflow-hidden relative border border-slate-700 select-none flex flex-col justify-between shadow-inner`}>
      {/* Map Graphic Layer (Stylized OSM / Satellite hybrid) */}
      <div className="absolute inset-0 bg-[#0F172A]">
        {/* Background Grid & Streets */}
        <svg className="w-full h-full object-cover opacity-80" viewBox="0 0 600 300" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E293B" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="600" height="300" fill="url(#grid)" />
          
          {/* Ambazari Lake / Futala Lake waterbodies */}
          <ellipse cx="140" cy="190" rx="45" ry="30" fill="#0369A1" opacity="0.4" />
          <text x="110" y="195" fill="#38BDF8" fontSize="9" fontWeight="bold">Ambazari Lake</text>
          
          <ellipse cx="120" cy="90" rx="35" ry="20" fill="#0369A1" opacity="0.4" />
          <text x="100" y="94" fill="#38BDF8" fontSize="8" fontWeight="bold">Futala Lake</text>

          <ellipse cx="440" cy="180" rx="35" ry="22" fill="#0369A1" opacity="0.35" />
          <text x="415" y="184" fill="#38BDF8" fontSize="8" fontWeight="bold">Sakkardara</text>

          {/* Primary Arterial Road Networks (Nagpur Ring Roads & West High Court Rd) */}
          <path d="M 0,150 Q 200,140 600,160" stroke="#475569" strokeWidth="9" fill="none" />
          <path d="M 0,150 Q 200,140 600,160" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="6 4" fill="none" />
          
          {/* North-South corridor (Wardha Road / Metro Line) */}
          <path d="M 280,0 L 290,300" stroke="#F59E0B" strokeWidth="7" fill="none" opacity="0.8" />
          <path d="M 280,0 L 290,300" stroke="#FEF08A" strokeWidth="2" strokeDasharray="4 3" fill="none" />
          <text x="295" y="40" fill="#FDE047" fontSize="8" fontWeight="bold" transform="rotate(85 295 40)">NMC Metro Corridor</text>

          {/* Central Ring Road */}
          <circle cx="300" cy="150" r="100" stroke="#334155" strokeWidth="5" fill="none" />
          <path d="M 100,50 L 500,260" stroke="#334155" strokeWidth="4" fill="none" />
          <path d="M 80,260 L 520,60" stroke="#334155" strokeWidth="4" fill="none" />

          {/* Landmark Hotspot nodes */}
          {NAGPUR_LOCALITIES.map((loc, idx) => {
            // Map lat/lng relative to Nagpur bounding box
            const x = 50 + ((loc.lng - 79.05) / 0.12) * 480;
            const y = 260 - ((loc.lat - 21.08) / 0.11) * 220;
            const isSelected = activeItem.name === loc.name;

            return (
              <g key={loc.name} className="cursor-pointer transition-all" onClick={() => handlePinClick(loc)}>
                {isSelected && (
                  <circle cx={x} cy={y} r="16" fill="#EF4444" opacity="0.3" className="animate-ping" />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "8" : "5"}
                  fill={isSelected ? "#EF4444" : "#38BDF8"}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                />
                <text
                  x={x + 10}
                  y={y + 4}
                  fill={isSelected ? "#FFFFFF" : "#94A3B8"}
                  fontSize={isSelected ? "11" : "9"}
                  fontWeight={isSelected ? "bold" : "normal"}
                  className="drop-shadow-md pointer-events-none"
                >
                  {loc.name.split(',')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Top Header Overlay with Zone & Live Accuracy */}
      <div className="relative z-10 p-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-200 tracking-wide">
            NMC Spatial GIS • Nagpur Municipal Corporation
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold bg-blue-900/60 text-blue-200 border border-blue-700/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
          <Compass className="w-3 h-3 text-blue-300" />
          <span>GPS Fix (±4m)</span>
        </div>
      </div>

      {/* Center Pin Indicator */}
      <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center">
          <div className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/80 animate-bounce flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{activeItem.name.split(',')[0]}</span>
          </div>
        </div>
      </div>

      {/* Bottom Pinned Location Banner */}
      <div className="relative z-10 p-2.5 bg-slate-900/90 backdrop-blur-md border-t border-slate-700/80 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
            <MapPin className="w-4 h-4 text-red-400" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">
              {activeItem.name}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {activeItem.ward} • {activeItem.landmark}
            </div>
          </div>
        </div>

        {interactive && onSelectLocation && (
          <button
            onClick={() => onSelectLocation(activeItem)}
            className="ml-2 shrink-0 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            <span>Confirm Spot</span>
          </button>
        )}
      </div>
    </div>
  );
};
