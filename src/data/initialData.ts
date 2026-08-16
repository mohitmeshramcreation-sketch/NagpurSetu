import { CaseItem, CommunityInsight, HotspotCluster, MunicipalService, NotificationItem, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'CIT-7749',
  name: 'Mohit Meshram',
  phone: '+91 98230 45129',
  email: 'mohitmeshramcreation@gmail.com',
  role: 'citizen',
  preferredLanguage: 'hi',
  homeAddress: '42 Dharampeth Extension, Nagpur - 440010',
  officeAddress: 'Civil Lines, Near High Court, Nagpur - 440001',
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
  id: 'OFF-1042',
  name: 'Ramesh Kumar',
  phone: '+91 94221 88902',
  email: 'ramesh.kumar@nagpurcorporation.gov.in',
  role: 'officer',
  preferredLanguage: 'mr',
  homeAddress: 'NMC Staff Quarters, Civil Lines, Nagpur',
  ward: 'Dharampeth (Ward 4)',
  accessibility: {
    highContrast: false,
    largeText: false,
    voiceAssistance: false,
    screenReaderOptimized: false,
  },
  notificationsEnabled: true,
};

export const INITIAL_CASES: CaseItem[] = [
  {
    id: 'NS-2024-8842',
    title: 'Severe water logging near Metro Pillar 42',
    description: 'Continuous water logging after rain causing traffic blockages near Dharampeth metro station. Drain grates are choked with silt.',
    category: 'Roads & Traffic - Pothole/Drainage',
    department: 'Roads & Traffic',
    location: 'Near Metro Pillar 42, West High Court Road, Dharampeth',
    ward: 'Dharampeth (W4)',
    landmark: 'Dharampeth Metro Station',
    lat: 21.1458,
    lng: 79.0601,
    citizenName: 'Mohit Meshram',
    citizenPhone: '+91 98230 45129',
    citizenId: 'CIT-7749',
    status: 'In Progress',
    priority: 'High',
    slaStatus: 'Warning',
    slaRemaining: '2h left',
    expectedResolutionDays: 1,
    createdAt: '2024-10-24T09:15:00Z',
    updatedAt: '2024-10-24T11:30:00Z',
    assignedOfficer: 'Suresh Patil (Road Maintenance Dept)',
    assignedOfficerPhone: '+91 98221 11445',
    attachments: [
      {
        id: 'att-1',
        name: 'waterlog_road.jpg',
        url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
        type: 'image',
        size: '1.8 MB'
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        title: 'Complaint received',
        timestamp: 'Oct 24, 09:15 AM',
        description: 'Auto-routed via NagpurSetu AI based on citizen conversation.',
        status: 'completed',
        dotColor: 'dark'
      },
      {
        id: 'tl-2',
        title: 'Sent to team',
        timestamp: 'Oct 24, 09:20 AM',
        description: 'Transferred to Roads & Drainage Division Zone 4.',
        status: 'completed',
        dotColor: 'dark'
      },
      {
        id: 'tl-3',
        title: 'Officer assigned',
        timestamp: 'Oct 24, 09:45 AM',
        actor: 'Suresh Patil (Road Maintenance Dept)',
        description: 'Field inspection crew dispatched with suction pump unit.',
        status: 'current',
        dotColor: 'orange'
      },
      {
        id: 'tl-4',
        title: 'Resolution',
        timestamp: 'Pending completion',
        description: 'Awaiting de-silting and surface drainage clearance confirmation.',
        status: 'pending',
        dotColor: 'gray'
      }
    ],
    rawUserInput: 'There is severe water logging near Metro Pillar Dharampeth road since morning.'
  },
  {
    id: 'NS-2024-8840',
    title: 'Streetlight not working since 3 days',
    description: 'Pole number LP-14 opposite Shivaji Hall has not been functioning. Street is completely dark at night.',
    category: 'Electrical - Maintenance',
    department: 'Electrical & Streetlights',
    location: 'Near Shivaji Hall, 8-Rasta Square, Laxmi Nagar',
    ward: 'Laxmi Nagar (W7)',
    landmark: 'Shivaji Hall',
    lat: 21.1215,
    lng: 79.0684,
    citizenName: 'Sneha Deshmukh',
    citizenPhone: '+91 97654 32100',
    citizenId: 'CIT-8821',
    status: 'Assigned',
    priority: 'Normal',
    slaStatus: 'On Track',
    slaRemaining: '28h left',
    expectedResolutionDays: 2,
    createdAt: '2024-10-23T18:30:00Z',
    updatedAt: '2024-10-23T19:00:00Z',
    assignedOfficer: 'Vikas Shende (Electrical Dept)',
    assignedOfficerPhone: '+91 94230 77123',
    attachments: [],
    timeline: [
      {
        id: 'tl-1',
        title: 'Complaint received',
        timestamp: 'Oct 23, 06:30 PM',
        status: 'completed',
        dotColor: 'dark'
      },
      {
        id: 'tl-2',
        title: 'Officer assigned',
        timestamp: 'Oct 23, 07:00 PM',
        actor: 'Vikas Shende (Electrical Dept)',
        status: 'current',
        dotColor: 'orange'
      },
      {
        id: 'tl-3',
        title: 'Resolution',
        timestamp: 'Pending completion',
        status: 'pending',
        dotColor: 'gray'
      }
    ]
  },
  {
    id: 'NS-2024-8835',
    title: 'Garbage uncollected at main square',
    description: 'Community dumpster overflowing onto pedestrian footpath for 2 consecutive days. Foul odor spreading.',
    category: 'Solid Waste - Collection',
    department: 'Solid Waste Management',
    location: 'Main Square, Near Community Hall, Mangalwari',
    ward: 'Mangalwari (W2)',
    landmark: 'Mangalwari Community Hall',
    lat: 21.1732,
    lng: 79.0834,
    citizenName: 'Pravin Joshi',
    citizenPhone: '+91 98810 55432',
    citizenId: 'CIT-9102',
    status: 'In Progress',
    priority: 'Elevated',
    slaStatus: 'On Track',
    slaRemaining: '14h left',
    expectedResolutionDays: 1,
    createdAt: '2024-10-23T14:20:00Z',
    updatedAt: '2024-10-23T15:00:00Z',
    assignedOfficer: 'Ramesh Kumar (Sanitation Dept)',
    assignedOfficerPhone: '+91 94221 88902',
    attachments: [
      {
        id: 'att-2',
        name: 'garbage_pile.jpg',
        url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
        type: 'image',
        size: '2.1 MB'
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        title: 'Complaint received',
        timestamp: 'Oct 23, 02:20 PM',
        status: 'completed',
        dotColor: 'dark'
      },
      {
        id: 'tl-2',
        title: 'Sent to team',
        timestamp: 'Oct 23, 02:35 PM',
        status: 'completed',
        dotColor: 'dark'
      },
      {
        id: 'tl-3',
        title: 'Officer assigned',
        timestamp: 'Oct 23, 03:00 PM',
        actor: 'Ramesh Kumar (Sanitation Dept)',
        status: 'current',
        dotColor: 'orange'
      },
      {
        id: 'tl-4',
        title: 'Resolution',
        timestamp: 'Pending completion',
        status: 'pending',
        dotColor: 'gray'
      }
    ]
  },
  {
    id: 'NS-2024-8831',
    title: 'Illegal hoarding blocking road sign',
    description: 'Large commercial banner tied over the directional board at Dhantoli intersection, blocking view for motorists.',
    category: 'Enforcement - Advertisement',
    department: 'Enforcement & Hoardings',
    location: 'Congress Nagar T-Point, Dhantoli',
    ward: 'Dhantoli (W5)',
    landmark: 'Near Dhantoli Park',
    lat: 21.1342,
    lng: 79.0821,
    citizenName: 'Anil Kulkarni',
    citizenPhone: '+91 94228 90111',
    citizenId: 'CIT-6031',
    status: 'Submitted',
    priority: 'Normal',
    slaStatus: 'Pending Review',
    slaRemaining: '44h left',
    expectedResolutionDays: 2,
    createdAt: '2024-10-22T10:05:00Z',
    updatedAt: '2024-10-22T10:05:00Z',
    assignedOfficer: 'Ajay Wankhede (Enforcement Squad)',
    attachments: [],
    timeline: [
      {
        id: 'tl-1',
        title: 'Complaint received',
        timestamp: 'Oct 22, 10:05 AM',
        status: 'completed',
        dotColor: 'dark'
      },
      {
        id: 'tl-2',
        title: 'Pending inspection',
        timestamp: 'Oct 22, 10:30 AM',
        status: 'current',
        dotColor: 'orange'
      }
    ]
  },
  {
    id: 'REQ-2024-892',
    title: 'Uncollected Garbage',
    description: 'Garbage has not been collected near our residential building for the last two days. The container is overflowing.',
    category: 'Solid Waste Management',
    department: 'Solid Waste Management',
    location: '42 Dharampeth Extension, Nagpur',
    ward: 'Dharampeth (Ward 4)',
    landmark: 'Near Coffee House Square',
    lat: 21.1441,
    lng: 79.0624,
    citizenName: 'Mohit Meshram',
    citizenPhone: '+91 98230 45129',
    citizenId: 'CIT-7749',
    status: 'In Progress',
    priority: 'Elevated',
    slaStatus: 'On Track',
    slaRemaining: 'Expected in 2 days',
    expectedResolutionDays: 2,
    createdAt: '2024-10-24T09:41:00Z',
    updatedAt: '2024-10-24T10:15:00Z',
    assignedOfficer: 'Ramesh Kumar (Sanitation Dept)',
    assignedOfficerPhone: '+91 94221 88902',
    attachments: [
      {
        id: 'att-garbage-demo',
        name: 'dharampeth_bin.jpg',
        url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
        type: 'image',
        size: '1.4 MB'
      }
    ],
    timeline: [
      {
        id: 'tl-g1',
        title: 'Complaint received',
        timestamp: 'Today, 09:41 AM',
        description: 'Auto-registered via citizen conversation with voice recognition.',
        status: 'completed',
        dotColor: 'dark'
      },
      {
        id: 'tl-g2',
        title: 'Sent to team',
        timestamp: 'Today, 09:45 AM',
        description: 'Dispatched to Zone 4 Sanitation Supervisor.',
        status: 'completed',
        dotColor: 'dark'
      },
      {
        id: 'tl-g3',
        title: 'Officer assigned',
        timestamp: 'Today, 10:15 AM',
        actor: 'Ramesh Kumar (Sanitation Dept)',
        description: 'NMC Tipper Truck #MH-31-CB-9021 scheduled on morning sweep.',
        status: 'current',
        dotColor: 'orange'
      },
      {
        id: 'tl-g4',
        title: 'Resolution',
        timestamp: 'Pending completion',
        description: 'Citizen confirmation requested upon compactor clearance.',
        status: 'pending',
        dotColor: 'gray'
      }
    ],
    rawUserInput: 'Mere area mein garbage nahi uthaya.'
  },
  {
    id: 'REQ-2024-810',
    title: 'Streetlight Malfunction',
    description: 'Main road streetlights near Civil Lines high court gate flickering and completely off for 2 nights.',
    category: 'Electrical & Streetlights',
    department: 'Electrical & Streetlights',
    location: 'Main Road, Civil Lines',
    ward: 'Civil Lines (Ward 1)',
    citizenName: 'Mohit Meshram',
    citizenPhone: '+91 98230 45129',
    citizenId: 'CIT-7749',
    status: 'Resolved',
    priority: 'Normal',
    slaStatus: 'On Track',
    createdAt: '2024-10-18T11:20:00Z',
    updatedAt: '2024-10-19T16:45:00Z',
    assignedOfficer: 'Kishore Tayade (Electrical)',
    resolutionNotes: 'Replaced burnt capacitor and 120W LED lamp unit. Circuit breaker re-tested.',
    resolutionEvidenceUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80',
    citizenFeedback: {
      isResolved: true,
      feedbackText: 'Fixed quickly within 24 hours. Thanks!',
      submittedAt: '2024-10-20T08:30:00Z'
    },
    attachments: [],
    timeline: [
      {
        id: 'tl-s1',
        title: 'Complaint received',
        timestamp: 'Oct 18, 11:20 AM',
        status: 'completed',
        dotColor: 'dark'
      },
      {
        id: 'tl-s2',
        title: 'Officer assigned',
        timestamp: 'Oct 18, 01:00 PM',
        actor: 'Kishore Tayade (Electrical)',
        status: 'completed',
        dotColor: 'dark'
      },
      {
        id: 'tl-s3',
        title: 'Work Completed',
        timestamp: 'Oct 19, 04:30 PM',
        description: 'LED module replaced.',
        status: 'completed',
        dotColor: 'green'
      },
      {
        id: 'tl-s4',
        title: 'Citizen Confirmed Resolution',
        timestamp: 'Oct 20, 08:30 AM',
        status: 'completed',
        dotColor: 'dark'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'CIT-7749',
    title: 'Officer Assigned to Case REQ-2024-892',
    message: 'Ramesh Kumar (Sanitation Dept) has been assigned to inspect uncollected garbage at Dharampeth Extension.',
    type: 'officer_assigned',
    caseId: 'REQ-2024-892',
    read: false,
    createdAt: '10 minutes ago',
    actionUrl: '/cases/REQ-2024-892'
  },
  {
    id: 'notif-2',
    userId: 'CIT-7749',
    title: 'Resolution Confirmation Needed',
    message: 'Streetlight Malfunction at Civil Lines has been marked resolved by team. Please confirm if the light is working.',
    type: 'resolved',
    caseId: 'REQ-2024-810',
    read: true,
    createdAt: '2 days ago',
    actionUrl: '/cases/REQ-2024-810'
  },
  {
    id: 'notif-3',
    userId: 'OFF-1042',
    title: 'High Priority SLA Warning',
    message: 'Case #NS-8842 (Dharampeth Metro Pillar Water logging) has 2 hours remaining before SLA breach.',
    type: 'sla_warning',
    caseId: 'NS-2024-8842',
    read: false,
    createdAt: '25 minutes ago',
    actionUrl: '/officer/cases/NS-2024-8842'
  },
  {
    id: 'notif-4',
    userId: 'CIT-7749',
    title: 'Community Alert: Pothole Surge in Ward 4',
    message: 'Multiple citizens reported road issues near Variety Square. NMC road squad is scheduled for repair tomorrow.',
    type: 'community_alert',
    read: true,
    createdAt: 'Yesterday',
    actionUrl: '/cases'
  }
];

export const COMMUNITY_INSIGHTS: CommunityInsight[] = [
  {
    id: 'insight-1',
    title: 'Surge in Road Damage',
    description: '18 new pothole reports clustered around Ward 4 in the last 24 hours.',
    type: 'road',
    reportCount: 18,
    ward: 'Ward 4 (Dharampeth)',
    status: 'Active Surge',
    actionLabel: 'Dispatch Inspection Unit'
  },
  {
    id: 'insight-2',
    title: 'Water Supply Disruption',
    description: 'Multiple low-pressure complaints originating from Dharampeth zone.',
    type: 'water',
    reportCount: 12,
    ward: 'Dharampeth Zone',
    status: 'Investigating',
    actionLabel: 'Check Valve Status'
  },
  {
    id: 'insight-3',
    title: 'Waste Collection Delay',
    description: 'Consistent misses reported in route 12B over the weekend.',
    type: 'waste',
    reportCount: 9,
    ward: 'Route 12B / Mangalwari',
    status: 'Assigned to SWM Dept',
    actionLabel: 'View Route Schedule'
  }
];

export const HOTSPOT_CLUSTERS: HotspotCluster[] = [
  {
    id: 'hot-1',
    name: 'Variety Square & WHC Road',
    ward: 'Dharampeth (Ward 4)',
    category: 'Roads & Drainage',
    count: 24,
    lat: 21.1460,
    lng: 79.0740,
    severity: 'high',
    description: 'Clustered pothole and monsoon runoff accumulation reports along 1.2km stretch.',
    recentCases: ['NS-2024-8842', 'REQ-2024-892']
  },
  {
    id: 'hot-2',
    name: 'Itwari Grain Market',
    ward: 'Itwari (Ward 9)',
    category: 'Solid Waste Management',
    count: 31,
    lat: 21.1550,
    lng: 79.1120,
    severity: 'high',
    description: 'Daily commercial vegetable packaging waste overflow near main loading lane.',
    recentCases: ['NS-2024-8835']
  },
  {
    id: 'hot-3',
    name: 'Sadar Residency Road',
    ward: 'Sadar (Ward 3)',
    category: 'Streetlights & Traffic',
    count: 14,
    lat: 21.1620,
    lng: 79.0810,
    severity: 'moderate',
    description: 'Flickering streetlights and pedestrian signal timing issues.',
    recentCases: ['NS-2024-8840']
  },
  {
    id: 'hot-4',
    name: 'Mahal Gandhi Gate Area',
    ward: 'Gandhibagh (Ward 6)',
    category: 'Drainage & Sewage',
    count: 19,
    lat: 21.1440,
    lng: 79.1020,
    severity: 'moderate',
    description: 'Old storm water chamber overflow during heavy morning usage.',
    recentCases: []
  },
  {
    id: 'hot-5',
    name: 'Laxmi Nagar 8-Rasta Square',
    ward: 'Laxmi Nagar (Ward 7)',
    category: 'Road Repairs',
    count: 8,
    lat: 21.1215,
    lng: 79.0684,
    severity: 'low',
    description: 'Minor paver block displacement near bus stop.',
    recentCases: []
  }
];

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
