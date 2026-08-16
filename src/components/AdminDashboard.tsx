import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  GitFork, 
  Flame, 
  AlertOctagon, 
  HelpCircle, 
  LogOut, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  X, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  UploadCloud,
  FileSpreadsheet
} from 'lucide-react';
import { StorageService, subscribeToStorage } from '../services/storage';
import { CaseItem, Department, PriorityLevel, SlaStatus, UserRole } from '../types';

interface AdminDashboardProps {
  navigate: (route: string) => void;
  onOpenEmergencyModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  navigate,
  onOpenEmergencyModal,
}) => {
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Assigned Cases' | 'Analytics' | 'Workflows' | 'Hotspots' | 'Settings'>('Dashboard');
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Officer action form states
  const [actionStatus, setActionStatus] = useState<CaseItem['status']>('In Progress');
  const [officerNotes, setOfficerNotes] = useState('');
  const [evidenceFileUrl, setEvidenceFileUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [createCaseModalOpen, setCreateCaseModalOpen] = useState(false);

  // New Case Form
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseDesc, setNewCaseDesc] = useState('');
  const [newCaseDept, setNewCaseDept] = useState<Department>('Roads & Traffic');
  const [newCaseWard, setNewCaseWard] = useState('Dharampeth (Ward 4)');
  const [newCaseLocation, setNewCaseLocation] = useState('');
  const [newCasePriority, setNewCasePriority] = useState<PriorityLevel>('High');

  useEffect(() => {
    setCases(StorageService.getCases());
    const unsub = subscribeToStorage(() => {
      const updated = StorageService.getCases();
      setCases(updated);
      if (selectedCase) {
        const found = updated.find((c) => c.id.toLowerCase() === selectedCase.id.toLowerCase());
        if (found) setSelectedCase(found);
      }
    });
    return () => unsub();
  }, [selectedCase]);

  const refreshCases = () => {
    setCases(StorageService.getCases());
  };

  const handleUpdateStatus = () => {
    if (!selectedCase) return;
    setIsUpdating(true);

    StorageService.updateCaseStatus(
      selectedCase.id,
      actionStatus,
      'Officer Ramesh Kumar (Zonal Field Officer)',
      officerNotes || undefined,
      evidenceFileUrl || undefined
    );

    refreshCases();
    const updated = StorageService.getCaseById(selectedCase.id);
    setSelectedCase(updated || null);
    setIsUpdating(false);
    setOfficerNotes('');
  };

  const handleCreateManualCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle.trim()) return;

    const newId = `NS-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const created: CaseItem = {
      id: newId,
      title: newCaseTitle,
      description: newCaseDesc || 'Field inspection manual logged case.',
      category: `${newCaseDept} - General`,
      department: newCaseDept,
      location: newCaseLocation || `${newCaseWard}, Nagpur`,
      ward: newCaseWard,
      citizenName: 'Walk-in / Field Staff',
      citizenPhone: '+91 94220 00000',
      citizenId: 'CIT-OFFICER',
      status: 'Assigned',
      priority: newCasePriority,
      slaStatus: 'On Track',
      slaRemaining: '48h left',
      expectedResolutionDays: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedOfficer: 'Officer Ramesh Kumar',
      assignedOfficerPhone: '+91 94221 88902',
      attachments: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          title: 'Manual Case Registered',
          timestamp: 'Just now',
          actor: 'Officer Console',
          status: 'completed',
          dotColor: 'dark'
        }
      ]
    };

    StorageService.addCase(created);
    refreshCases();
    setCreateCaseModalOpen(false);
    setNewCaseTitle('');
    setNewCaseDesc('');
    setNewCaseLocation('');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Case ID,Title,Department,Ward,Priority,Status,SLA Remaining\n' +
      cases
        .map(
          (c) =>
            `"${c.id}","${c.title.replace(/"/g, '""')}","${c.department}","${c.ward}","${c.priority}","${c.status}","${c.slaRemaining || ''}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NagpurSetu_Cases_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Matrix List
  const filteredCases = cases.filter((c) => {
    if (activeTab === 'Assigned Cases') {
      const isAssigned = c.assignedOfficer?.includes('Ramesh') || c.assignedOfficer?.includes('Patil');
      if (!isAssigned) return false;
    }

    if (selectedDept !== 'All' && c.department !== selectedDept) return false;
    if (selectedWard !== 'All' && !c.ward.includes(selectedWard)) return false;
    if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        c.title.toLowerCase().includes(s) ||
        c.id.toLowerCase().includes(s) ||
        c.location.toLowerCase().includes(s) ||
        c.citizenName.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="w-full bg-[#F4F6F9] min-h-[calc(100vh-140px)] flex flex-col md:flex-row" id="admin-dashboard-container">
      
      {/* LEFT SIDEBAR (Matching Screen 5) */}
      <aside className="w-full md:w-64 bg-[#0B1E38] text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>NagpurSetu Admin</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              NMC Field & Operations Portal
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            {[
              { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard', route: '/officer' },
              { id: 'Assigned Cases', icon: CheckSquare, label: 'Assigned Cases', route: '/officer' },
              { id: 'Analytics', icon: BarChart3, label: 'Analytics', route: '/officer/analytics' },
              { id: 'Workflows', icon: GitFork, label: 'Workflows', route: '/officer/workflows' },
              { id: 'Hotspots', icon: Flame, label: 'Hotspots', route: '/officer/hotspots' },
              { id: 'Settings', icon: Settings, label: 'Settings', route: '/profile' },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    if (item.id === 'Analytics') {
                      navigate('/officer/analytics');
                    } else if (item.id === 'Hotspots') {
                      navigate('/officer/hotspots');
                    } else if (item.id === 'Workflows') {
                      navigate('/officer/workflows');
                    } else if (item.id === 'Settings') {
                      navigate('/profile');
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-white/10 text-white font-bold'
                      : 'hover:bg-white/5 text-slate-300 hover:text-white'
                  }`}
                  id={`admin-nav-${item.id.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Action: Emergency Alert */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          <button
            onClick={onOpenEmergencyModal}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
            id="admin-emergency-alert-button"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Emergency Alert</span>
          </button>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <button
              onClick={() => navigate('/help')}
              className="flex items-center gap-1 hover:text-white"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help</span>
            </button>
            <button
              onClick={() => {
                StorageService.setActiveRole('citizen');
                navigate('/');
              }}
              className="flex items-center gap-1 hover:text-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto">
        {/* Title & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E38] tracking-tight">
              Operational Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Overview of municipal tasks and citizen requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 shadow-2xs transition-colors cursor-pointer"
              id="export-report-btn"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export Report</span>
            </button>

            <button
              onClick={() => setCreateCaseModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0B1E38] hover:bg-[#152e52] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              id="create-case-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Create Case</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards (Matching Screen 5) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              New Cases (24h)
            </div>
            <div className="text-3xl font-extrabold text-[#0B1E38]">142</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <span>↑ 12% vs yesterday</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assigned to Me
            </div>
            <div className="text-3xl font-extrabold text-[#0B1E38]">28</div>
            <div className="text-xs text-slate-500 font-medium">
              Across 3 departments
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Overdue SLAs
            </div>
            <div className="text-3xl font-extrabold text-red-600">7</div>
            <div className="text-xs text-red-600 font-semibold">
              Immediate action required
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Resolved (Week)
            </div>
            <div className="text-3xl font-extrabold text-[#0B1E38]">315</div>
            <div className="text-xs text-emerald-600 font-semibold">
              94% resolution rate
            </div>
          </div>
        </div>

        {/* ACTIVE CASES MATRIX TABLE (Matching Screen 5) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Matrix Header & Filters */}
          <div className="p-6 border-b border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-extrabold text-[#0B1E38]">
                Active Cases Matrix
              </h2>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search case, ward, keyword..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
                />
              </div>
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Department:</span>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 font-semibold text-slate-700"
                >
                  <option value="All">All Departments</option>
                  <option value="Roads & Traffic">Roads & Traffic</option>
                  <option value="Solid Waste Management">Solid Waste Management</option>
                  <option value="Electrical & Streetlights">Electrical & Streetlights</option>
                  <option value="Water Works">Water Works</option>
                  <option value="Drainage & Sewage">Drainage & Sewage</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Ward:</span>
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 font-semibold text-slate-700"
                >
                  <option value="All">All Wards</option>
                  <option value="Dharampeth">Dharampeth (W4)</option>
                  <option value="Laxmi Nagar">Laxmi Nagar (W7)</option>
                  <option value="Mangalwari">Mangalwari (W2)</option>
                  <option value="Dhantoli">Dhantoli (W5)</option>
                  <option value="Civil Lines">Civil Lines (W1)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 font-semibold text-slate-700"
                >
                  <option value="All">All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Case ID</th>
                  <th className="px-6 py-3.5">Citizen Request</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">SLA Status</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Date Logged</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredCases.map((c) => {
                  const isHigh = c.priority === 'High';
                  const isWarning = c.slaStatus === 'Warning';

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                      id={`table-row-${c.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      {/* Case ID */}
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 group-hover:text-blue-900">
                        #{c.id}
                      </td>

                      {/* Citizen Request */}
                      <td className="px-6 py-4 max-w-xs">
                        <div className="font-bold text-slate-900 truncate">
                          {c.title}
                        </div>
                        <div className="text-slate-500 truncate text-[11px]">
                          {c.category}
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            c.priority === 'High' || c.priority === 'Critical'
                              ? 'bg-[#FEE2E2] text-[#B91C1C]'
                              : c.priority === 'Elevated'
                              ? 'bg-[#FFEDD5] text-[#C2410C]'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>

                      {/* SLA Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            c.slaStatus === 'Warning'
                              ? 'bg-[#FEE2E2] text-[#B91C1C]'
                              : c.slaStatus === 'On Track'
                              ? 'bg-[#DCFCE7] text-[#15803D]'
                              : 'bg-[#FEF3C7] text-[#B45309]'
                          }`}
                        >
                          {c.slaRemaining ? `Warning (${c.slaRemaining})` : c.slaStatus}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 text-slate-600">
                        {c.ward}
                      </td>

                      {/* Date Logged */}
                      <td className="px-6 py-4 text-slate-500">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Oct 24, 09:15 AM'}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 rounded-md text-slate-400 group-hover:text-blue-900">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* OFFICER CASE DETAIL & ACTION MODAL */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    #{selectedCase.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                      selectedCase.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-900'
                        : selectedCase.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {selectedCase.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedCase.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Citizen Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Citizen Details</span>
                <div className="font-bold text-slate-900">{selectedCase.citizenName}</div>
                <div className="text-slate-600 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedCase.citizenPhone}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Location & Ward</span>
                <div className="font-bold text-slate-900">{selectedCase.location}</div>
                <div className="text-slate-600">{selectedCase.ward}</div>
              </div>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-200 p-3.5 rounded-xl">
              <span className="font-bold text-slate-900 block mb-1">Issue Description:</span>
              {selectedCase.description}
            </div>

            {/* Photo Evidence if present */}
            {selectedCase.attachments && selectedCase.attachments.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">Citizen Photo Evidence:</span>
                <div className="h-40 rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={selectedCase.attachments[0].url}
                    alt="Evidence"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Officer Action Form */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Update Case Status & Field Work Notes
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Update Status:</label>
                  <select
                    value={actionStatus}
                    onChange={(e) => setActionStatus(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="In Progress">In Progress (Unit Dispatched)</option>
                    <option value="Waiting for Citizen">Waiting for Citizen Info</option>
                    <option value="Resolved">Resolved (Work Completed)</option>
                    <option value="Escalated">Escalate to Executive Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Upload Work Resolution Proof:</label>
                  <input
                    type="text"
                    value={evidenceFileUrl}
                    onChange={(e) => setEvidenceFileUrl(e.target.value)}
                    placeholder="Paste image URL (e.g. fixed road photo)"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Field Action Remarks / Resolution Details:
                </label>
                <textarea
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="e.g. Suction pump unit cleared water logging. De-silting completed at storm grate."
                  className="w-full h-20 bg-white border border-slate-300 rounded-lg p-3 text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="px-5 py-2 bg-[#0B1E38] hover:bg-[#152e52] text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  {isUpdating ? 'Saving Update...' : 'Submit Status Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MANUAL CASE MODAL */}
      {createCaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateManualCase} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-[#0B1E38]">Create Municipal Case (Staff Form)</h3>
              <button type="button" onClick={() => setCreateCaseModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                  placeholder="e.g. Broken Paver Blocks on Dharampeth Footpath"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newCaseDept}
                    onChange={(e) => setNewCaseDept(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Roads & Traffic">Roads & Traffic</option>
                    <option value="Solid Waste Management">Solid Waste Management</option>
                    <option value="Electrical & Streetlights">Electrical & Streetlights</option>
                    <option value="Water Works">Water Works</option>
                    <option value="Drainage & Sewage">Drainage & Sewage</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ward</label>
                  <select
                    value={newCaseWard}
                    onChange={(e) => setNewCaseWard(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Dharampeth (Ward 4)">Dharampeth (Ward 4)</option>
                    <option value="Laxmi Nagar (Ward 7)">Laxmi Nagar (Ward 7)</option>
                    <option value="Mangalwari (Ward 2)">Mangalwari (Ward 2)</option>
                    <option value="Dhantoli (Ward 5)">Dhantoli (Ward 5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specific Location / Landmark</label>
                <input
                  type="text"
                  value={newCaseLocation}
                  onChange={(e) => setNewCaseLocation(e.target.value)}
                  placeholder="e.g. West High Court Road opposite Laxmi Hall"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Details & Description</label>
                <textarea
                  value={newCaseDesc}
                  onChange={(e) => setNewCaseDesc(e.target.value)}
                  placeholder="Inspection notes or field staff observations..."
                  className="w-full h-20 border border-slate-300 rounded-lg p-2 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCreateCaseModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0B1E38] text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Create Case
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
