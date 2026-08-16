import React, { useState } from 'react';
import { 
  Flame, 
  MapPin, 
  AlertTriangle, 
  ChevronRight, 
  Download, 
  ShieldAlert,
  Clock
} from 'lucide-react';
import { HOTSPOT_CLUSTERS } from '../data/initialData';
import { HotspotCluster } from '../types';

interface HotspotsScreenProps {
  navigate: (route: string) => void;
}

export const HotspotsScreen: React.FC<HotspotsScreenProps> = ({
  navigate,
}) => {
  const [selectedCluster, setSelectedCluster] = useState<HotspotCluster>(HOTSPOT_CLUSTERS[0]);

  return (
    <div className="w-full bg-[#FAFCFF] min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8" id="hotspots-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E38] tracking-tight">
                Civic Problem Hotspots
              </h1>
              <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                5 Active Clusters
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Automated spatial clustering identifying high-frequency complaint corridors in Nagpur.
            </p>
          </div>

          <button
            onClick={() => alert('Spatial incident report downloaded.')}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download Spatial Log</span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clusters List */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Incident Corridors
            </h2>

            {HOTSPOT_CLUSTERS.map((cluster) => {
              const isSelected = selectedCluster.id === cluster.id;
              return (
                <div
                  key={cluster.id}
                  onClick={() => setSelectedCluster(cluster)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      {cluster.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        cluster.severity === 'high'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {cluster.count} Complaints
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    {cluster.ward} • {cluster.category}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Inspector */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Selected Hotspot</span>
                <h2 className="text-xl font-bold text-[#0B1E38]">{selectedCluster.name}</h2>
                <div className="text-xs text-slate-500">{selectedCluster.ward}</div>
              </div>

              <span className="px-3 py-1 bg-red-100 text-red-800 font-extrabold text-xs rounded-md">
                {selectedCluster.severity.toUpperCase()} PRIORITY
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700">Cluster Analysis & Ground Realities:</span>
              <p className="text-slate-600 bg-slate-50 p-4 rounded-xl leading-relaxed">
                {selectedCluster.description}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-500">
                Recommended Municipal Interventions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900">Zonal Inspection Unit</div>
                  <div className="text-slate-500 text-[11px]">Deploy asphalt cold-mix repair team within 12 hours.</div>
                </div>

                <div className="p-3 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900">Preventive Silt Clearing</div>
                  <div className="text-slate-500 text-[11px]">Clean side gutters before next precipitation.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
