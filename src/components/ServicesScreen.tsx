import React, { useState } from 'react';
import { 
  FileText, 
  FileCheck, 
  Receipt, 
  Droplets, 
  Store, 
  Trees, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import { MUNICIPAL_SERVICES } from '../data/initialData';
import { MunicipalService } from '../types';

interface ServicesScreenProps {
  navigate: (route: string) => void;
  onSelectService: (service: MunicipalService) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  navigate,
  onSelectService,
}) => {
  const [selectedService, setSelectedService] = useState<MunicipalService | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'FileCheck': return <FileCheck className="w-5 h-5" />;
      case 'Receipt': return <Receipt className="w-5 h-5" />;
      case 'Droplets': return <Droplets className="w-5 h-5" />;
      case 'Store': return <Store className="w-5 h-5" />;
      case 'Trees': return <Trees className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full bg-[#FAFCFF] min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8" id="services-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E38] tracking-tight">
            NMC Citizen Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Apply for certificates, utility connections, and property tax payments online through assisted conversational AI.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MUNICIPAL_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 space-y-4 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
              id={`service-card-${srv.id}`}
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                  {getServiceIcon(srv.icon)}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    {srv.name}
                  </h3>
                  <div className="text-[11px] font-semibold text-slate-500">
                    {srv.department}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {srv.description}
                </p>

                {/* Requirements */}
                <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-[11px]">
                  <span className="font-bold text-slate-700 block">Required Documents:</span>
                  <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                    {srv.requiredDocuments.map((doc, idx) => (
                      <li key={idx} className="truncate">{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>SLA: {srv.slaDays} Days</span>
                </div>

                <button
                  onClick={() => onSelectService(srv)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#0B1E38] hover:bg-[#152e52] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  id={`apply-service-${srv.id}`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Start with AI</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
