import { CaseItem, CommunityInsight, HotspotCluster, MunicipalService, NotificationItem, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'CIT-1001',
  name: 'Nagpur Citizen',
  phone: '',
  email: '',
  role: 'citizen',
  preferredLanguage: 'en',
  homeAddress: 'Nagpur, Maharashtra',
  officeAddress: '',
  ward: 'Dharampeth (Ward 4)',
  accessibility: {
    highContrast: false,
    largeText: false,
    voiceAssistance: true,
    screenReaderOptimized: false,
  },
  notificationsEnabled: true,
};

export const INITIAL_OFFICER: UserProfile = {
  id: 'OFF-1001',
  name: 'Civic Officer',
  phone: '',
  email: 'officer@nagpurcorporation.gov.in',
  role: 'officer',
  preferredLanguage: 'mr',
  homeAddress: 'Civil Lines, Nagpur',
  ward: 'Dharampeth (Ward 4)',
  accessibility: {
    highContrast: false,
    largeText: false,
    voiceAssistance: false,
    screenReaderOptimized: false,
  },
  notificationsEnabled: true,
};

export const INITIAL_CASES: CaseItem[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const COMMUNITY_INSIGHTS: CommunityInsight[] = [];

export const HOTSPOT_CLUSTERS: HotspotCluster[] = [];

export const MUNICIPAL_SERVICES: MunicipalService[] = [
  {
    id: 'srv-birth',
    name: 'Birth Certificate Issuance',
    department: 'Town Planning & Birth/Death',
    description: 'Apply for official birth certificate copy or correction with NMC digital verification.',
    fee: 50,
    slaDays: 7,
    requiredDocuments: ['Hospital Discharge Summary', 'Parent Aadhaar Card', 'Address Proof'],
    icon: 'FileText'
  },
  {
    id: 'srv-death',
    name: 'Death Certificate Application',
    department: 'Town Planning & Birth/Death',
    description: 'Official issuance of registered death certificate for NMC jurisdiction.',
    fee: 50,
    slaDays: 5,
    requiredDocuments: ['Crematorium/Burial Slip', 'Hospital Report', 'Applicant ID'],
    icon: 'FileCheck'
  },
  {
    id: 'srv-tax',
    name: 'Property Tax Payment & Assessment',
    department: 'Enforcement & Hoardings',
    description: 'Pay annual municipal property tax online, verify index number and download tax receipt.',
    fee: 0,
    slaDays: 1,
    requiredDocuments: ['Property Index Number', 'Previous Tax Receipt'],
    icon: 'Receipt'
  },
  {
    id: 'srv-water',
    name: 'New Water Pipeline Connection',
    department: 'Water Works',
    description: 'Request domestic or commercial water meter connection installation with OCW/NMC.',
    fee: 1500,
    slaDays: 14,
    requiredDocuments: ['Property Tax Receipt', 'Sanctioned Building Plan', 'Identity Proof'],
    icon: 'Droplets'
  },
  {
    id: 'srv-trade',
    name: 'Shop & Trade License Renewal',
    department: 'Enforcement & Hoardings',
    description: 'Instant renewal of municipal trade permits for establishments in Nagpur.',
    fee: 750,
    slaDays: 3,
    requiredDocuments: ['Shop Act License', 'NMC Tax NOC', 'Fire Safety Certificate'],
    icon: 'Store'
  },
  {
    id: 'srv-tree',
    name: 'Tree Trimming / Hazard Removal',
    department: 'Roads & Traffic',
    description: 'Request garden department pruning for dangerous roadside tree branches.',
    fee: 0,
    slaDays: 4,
    requiredDocuments: ['Photo of hazardous branch', 'Exact Location Landmark'],
    icon: 'Trees'
  }
];
