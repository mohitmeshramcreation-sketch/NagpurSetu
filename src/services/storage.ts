import { CaseItem, NotificationItem, UserProfile, UserRole } from '../types';
import { INITIAL_CASES, INITIAL_NOTIFICATIONS, INITIAL_OFFICER, INITIAL_USER } from '../data/initialData';
import { FirebaseDataService } from './firebaseDataService';

const STORAGE_KEYS = {
  CASES: 'nagpursetu_cases_v3_clean',
  NOTIFICATIONS: 'nagpursetu_notifications_v3_clean',
  USER: 'nagpursetu_user_v3_clean',
  ACTIVE_ROLE: 'nagpursetu_active_role_v3_clean',
  CURRENT_LANGUAGE: 'nagpursetu_lang_v3_clean',
  DRAFT_CHAT: 'nagpursetu_draft_chat_v3_clean',
};

// Event listener mechanism for cross-component reactivity
const listeners: Set<() => void> = new Set();

// Cross-tab / cross-window real-time synchronization via BroadcastChannel
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('nagpursetu_realtime_sync');
    broadcastChannel.onmessage = () => {
      notifyLocalListeners();
    };
  } catch (e) {
    console.warn('BroadcastChannel not available:', e);
  }
}

// Listen to storage events from other tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('nagpursetu_')) {
      notifyLocalListeners();
    }
  });
}

// Track whether initial cloud sync has been received
let isCloudSynced = false;

// Background listener for Cloud Firestore real-time updates
if (typeof window !== 'undefined') {
  try {
    FirebaseDataService.subscribeToCases((firestoreCases) => {
      // Cloud Firestore is the authoritative source of truth
      isCloudSynced = true;
      if (Array.isArray(firestoreCases)) {
        try {
          localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(firestoreCases));
          notifyLocalListeners();
        } catch (e) {
          console.warn('Storage sync error:', e);
        }
      }
    });
  } catch (e) {
    console.warn('Firestore subscription init:', e);
  }
}

export const subscribeToStorage = (callback: () => void) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

const notifyLocalListeners = () => {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.error('Storage listener error:', e);
    }
  });
};

const notifyListeners = () => {
  // 1. Notify local React components immediately (0ms delay)
  notifyLocalListeners();
  
  // 2. Broadcast to other tabs / windows immediately (0ms delay)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
    } catch (e) {
      // ignore
    }
  }

  // 3. Dispatch window custom event for any non-React listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nagpursetu_data_change', { detail: { timestamp: Date.now() } }));
  }
};

export const StorageService = {
  getCases: (): CaseItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CASES);
      if (data !== null) {
        return JSON.parse(data);
      }
      // First boot before cloud sync
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(INITIAL_CASES));
      return INITIAL_CASES;
    } catch (e) {
      console.error('Error loading cases:', e);
      return [];
    }
  },

  getCaseById: (id: string): CaseItem | undefined => {
    const cases = StorageService.getCases();
    return cases.find((c) => c.id.toLowerCase() === id.toLowerCase() || c.id.replace('#', '').toLowerCase() === id.replace('#', '').toLowerCase());
  },

  saveCases: (cases: CaseItem[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
      notifyListeners();
    } catch (e) {
      console.error('Error saving cases:', e);
    }
  },

  deleteCase: (id: string): void => {
    const cases = StorageService.getCases();
    const updated = cases.filter((c) => c.id.toLowerCase() !== id.toLowerCase());
    StorageService.saveCases(updated);

    // Delete in Cloud Firestore immediately
    FirebaseDataService.deleteCase(id).catch((err) => {
      console.warn('Firestore delete warning:', err);
    });
  },

  clearAllCases: async (): Promise<void> => {
    StorageService.saveCases([]);
    try {
      await FirebaseDataService.clearAllCases();
    } catch (err) {
      console.warn('Firestore clear error:', err);
    }
  },

  seedDemoCases: async (): Promise<void> => {
    StorageService.saveCases(INITIAL_CASES);
    try {
      await FirebaseDataService.seedCases(INITIAL_CASES);
    } catch (err) {
      console.warn('Firestore seed error:', err);
    }
  },

  addCase: (newCase: CaseItem): CaseItem => {
    const cases = StorageService.getCases();
    const updated = [newCase, ...cases];
    StorageService.saveCases(updated);

    // Persist to Cloud Firestore in background
    FirebaseDataService.saveCase(newCase).catch((err) => {
      console.warn('Firestore case persist warning:', err);
    });

    // Auto-create notification for citizen
    StorageService.addNotification({
      id: `notif-${Date.now()}`,
      userId: newCase.citizenId,
      title: `Case Registered: #${newCase.id}`,
      message: `Your complaint regarding "${newCase.title}" has been registered and assigned to ${newCase.department}.`,
      type: 'case_update',
      caseId: newCase.id,
      read: false,
      createdAt: 'Just now',
      actionUrl: `/cases/${newCase.id}`
    });

    return newCase;
  },

  updateCase: (id: string, updates: Partial<CaseItem>): CaseItem | undefined => {
    const cases = StorageService.getCases();
    const index = cases.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return undefined;

    const existing = cases[index];
    const updatedCase: CaseItem = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    cases[index] = updatedCase;
    StorageService.saveCases(cases);

    // Sync updated case to Cloud Firestore
    FirebaseDataService.saveCase(updatedCase).catch((err) => {
      console.warn('Firestore update sync warning:', err);
    });

    return updatedCase;
  },

  updateCaseStatus: (
    id: string,
    newStatus: CaseItem['status'],
    actorName: string,
    remarks?: string,
    evidenceUrl?: string
  ): CaseItem | undefined => {
    const cases = StorageService.getCases();
    const currentCase = cases.find((c) => c.id.toLowerCase() === id.toLowerCase());
    if (!currentCase) return undefined;

    const newTimelineEvent = {
      id: `tl-${Date.now()}`,
      title: `Status: ${newStatus}`,
      timestamp: 'Just now',
      actor: actorName,
      description: remarks || `Case status updated to ${newStatus} by ${actorName}`,
      status: (newStatus === 'Resolved' || newStatus === 'Closed' ? 'completed' : 'current') as 'completed' | 'current' | 'pending',
      dotColor: (newStatus === 'Resolved' ? 'green' : newStatus === 'In Progress' ? 'orange' : 'dark') as 'dark' | 'orange' | 'green' | 'gray',
      evidenceUrl,
    };

    const updatedTimeline = [...currentCase.timeline, newTimelineEvent];

    return StorageService.updateCase(id, {
      status: newStatus,
      resolutionNotes: remarks || currentCase.resolutionNotes,
      resolutionEvidenceUrl: evidenceUrl || currentCase.resolutionEvidenceUrl,
      timeline: updatedTimeline,
    });
  },

  reopenCase: (id: string, citizenReason: string): CaseItem | undefined => {
    const cases = StorageService.getCases();
    const current = cases.find((c) => c.id.toLowerCase() === id.toLowerCase());
    if (!current) return undefined;

    const reopenEvent = {
      id: `tl-${Date.now()}`,
      title: 'Citizen Reopened Complaint',
      timestamp: 'Just now',
      actor: current.citizenName,
      description: `Citizen noted: "${citizenReason}". Sent back to ${current.department} for re-investigation.`,
      status: 'current' as const,
      dotColor: 'orange' as const,
    };

    return StorageService.updateCase(id, {
      status: 'Reopened',
      priority: 'High',
      slaStatus: 'Warning',
      slaRemaining: '24h left',
      timeline: [...current.timeline, reopenEvent],
    });
  },

  confirmResolution: (id: string, isResolved: boolean, feedback?: string): CaseItem | undefined => {
    const current = StorageService.getCaseById(id);
    if (!current) return undefined;

    if (isResolved) {
      const closeEvent = {
        id: `tl-${Date.now()}`,
        title: 'Citizen Confirmed Resolution',
        timestamp: 'Just now',
        actor: current.citizenName,
        description: feedback || 'Citizen verified satisfactory completion of work. Case closed.',
        status: 'completed' as const,
        dotColor: 'green' as const,
      };

      return StorageService.updateCase(id, {
        status: 'Closed',
        citizenFeedback: {
          isResolved: true,
          feedbackText: feedback,
          submittedAt: new Date().toISOString(),
        },
        timeline: [...current.timeline, closeEvent],
      });
    } else {
      return StorageService.reopenCase(id, feedback || 'Issue not resolved satisfactorily.');
    }
  },

  // Notifications
  getNotifications: (): NotificationItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error getting notifications:', e);
      return INITIAL_NOTIFICATIONS;
    }
  },

  addNotification: (notification: NotificationItem): void => {
    const list = StorageService.getNotifications();
    const updated = [notification, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
      notifyListeners();
    } catch (e) {
      console.error('Error adding notification:', e);
    }
  },

  markNotificationAsRead: (id: string): void => {
    const list = StorageService.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    notifyListeners();
  },

  markAllNotificationsAsRead: (): void => {
    const list = StorageService.getNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    notifyListeners();
  },

  // User & Active Role
  getUser: (): UserProfile => {
    try {
      const role = StorageService.getActiveRole();
      if (role === 'officer' || role === 'admin') {
        return INITIAL_OFFICER;
      }
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
        return INITIAL_USER;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_USER;
    }
  },

  saveUser: (user: UserProfile): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      notifyListeners();
    } catch (e) {
      console.error('Error saving user profile:', e);
    }
  },

  getActiveRole: (): UserRole => {
    try {
      const role = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
      if (role === 'officer' || role === 'admin' || role === 'citizen') {
        return role as UserRole;
      }
      return 'citizen';
    } catch (e) {
      return 'citizen';
    }
  },

  setActiveRole: (role: UserRole): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
      notifyListeners();
    } catch (e) {
      console.error('Error setting role:', e);
    }
  },

  getLanguage: (): string => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_LANGUAGE) || 'en';
  },

  setLanguage: (lang: string): void => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_LANGUAGE, lang);
    notifyListeners();
  },

  resetDemoData: (): void => {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(INITIAL_CASES));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
    notifyListeners();
    FirebaseDataService.seedCases(INITIAL_CASES).catch((e) => console.warn('Reset seed warning:', e));
  }
};
