import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Shield, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';
import { auth, googleProvider, db } from '../services/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { StorageService } from '../services/storage';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('Dharampeth (Ward 4)');
  const [role, setRole] = useState<UserRole>('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!email || !password || !name) {
          setErrorMessage('Please fill in all required fields.');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setIsLoading(false);
          return;
        }

        // 1. Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Set Firebase Auth display name
        await updateProfile(user, { displayName: name });

        // 3. Create Firestore user document
        const userDocRef = doc(db, 'users', user.uid);
        const userProfileData = {
          id: user.uid,
          name,
          email,
          phone: phone || '+91 98230 11234',
          role: role,
          preferredLanguage: 'en',
          homeAddress: `${ward}, Nagpur, Maharashtra`,
          ward: ward,
          accessibility: {
            highContrast: false,
            largeText: false,
            voiceAssistance: true,
            screenReaderOptimized: false
          },
          notificationsEnabled: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await setDoc(userDocRef, userProfileData, { merge: true });

        // Sync local storage user profile & role
        StorageService.saveUser(userProfileData as any);
        StorageService.setActiveRole(role);

        setSuccessMessage('Account created successfully! Welcome to NagpurSetu.');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 800);

      } else {
        // Sign In
        if (!email || !password) {
          setErrorMessage('Please enter both email and password.');
          setIsLoading(false);
          return;
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch Firestore profile
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            StorageService.saveUser(data as any);
            if (data.role) {
              StorageService.setActiveRole(data.role as UserRole);
            }
          }
        } catch (dbErr) {
          console.warn('Could not load profile from Firestore:', dbErr);
        }

        setSuccessMessage('Signed in successfully!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 600);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      let msg = 'Authentication failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account already exists with this email. Please sign in instead.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email. Please sign up first.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Sync Firestore profile
      const userDocRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userDocRef);
      
      let userRole: UserRole = 'citizen';
      if (snap.exists()) {
        const data = snap.data();
        if (data.role) userRole = data.role as UserRole;
        StorageService.saveUser(data as any);
      } else {
        const newProfile = {
          id: user.uid,
          name: user.displayName || 'Nagpur Citizen',
          email: user.email || '',
          phone: user.phoneNumber || '+91 98230 11234',
          role: 'citizen' as UserRole,
          preferredLanguage: 'en',
          homeAddress: 'Dharampeth, Nagpur, Maharashtra',
          ward: 'Dharampeth (Ward 4)',
          accessibility: {
            highContrast: false,
            largeText: false,
            voiceAssistance: true,
            screenReaderOptimized: false
          },
          notificationsEnabled: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(userDocRef, newProfile, { merge: true });
        StorageService.saveUser(newProfile as any);
      }

      StorageService.setActiveRole(userRole);
      setSuccessMessage('Signed in with Google successfully!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 600);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      id="auth-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200"
        id="auth-modal-container"
      >
        {/* Header */}
        <div className="bg-[#0B1E38] text-white px-6 py-5 flex items-center justify-between relative">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-orange-400">NagpurSetu Identity</div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              {mode === 'signin' ? 'Sign In to NagpurSetu' : 'Create Civic Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition ${
              mode === 'signin'
                ? 'border-[#EA580C] text-[#0B1E38] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition ${
              mode === 'signup'
                ? 'border-[#EA580C] text-[#0B1E38] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Quick Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 shadow-2xs transition active:scale-[0.99] disabled:opacity-50 cursor-pointer mb-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-xs text-slate-400 uppercase tracking-wider font-medium absolute">
              or with email
            </span>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Deshmukh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        placeholder="+91 98230..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nagpur Ward
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <select
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                      >
                        <option value="Dharampeth (Ward 4)">Dharampeth</option>
                        <option value="Dhantoli (Ward 7)">Dhantoli</option>
                        <option value="Hanuman Nagar (Ward 9)">Hanuman Nagar</option>
                        <option value="Nehru Nagar (Ward 11)">Nehru Nagar</option>
                        <option value="Gandhibagh (Ward 14)">Gandhibagh</option>
                        <option value="Satranjipura (Ward 18)">Satranjipura</option>
                        <option value="Lakadganj (Ward 21)">Lakadganj</option>
                        <option value="Ashi Nagar (Ward 25)">Ashi Nagar</option>
                        <option value="Mangalwari (Ward 29)">Mangalwari</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('citizen')}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border text-left flex items-center gap-2 transition ${
                        role === 'citizen'
                          ? 'border-[#EA580C] bg-orange-50/50 text-[#EA580C] font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Citizen User</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('officer')}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border text-left flex items-center gap-2 transition ${
                        role === 'officer'
                          ? 'border-blue-600 bg-blue-50/50 text-blue-800 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Civic Officer</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#EA580C] hover:bg-[#D94E07] text-white text-sm font-semibold rounded-lg shadow-xs transition active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer toggle */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            {mode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className="text-[#EA580C] hover:underline font-semibold"
                >
                  Sign up now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                  }}
                  className="text-[#EA580C] hover:underline font-semibold"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
