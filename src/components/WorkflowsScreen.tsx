import React, { useState } from 'react';
import { 
  GitFork, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Plus, 
  ShieldCheck, 
  Sparkles,
  Zap
} from 'lucide-react';

interface WorkflowsScreenProps {
  navigate: (route: string) => void;
}

export const WorkflowsScreen: React.FC<WorkflowsScreenProps> = ({
  navigate,
}) => {
  const [workflows, setWorkflows] = useState([
    {
      id: 'wf-1',
      title: 'Pothole & Road Hazard Rapid Escalation',
      department: 'Roads & Traffic',
      trigger: 'Citizen reports road crater or cave-in',
      autoRoutingRule: 'Ward Officer -> Road Maintenance Crew within 2 hours',
      slaHours: 48,
      status: 'Active',
    },
    {
      id: 'wf-2',
      title: 'Overflowing Community Dustbin Sweep',
      department: 'Solid Waste Management',
      trigger: 'Garbage accumulation photo verified',
      autoRoutingRule: 'NMC Tipper Truck route dispatch via Zonal Supervisor',
      slaHours: 24,
      status: 'Active',
    },
    {
      id: 'wf-3',
      title: 'Monsoon Waterlogging & Silt Choking',
      department: 'Drainage & Sewage',
      trigger: 'Waterlogging > 6 inches near Metro corridor',
      autoRoutingRule: 'Suction Pump Unit + Emergency De-silting Squad',
      slaHours: 12,
      status: 'High Priority Active',
    },
    {
      id: 'wf-4',
      title: 'Streetlight Blackout & Dark Street Resolution',
      department: 'Electrical & Streetlights',
      trigger: 'Pole number identified or >2 streetlights offline',
      autoRoutingRule: 'Electrical Zonal Lineman repair schedule',
      slaHours: 48,
      status: 'Active',
    },
  ]);

  return (
    <div className="w-full bg-[#FAFCFF] min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8" id="workflows-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E38] tracking-tight">
              Municipal Workflows & SLA Rules
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Automated routing rules connecting citizen conversational reports directly to zonal staff.
            </p>
          </div>

          <button
            onClick={() => alert('New SLA workflow rule creator opened.')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0B1E38] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Routing Rule</span>
          </button>
        </div>

        {/* Workflows List */}
        <div className="space-y-4">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {wf.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-md">
                    {wf.status}
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-semibold">
                    Max SLA: {wf.slaHours} Hours
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Citizen Input Trigger</span>
                  <p className="text-slate-800 font-medium">{wf.trigger}</p>
                </div>

                <div className="bg-blue-50/60 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-blue-900">Automated Routing Action</span>
                  <p className="text-blue-950 font-medium">{wf.autoRoutingRule}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
