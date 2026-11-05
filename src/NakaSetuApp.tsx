import React, { useState, useEffect, useMemo } from 'react';
import {
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Cpu,
  Home,
  Utensils,
  Truck,
  Sparkles,
  Package,
  Phone,
  Smartphone,
  ShieldCheck,
  MapPin,
  Clock,
  Users,
  Star,
  CheckCircle2,
  ArrowRight,
  Search,
  PhoneCall,
  Camera,
  X,
  AlertTriangle,
  QrCode,
  Banknote,
  Lock,
  Radio,
  Bike,
  FileImage,
  RotateCcw,
  UserPlus,
  Volume2,
  Hash,
  Upload,
  FileCheck2,
  HardHat,
  ArrowLeftRight,
  KeyRound,
  MessageSquareQuote,
  Receipt,
  Languages,
  Calculator
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// 1. TYPES & INTERFACES
// ============================================================================

export type ActiveTab = 'customer' | 'operations';

export type LanguageCode = 'en' | 'hi';

export type ServiceCategory = 'Skilled Trades' | 'Domestic & Naka';

export type RateUnit = 'visit' | 'hr' | 'meal' | 'flat';

export interface ServiceItem {
  id: string;
  label: string;
  labelHi: string;
  icon: LucideIcon;
  baseRate: number;
  rateDisplay: string;
  unit: RateUnit;
  unitLabel: string;
  category: ServiceCategory;
  defaultEtaMins: number;
  description: string;
}

export type PhoneType = 'App' | 'Feature Phone';

export type ToliCapacity =
  | 'Solo'
  | '2 Helpers'
  | '3-4 Helpers'
  | 'Group of 2'
  | 'Group of 3-4 Helpers'
  | 'Toli of 3'
  | 'Solo Professional'
  | 'Toli / Group Lead (2-4 helpers)';

export type WorkerStatus =
  | 'Available'
  | 'Dispatched'
  | 'Dispatched (SMS Sent)'
  | 'On Job';

export interface Worker {
  id: string;
  name: string;
  phone: string;
  skill: string;
  serviceId: string;
  phoneType: PhoneType;
  toliCapacity: ToliCapacity;
  groupSizeDisplay: string;
  hubLocation: string;
  rating: number;
  completedJobs: number;
  verificationBadges: string[];
  status: WorkerStatus;
}

export interface WorkerReview {
  id: string;
  reviewerName: string;
  locality: string;
  rating: number;
  date: string;
  tags: string[];
  comment: string;
}

export interface BookingRecord {
  id: string;
  invoiceNo: string;
  serviceLabel: string;
  workerName: string;
  helperCount: number;
  durationUnits: number;
  unitLabel: string;
  baseRate: number;
  totalAmount: number;
  paymentMethod: 'UPI QR' | 'Cash';
  urgencyLabel: string;
  landmark: string;
  completedAt: string;
  rating: number;
  startOtp: string;
  stopOtp: string;
}

export type CustomerStep = 'booking' | 'matching' | 'assigned' | 'settlement';

export type UrgencyOption = 'immediate' | 'scheduled';

export type PaymentMethod = 'upi' | 'cash';

export interface ToastNotification {
  id: number;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

// ============================================================================
// 2. MOCK DATASET (10-SERVICE CATALOG, WORKERS, SLOTS, REVIEWS, BOOKINGS)
// ============================================================================

const STORAGE_KEYS = {
  WORKERS: 'nakasetu_workers_v1',
  REVIEWS: 'nakasetu_reviews_v1',
  BOOKINGS: 'nakasetu_bookings_v1'
} as const;

export const SERVICE_CATALOG: ServiceItem[] = [
  // Skilled Trades (5)
  {
    id: 'srv-electrician',
    label: 'Electrician',
    labelHi: 'इलेक्ट्रीशियन (बिजली मिस्त्री)',
    icon: Zap,
    baseRate: 199,
    rateDisplay: '₹199',
    unit: 'visit',
    unitLabel: 'visit / task',
    category: 'Skilled Trades',
    defaultEtaMins: 14,
    description: 'MCB faults, wiring repairs, switchboard & ceiling fan installation'
  },
  {
    id: 'srv-plumber',
    label: 'Plumber',
    labelHi: 'प्लंबर (नल कारीगर)',
    icon: Wrench,
    baseRate: 199,
    rateDisplay: '₹199',
    unit: 'visit',
    unitLabel: 'visit / task',
    category: 'Skilled Trades',
    defaultEtaMins: 14,
    description: 'Pipe leakages, tap replacement, drainage blockages & tank fitting'
  },
  {
    id: 'srv-carpenter',
    label: 'Carpenter',
    labelHi: 'कारपेंटर (बढ़ई)',
    icon: Hammer,
    baseRate: 249,
    rateDisplay: '₹249',
    unit: 'visit',
    unitLabel: 'visit / task',
    category: 'Skilled Trades',
    defaultEtaMins: 22,
    description: 'Door lock repair, hinge alignment, modular cabinet & bed assembly'
  },
  {
    id: 'srv-painter',
    label: 'Painter',
    labelHi: 'पेंटर (रंगाई कारीगर)',
    icon: Paintbrush,
    baseRate: 299,
    rateDisplay: '₹299',
    unit: 'visit',
    unitLabel: 'visit / room',
    category: 'Skilled Trades',
    defaultEtaMins: 25,
    description: 'Wall touch-ups, dampness waterproofing, putty & single-room coats'
  },
  {
    id: 'srv-appliance',
    label: 'Appliance Repair',
    labelHi: 'उपकरण रिपेयर (AC/फ्रिज)',
    icon: Cpu,
    baseRate: 249,
    rateDisplay: '₹249',
    unit: 'visit',
    unitLabel: 'unit check',
    category: 'Skilled Trades',
    defaultEtaMins: 20,
    description: 'AC servicing, washing machine, refrigerator & geyser diagnostics'
  },

  // Domestic & Naka (5)
  {
    id: 'srv-maid',
    label: 'House Maid',
    labelHi: 'घरेलू सहायिका (सफाई/बर्तन)',
    icon: Home,
    baseRate: 150,
    rateDisplay: '₹150/hr',
    unit: 'hr',
    unitLabel: 'hour(s)',
    category: 'Domestic & Naka',
    defaultEtaMins: 15,
    description: 'On-demand sweeping, mopping, utensil washing & kitchen tidy-up'
  },
  {
    id: 'srv-cook',
    label: 'Cook',
    labelHi: 'रसोइया (घर का खाना)',
    icon: Utensils,
    baseRate: 200,
    rateDisplay: '₹200/meal',
    unit: 'meal',
    unitLabel: 'meal(s)',
    category: 'Domestic & Naka',
    defaultEtaMins: 18,
    description: 'Fresh home-style meal preparation (rotis, sabzi, dal, rice) for up to 4'
  },
  {
    id: 'srv-shifting',
    label: 'Luggage/Furniture Shifting',
    labelHi: 'सामान / फर्नीचर शिफ्टिंग टोली',
    icon: Truck,
    baseRate: 180,
    rateDisplay: '₹180/hr',
    unit: 'hr',
    unitLabel: 'hour(s)',
    category: 'Domestic & Naka',
    defaultEtaMins: 19,
    description: 'Heavy appliance moving, inter-floor shifting & tempo loading toli'
  },
  {
    id: 'srv-cleaning',
    label: 'Compound/Terrace Cleaning',
    labelHi: 'अहाता / छत सफाई',
    icon: Sparkles,
    baseRate: 250,
    rateDisplay: '₹250 flat',
    unit: 'flat',
    unitLabel: 'zone(s)',
    category: 'Domestic & Naka',
    defaultEtaMins: 21,
    description: 'Debris clearance, pressure washing, leaf sweeping & drain desilting'
  },
  {
    id: 'srv-loader',
    label: 'General Loader/Helper',
    labelHi: 'नाका हेल्पर / मजदूर',
    icon: Package,
    baseRate: 150,
    rateDisplay: '₹150/hr',
    unit: 'hr',
    unitLabel: 'hour(s)',
    category: 'Domestic & Naka',
    defaultEtaMins: 12,
    description: 'Daily-wage Naka helper for construction material, shop stock & lifting'
  }
];

export const INITIAL_WORKERS: Worker[] = [
  {
    id: 'WRK-101',
    name: 'Rajeshwar Vishwakarma',
    phone: '+91 98204 11842',
    skill: 'Electrician',
    serviceId: 'srv-electrician',
    phoneType: 'App',
    toliCapacity: 'Solo',
    groupSizeDisplay: 'Solo',
    hubLocation: 'Station Road Chowk',
    rating: 4.9,
    completedJobs: 314,
    verificationBadges: ['App User • Digital KYC Verified', 'Aadhaar Verified'],
    status: 'Available'
  },
  {
    id: 'WRK-102',
    name: 'Suresh Yadav & 2 Helpers',
    phone: '+91 98201 88310',
    skill: 'Luggage/Furniture Shifting',
    serviceId: 'srv-shifting',
    phoneType: 'Feature Phone',
    toliCapacity: '2 Helpers',
    groupSizeDisplay: 'Toli of 3',
    hubLocation: 'Bharti Park Naka',
    rating: 4.8,
    completedJobs: 189,
    verificationBadges: ['Naka Verified', 'Mukadam Vouched'],
    status: 'Available'
  },
  {
    id: 'WRK-103',
    name: 'Abdul Karim Ansari',
    phone: '+91 97681 44029',
    skill: 'Plumber',
    serviceId: 'srv-plumber',
    phoneType: 'Feature Phone',
    toliCapacity: 'Solo',
    groupSizeDisplay: 'Solo',
    hubLocation: 'Station Road Chowk',
    rating: 4.7,
    completedJobs: 246,
    verificationBadges: ['Naka Verified', 'Trade Tested'],
    status: 'Available'
  },
  {
    id: 'WRK-104',
    name: 'Sunita Shinde',
    phone: '+91 93218 70954',
    skill: 'Cook',
    serviceId: 'srv-cook',
    phoneType: 'Feature Phone',
    toliCapacity: 'Solo',
    groupSizeDisplay: 'Solo',
    hubLocation: 'Bharti Park Naka',
    rating: 4.9,
    completedJobs: 412,
    verificationBadges: ['Aadhaar Verified', 'Police Cleared'],
    status: 'Available'
  }
];

export const SCHEDULE_TIME_SLOTS = [
  {
    group: 'Today — Morning & Afternoon',
    slots: [
      'Today, 10:00 AM – 11:00 AM',
      'Today, 11:30 AM – 12:30 PM',
      'Today, 1:00 PM – 2:00 PM',
      'Today, 2:30 PM – 3:30 PM'
    ]
  },
  {
    group: 'Today — Evening',
    slots: [
      'Today, 4:00 PM – 5:00 PM',
      'Today, 5:30 PM – 6:30 PM',
      'Today, 6:00 PM – 7:00 PM',
      'Today, 7:30 PM – 8:30 PM',
      'Today, 8:30 PM – 9:30 PM'
    ]
  },
  {
    group: 'Tomorrow — Morning & Afternoon',
    slots: [
      'Tomorrow, 8:00 AM – 9:00 AM',
      'Tomorrow, 9:00 AM – 10:00 AM',
      'Tomorrow, 10:30 AM – 11:30 AM',
      'Tomorrow, 12:00 PM – 1:00 PM',
      'Tomorrow, 2:00 PM – 3:00 PM'
    ]
  },
  {
    group: 'Tomorrow — Evening',
    slots: [
      'Tomorrow, 4:00 PM – 5:00 PM',
      'Tomorrow, 6:00 PM – 7:00 PM',
      'Tomorrow, 7:30 PM – 8:30 PM'
    ]
  }
] as const;

export const INITIAL_WORKER_REVIEWS: WorkerReview[] = [
  {
    id: 'rev-1',
    reviewerName: 'Neha Deshmukh',
    locality: 'Chakala Metro Gate 2',
    rating: 5,
    date: '2 days ago',
    tags: ['Punctual', 'Clean Work'],
    comment:
      'Reached within 12 minutes of booking. Fixed the kitchen angle valve leak cleanly and wiped the floor before leaving.'
  },
  {
    id: 'rev-2',
    reviewerName: 'Siddharth Kulkarni',
    locality: 'Shanti Niketan Society',
    rating: 5,
    date: '5 days ago',
    tags: ['Polite', 'Punctual'],
    comment:
      'Brought his own heavy-duty wrench and Teflon tape. Charged the exact ₹199 base tariff with zero haggling.'
  },
  {
    id: 'rev-3',
    reviewerName: 'Farhan Shaikh',
    locality: 'Station Road Chowk',
    rating: 4,
    date: '1 week ago',
    tags: ['Clean Work'],
    comment:
      'Very polite and skilled Naka professional. Shared Start and Stop OTP smoothly.'
  }
];

export const INITIAL_BOOKING_HISTORY: BookingRecord[] = [
  {
    id: 'BKG-7902',
    invoiceNo: 'INV-8810',
    serviceLabel: 'Electrician',
    workerName: 'Rajeshwar Vishwakarma',
    helperCount: 1,
    durationUnits: 1,
    unitLabel: 'visit / task',
    baseRate: 199,
    totalAmount: 199,
    paymentMethod: 'UPI QR',
    urgencyLabel: 'Under 30 Mins',
    landmark: 'Flat B-402, Shanti Niketan, Near Chakala Metro Gate 2',
    completedAt: '2 days ago · 6:40 PM',
    rating: 5,
    startOtp: '4821',
    stopOtp: '9306'
  }
];

const NAKA_HUB_OPTIONS = [
  'Station Road Chowk',
  'Bharti Park Naka',
  'Andheri East Naka #1',
  'Kurla Station Naka #3',
  'Dadar West Kabutarkhana Naka'
] as const;

const FEEDBACK_TAGS = ['Punctual', 'Clean Work', 'Polite'] as const;

// Bilingual Dictionary (Pure Frontend)
const UI_COPY = {
  en: {
    subtitle: 'Hyperlocal Labor & Service Gateway',
    customerTab: 'Customer App View',
    opsTab: 'Field Operations & Call Desk',
    registerPartner: 'Register as a Partner / Worker',
    pastBookings: 'Past Bookings',
    catalogHeading: 'All 10 Hyperlocal Service Tiers',
    catalogSub: 'Fixed base rates · Instant dispatch to smartphone partners & Naka toli leads',
    dispatchConfig: 'DISPATCH CONFIGURATION',
    urgencyLabel: 'Urgency Selector',
    under30Mins: 'Under 30 Mins',
    scheduled: 'Scheduled',
    calculatorTitle: 'Helper Count & Duration Price Calculator',
    helpersLabel: 'Workers / Toli Size',
    durationLabel: 'Duration / Units',
    estimatedTotal: 'Estimated Total',
    broadcastBtn: 'Broadcast Request (3 km)',
    opsFormTitle: 'Helpline & Naka Registration Desk (For Feature-Phone Workers)',
    directoryTitle: 'Live Worker Directory'
  },
  hi: {
    subtitle: 'हाइपरलोकल नाका श्रमिक और सेवा गेटवे',
    customerTab: 'ग्राहक बुकिंग ऐप',
    opsTab: 'फील्ड ऑपरेशंस और कॉल डेस्क',
    registerPartner: 'पार्टनर / कारीगर पंजीकरण',
    pastBookings: 'पुरानी बुकिंग व रसीद',
    catalogHeading: 'सभी 10 हाइपरलोकल सेवाएं',
    catalogSub: 'तय दरें · 30 मिनट में नजदीकी नाका कारीगर या टोली आपके द्वार',
    dispatchConfig: 'बुकिंग विवरण व शुल्क',
    urgencyLabel: 'समय का चयन करें',
    under30Mins: 'तुरंत (30 मिनट में)',
    scheduled: 'बाद के लिए शेड्यूल करें',
    calculatorTitle: 'मजदूर संख्या और समय शुल्क कैलकुलेटर',
    helpersLabel: 'कारीगर / हेल्पर संख्या',
    durationLabel: 'समय / यूनिट',
    estimatedTotal: 'अनुमानित कुल राशि',
    broadcastBtn: 'रिक्वेस्ट भेजें (3 किमी रेडार)',
    opsFormTitle: 'हेल्पलाइन और नाका पंजीकरण डेस्क (फीचर-फोन श्रमिकों के लिए)',
    directoryTitle: 'लाइव नाका वर्कर डायरेक्टरी'
  }
} as const;

// ============================================================================
// 3. MAIN COMPONENT
// ============================================================================

export default function NakaSetuApp() {
  // Global Navigation & Language State
  const [activeTab, setActiveTab] = useState<ActiveTab>('customer');
  const [lang, setLang] = useState<LanguageCode>('en');
  const t = UI_COPY[lang];

  // Persistent State initialized from localStorage
  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.WORKERS);
      return saved ? (JSON.parse(saved) as Worker[]) : INITIAL_WORKERS;
    } catch {
      return INITIAL_WORKERS;
    }
  });

  const [workerReviews, setWorkerReviews] = useState<WorkerReview[]>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? (JSON.parse(saved) as WorkerReview[]) : INITIAL_WORKER_REVIEWS;
    } catch {
      return INITIAL_WORKER_REVIEWS;
    }
  });

  const [bookingHistory, setBookingHistory] = useState<BookingRecord[]>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? (JSON.parse(saved) as BookingRecord[]) : INITIAL_BOOKING_HISTORY;
    } catch {
      return INITIAL_BOOKING_HISTORY;
    }
  });

  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
    } catch {
      // Ignore storage quota errors
    }
  }, [workers]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(workerReviews));
    } catch {
      // Ignore storage quota errors
    }
  }, [workerReviews]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookingHistory));
    } catch {
      // Ignore storage quota errors
    }
  }, [bookingHistory]);

  // --------------------------------------------------------------------------
  // VIEW 1 (Customer App View & Verified Trust Flow) State
  // --------------------------------------------------------------------------
  const [customerStep, setCustomerStep] = useState<CustomerStep>('booking');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<
    ServiceCategory | 'All'
  >('All');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-plumber');
  const [helperCount, setHelperCount] = useState<number>(1);
  const [durationUnits, setDurationUnits] = useState<number>(1);
  const [urgency, setUrgency] = useState<UrgencyOption>('immediate');
  const [scheduledSlot, setScheduledSlot] = useState<string>(
    'Today, 4:00 PM – 5:00 PM'
  );
  const [taskNote, setTaskNote] = useState<string>(
    'Flat B-402, Shanti Niketan, Near Chakala Metro Gate 2. Kitchen under-sink angle valve leaking.'
  );
  const [attachedPhoto, setAttachedPhoto] = useState<boolean>(false);

  // View 1 Modals
  const [isMaskedCallModalOpen, setIsMaskedCallModalOpen] = useState<boolean>(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [isUpiQrModalOpen, setIsUpiQrModalOpen] = useState<boolean>(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<BookingRecord | null>(null);

  // View 1 Settlement & Two-Way Rating State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [customerRating, setCustomerRating] = useState<number>(5);
  const [selectedFeedbackTags, setSelectedFeedbackTags] = useState<string[]>([
    'Punctual',
    'Clean Work'
  ]);
  const [writtenReviewText, setWrittenReviewText] = useState<string>('');

  // --------------------------------------------------------------------------
  // SMARTPHONE PARTNER SELF-REGISTRATION MODAL STATE
  // --------------------------------------------------------------------------
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState<boolean>(false);
  const [partnerName, setPartnerName] = useState<string>('');
  const [partnerPhone, setPartnerPhone] = useState<string>('');
  const [partnerTradeId, setPartnerTradeId] = useState<string>('srv-electrician');
  const [partnerLocality, setPartnerLocality] = useState<string>('Station Road Chowk');
  const [partnerWorkMode, setPartnerWorkMode] = useState<
    'Solo Professional' | 'Toli / Group Lead (2-4 helpers)'
  >('Solo Professional');
  const [partnerKycUploaded, setPartnerKycUploaded] = useState<boolean>(true);

  // --------------------------------------------------------------------------
  // VIEW 2 (Field Operations & Call Desk) State
  // --------------------------------------------------------------------------
  const [enrollName, setEnrollName] = useState<string>('');
  const [enrollPhone, setEnrollPhone] = useState<string>('');
  const [enrollSkillId, setEnrollSkillId] = useState<string>('srv-shifting');
  const [enrollHub, setEnrollHub] = useState<string>('Station Road Chowk');
  const [enrollGroupSize, setEnrollGroupSize] = useState<
    'Solo' | 'Group of 2' | 'Group of 3-4 Helpers'
  >('Group of 2');
  const [enrollPhysicalVerified, setEnrollPhysicalVerified] = useState<boolean>(true);

  const [opsSearchQuery, setOpsSearchQuery] = useState<string>('');
  const [opsPhoneFilter, setOpsPhoneFilter] = useState<'All' | PhoneType>('All');
  const [opsHubFilter, setOpsHubFilter] = useState<string>('All Hubs');
  const [ivrTargetWorker, setIvrTargetWorker] = useState<Worker | null>(null);

  // --------------------------------------------------------------------------
  // Toast Helper
  // --------------------------------------------------------------------------
  const showToast = (
    type: ToastNotification['type'],
    title: string,
    message: string
  ) => {
    setToast({
      id: Date.now(),
      type,
      title,
      message
    });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => {
      setToast(null);
    }, 5500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // --------------------------------------------------------------------------
  // Derived State & Live Price Calculator
  // --------------------------------------------------------------------------
  const selectedService = useMemo(
    () =>
      SERVICE_CATALOG.find((s) => s.id === selectedServiceId) || SERVICE_CATALOG[0],
    [selectedServiceId]
  );

  const estimatedTotal = useMemo(
    () => selectedService.baseRate * helperCount * durationUnits,
    [selectedService.baseRate, helperCount, durationUnits]
  );

  const displayedCatalog = useMemo(() => {
    if (selectedCategoryTab === 'All') return SERVICE_CATALOG;
    return SERVICE_CATALOG.filter((item) => item.category === selectedCategoryTab);
  }, [selectedCategoryTab]);

  const filteredWorkers = useMemo(() => {
    return workers.filter((w) => {
      const matchesSearch =
        w.name.toLowerCase().includes(opsSearchQuery.toLowerCase()) ||
        w.skill.toLowerCase().includes(opsSearchQuery.toLowerCase()) ||
        w.hubLocation.toLowerCase().includes(opsSearchQuery.toLowerCase());
      const matchesPhone = opsPhoneFilter === 'All' || w.phoneType === opsPhoneFilter;
      const matchesHub =
        opsHubFilter === 'All Hubs' || w.hubLocation === opsHubFilter;
      return matchesSearch && matchesPhone && matchesHub;
    });
  }, [workers, opsSearchQuery, opsPhoneFilter, opsHubFilter]);

  // --------------------------------------------------------------------------
  // 3-Second Live Radar Matching Timer Effect
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (customerStep !== 'matching') return;

    const timer = window.setTimeout(() => {
      setCustomerStep('assigned');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [customerStep]);

  // --------------------------------------------------------------------------
  // View 1 Event Handlers
  // --------------------------------------------------------------------------
  const handleSelectCategoryTab = (category: ServiceCategory | 'All') => {
    setSelectedCategoryTab(category);
    if (category !== 'All') {
      const firstInCat = SERVICE_CATALOG.find((s) => s.category === category);
      if (firstInCat && selectedService.category !== category) {
        setSelectedServiceId(firstInCat.id);
      }
    }
  };

  const handleBroadcastRequest = () => {
    setIsMaskedCallModalOpen(false);
    setIsSosModalOpen(false);
    setIsUpiQrModalOpen(false);
    setCustomerStep('matching');
  };

  const handleToggleFeedbackTag = (tag: string) => {
    setSelectedFeedbackTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFinishAndReset = () => {
    const trimmedComment = writtenReviewText.trim();
    if (trimmedComment.length > 0) {
      const newReview: WorkerReview = {
        id: `rev-${Date.now()}`,
        reviewerName: 'You (Verified Customer)',
        locality: 'Chakala Metro Gate 2',
        rating: customerRating,
        date: 'Just now',
        tags: selectedFeedbackTags.length > 0 ? selectedFeedbackTags : ['Punctual'],
        comment: trimmedComment
      };
      setWorkerReviews((prev) => [newReview, ...prev]);
    }

    const newBooking: BookingRecord = {
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNo: `INV-${Math.floor(8000 + Math.random() * 1999)}`,
      serviceLabel: selectedService.label,
      workerName: 'Ramesh Pawar',
      helperCount,
      durationUnits,
      unitLabel: selectedService.unitLabel,
      baseRate: selectedService.baseRate,
      totalAmount: estimatedTotal,
      paymentMethod: paymentMethod === 'upi' ? 'UPI QR' : 'Cash',
      urgencyLabel: urgency === 'immediate' ? 'Under 30 Mins' : scheduledSlot,
      landmark: taskNote,
      completedAt: 'Just now',
      rating: customerRating,
      startOtp: '4821',
      stopOtp: '9306'
    };
    setBookingHistory((prev) => [newBooking, ...prev]);

    setIsMaskedCallModalOpen(false);
    setIsSosModalOpen(false);
    setIsUpiQrModalOpen(false);
    setAttachedPhoto(false);
    setUrgency('immediate');
    setPaymentMethod('upi');
    setCustomerRating(5);
    setHelperCount(1);
    setDurationUnits(1);
    setSelectedFeedbackTags(['Punctual', 'Clean Work']);
    setWrittenReviewText('');
    setCustomerStep('booking');
    showToast(
      'success',
      'Receipt Saved & Settlement Completed',
      `₹${estimatedTotal} settled with Ramesh Pawar (${customerRating} ★). Digital receipt #${newBooking.invoiceNo} added to Past Bookings.`
    );
  };

  // --------------------------------------------------------------------------
  // Smartphone Partner Self-Registration Handler (Online Onboarding Modal)
  // --------------------------------------------------------------------------
  const handlePartnerSelfRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = partnerName.trim() || 'Vikramaditya More';
    const rawDigits = partnerPhone.replace(/\D/g, '').slice(-10);
    const formattedPhone =
      rawDigits.length === 10
        ? `+91 ${rawDigits.slice(0, 5)} ${rawDigits.slice(5)}`
        : '+91 98209 33104';

    const matchedTrade =
      SERVICE_CATALOG.find((s) => s.id === partnerTradeId) || SERVICE_CATALOG[0];

    const groupDisplay =
      partnerWorkMode === 'Toli / Group Lead (2-4 helpers)'
        ? 'Toli of 3'
        : 'Solo';

    const newAppWorker: Worker = {
      id: `WRK-${101 + workers.length}`,
      name: trimmedName,
      phone: formattedPhone,
      skill: matchedTrade.label,
      serviceId: matchedTrade.id,
      phoneType: 'App',
      toliCapacity: partnerWorkMode,
      groupSizeDisplay: groupDisplay,
      hubLocation: partnerLocality,
      rating: 5.0,
      completedJobs: 1,
      verificationBadges: [
        'App User • Digital KYC Verified',
        ...(partnerKycUploaded ? ['ID & Cert Uploaded'] : [])
      ],
      status: 'Available'
    };

    setWorkers((prev) => [newAppWorker, ...prev]);
    setPartnerName('');
    setPartnerPhone('');
    setIsPartnerModalOpen(false);
    setActiveTab('operations');
    showToast(
      'success',
      'Smartphone Partner Onboarded',
      `${newAppWorker.name} (${newAppWorker.skill}) saved to directory with badge "App User • Digital KYC Verified".`
    );
  };

  // --------------------------------------------------------------------------
  // View 2 Offline Worker Registration & IVR Handlers
  // --------------------------------------------------------------------------
  const handleRegisterOfflineWorker = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = enrollName.trim() || 'Mahesh Chavan';
    const rawDigits = enrollPhone.replace(/\D/g, '').slice(-10);
    const formattedPhone =
      rawDigits.length === 10
        ? `+91 ${rawDigits.slice(0, 5)} ${rawDigits.slice(5)}`
        : '+91 98201 55412';

    const matchedService =
      SERVICE_CATALOG.find((s) => s.id === enrollSkillId) || SERVICE_CATALOG[7];

    const mappedGroupDisplay =
      enrollGroupSize === 'Group of 2'
        ? 'Toli of 2'
        : enrollGroupSize === 'Group of 3-4 Helpers'
          ? 'Toli of 3'
          : 'Solo';

    const badges = enrollPhysicalVerified
      ? ['Naka Verified', 'Physical ID Inspected']
      : ['Helpline Enrolled'];

    const newWorker: Worker = {
      id: `WRK-${101 + workers.length}`,
      name: trimmedName,
      phone: formattedPhone,
      skill: matchedService.label,
      serviceId: matchedService.id,
      phoneType: 'Feature Phone',
      toliCapacity: enrollGroupSize,
      groupSizeDisplay: mappedGroupDisplay,
      hubLocation: enrollHub,
      rating: 5.0,
      completedJobs: 1,
      verificationBadges: badges,
      status: 'Available'
    };

    setWorkers((prev) => [newWorker, ...prev]);
    setEnrollName('');
    setEnrollPhone('');
    showToast(
      'success',
      'Offline Feature-Phone Worker Enrolled',
      `${newWorker.name} (${newWorker.skill} · ${newWorker.groupSizeDisplay}) added to ${newWorker.hubLocation}.`
    );
  };

  const handleIvrKeyPress = (dtmfKey: '1' | '2') => {
    if (!ivrTargetWorker) return;

    if (dtmfKey === '1') {
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === ivrTargetWorker.id
            ? { ...w, status: 'Dispatched (SMS Sent)' }
            : w
        )
      );
      showToast(
        'success',
        'IVR Dispatch Accepted (Pressed 1)',
        `${ivrTargetWorker.name} accepted via DTMF 1. Status updated to "Dispatched (SMS Sent)".`
      );
    } else {
      showToast(
        'warning',
        'IVR Dispatch Declined (Pressed 2)',
        `${ivrTargetWorker.name} declined via DTMF 2. Routing call to next available Naka worker.`
      );
    }

    setIvrTargetWorker(null);
  };

  const handleResetSavedStorage = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.WORKERS);
      window.localStorage.removeItem(STORAGE_KEYS.REVIEWS);
      window.localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    } catch {
      // Ignore
    }
    setWorkers(INITIAL_WORKERS);
    setWorkerReviews(INITIAL_WORKER_REVIEWS);
    setBookingHistory(INITIAL_BOOKING_HISTORY);
    showToast(
      'info',
      'Demo Data Reset',
      'Restored default workers, reviews, and booking records.'
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col relative selection:bg-[#1D4ED8]/15 selection:text-[#0F172A]">
      {/* Subtle Top Wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-50/80 to-transparent z-0"
      />

      {/* =====================================================================
          GLOBAL HEADER & NAVIGATION (CRISP WHITE + DEEP BLUE & ORANGE CTAS)
      ===================================================================== */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3.5 gap-4">
            {/* Brand Identity */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-base tracking-tight shrink-0 shadow-xs">
                  NS
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-lg font-bold tracking-tight text-[#0F172A] leading-none">
                      NakaSetu
                    </h1>
                    <span className="text-xs font-semibold text-orange-800 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                      30-Min SLA
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{t.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Center: Segmented Workspace Switcher */}
            <div
              role="tablist"
              aria-label="Workspace View Switcher"
              className="inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl self-start lg:self-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'customer'}
                onClick={() => setActiveTab('customer')}
                className={`px-4 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'customer'
                    ? 'bg-[#1D4ED8] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                {t.customerTab}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'operations'}
                onClick={() => setActiveTab('operations')}
                className={`px-4 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'operations'
                    ? 'bg-[#1D4ED8] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                {t.opsTab}
              </button>
            </div>

            {/* Right: Language Toggle + Past Bookings + Partner CTA */}
            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
              {/* Simple English & Hindi Toggle */}
              <button
                type="button"
                onClick={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200 text-xs font-semibold transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                title="Switch Language (English / Hindi)"
              >
                <Languages className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <span>{lang === 'en' ? 'EN · हिंदी' : 'हिंदी · EN'}</span>
              </button>

              {/* Past Bookings & Receipt Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedReceipt(bookingHistory[0] || null);
                  setIsBookingsModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs text-xs font-semibold transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
              >
                <Receipt className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <span>
                  {t.pastBookings} ({bookingHistory.length})
                </span>
              </button>

              {/* Register as a Partner / Worker Button (Warm Orange Tertiary Accent) */}
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-xs text-xs font-semibold transition-all inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <HardHat className="w-4 h-4 text-orange-100" />
                <span>{t.registerPartner}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Operational Metrics & Customer Verification Strip */}
        <div className="bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-slate-600 font-medium tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <strong className="font-semibold text-slate-900">
                  {workers.filter((w) => w.status === 'Available').length} Available / 28 Nearby
                </strong>
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <strong className="font-semibold text-slate-900">5 Naka Hubs Online</strong>
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <strong className="font-semibold text-slate-900">Avg Arrival: 18m</strong>
              </span>
            </div>

            {/* Customer Verified Strip */}
            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full font-mono text-[11px] tabular-nums">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Customer Verified: Phone OTP (+91 98201 •••••) • Geo-Locked • Zero Advance Fee
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================================
          TOAST NOTIFICATION BANNER
      ===================================================================== */}
      {toast && (
        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            role="status"
            className={`px-4 py-3 rounded-xl border flex items-center justify-between gap-3 text-xs shadow-xs ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : toast.type === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  toast.type === 'success'
                    ? 'text-emerald-600'
                    : toast.type === 'warning'
                      ? 'text-amber-600'
                      : 'text-[#1D4ED8]'
                }`}
              />
              <div>
                <span className="font-bold text-slate-900">{toast.title}: </span>
                <span>{toast.message}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          MAIN VIEWPORT CONTAINER
      ===================================================================== */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'customer' ? (
          <>
            {/* VIEW 1 INJECTED HERE */}
            <div className="space-y-6">
              {/* Step Progress Bar */}
              <div className="bg-white border border-slate-200/90 shadow-2xs rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium overflow-x-auto">
                  {(
                    [
                      { key: 'booking', stepNum: '01', label: 'Service & Booking' },
                      { key: 'matching', stepNum: '02', label: 'Live Radar (3 km)' },
                      { key: 'assigned', stepNum: '03', label: 'Dual OTP & Execution' },
                      { key: 'settlement', stepNum: '04', label: 'Settlement & Two-Way Rating' }
                    ] as const
                  ).map((s, idx) => {
                    const isCurrent = customerStep === s.key;
                    const stepOrder = ['booking', 'matching', 'assigned', 'settlement'];
                    const isPassed = stepOrder.indexOf(customerStep) > idx;
                    return (
                      <React.Fragment key={s.key}>
                        {idx > 0 && (
                          <span className="text-slate-300 select-none" aria-hidden="true">
                            /
                          </span>
                        )}
                        <div
                          className={`inline-flex items-center gap-2 whitespace-nowrap ${
                            isCurrent
                              ? 'text-slate-900 font-bold'
                              : isPassed
                                ? 'text-emerald-700 font-semibold'
                                : 'text-slate-500'
                          }`}
                        >
                          <span
                            className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
                              isCurrent
                                ? 'bg-[#1D4ED8] text-white font-bold'
                                : isPassed
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {s.stepNum}
                          </span>
                          <span>{s.label}</span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                {customerStep !== 'booking' && (
                  <button
                    type="button"
                    onClick={() => setCustomerStep('booking')}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
                    <span>Back to Step 1</span>
                  </button>
                )}
              </div>

              {/* =============================================================
                  STEP 1: 10-SERVICE CATALOG & BOOKING FORM
              ============================================================= */}
              {customerStep === 'booking' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left 7 Columns: 10 Service Tiers in Crisp White Cards */}
                  <div className="lg:col-span-7 bg-white border border-slate-200/90 shadow-2xs rounded-2xl p-5 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                      <div>
                        <h2 className="text-base font-semibold text-slate-900">
                          {t.catalogHeading}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {t.catalogSub}
                        </p>
                      </div>

                      {/* Segmented Category Filter */}
                      <div
                        role="tablist"
                        aria-label="Service Category Filter"
                        className="inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl self-start"
                      >
                        <button
                          type="button"
                          role="tab"
                          aria-selected={selectedCategoryTab === 'All'}
                          onClick={() => handleSelectCategoryTab('All')}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                            selectedCategoryTab === 'All'
                              ? 'bg-[#1D4ED8] text-white shadow-2xs font-semibold'
                              : 'text-slate-600 hover:text-slate-900 font-medium'
                          }`}
                        >
                          All (10)
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={selectedCategoryTab === 'Skilled Trades'}
                          onClick={() => handleSelectCategoryTab('Skilled Trades')}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                            selectedCategoryTab === 'Skilled Trades'
                              ? 'bg-[#1D4ED8] text-white shadow-2xs font-semibold'
                              : 'text-slate-600 hover:text-slate-900 font-medium'
                          }`}
                        >
                          Skilled Trades
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={selectedCategoryTab === 'Domestic & Naka'}
                          onClick={() => handleSelectCategoryTab('Domestic & Naka')}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                            selectedCategoryTab === 'Domestic & Naka'
                              ? 'bg-[#1D4ED8] text-white shadow-2xs font-semibold'
                              : 'text-slate-600 hover:text-slate-900 font-medium'
                          }`}
                        >
                          Domestic &amp; Naka
                        </button>
                      </div>
                    </div>

                    {/* Grid Cards for All 10 Services */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {displayedCatalog.map((service) => {
                        const IconComponent = service.icon;
                        const isSelected = service.id === selectedServiceId;
                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => setSelectedServiceId(service.id)}
                            className={`text-left p-4 rounded-xl transition-all flex items-start justify-between gap-3 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50/60 border-2 border-[#1D4ED8] shadow-xs'
                                : 'bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                            }`}
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                  isSelected
                                    ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                                    : 'bg-slate-100 text-[#1D4ED8] border-slate-200/80'
                                }`}
                              >
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-sm text-slate-900 truncate">
                                  {lang === 'hi' ? service.labelHi : service.label}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                  {service.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 tabular-nums">
                                  <span>{service.category}</span>
                                  <span>·</span>
                                  <span className="text-orange-700 font-semibold">
                                    ETA ~{service.defaultEtaMins}m
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Pricing Chip */}
                            <span
                              className={`font-mono text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 tabular-nums ${
                                isSelected
                                  ? 'bg-[#1D4ED8] text-white font-bold'
                                  : 'bg-slate-100 text-slate-800 border border-slate-200'
                              }`}
                            >
                              {service.rateDisplay}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right 5 Columns: Booking Configuration & Price Calculator */}
                  <div className="lg:col-span-5 bg-white border border-slate-200/90 shadow-2xs rounded-2xl p-5 space-y-5">
                    <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-mono font-semibold text-slate-500">
                          {t.dispatchConfig}
                        </span>
                        <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                          {lang === 'hi' ? selectedService.labelHi : selectedService.label}
                        </h3>
                      </div>
                      <span className="font-mono text-sm font-bold text-orange-800 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full tabular-nums">
                        {selectedService.rateDisplay}
                      </span>
                    </div>

                    {/* Helper Count & Hours Price Calculator */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                          <Calculator className="w-3.5 h-3.5 text-[#1D4ED8]" />
                          <span>{t.calculatorTitle}</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                          Base: ₹{selectedService.baseRate}/{selectedService.unit}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Helper Count Selector */}
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            {t.helpersLabel}
                          </label>
                          <div className="grid grid-cols-3 gap-1 bg-white p-1 border border-slate-200 rounded-lg">
                            {[1, 2, 3].map((count) => (
                              <button
                                key={count}
                                type="button"
                                onClick={() => setHelperCount(count)}
                                className={`py-1 text-xs font-mono font-semibold rounded transition-colors cursor-pointer ${
                                  helperCount === count
                                    ? 'bg-[#1D4ED8] text-white'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                {count === 1 ? '1 Solo' : `${count}x`}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Duration / Units Selector */}
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            {t.durationLabel} ({selectedService.unitLabel})
                          </label>
                          <div className="grid grid-cols-4 gap-1 bg-white p-1 border border-slate-200 rounded-lg">
                            {[1, 2, 3, 4].map((hrs) => (
                              <button
                                key={hrs}
                                type="button"
                                onClick={() => setDurationUnits(hrs)}
                                className={`py-1 text-xs font-mono font-semibold rounded transition-colors cursor-pointer ${
                                  durationUnits === hrs
                                    ? 'bg-[#1D4ED8] text-white'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                {hrs}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs tabular-nums">
                        <span className="text-slate-600 font-medium">
                          {t.estimatedTotal} ({helperCount} worker × {durationUnits}{' '}
                          {selectedService.unitLabel})
                        </span>
                        <span className="font-mono text-sm font-bold text-[#1D4ED8]">
                          ₹{estimatedTotal}
                        </span>
                      </div>
                    </div>

                    {/* Urgency Selector */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-800">
                        {t.urgencyLabel}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setUrgency('immediate')}
                          className={`p-3 rounded-xl text-left transition-all cursor-pointer ${
                            urgency === 'immediate'
                              ? 'bg-blue-50/60 border-2 border-[#1D4ED8]'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-orange-600" />
                              <span>{t.under30Mins}</span>
                            </span>
                            <span
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                urgency === 'immediate'
                                  ? 'border-[#1D4ED8] bg-[#1D4ED8]'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {urgency === 'immediate' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Immediate 3 km radar &amp; IVR voice blast
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setUrgency('scheduled')}
                          className={`p-3 rounded-xl text-left transition-all cursor-pointer ${
                            urgency === 'scheduled'
                              ? 'bg-blue-50/60 border-2 border-[#1D4ED8]'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-orange-600" />
                              <span>{t.scheduled}</span>
                            </span>
                            <span
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                urgency === 'scheduled'
                                  ? 'border-[#1D4ED8] bg-[#1D4ED8]'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {urgency === 'scheduled' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Pre-assign a verified Naka worker or toli
                          </p>
                        </button>
                      </div>

                      {urgency === 'scheduled' && (
                        <div className="pt-1.5 space-y-1">
                          <label
                            htmlFor="scheduled-slot-select"
                            className="block text-[11px] font-semibold text-slate-700"
                          >
                            Choose 1-Hour Arrival Slot (17 Windows Available):
                          </label>
                          <select
                            id="scheduled-slot-select"
                            value={scheduledSlot}
                            onChange={(e) => setScheduledSlot(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-[#1D4ED8]"
                          >
                            {SCHEDULE_TIME_SLOTS.map((group) => (
                              <optgroup key={group.group} label={group.group}>
                                {group.slots.map((slot) => (
                                  <option key={slot} value={slot}>
                                    {slot}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Task Note & Landmark */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="task-note-input"
                        className="block text-xs font-semibold text-slate-800"
                      >
                        Task Note &amp; Landmark
                      </label>
                      <textarea
                        id="task-note-input"
                        rows={2}
                        value={taskNote}
                        onChange={(e) => setTaskNote(e.target.value)}
                        placeholder="Enter flat number, landmark, and brief task details..."
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8] resize-none"
                      />
                    </div>

                    {/* Simulated Photo Attachment */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800">
                          Task Media Attachment
                        </span>
                        <button
                          type="button"
                          onClick={() => setAttachedPhoto((prev) => !prev)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-orange-600" />
                          <span>{attachedPhoto ? 'Remove Photo' : 'Attach Photo'}</span>
                        </button>
                      </div>

                      {attachedPhoto && (
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-lg border border-slate-200 bg-white shrink-0 overflow-hidden flex items-center justify-center">
                              <svg
                                viewBox="0 0 64 64"
                                className="w-full h-full"
                                role="img"
                                aria-label="sink_leakage.jpg preview"
                              >
                                <rect width="64" height="64" fill="#EFF6FF" />
                                <path
                                  d="M14 20 H36 V32 H50"
                                  stroke="#1E3A8A"
                                  strokeWidth="6"
                                  strokeLinecap="round"
                                  fill="none"
                                />
                                <circle cx="36" cy="26" r="5" fill="#1D4ED8" />
                                <path
                                  d="M36 36 C33 42, 39 42, 36 48"
                                  stroke="#EA580C"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  fill="none"
                                />
                                <circle cx="36" cy="53" r="2.5" fill="#EA580C" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-900 truncate">
                                <FileImage className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                                <span>sink_leakage.jpg</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                1.2 MB · Attached to dispatch ticket
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAttachedPhoto(false)}
                            aria-label="Remove attached photo"
                            className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Broadcast CTA */}
                    <div className="pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={handleBroadcastRequest}
                        className="w-full py-3 px-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Radio className="w-4 h-4 text-orange-300" />
                        <span>
                          {t.broadcastBtn} · ₹{estimatedTotal}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  STEP 2: INTERACTIVE MATCH RADAR
              ============================================================= */}
              {customerStep === 'matching' && (
                <div className="max-w-2xl mx-auto bg-white border border-slate-200 shadow-2xs rounded-2xl p-8 text-center space-y-6">
                  {/* Radar Rings */}
                  <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-[#1D4ED8]/40 animate-ping opacity-40" />
                    <div className="absolute inset-4 rounded-full border border-[#1D4ED8]/30 bg-blue-50/50 animate-pulse" />
                    <div className="absolute inset-10 rounded-full border border-slate-200 bg-white shadow-inner" />
                    <span className="absolute top-6 left-11 w-2.5 h-2.5 rounded-full bg-orange-600 shadow-xs" />
                    <span className="absolute top-12 right-7 w-2.5 h-2.5 rounded-full bg-[#1D4ED8] shadow-xs" />
                    <span className="absolute bottom-9 left-9 w-2.5 h-2.5 rounded-full bg-slate-900 shadow-xs" />
                    <span className="absolute bottom-7 right-12 w-2.5 h-2.5 rounded-full bg-orange-600 shadow-xs" />
                    <div className="relative w-14 h-14 rounded-2xl bg-[#1D4ED8] text-white flex items-center justify-center shadow-md">
                      <Radio className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="inline-block font-mono text-[11px] font-semibold text-orange-800 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                      3 KM GEOFENCE RADAR ACTIVE
                    </span>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Broadcasting to 6 nearby verified workers...
                    </h2>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Pinging smartphone partners via FCM push and dialing offline Naka leads on automated bilingual IVR.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2 font-mono tabular-nums">
                    <div className="flex justify-between text-slate-500">
                      <span>Selected Service:</span>
                      <strong className="text-slate-900">{selectedService.label}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Scope &amp; Locked Tariff:</span>
                      <strong className="text-orange-700">
                        {helperCount}x Worker · {durationUnits} {selectedService.unitLabel} · ₹
                        {estimatedTotal}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Urgency Window:</span>
                      <strong className="text-[#1D4ED8]">
                        {urgency === 'immediate' ? 'Under 30 Mins' : scheduledSlot}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  STEP 3: MATCHED WORKER CARD, PREVIOUS REVIEWS & DUAL OTP
              ============================================================= */}
              {customerStep === 'assigned' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left 7 Columns: Matched Worker Card & Previous Customer Reviews */}
                  <div className="lg:col-span-7 bg-white border border-slate-200/90 shadow-2xs rounded-2xl p-6 space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-2 pb-4 border-b border-slate-200">
                      <div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                            Matched Worker En Route (Dispatched &amp; Traveling to You)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Your nearest verified professional has accepted the broadcast and is riding from Station Road Chowk Naka to your address.
                        </p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-orange-800 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full tabular-nums shrink-0">
                        Arriving in 14 mins
                      </span>
                    </div>

                    {/* Worker Identity */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 overflow-hidden">
                          <svg
                            viewBox="0 0 80 80"
                            className="w-full h-full"
                            role="img"
                            aria-label="Ramesh Pawar Avatar"
                          >
                            <rect width="80" height="80" fill="#DBEAFE" />
                            <circle cx="40" cy="30" r="14" fill="#1D4ED8" />
                            <path
                              d="M16 72 C16 54, 64 54, 64 72"
                              fill="#0F172A"
                            />
                          </svg>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg font-semibold text-slate-900">
                              Ramesh Pawar
                            </h2>
                            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-orange-900 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full tabular-nums">
                              4.9 ★
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Senior {selectedService.label} · Station Road Chowk Naka
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 text-xs font-mono text-slate-600">
                            <Bike className="w-3.5 h-3.5 text-orange-600" />
                            <span>Vehicle: MH-02-EF-4918</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsMaskedCallModalOpen(true)}
                        className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 shadow-2xs text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-2 self-start sm:self-center shrink-0 cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-[#1D4ED8]" />
                        <span>Call via Masked Number</span>
                      </button>
                    </div>

                    {/* Verification Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Aadhaar Verified
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Police Background Checked
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full font-mono tabular-nums">
                        418 Completed Jobs
                      </span>
                    </div>

                    {/* Job Context Summary */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs tabular-nums">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Booked Scope &amp; Tariff</span>
                        <span className="font-semibold text-slate-900">
                          {selectedService.label} · {helperCount}x Worker · ₹{estimatedTotal}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Landmark Note</span>
                        <span className="font-medium text-slate-800 text-right max-w-xs truncate">
                          {taskNote}
                        </span>
                      </div>
                    </div>

                    {/* Previous Verified Customer Reviews Section */}
                    <div className="pt-2 border-t border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                          <MessageSquareQuote className="w-4 h-4 text-orange-600" />
                          <span>Recent Verified Customer Reviews ({workerReviews.length})</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          100% OTP-Verified Bookings
                        </span>
                      </div>

                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {workerReviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900">
                                  {rev.reviewerName}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  · {rev.locality}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-mono text-[11px] font-bold text-orange-800 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                                  {rev.rating}.0 ★
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  {rev.date}
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                              &ldquo;{rev.comment}&rdquo;
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {rev.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-semibold text-[#1D4ED8] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full"
                                >
                                  ✓ {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right 5 Columns: Dual Start/Stop OTP & Safety Controls */}
                  <div className="lg:col-span-5 bg-white border border-slate-200/90 shadow-2xs rounded-2xl p-6 space-y-5">
                    <div className="pb-3.5 border-b border-slate-200">
                      <span className="text-[11px] font-mono font-semibold text-slate-500">
                        DUAL HANDSHAKE PROTOCOL
                      </span>
                      <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                        Start &amp; Stop OTP Verification
                      </h3>
                    </div>

                    {/* Dual Start OTP & Stop OTP Display */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Start OTP */}
                      <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-900 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-[#1D4ED8]" />
                            Start OTP (On Arrival)
                          </span>
                        </div>
                        <div
                          aria-label="Start OTP 4 8 2 1"
                          className="grid grid-cols-4 gap-1.5"
                        >
                          {['4', '8', '2', '1'].map((digit, i) => (
                            <div
                              key={i}
                              className="py-2 bg-white border border-blue-300 rounded-lg text-center font-mono text-base font-bold text-[#1D4ED8] shadow-2xs tabular-nums"
                            >
                              {digit}
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Unlocks job session &amp; insurance cover
                        </p>
                      </div>

                      {/* Stop OTP */}
                      <div className="bg-orange-50/60 border border-orange-200 rounded-xl p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-900 flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-orange-600" />
                            Stop OTP (On Completion)
                          </span>
                        </div>
                        <div
                          aria-label="Stop OTP 9 3 0 6"
                          className="grid grid-cols-4 gap-1.5"
                        >
                          {['9', '3', '0', '6'].map((digit, i) => (
                            <div
                              key={i}
                              className="py-2 bg-white border border-orange-300 rounded-lg text-center font-mono text-base font-bold text-orange-800 shadow-2xs tabular-nums"
                            >
                              {digit}
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Share only after inspecting completed work
                        </p>
                      </div>
                    </div>

                    {/* Emergency SOS */}
                    <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold text-red-900">
                          Emergency Ward Police SOS
                        </div>
                        <p className="text-[11px] text-red-700 mt-0.5">
                          Broadcasts live GPS &amp; worker KYC to local police desk
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSosModalOpen(true)}
                        className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Emergency SOS</span>
                      </button>
                    </div>

                    {/* Proceed to Settlement */}
                    <div className="pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setCustomerStep('settlement')}
                        className="w-full py-3 px-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify Stop OTP &amp; Mark Job Completed</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  STEP 4: SETTLEMENT, WRITE A REVIEW & TWO-WAY RATING
              ============================================================= */}
              {customerStep === 'settlement' && (
                <div className="max-w-3xl mx-auto bg-white border border-slate-200/90 shadow-2xs rounded-2xl p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                    <div>
                      <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        ZERO PLATFORM COMMISSION · 100% TO WORKER
                      </span>
                      <h2 className="text-lg font-semibold text-slate-900 mt-2">
                        Settlement &amp; Two-Way Rating
                      </h2>
                    </div>
                    <div className="text-xs font-mono text-slate-500 tabular-nums">
                      Worker: Ramesh Pawar · Start #4821 / Stop #9306
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Itemized Bill & UPI QR Modal Trigger */}
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs tabular-nums">
                        <div className="font-semibold text-slate-900 pb-2 border-b border-slate-200">
                          Itemized Breakdown ({selectedService.label})
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Base rate</span>
                          <span className="font-mono font-semibold text-slate-900">
                            ₹{selectedService.baseRate} / {selectedService.unit}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Multiplier</span>
                          <span className="font-mono font-semibold text-slate-900">
                            {helperCount} worker(s) × {durationUnits}{' '}
                            {selectedService.unitLabel}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Platform fee</span>
                          <span className="font-mono font-semibold text-emerald-700">
                            ₹0
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                          <span>Total Payable</span>
                          <span className="font-mono text-orange-700">
                            ₹{estimatedTotal}
                          </span>
                        </div>
                      </div>

                      {/* Payment Mode Toggle */}
                      <div className="space-y-2.5">
                        <label className="block text-xs font-semibold text-slate-800">
                          Direct Worker Settlement Mode
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('upi')}
                            className={`py-2 px-3 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              paymentMethod === 'upi'
                                ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-2xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>UPI QR Code</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('cash')}
                            className={`py-2 px-3 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              paymentMethod === 'cash'
                                ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-2xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <Banknote className="w-3.5 h-3.5" />
                            <span>Cash Payment</span>
                          </button>
                        </div>

                        {paymentMethod === 'upi' ? (
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-16 h-16 bg-white p-1.5 border border-slate-200 rounded-lg shrink-0">
                                <svg
                                  viewBox="0 0 64 64"
                                  className="w-full h-full"
                                  role="img"
                                  aria-label="Mock UPI QR Code"
                                >
                                  <rect width="64" height="64" fill="#ffffff" />
                                  <rect x="4" y="4" width="18" height="18" fill="#0f172a" />
                                  <rect x="7" y="7" width="12" height="12" fill="#ffffff" />
                                  <rect x="10" y="10" width="6" height="6" fill="#0f172a" />
                                  <rect x="42" y="4" width="18" height="18" fill="#0f172a" />
                                  <rect x="45" y="7" width="12" height="12" fill="#ffffff" />
                                  <rect x="48" y="10" width="6" height="6" fill="#0f172a" />
                                  <rect x="4" y="42" width="18" height="18" fill="#0f172a" />
                                  <rect x="7" y="45" width="12" height="12" fill="#ffffff" />
                                  <rect x="10" y="48" width="6" height="6" fill="#0f172a" />
                                  <rect x="26" y="24" width="12" height="4" fill="#0f172a" />
                                  <rect x="28" y="32" width="8" height="8" fill="#0f172a" />
                                  <rect x="42" y="28" width="6" height="10" fill="#0f172a" />
                                  <rect x="26" y="46" width="6" height="12" fill="#0f172a" />
                                  <rect x="48" y="52" width="12" height="8" fill="#0f172a" />
                                </svg>
                              </div>
                              <div className="space-y-1 text-xs">
                                <div className="font-semibold text-slate-900">
                                  rameshpawar.naka@upi
                                </div>
                                <p className="text-[11px] text-slate-500">
                                  Instant bank settlement + Hindi audio box alert
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsUpiQrModalOpen(true)}
                              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-800 shrink-0 cursor-pointer"
                            >
                              Enlarge QR
                            </button>
                          </div>
                        ) : (
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                            <div className="font-semibold text-slate-900">
                              Hand ₹{estimatedTotal} Cash directly to Ramesh Pawar
                            </div>
                            <p className="text-slate-500">
                              Digital SMS receipt is sent automatically to both parties.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Worker Rates Customer Reciprocity Indicator */}
                      <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
                            <ArrowLeftRight className="w-3.5 h-3.5 text-orange-600" />
                            Worker Rates Customer (Reciprocity Active)
                          </span>
                          <span className="font-mono text-[11px] font-bold text-orange-800">
                            Customer Score: 4.95 ★
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Ramesh Pawar also rates your household via IVR/App on respectful conduct, accurate scope &amp; prompt settlement.
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Customer Rating + Write a Review + Submit */}
                    <div className="space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-slate-800">
                            Rate Ramesh Pawar ({customerRating}/5 ★)
                          </label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((starValue) => {
                              const active = starValue <= customerRating;
                              return (
                                <button
                                  key={starValue}
                                  type="button"
                                  onClick={() => setCustomerRating(starValue)}
                                  aria-label={`Rate ${starValue} stars`}
                                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                                    active
                                      ? 'bg-orange-50 border-orange-400 text-orange-500 shadow-2xs'
                                      : 'bg-white border-slate-200 text-slate-300 hover:border-slate-300'
                                  }`}
                                >
                                  <Star
                                    className="w-5 h-5"
                                    fill={active ? 'currentColor' : 'none'}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Commendation Tags */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-slate-800">
                            Feedback Badges
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {FEEDBACK_TAGS.map((tag) => {
                              const isSelected = selectedFeedbackTags.includes(tag);
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => handleToggleFeedbackTag(tag)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-blue-50 border-[#1D4ED8] text-[#1D4ED8]'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                  }`}
                                >
                                  {isSelected ? `✓ ${tag}` : tag}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Write a Customer Review Input */}
                        <div className="space-y-1.5">
                          <label
                            htmlFor="write-review-input"
                            className="block text-xs font-semibold text-slate-800"
                          >
                            Write a Review for Ramesh Pawar
                          </label>
                          <textarea
                            id="write-review-input"
                            rows={3}
                            value={writtenReviewText}
                            onChange={(e) => setWrittenReviewText(e.target.value)}
                            placeholder="Share how Ramesh performed (e.g., arrived on time, neat repair, transparent pricing)..."
                            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8] resize-none"
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={handleFinishAndReset}
                          className="w-full py-3 px-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Submit Review, Save Receipt &amp; Reset</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* VIEW 2 INJECTED HERE */}
            <div className="space-y-6">
              {/* =============================================================
                  1. OFFLINE WORKER ENROLLMENT FORM (FEATURE-PHONE & NAKA DESK)
              ============================================================= */}
              <div className="bg-white border border-slate-200/90 shadow-2xs rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#1D4ED8] flex items-center justify-center shrink-0">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">
                        {t.opsFormTitle}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Fast registration for offline walk-ins and basic-phone callers (automatically saved in browser storage)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <span className="text-[11px] font-mono font-semibold text-orange-800 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                      2G Voice &amp; SMS Loop Ready
                    </span>
                    <button
                      type="button"
                      onClick={handleResetSavedStorage}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium cursor-pointer"
                      title="Reset saved localStorage workers and reviews"
                    >
                      Reset Saved Data
                    </button>
                  </div>
                </div>

                <form onSubmit={handleRegisterOfflineWorker} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div>
                      <label
                        htmlFor="enroll-name"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Worker Name
                      </label>
                      <input
                        id="enroll-name"
                        type="text"
                        value={enrollName}
                        onChange={(e) => setEnrollName(e.target.value)}
                        placeholder="e.g. Govind Kale"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="enroll-phone"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        10-Digit Mobile Number
                      </label>
                      <input
                        id="enroll-phone"
                        type="tel"
                        maxLength={10}
                        value={enrollPhone}
                        onChange={(e) => setEnrollPhone(e.target.value)}
                        placeholder="e.g. 9820155412"
                        className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="enroll-skill"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Skill Dropdown (All 10 Services)
                      </label>
                      <select
                        id="enroll-skill"
                        value={enrollSkillId}
                        onChange={(e) => setEnrollSkillId(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#1D4ED8]"
                      >
                        {SERVICE_CATALOG.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.label} ({service.rateDisplay})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="enroll-hub"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Base Naka / Hub
                      </label>
                      <select
                        id="enroll-hub"
                        value={enrollHub}
                        onChange={(e) => setEnrollHub(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#1D4ED8]"
                      >
                        {NAKA_HUB_OPTIONS.map((hub) => (
                          <option key={hub} value={hub}>
                            {hub}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="enroll-group-size"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Group / Toli Capacity
                      </label>
                      <select
                        id="enroll-group-size"
                        value={enrollGroupSize}
                        onChange={(e) =>
                          setEnrollGroupSize(
                            e.target.value as
                              | 'Solo'
                              | 'Group of 2'
                              | 'Group of 3-4 Helpers'
                          )
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#1D4ED8]"
                      >
                        <option value="Solo">Solo</option>
                        <option value="Group of 2">Group of 2</option>
                        <option value="Group of 3-4 Helpers">Group of 3-4 Helpers</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={enrollPhysicalVerified}
                        onChange={(e) => setEnrollPhysicalVerified(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                      />
                      <span>Physical ID inspected at Naka drive</span>
                    </label>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-xl transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs"
                    >
                      <span>+ Register Offline Worker</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* =============================================================
                  2. LIVE WORKER DIRECTORY TABLE + NAKA HUB FILTER BUTTONS
              ============================================================= */}
              <div className="bg-white border border-slate-200/90 shadow-2xs rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">
                        {t.directoryTitle} ({filteredWorkers.length})
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Unified roster showing online Smartphone App partners and offline Feature-Phone / Naka workers
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search worker, trade, naka..."
                          value={opsSearchQuery}
                          onChange={(e) => setOpsSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8]"
                        />
                      </div>
                      <div className="inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl">
                        {(['All', 'App', 'Feature Phone'] as const).map((pt) => (
                          <button
                            key={pt}
                            type="button"
                            onClick={() => setOpsPhoneFilter(pt)}
                            className={`px-2.5 py-1 text-xs rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                              opsPhoneFilter === pt
                                ? 'bg-[#1D4ED8] text-white shadow-2xs font-semibold'
                                : 'text-slate-600 hover:text-slate-900 font-medium'
                            }`}
                          >
                            {pt === 'App'
                              ? 'App User'
                              : pt === 'Feature Phone'
                                ? 'Feature Phone'
                                : 'All'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Naka Hub Filter Buttons Row */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                    <span className="text-[11px] font-semibold text-slate-500 mr-1 shrink-0">
                      Filter by Naka Hub:
                    </span>
                    {(['All Hubs', ...NAKA_HUB_OPTIONS] as const).map((hub) => {
                      const active = opsHubFilter === hub;
                      return (
                        <button
                          key={hub}
                          type="button"
                          onClick={() => setOpsHubFilter(hub)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                            active
                              ? 'bg-orange-600 text-white border-orange-600 font-semibold'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {hub}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500">
                        <th className="py-3 px-4">Worker Details</th>
                        <th className="py-3 px-4">Primary Skill</th>
                        <th className="py-3 px-4">Device Type</th>
                        <th className="py-3 px-4">Group Size</th>
                        <th className="py-3 px-4">Verification Status</th>
                        <th className="py-3 px-4">Current Availability</th>
                        <th className="py-3 px-4 text-right">Dispatch Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs tabular-nums">
                      {filteredWorkers.map((worker) => (
                        <tr key={worker.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{worker.name}</div>
                            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                              {worker.id} · {worker.phone} · {worker.hubLocation}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-900">{worker.skill}</div>
                            <div className="text-[11px] font-mono text-orange-700 font-semibold">
                              ★ {worker.rating.toFixed(1)} ({worker.completedJobs} jobs)
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-700 whitespace-nowrap">
                              {worker.phoneType === 'App' ? (
                                <>
                                  <Smartphone className="w-3.5 h-3.5 text-[#1D4ED8]" />
                                  <span>App User</span>
                                </>
                              ) : (
                                <>
                                  <Phone className="w-3.5 h-3.5 text-orange-600" />
                                  <span>Feature Phone / Helpline</span>
                                </>
                              )}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                            {worker.groupSizeDisplay}
                          </td>

                          {/* Verification Badges */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {worker.verificationBadges.map((badge) => (
                                <span
                                  key={badge}
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full whitespace-nowrap"
                                >
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                worker.status === 'Available'
                                  ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                                  : 'text-amber-800 bg-amber-50 border border-amber-200'
                              }`}
                            >
                              {worker.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {worker.phoneType === 'Feature Phone' ? (
                              <button
                                type="button"
                                onClick={() => setIvrTargetWorker(worker)}
                                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 shadow-2xs text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                              >
                                <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
                                <span>Simulate Outbound Voice Call (IVR)</span>
                              </button>
                            ) : (
                              <span className="text-[11px] font-mono text-[#1D4ED8] font-semibold">
                                App Push Active
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* =====================================================================
          MODAL A: SMARTPHONE PARTNER SELF-REGISTRATION
      ===================================================================== */}
      {isPartnerModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="partner-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center shrink-0">
                  <HardHat className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h3 id="partner-modal-title" className="text-sm font-semibold text-slate-900">
                    Smartphone Partner Self-Registration
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instant Digital KYC onboarding into NakaSetu Live Dispatch Directory
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                aria-label="Close partner registration modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePartnerSelfRegistration} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="partner-name"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="partner-name"
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="e.g. Vikramaditya More"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="partner-phone"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    10-Digit Phone
                  </label>
                  <input
                    id="partner-phone"
                    type="tel"
                    maxLength={10}
                    value={partnerPhone}
                    onChange={(e) => setPartnerPhone(e.target.value)}
                    placeholder="e.g. 9820933104"
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="partner-trade"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Primary Trade
                  </label>
                  <select
                    id="partner-trade"
                    value={partnerTradeId}
                    onChange={(e) => setPartnerTradeId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#1D4ED8]"
                  >
                    {SERVICE_CATALOG.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.label} ({service.rateDisplay})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="partner-locality"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Base Locality
                  </label>
                  <select
                    id="partner-locality"
                    value={partnerLocality}
                    onChange={(e) => setPartnerLocality(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#1D4ED8]"
                  >
                    {NAKA_HUB_OPTIONS.map((hub) => (
                      <option key={hub} value={hub}>
                        {hub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Work Mode */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Work Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(
                    [
                      'Solo Professional',
                      'Toli / Group Lead (2-4 helpers)'
                    ] as const
                  ).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPartnerWorkMode(mode)}
                      className={`p-3 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                        partnerWorkMode === mode
                          ? 'bg-blue-50/70 border-2 border-[#1D4ED8] text-slate-900'
                          : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* ID & Certification Mock File Uploader */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  ID &amp; Certification Upload
                </label>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs">
                    {partnerKycUploaded ? (
                      <>
                        <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-mono font-semibold text-slate-900">
                            aadhaar_trade_cert_verified.pdf
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Digital KYC checksum verified
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-slate-500">
                          Upload Aadhaar / ITI Trade Certificate
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPartnerKycUploaded((prev) => !prev)}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-800 cursor-pointer shrink-0"
                  >
                    {partnerKycUploaded ? 'Replace File' : 'Upload File'}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Complete Digital KYC &amp; Join Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL B: SIMULATED AUTOMATED IVR CALL MODAL (VIEW 2)
      ===================================================================== */}
      {ivrTargetWorker && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ivr-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Volume2 className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h3 id="ivr-modal-title" className="text-sm font-semibold text-slate-900">
                    Automated Voice Dispatch System (Simulated Call to +91 98201 XXXXX)
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Dialing: {ivrTargetWorker.name} ({ivrTargetWorker.phone}) · {ivrTargetWorker.hubLocation}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIvrTargetWorker(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                aria-label="Close IVR modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>BILINGUAL CALL AUDIO SCRIPT (2G VOICE)</span>
                <span className="text-orange-700 font-semibold">LIVE AUDIO STREAM</span>
              </div>
              <blockquote className="text-sm font-medium text-slate-900 leading-relaxed">
                &ldquo;Namaste Suresh ji. 1.2 km door luggage shifting ke liye 2 workers ki zaroorat hai. Budget ₹360. Kaam accept karne ke liye 1 dabayein, mana karne ke liye 2 dabayein.&rdquo;
              </blockquote>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-orange-600" />
                <span>Interactive Feature-Phone Keypad Response:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleIvrKeyPress('1')}
                  className="py-2.5 px-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Press 1 to Accept</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleIvrKeyPress('2')}
                  className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Press 2 to Decline</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL C: MASKED PROXY CALL MODAL
      ===================================================================== */}
      {isMaskedCallModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="masked-call-title"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#1D4ED8]" />
                <h3 id="masked-call-title" className="text-sm font-semibold text-slate-900">
                  Masked Number Proxy Line
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMaskedCallModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
              <div className="text-xs font-mono font-semibold text-[#1D4ED8]">
                Connecting securely via proxy line...
              </div>
              <div className="text-sm font-bold text-slate-900">
                Ramesh Pawar (+91 22-4890-7712)
              </div>
              <p className="text-xs text-slate-500">
                Both customer and worker phone numbers remain anonymized.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsMaskedCallModalOpen(false)}
                className="px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                End Proxy Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL D: EMERGENCY SOS MODAL
      ===================================================================== */}
      {isSosModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sos-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-red-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <h3 id="sos-modal-title" className="text-sm font-semibold">
                  Emergency SOS Broadcast Active
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSosModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
              <div className="text-xs font-bold text-red-900">
                Live GPS and job session broadcast to local ward police desk
              </div>
              <div className="text-xs font-mono text-red-800 space-y-1 tabular-nums">
                <div>Coordinates: 19.1136° N, 72.8697° E</div>
                <div>Start OTP: #4821 · Stop OTP: #9306</div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsSosModalOpen(false)}
                className="px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL E: UPI QR CODE MODAL
      ===================================================================== */}
      {isUpiQrModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="upi-qr-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 id="upi-qr-modal-title" className="text-sm font-semibold text-slate-900">
                Direct Worker UPI QR (₹{estimatedTotal})
              </h3>
              <button
                type="button"
                onClick={() => setIsUpiQrModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-44 h-44 mx-auto bg-white p-3 border border-slate-200 rounded-2xl">
              <svg
                viewBox="0 0 64 64"
                className="w-full h-full"
                role="img"
                aria-label="Enlarged UPI QR Code"
              >
                <rect width="64" height="64" fill="#ffffff" />
                <rect x="4" y="4" width="18" height="18" fill="#0f172a" />
                <rect x="7" y="7" width="12" height="12" fill="#ffffff" />
                <rect x="10" y="10" width="6" height="6" fill="#0f172a" />
                <rect x="42" y="4" width="18" height="18" fill="#0f172a" />
                <rect x="45" y="7" width="12" height="12" fill="#ffffff" />
                <rect x="48" y="10" width="6" height="6" fill="#0f172a" />
                <rect x="4" y="42" width="18" height="18" fill="#0f172a" />
                <rect x="7" y="45" width="12" height="12" fill="#ffffff" />
                <rect x="10" y="48" width="6" height="6" fill="#0f172a" />
                <rect x="26" y="24" width="12" height="4" fill="#0f172a" />
                <rect x="28" y="32" width="8" height="8" fill="#0f172a" />
                <rect x="42" y="28" width="6" height="10" fill="#0f172a" />
                <rect x="26" y="46" width="6" height="12" fill="#0f172a" />
                <rect x="48" y="52" width="12" height="8" fill="#0f172a" />
              </svg>
            </div>

            <div className="text-xs space-y-1">
              <div className="font-mono font-bold text-[#1D4ED8]">
                rameshpawar.naka@upi
              </div>
              <p className="text-slate-500">
                100% direct transfer to worker · Zero platform cut
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsUpiQrModalOpen(false)}
              className="w-full py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL F: PAST BOOKINGS HISTORY & DIGITAL RECEIPT VIEW
      ===================================================================== */}
      {isBookingsModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="bookings-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#1D4ED8] flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="bookings-modal-title" className="text-sm font-semibold text-slate-900">
                    Past Bookings &amp; Digital Receipts ({bookingHistory.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click any booking to inspect its verified OTP log and zero-commission receipt
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Bookings List */}
              <div className="md:col-span-5 space-y-2">
                {bookingHistory.map((b) => {
                  const isSelected = selectedReceipt?.id === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedReceipt(b)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? 'bg-blue-50/70 border-2 border-[#1D4ED8]'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-slate-900">{b.invoiceNo}</span>
                        <span className="font-bold text-orange-700">₹{b.totalAmount}</span>
                      </div>
                      <div className="font-semibold text-slate-800">{b.serviceLabel}</div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>{b.workerName}</span>
                        <span>{b.completedAt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Digital Receipt Inspector */}
              <div className="md:col-span-7">
                {selectedReceipt ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs tabular-nums">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          PAID · 0% COMMISSION
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          Receipt #{selectedReceipt.invoiceNo} ({selectedReceipt.id})
                        </h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-orange-800 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                        {selectedReceipt.rating}.0 ★
                      </span>
                    </div>

                    <div className="space-y-1.5 text-slate-600">
                      <div className="flex justify-between">
                        <span>Service Tier</span>
                        <strong className="text-slate-900">{selectedReceipt.serviceLabel}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Assigned Professional</span>
                        <strong className="text-slate-900">{selectedReceipt.workerName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Scope Calculation</span>
                        <span className="font-mono text-slate-900">
                          {selectedReceipt.helperCount}x Worker × {selectedReceipt.durationUnits}{' '}
                          {selectedReceipt.unitLabel} (@ ₹{selectedReceipt.baseRate})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Mode</span>
                        <span className="font-mono text-slate-900">
                          {selectedReceipt.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verified Handshake OTPs</span>
                        <span className="font-mono text-slate-900">
                          Start #{selectedReceipt.startOtp} · Stop #{selectedReceipt.stopOtp}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Landmark</span>
                        <span className="text-slate-800 text-right max-w-[200px] truncate">
                          {selectedReceipt.landmark}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-slate-900">
                      <span>Total Settled Direct to Worker</span>
                      <span className="font-mono text-[#1D4ED8]">
                        ₹{selectedReceipt.totalAmount}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">
                    Select a booking on the left to inspect its digital receipt.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
