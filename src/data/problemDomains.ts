export interface ProblemDomain {
  id: string;
  key: 'street_lights' | 'flood_drainage' | 'potholes_roads' | 'garbage_waste' | 'water_supply' | 'certificates' | 'schemes' | 'encroachment_trees';
  title: string;
  marathiTitle: string;
  hindiTitle: string;
  tagline: string;
  department: string;
  iconName: string;
  accentColor: string; // Tailwind class
  glowColor: string;
  badgeBg: string;
  emergencyHelpline: string;
  slaHours: number;
  sampleProblems: {
    title: string;
    description: string;
    suggestedLocation: string;
    priority: 'Critical' | 'High' | 'Normal';
  }[];
  snapFilterKey: string;
}

export const PROBLEM_DOMAINS: ProblemDomain[] = [
  {
    id: 'street_lights',
    key: 'street_lights',
    title: 'Street Light & Electrical AI',
    marathiTitle: 'विद्युत व पथदिवे निवारण AI',
    hindiTitle: 'स्ट्रीट लाइट और विद्युत समाधान AI',
    tagline: 'Specialized for pole faults, dark spot safety, broken cables & LED replacements',
    department: 'Electrical & Streetlights (NMC)',
    iconName: 'Lightbulb',
    accentColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    glowColor: '#F59E0B',
    badgeBg: 'bg-amber-500 text-slate-950',
    emergencyHelpline: '1800-233-3764 (Ext: 2)',
    slaHours: 24,
    snapFilterKey: 'streetlight',
    sampleProblems: [
      {
        title: 'Dark Corridor / Streetlight Outage on Wardha Road',
        description: '3 consecutive LED poles dark from Ajni Square to Rahate Colony, creating blind spots.',
        suggestedLocation: 'Rahate Colony, Wardha Road, Nagpur',
        priority: 'High'
      },
      {
        title: 'Exposed Sparking Wire at Pole Base in Dharampeth',
        description: 'Rainwater seepage causing small sparks near pedestrian crossing.',
        suggestedLocation: 'West High Court Road, Dharampeth',
        priority: 'Critical'
      },
      {
        title: 'Flickering Sodium Lamp in Sadar Residency Road',
        description: 'Light keeps blinking throughout night near Sadar Police Station lane.',
        suggestedLocation: 'Residency Road, Sadar, Nagpur',
        priority: 'Normal'
      }
    ]
  },
  {
    id: 'flood_drainage',
    key: 'flood_drainage',
    title: 'Flood, Waterlogging & Drainage AI',
    marathiTitle: 'पूर, जलभराव व सांडपाणी आपत्कालीन AI',
    hindiTitle: 'बाढ़, जलभराव और जल निकासी समाधान AI',
    tagline: 'Specialized for monsoon inundation, storm drains, river basins & dewatering pumps',
    department: 'Drainage & Stormwater Disaster Cell',
    iconName: 'Waves',
    accentColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
    glowColor: '#06B6D4',
    badgeBg: 'bg-cyan-500 text-slate-950',
    emergencyHelpline: '0712-2567035 / 101',
    slaHours: 4,
    snapFilterKey: 'flood',
    sampleProblems: [
      {
        title: 'Severe Waterlogging at Sitabuldi Metro Underpass',
        description: 'Water accumulated to 1.8 feet height after heavy spell, two-wheelers stalling.',
        suggestedLocation: 'Sitabuldi Interchange Underpass, Nagpur',
        priority: 'Critical'
      },
      {
        title: 'Choked Storm Drain & Sewage Backflow in Manish Nagar',
        description: 'Nullah overflow entering residential lane due to plastic debris blockage.',
        suggestedLocation: 'Lane 4, Manish Nagar, Somalwada',
        priority: 'High'
      },
      {
        title: 'Nag River Overflow Warning near Ganeshpeth Nullah',
        description: 'Rising water level approaching low bridge embankment near bus terminus.',
        suggestedLocation: 'Ganeshpeth, Nagpur',
        priority: 'Critical'
      }
    ]
  },
  {
    id: 'potholes_roads',
    key: 'potholes_roads',
    title: 'Potholes, Roads & Traffic Safety AI',
    marathiTitle: 'रस्ते, खड्डे व वाहतूक सुरक्षा AI',
    hindiTitle: 'सड़कें, गड्ढे और यातायात सुरक्षा AI',
    tagline: 'Specialized for asphalt craters, cave-ins, divider breaks & Jetpatcher squads',
    department: 'Civil Roads & Traffic Infrastructure',
    iconName: 'Construction',
    accentColor: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
    glowColor: '#F97316',
    badgeBg: 'bg-orange-500 text-white',
    emergencyHelpline: '1800-233-3764 (Ext: 1)',
    slaHours: 48,
    snapFilterKey: 'pothole',
    sampleProblems: [
      {
        title: 'Dangerous Deep Crater Pothole on Central Avenue',
        description: 'Deep 8-inch road cave-in causing sudden vehicle swerves near Gandhi Putla.',
        suggestedLocation: 'Central Avenue, Gandhibagh, Nagpur',
        priority: 'High'
      },
      {
        title: 'Broken Concrete Median Divider in Pratap Nagar',
        description: 'Vehicle collided with divider block, debris scattered into fast lane.',
        suggestedLocation: 'Ring Road, Pratap Nagar Square, Nagpur',
        priority: 'High'
      },
      {
        title: 'Uneven Trenching Left Open After Cable Laying in Laxmi Nagar',
        description: 'Excavation trench not leveled with asphalt, posing hazard for cyclists.',
        suggestedLocation: 'Water Tank Road, Laxmi Nagar',
        priority: 'Normal'
      }
    ]
  },
  {
    id: 'garbage_waste',
    key: 'garbage_waste',
    title: 'Solid Waste & Sanitation AI',
    marathiTitle: 'घनकचरा व स्वच्छता व्यवस्थापन AI',
    hindiTitle: 'कचरा और स्वच्छता समाधान AI',
    tagline: 'Specialized for overflowing bins, missed Ghantagadi, open dumping & disinfection',
    department: 'Solid Waste Management (Health Dept)',
    iconName: 'Trash2',
    accentColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    glowColor: '#10B981',
    badgeBg: 'bg-emerald-500 text-slate-950',
    emergencyHelpline: '1800-233-3764 (Ext: 3)',
    slaHours: 24,
    snapFilterKey: 'garbage',
    sampleProblems: [
      {
        title: 'Overflowing Community Waste Vat in Itwari Market',
        description: 'Commercial vegetable waste accumulated outside bins spreading into street.',
        suggestedLocation: 'Itwari Main Bazaar, Lakadganj Zone',
        priority: 'High'
      },
      {
        title: 'Missed Door-to-Door Collection in Trimurti Nagar for 3 Days',
        description: 'Compactor vehicle skipped Sector 2 houses; residents dumping at street corner.',
        suggestedLocation: 'Trimurti Nagar, Ring Road, Nagpur',
        priority: 'Normal'
      },
      {
        title: 'Dead Animal Removal Request near Khamla Vegetable Market',
        description: 'Requires immediate sanitation squad with bleaching powder disinfection.',
        suggestedLocation: 'Khamla Market Square, Nagpur',
        priority: 'Critical'
      }
    ]
  },
  {
    id: 'water_supply',
    key: 'water_supply',
    title: 'Water Supply & Leakage AI',
    marathiTitle: 'पाणीपुरवठा व जलगळती निवारण AI',
    hindiTitle: 'जल आपूर्ति और लीकेज समाधान AI',
    tagline: 'Specialized for main line bursts, OCW valve faults, low pressure & free tanker booking',
    department: 'NMC Water Works & Orange City Water (OCW)',
    iconName: 'Droplets',
    accentColor: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    glowColor: '#3B82F6',
    badgeBg: 'bg-blue-500 text-white',
    emergencyHelpline: '1800-255-9933 (OCW 24x7)',
    slaHours: 12,
    snapFilterKey: 'water',
    sampleProblems: [
      {
        title: 'High Pressure Main Pipeline Burst in Nandanvan',
        description: 'Gallons of clean water gushing onto road; isolating valve shutoff needed.',
        suggestedLocation: 'KDK College Road, Nandanvan, Nagpur',
        priority: 'Critical'
      },
      {
        title: 'Zero Water Supply & Turbid Red Water in Mahal Old City',
        description: 'Contamination suspected from nearby underground sewer seepage line.',
        suggestedLocation: 'Tilak Statue Lane, Mahal, Nagpur',
        priority: 'High'
      },
      {
        title: 'Emergency Drinking Water Tanker Request for Besa Layout',
        description: 'Feeder pipe under repair; 60 families need immediate municipal tanker.',
        suggestedLocation: 'Besa-Pipla Road, Nagpur',
        priority: 'High'
      }
    ]
  },
  {
    id: 'certificates',
    key: 'certificates',
    title: 'Citizen Certificates & Revenue AI',
    marathiTitle: 'दाखले, प्रमाणपत्र व महसूल सेवा AI',
    hindiTitle: 'प्रमाणपत्र और राजस्व सहायता AI',
    tagline: 'Specialized for Income, Domicile, Caste, Non-Creamy Layer, Birth & RTS tracking',
    department: 'Revenue & Aaple Sarkar Citizen Portal',
    iconName: 'Award',
    accentColor: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    glowColor: '#A855F7',
    badgeBg: 'bg-purple-500 text-white',
    emergencyHelpline: '1800-120-8040 (Aaple Sarkar)',
    slaHours: 120,
    snapFilterKey: 'certificates',
    sampleProblems: [
      {
        title: 'Urgent Income & Domicile Certificate for Engineering Admission',
        description: 'Need exact document list, Tehsildar affidavit format, and RTS 7-day fast track.',
        suggestedLocation: 'Nagpur Collectorate Setu Seva Kendra, Civil Lines',
        priority: 'Normal'
      },
      {
        title: 'Caste Validity Application Stalled in Scrutiny Committee',
        description: 'Pre-1950 proof document verification guidance for Vidarbha residents.',
        suggestedLocation: 'Dr. Babasaheb Ambedkar Bhavan, Nagpur',
        priority: 'Normal'
      }
    ]
  },
  {
    id: 'schemes',
    key: 'schemes',
    title: 'Government Schemes & Subsidy AI',
    marathiTitle: 'शासकीय योजना व अनुदान AI',
    hindiTitle: 'सरकारी योजना और सब्सिडी AI',
    tagline: 'Specialized for PM Surya Ghar, PMAY, PM SVANidhi, MJPJAY & Ladki Bahin',
    department: 'Social Welfare & Urban Development',
    iconName: 'Landmark',
    accentColor: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
    glowColor: '#F43F5E',
    badgeBg: 'bg-rose-500 text-white',
    emergencyHelpline: '1800-233-0244',
    slaHours: 72,
    snapFilterKey: 'schemes',
    sampleProblems: [
      {
        title: 'Calculate PM Surya Ghar Solar Rooftop ₹78,000 Subsidy',
        description: 'Check rooftop area feasibility, Discom net metering meter installation in Nagpur.',
        suggestedLocation: 'MSEDCL Katol Road Division, Nagpur',
        priority: 'Normal'
      },
      {
        title: 'PM SVANidhi ₹10,000 Micro-Loan for Street Food Vendors',
        description: 'Letter of Recommendation (LoR) issuance from NMC Mangalwari Zone.',
        suggestedLocation: 'Mangalwari Zonal Office, Sadar',
        priority: 'Normal'
      }
    ]
  },
  {
    id: 'encroachment_trees',
    key: 'encroachment_trees',
    title: 'Tree Hazards & Encroachment AI',
    marathiTitle: 'वृक्ष प्राधिकरण व आपत्कालीन AI',
    hindiTitle: 'वृक्ष सुरक्षा और अतिक्रमण निवारण AI',
    tagline: 'Specialized for storm-fallen trees, electric wire branches & footpath clearance',
    department: 'Garden & Tree Authority / Anti-Encroachment Squad',
    iconName: 'Trees',
    accentColor: 'text-lime-500 bg-lime-500/10 border-lime-500/30',
    glowColor: '#84CC16',
    badgeBg: 'bg-lime-500 text-slate-950',
    emergencyHelpline: '101 / 0712-2567035',
    slaHours: 12,
    snapFilterKey: 'trees',
    sampleProblems: [
      {
        title: 'Banyan Tree Branch Touching 11kV High-Tension Wire in Civil Lines',
        description: 'High risk of electrical fire during windy weather; hydraulic pruner needed.',
        suggestedLocation: 'Temple Road, Civil Lines, Nagpur',
        priority: 'Critical'
      },
      {
        title: 'Heavy Neem Tree Uprooted Blocking Seminary Hills Main Road',
        description: 'Traffic blocked towards botanical gardens; emergency chainsaw squad required.',
        suggestedLocation: 'Seminary Hills Bypass Road, Nagpur',
        priority: 'Critical'
      }
    ]
  }
];

// Snapchat Map Photo Incidents Data with Real Coordinates & Geotagged Stories
export interface SnapPhotoIncident {
  id: string;
  title: string;
  problemType: 'streetlight' | 'flood' | 'pothole' | 'garbage' | 'water' | 'trees' | 'certificates' | 'schemes';
  domainId: string;
  categoryLabel: string;
  locationName: string;
  ward: string;
  lat: number;
  lng: number;
  photoUrl: string;
  thumbnailUrl: string;
  reportedAgo: string;
  confirmationsCount: number;
  severity: 'high' | 'medium' | 'low';
  waterLevelInches?: number;
  lightStatus?: string;
  potholeDepthInches?: number;
  wasteTonsEst?: number;
  aiDiagnosis: string;
  assignedUnit: string;
  status: 'Investigating' | 'Squad Dispatched' | 'Resolved' | 'Corroborated by Community';
  storyAuthor: string;
  storyAuthorAvatar: string;
}

export const SNAP_PHOTO_INCIDENTS: SnapPhotoIncident[] = [
  {
    id: 'snap-flood-01',
    title: 'Sitabuldi Underpass Inundation',
    problemType: 'flood',
    domainId: 'flood_drainage',
    categoryLabel: 'Flood / Waterlogging',
    locationName: 'Sitabuldi Metro Interchange Underpass',
    ward: 'Dharampeth (Ward 2)',
    lat: 21.1458,
    lng: 79.0833,
    photoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=150&q=80',
    reportedAgo: '12m ago',
    confirmationsCount: 38,
    severity: 'high',
    waterLevelInches: 22,
    aiDiagnosis: 'High surge waterlogging detected at lowest elevation dip. Storm grate clogged with polythene. Dewatering suction pump #02 en route.',
    assignedUnit: 'NMC High-Power Dewatering Pump Unit #MH-31-DS-2041',
    status: 'Squad Dispatched',
    storyAuthor: 'Citizen Rohit G.',
    storyAuthorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'snap-light-01',
    title: 'Dark Corridor / 4 Poles Dead on Wardha Road',
    problemType: 'streetlight',
    domainId: 'street_lights',
    categoryLabel: 'Street Light Fault',
    locationName: 'Wardha Road, near Ajni Flyover',
    ward: 'Dhantoli (Ward 4)',
    lat: 21.1215,
    lng: 79.0782,
    photoUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=150&q=80',
    reportedAgo: '28m ago',
    confirmationsCount: 24,
    severity: 'high',
    lightStatus: '4 Consecutive Poles Out (Feeder Tripped)',
    aiDiagnosis: 'Phase line MCB trip detected at Ajni Substation Feeder #4. Dark spot hazard rating: 8.5/10. Sky-Lift truck deployed.',
    assignedUnit: 'NMC Sky-Lift Hydraulic Electrical Boom #MH-31-EL-1188',
    status: 'Squad Dispatched',
    storyAuthor: 'Citizen Sneha M.',
    storyAuthorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'snap-pothole-01',
    title: 'Massive Asphalt Crater on Central Avenue',
    problemType: 'pothole',
    domainId: 'potholes_roads',
    categoryLabel: 'Road Crater / Pothole',
    locationName: 'Central Avenue, Near Agrasen Square',
    ward: 'Gandhibagh (Ward 6)',
    lat: 21.1524,
    lng: 79.1120,
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=150&q=80',
    reportedAgo: '45m ago',
    confirmationsCount: 42,
    severity: 'high',
    potholeDepthInches: 9,
    aiDiagnosis: 'Structural road base exposure. Two-wheeler skid hazard. Jetpatcher Cold-mix asphalt machine scheduled for immediate leveling.',
    assignedUnit: 'NMC Jetpatcher Quick-Pave Machine #MH-31-RD-3329',
    status: 'Corroborated by Community',
    storyAuthor: 'Citizen Amit P.',
    storyAuthorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'snap-garbage-01',
    title: 'Overflowing Commercial Waste at Itwari',
    problemType: 'garbage',
    domainId: 'garbage_waste',
    categoryLabel: 'Solid Waste Overflow',
    locationName: 'Itwari Wholesale Market Chowk',
    ward: 'Lakadganj (Ward 8)',
    lat: 21.1558,
    lng: 79.1190,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=150&q=80',
    reportedAgo: '1h ago',
    confirmationsCount: 19,
    severity: 'medium',
    wasteTonsEst: 1.8,
    aiDiagnosis: 'Market refuse spillover blocking storm gutter. AG Enviro compactor rerouted. Lime disinfection requested.',
    assignedUnit: 'AG Enviro Compactor Truck #MH-31-SW-7721',
    status: 'Squad Dispatched',
    storyAuthor: 'Citizen Rajesh K.',
    storyAuthorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'snap-water-01',
    title: 'Pipeline Burst on KDK College Road',
    problemType: 'water',
    domainId: 'water_supply',
    categoryLabel: 'Water Pipeline Burst',
    locationName: 'KDK College Road, Nandanvan',
    ward: 'Nehru Nagar (Ward 5)',
    lat: 21.1310,
    lng: 79.1350,
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=150&q=80',
    reportedAgo: '18m ago',
    confirmationsCount: 31,
    severity: 'high',
    aiDiagnosis: '400mm distribution feeder pipe fracture. Pressure loss reported across 4 colonies. OCW repair squad isolating valve.',
    assignedUnit: 'OCW Rapid Pipeline Repair Team #07',
    status: 'Investigating',
    storyAuthor: 'Citizen Priya D.',
    storyAuthorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'snap-flood-02',
    title: 'Pora Nullah Water Surge at Narendra Nagar',
    problemType: 'flood',
    domainId: 'flood_drainage',
    categoryLabel: 'Flood / Waterlogging',
    locationName: 'Narendra Nagar Flyover Junction',
    ward: 'Laxmi Nagar (Ward 1)',
    lat: 21.1105,
    lng: 79.0812,
    photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=150&q=80',
    reportedAgo: '35m ago',
    confirmationsCount: 27,
    severity: 'high',
    waterLevelInches: 18,
    aiDiagnosis: 'Water backflow from Pora bridge culvert. Traffic diverted to ring road. Sandbag barriers and suction pump queued.',
    assignedUnit: 'Disaster Cell Dewatering Unit #04',
    status: 'Squad Dispatched',
    storyAuthor: 'Citizen Vikas T.',
    storyAuthorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'snap-light-02',
    title: 'Dark Intersection at Sadar Mount Road',
    problemType: 'streetlight',
    domainId: 'street_lights',
    categoryLabel: 'Street Light Fault',
    locationName: 'Mount Road, Sadar',
    ward: 'Mangalwari (Ward 10)',
    lat: 21.1620,
    lng: 79.0820,
    photoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=150&q=80',
    reportedAgo: '50m ago',
    confirmationsCount: 14,
    severity: 'medium',
    lightStatus: '2 High-Mast LED Panels Non-Functional',
    aiDiagnosis: 'Photocell sensor burned out due to voltage surge. Replacement LED driver unit requisitioned.',
    assignedUnit: 'NMC Electrical Maintenance Van #03',
    status: 'Corroborated by Community',
    storyAuthor: 'Citizen Anjali S.',
    storyAuthorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'snap-trees-01',
    title: 'Heavy Gulmohar Tree Fall on Seminary Hills Road',
    problemType: 'trees',
    domainId: 'encroachment_trees',
    categoryLabel: 'Tree Hazard / Fallen Trunk',
    locationName: 'Seminary Hills Road, Near TV Tower',
    ward: 'Dharampeth (Ward 2)',
    lat: 21.1590,
    lng: 79.0580,
    photoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=150&q=80',
    reportedAgo: '22m ago',
    confirmationsCount: 33,
    severity: 'high',
    aiDiagnosis: 'Road completely blocked. No electric line rupture. Emergency chainsaw tree authority squad actively clearing trunk sections.',
    assignedUnit: 'Garden Dept Rapid Tree Saw Unit #01',
    status: 'Squad Dispatched',
    storyAuthor: 'Citizen Manoj B.',
    storyAuthorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80'
  }
];
