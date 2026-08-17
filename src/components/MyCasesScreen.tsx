import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  ChevronRight, 
  Plus, 
  FileText, 
  Clock, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StorageService, subscribeToStorage } from '../services/storage';
import { CaseItem } from '../types';
import { CaseDetailModal } from './CaseDetailModal';

interface MyCasesScreenProps {
  navigate: (route: string) => void;
  selectedCaseId?: string | null;
}

export const MyCasesScreen: React.FC<MyCasesScreenProps> = ({
  navigate,
  selectedCaseId,
}) => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'In Progress' | 'Resolved'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalCase, setActiveModalCase] = useState<CaseItem | null>(null);

  useEffect(() => {
    const refresh = () => {
      const loaded = StorageService.getCases();
      setCases(loaded);

      if (selectedCaseId) {
        const target = loaded.find((c) => c.id.toLowerCase() === selectedCaseId.toLowerCase());
        if (target) setActiveModalCase(target);
      }
    };

    refresh();
    const unsub = subscribeToStorage(refresh);
    return () => unsub();
  }, [selectedCaseId]);

  const filtered = cases.filter((c) => {
    if (activeTab === 'In Progress' && (c.status === 'Resolved' || c.status === 'Closed')) return false;
    if (activeTab === 'Resolved' && c.status !== 'Resolved' && c.status !== 'Closed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.ward.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full bg-[#FAFCFF] min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8" id="my-cases-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E38] tracking-tight">
              My Civic Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Track real-time status and live officer actions for your reported issues.
            </p>
          </div>

          <button
            onClick={() => navigate('/talk')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0B1E38] hover:bg-[#152e52] text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            id="mycases-new-complaint-btn"
          >
            <Plus className="w-4 h-4" />
            <span>New Complaint</span>
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, case ID (e.g. #NS-8842, garbage, Dharampeth)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white transition-colors"
              id="mycases-search-input"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2">
              {(['All', 'In Progress', 'Resolved'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#0B1E38] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                  id={`tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <span className="text-xs font-semibold text-slate-500">
              Showing {filtered.length} {filtered.length === 1 ? 'case' : 'cases'}
            </span>
          </div>
        </div>

        {/* Cases List */}
        <div className="space-y-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalCase(item)}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 space-y-5 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
              id={`case-item-${item.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-blue-900">
                    #{item.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                      item.status === 'In Progress'
                        ? 'bg-[#FEF3C7] text-[#9A3412]'
                        : item.status === 'Resolved' || item.status === 'Closed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-50 text-blue-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-500">
                  {item.slaRemaining ? `SLA: ${item.slaRemaining}` : 'Logged recently'}
                </div>
              </div>

              {/* Title & Location */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0B1E38] transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{item.location}</span>
                </div>
              </div>

              {/* Stepper Timeline Summary */}
              <div className="pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {item.timeline.slice(0, 4).map((step, idx) => {
                    const isComplete = step.status === 'completed';
                    const isCurrent = step.status === 'current';
                    return (
                      <div key={step.id || idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              isComplete
                                ? 'bg-[#0B1E38]'
                                : isCurrent
                                ? 'bg-[#F97316] ring-2 ring-orange-200'
                                : 'bg-slate-300'
                            }`}
                          />
                          <span
                            className={`text-xs font-bold truncate ${
                              isComplete || isCurrent ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>
                        <div className="pl-4 text-[11px] text-slate-500 truncate">
                          {step.actor || step.timestamp}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Department: <strong className="text-slate-700">{item.department}</strong>
                </span>
                <span className="font-bold text-[#0B1E38] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View Full Case History <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <div className="space-y-1">
                <div className="text-base font-bold text-slate-800">
                  {cases.length === 0 ? 'No Complaints Logged Yet' : 'No matching cases found'}
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {cases.length === 0
                    ? 'When you report a municipal grievance or request civic assistance, your case timeline and officer status will appear here.'
                    : 'Try searching for another keyword or adjust the status filter.'}
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/complaints')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B1E38] text-white text-xs font-bold rounded-xl hover:bg-[#152e52] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Report an Issue</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Case Details Modal */}
      {activeModalCase && (
        <CaseDetailModal
          caseItem={activeModalCase}
          onClose={() => setActiveModalCase(null)}
          onCaseUpdated={(updated) => {
            setActiveModalCase(updated);
            setCases(StorageService.getCases());
          }}
        />
      )}
    </div>
  );
};
