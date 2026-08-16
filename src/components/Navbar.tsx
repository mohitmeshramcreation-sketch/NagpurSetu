import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Globe, 
  Bell, 
  User, 
  Shield, 
  Sparkles,
  Headphones,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';
import { StorageService, subscribeToStorage } from '../services/storage';
import { FirebaseDataService } from '../services/firebaseDataService';
import { UserRole } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenAuthModal?: (mode: 'signin' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  navigate,
  activeRole,
  onRoleChange,
  onOpenAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English / हिन्दी / मराठी');
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const updateNotifs = () => {
      const notifs = StorageService.getNotifications();
      setUnreadCount(notifs.filter((n) => !n.read).length);
    };

    updateNotifs();
    const unsub = subscribeToStorage(updateNotifs);
    const unsubAuth = FirebaseDataService.onAuthChange((user) => {
      setAuthUser(user);
    });
    return () => {
      unsub();
      unsubAuth();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await FirebaseDataService.signOutUser();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const navLinks = [
    { label: 'Home', route: '/' },
    { label: 'My Cases', route: '/cases' },
    { label: 'Notifications', route: '/notifications', badge: unreadCount },
    { label: 'Profile', route: '/profile' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden group"
              id="nav-logo"
            >
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-[#0B1E38] group-hover:text-blue-900 transition-colors">
                  NagpurSetu
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 -mt-1">
                  NMC Civic Portal
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
              {navLinks.map((link) => {
                const isActive =
                  currentRoute === link.route ||
                  (link.route === '/cases' && currentRoute.startsWith('/cases')) ||
                  (link.route === '/talk' && currentRoute.startsWith('/talk'));

                return (
                  <button
                    key={link.route}
                    onClick={() => navigate(link.route)}
                    className={`relative px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'text-[#0B1E38] font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span className="flex items-center gap-1.5">
                      {link.label}
                      {link.badge && link.badge > 0 ? (
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold text-white bg-red-600 rounded-full">
                          {link.badge}
                        </span>
                      ) : null}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#0B1E38] rounded-full" />
                    )}
                  </button>
                );
              })}

              {/* Officer / Admin Portal shortcut if in Officer mode */}
              {activeRole !== 'citizen' && (
                <button
                  onClick={() => navigate('/officer')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                    currentRoute.startsWith('/officer') || currentRoute.startsWith('/admin')
                      ? 'bg-blue-50 text-blue-900 border-blue-300 shadow-2xs'
                      : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                  id="nav-officer-portal-link"
                >
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-blue-700" />
                    Officer Console
                  </span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Action Tools */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                id="language-selector-button"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentLang}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                  <button
                    onClick={() => {
                      setCurrentLang('English / हिन्दी / मराठी');
                      StorageService.setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-800"
                  >
                    <span>English (Default)</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentLang('हिन्दी (Hindi)');
                      StorageService.setLanguage('hi');
                      setLangDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-800"
                  >
                    <span>हिन्दी (Hindi)</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentLang('मराठी (Marathi)');
                      StorageService.setLanguage('mr');
                      setLangDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-800"
                  >
                    <span>मराठी (Marathi)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tell NagpurSetu Primary Button */}
            <button
              onClick={() => navigate('/talk')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0B1E38] hover:bg-[#152e52] rounded-md transition-all shadow-xs active:scale-[0.98]"
              id="nav-tell-nagpursetu-button"
            >
              <Headphones className="w-4 h-4" />
              <span>Tell NagpurSetu</span>
            </button>

            {/* Authentication Buttons (Sign In / Sign Up / User Profile) */}
            <div className="flex items-center gap-2 pl-1">
              {authUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition cursor-pointer"
                    title={authUser.email || authUser.displayName || 'Profile'}
                  >
                    <User className="w-3.5 h-3.5 text-orange-600" />
                    <span className="max-w-[100px] truncate">{authUser.displayName || authUser.email?.split('@')[0] || 'User'}</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenAuthModal && onOpenAuthModal('signin')}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0B1E38] hover:bg-slate-100 rounded-md border border-transparent transition cursor-pointer"
                    id="nav-login-button"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-500" />
                    <span>Log In</span>
                  </button>
                  <button
                    onClick={() => onOpenAuthModal && onOpenAuthModal('signup')}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#D94E07] rounded-md transition shadow-2xs cursor-pointer"
                    id="nav-signup-button"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-white" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => navigate('/talk')}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0B1E38] rounded-md flex items-center gap-1"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Tell NagpurSetu</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => {
                navigate(link.route);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100 flex items-center justify-between"
            >
              <span>{link.label}</span>
              {link.badge && link.badge > 0 ? (
                <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                  {link.badge}
                </span>
              ) : null}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-200 space-y-2">
            {authUser ? (
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-semibold text-slate-800">{authUser.displayName || authUser.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    if (onOpenAuthModal) onOpenAuthModal('signin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    if (onOpenAuthModal) onOpenAuthModal('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#D94E07] rounded-md text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
