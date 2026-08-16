import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Eye, 
  Volume2, 
  Shield, 
  Check, 
  Save, 
  RotateCcw,
  Sparkles,
  LogOut,
  LogIn,
  KeyRound
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { FirebaseDataService } from '../services/firebaseDataService';
import { Language, UserProfile, UserRole } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

interface ProfileScreenProps {
  navigate: (route: string) => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  navigate,
  activeRole,
  onRoleChange,
}) => {
  const [profile, setProfile] = useState<UserProfile>(StorageService.getUser());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    setProfile(StorageService.getUser());
    const unsub = FirebaseDataService.onAuthChange((user) => {
      setAuthUser(user);
      if (user && user.uid) {
        FirebaseDataService.getUserProfile(user.uid).then((p) => {
          if (p) setProfile(p);
        }).catch(() => {});
      }
    });
    return () => unsub();
  }, [activeRole]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveUser(profile);
    
    // Save to Firestore if authenticated
    if (authUser?.uid) {
      await FirebaseDataService.saveUserProfile(authUser.uid, profile).catch((err) => {
        console.warn('Firestore profile sync error:', err);
      });
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSignOut = async () => {
    await FirebaseDataService.signOutUser();
    window.location.reload();
  };

  const handleResetDemoData = () => {
    if (confirm('Reset all demo complaints and cases back to initial sample state?')) {
      StorageService.resetDemoData();
      alert('Demo data has been restored to default state.');
      window.location.reload();
    }
  };

  return (
    <div className="w-full bg-[#FAFCFF] min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8" id="profile-screen">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E38] tracking-tight">
              Profile & Preferences
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Manage your contact information, language, and accessibility preferences.
            </p>
          </div>
        </div>

        {/* Account Authentication Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">NagpurSetu Account Status</div>
              <div className="text-sm font-bold text-slate-900">
                {authUser ? (
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Authenticated ({authUser.email || authUser.displayName})
                  </span>
                ) : (
                  <span className="text-slate-700">Guest / Unauthenticated Session</span>
                )}
              </div>
            </div>
          </div>

          {authUser ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="text-xs text-slate-500">
              Use <span className="font-bold text-[#EA580C]">Log In</span> or <span className="font-bold text-[#EA580C]">Sign Up</span> in the top header to connect your profile.
            </div>
          )}
        </div>

        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profile and accessibility preferences successfully saved!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
            <h2 className="text-base font-extrabold text-[#0B1E38] flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <span>Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Home Address in Nagpur</label>
                <input
                  type="text"
                  value={profile.homeAddress}
                  onChange={(e) => setProfile({ ...profile, homeAddress: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Municipal Ward</label>
                <select
                  value={profile.ward}
                  onChange={(e) => setProfile({ ...profile, ward: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700"
                >
                  <option value="Dharampeth (Ward 4)">Dharampeth (Ward 4)</option>
                  <option value="Laxmi Nagar (Ward 7)">Laxmi Nagar (Ward 7)</option>
                  <option value="Mangalwari (Ward 2)">Mangalwari (Ward 2)</option>
                  <option value="Dhantoli (Ward 5)">Dhantoli (Ward 5)</option>
                  <option value="Civil Lines (Ward 1)">Civil Lines (Ward 1)</option>
                  <option value="Gandhibagh (Ward 6)">Gandhibagh (Ward 6)</option>
                  <option value="Itwari (Ward 9)">Itwari (Ward 9)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Default Spoken Language</label>
                <select
                  value={profile.preferredLanguage}
                  onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value as Language })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700"
                >
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="en">English</option>
                  <option value="hinglish">Hinglish / Vernacular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-extrabold text-[#0B1E38] flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Accessibility & Assisted Input</span>
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/70">
                <div>
                  <span className="font-bold text-slate-900 block">Voice Feedback & Audio Prompts</span>
                  <span className="text-slate-500 text-[11px]">
                    Speaks AI confirmations aloud in Hindi/Marathi.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={profile.accessibility.voiceAssistance}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      accessibility: { ...profile.accessibility, voiceAssistance: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/70">
                <div>
                  <span className="font-bold text-slate-900 block">Large Text Rendering</span>
                  <span className="text-slate-500 text-[11px]">
                    Increases readability for elders and low-vision citizens.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={profile.accessibility.largeText}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      accessibility: { ...profile.accessibility, largeText: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={handleResetDemoData}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 font-semibold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Local Data</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-[#0B1E38] hover:bg-[#152e52] text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-all cursor-pointer"
              id="save-profile-btn"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
