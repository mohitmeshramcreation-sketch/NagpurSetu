import React, { useState } from 'react';
import { 
  X, 
  AlertOctagon, 
  Send, 
  ShieldAlert, 
  BellRing, 
  Check, 
  MapPin 
} from 'lucide-react';
import { StorageService } from '../services/storage';

interface EmergencyAlertModalProps {
  onClose: () => void;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({
  onClose,
}) => {
  const [alertType, setAlertType] = useState('Monsoon Flood & Waterlogging Warning');
  const [wardTarget, setWardTarget] = useState('Ward 4 (Dharampeth & West Nagpur)');
  const [alertMessage, setAlertMessage] = useState(
    'Heavy rain forecast in Nagpur. Civic emergency pumps deployed at Variety Square and Dharampeth. Avoid low-lying underpasses.'
  );
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertMessage.trim()) return;

    StorageService.addNotification({
      id: `alert-${Date.now()}`,
      userId: 'CIT-7749',
      title: `🚨 Civic Alert: ${alertType}`,
      message: `${alertMessage} [Targeted: ${wardTarget}]`,
      type: 'community_alert',
      read: false,
      createdAt: 'Just now',
      actionUrl: '/officer/analytics'
    });

    setSentSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" id="emergency-alert-modal">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-red-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 text-red-600 font-extrabold text-base">
            <AlertOctagon className="w-5 h-5" />
            <span>NMC Emergency Broadcast Dispatch</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-xl text-emerald-800">
            <Check className="w-8 h-8 mx-auto text-emerald-600" />
            <div className="font-bold text-sm">Emergency Broadcast Sent</div>
            <p className="text-xs text-emerald-700">
              Citizens in {wardTarget} and field officers have received high-priority alerts.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Alert Category</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 font-semibold text-slate-800"
              >
                <option value="Monsoon Flood & Waterlogging Warning">Monsoon Flood & Waterlogging Warning</option>
                <option value="Road Closure & Traffic Diversion">Road Closure & Traffic Diversion</option>
                <option value="Emergency Water Pipeline Shutdown">Emergency Water Pipeline Shutdown</option>
                <option value="Special Sanitation & Vector Control Drive">Special Sanitation & Vector Control Drive</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Municipal Zone / Ward</label>
              <select
                value={wardTarget}
                onChange={(e) => setWardTarget(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 font-semibold text-slate-800"
              >
                <option value="All Nagpur Wards (City-Wide Broadcast)">All Nagpur Wards (City-Wide Broadcast)</option>
                <option value="Ward 4 (Dharampeth & West Nagpur)">Ward 4 (Dharampeth & West Nagpur)</option>
                <option value="Ward 7 (Laxmi Nagar & South Nagpur)">Ward 7 (Laxmi Nagar & South Nagpur)</option>
                <option value="Ward 2 (Mangalwari & North Nagpur)">Ward 2 (Mangalwari & North Nagpur)</option>
                <option value="Ward 9 (Itwari & East Nagpur)">Ward 9 (Itwari & East Nagpur)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Broadcast Message</label>
              <textarea
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                className="w-full h-24 border border-slate-300 rounded-lg p-3 resize-none font-medium text-slate-800"
                placeholder="Type emergency alert bulletin..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <BellRing className="w-4 h-4" />
                <span>Broadcast Alert</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
