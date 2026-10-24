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
  KeyRound
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// 1. TYPES & INTERFACES
// ============================================================================

export type ActiveTab = 'customer' | 'operations';

export type ServiceCategory = 'Skilled Trades' | 'Domestic & Naka';

export type RateUnit = 'visit' | 'hr' | 'meal' | 'flat';

export interface ServiceItem {
  id: string;
  label: string;
  icon: LucideIcon;
  baseRate: number;
  rateDisplay: string;
  unit: RateUnit;
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
// 2. MOCK DATASET (10-SERVICE CATALOG & 4 INITIAL WORKERS)
// ============================================================================

export const SERVICE_CATALOG: ServiceItem[] = [
  // Skilled Trades (5)
  {
    id: 'srv-electrician',
    label: 'Electrician',
    icon: Zap,
    baseRate: 199,
    rateDisplay: '₹199',
    unit: 'visit',
    category: 'Skilled Trades',
    defaultEtaMins: 14,
    description: 'MCB faults, wiring repairs, switchboard & ceiling fan installation'
  },
  {
    id: 'srv-plumber',
    label: 'Plumber',
    icon: Wrench,
    baseRate: 199,
    rateDisplay: '₹199',
    unit: 'visit',
    category: 'Skilled Trades',
    defaultEtaMins: 14,
    description: 'Pipe leakages, tap replacement, drainage blockages & tank fitting'
  },
  {
    id: 'srv-carpenter',
    label: 'Carpenter',
    icon: Hammer,
    baseRate: 249,
    rateDisplay: '₹249',
    unit: 'visit',
    category: 'Skilled Trades',
    defaultEtaMins: 22,
    description: 'Door lock repair, hinge alignment, modular cabinet & bed assembly'
  },
  {
    id: 'srv-painter',
    label: 'Painter',
    icon: Paintbrush,
    baseRate: 299,
    rateDisplay: '₹299',
    unit: 'visit',
    category: 'Skilled Trades',
    defaultEtaMins: 25,
    description: 'Wall touch-ups, dampness waterproofing, putty & single-room coats'
  },
  {
    id: 'srv-appliance',
    label: 'Appliance Repair',
    icon: Cpu,
    baseRate: 249,
    rateDisplay: '₹249',
    unit: 'visit',
    category: 'Skilled Trades',
    defaultEtaMins: 20,
    description: 'AC servicing, washing machine, refrigerator & geyser diagnostics'
  },

  // Domestic & Naka (5)
  {
    id: 'srv-maid',
    label: 'House Maid',
    icon: Home,
    baseRate: 150,
    rateDisplay: '₹150/hr',
    unit: 'hr',
    category: 'Domestic & Naka',
    defaultEtaMins: 15,
    description: 'On-demand sweeping, mopping, utensil washing & kitchen tidy-up'
  },
  {
    id: 'srv-cook',
    label: 'Cook',
    icon: Utensils,
    baseRate: 200,
    rateDisplay: '₹200/meal',
    unit: 'meal',
    category: 'Domestic & Naka',
    defaultEtaMins: 18,
    description: 'Fresh home-style meal preparation (rotis, sabzi, dal, rice) for up to 4'
  },
  {
    id: 'srv-shifting',
    label: 'Luggage/Furniture Shifting',
    icon: Truck,
    baseRate: 180,
    rateDisplay: '₹180/hr',
    unit: 'hr',
    category: 'Domestic & Naka',
    defaultEtaMins: 19,
    description: 'Heavy appliance moving, inter-floor shifting & tempo loading toli'
  },
  {
    id: 'srv-cleaning',
    label: 'Compound/Terrace Cleaning',
    icon: Sparkles,
    baseRate: 250,
    rateDisplay: '₹250 flat',
    unit: 'flat',
    category: 'Domestic & Naka',
    defaultEtaMins: 21,
    description: 'Debris clearance, pressure washing, leaf sweeping & drain desilting'
  },
  {
    id: 'srv-loader',
    label: 'General Loader/Helper',
    icon: Package,
    baseRate: 150,
    rateDisplay: '₹150/hr',
    unit: 'hr',
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

const NAKA_HUB_OPTIONS = [
  'Station Road Chowk',
  'Bharti Park Naka',
  'Andheri East Naka #1',
  'Kurla Station Naka #3',
  'Dadar West Kabutarkhana Naka'
] as const;

const FEEDBACK_TAGS = ['Punctual', 'Clean Work', 'Polite'] as const;

// ============================================================================
// 3. MAIN COMPONENT & LIGHT GLASSMORPHIC SHELL (OCEAN BLUE PALETTE)
// ============================================================================

export default function NakaSetuApp() {
  // Global Navigation & Directory State
  const [activeTab, setActiveTab] = useState<ActiveTab>('customer');
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // --------------------------------------------------------------------------
  // VIEW 1 (Customer App View & Verified Trust Flow) State
  // --------------------------------------------------------------------------
  const [customerStep, setCustomerStep] = useState<CustomerStep>('booking');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<
    ServiceCategory | 'All'
  >('All');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-plumber');
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

  // View 1 Settlement & Two-Way Rating State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [customerRating, setCustomerRating] = useState<number>(5);
  const [selectedFeedbackTags, setSelectedFeedbackTags] = useState<string[]>([
    'Punctual',
    'Clean Work'
  ]);

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
  // Derived State
  // --------------------------------------------------------------------------
  const selectedService = useMemo(
    () =>
      SERVICE_CATALOG.find((s) => s.id === selectedServiceId) || SERVICE_CATALOG[0],
    [selectedServiceId]
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
      return matchesSearch && matchesPhone;
    });
  }, [workers, opsSearchQuery, opsPhoneFilter]);

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
    setIsMaskedCallModalOpen(false);
    setIsSosModalOpen(false);
    setIsUpiQrModalOpen(false);
    setAttachedPhoto(false);
    setUrgency('immediate');
    setPaymentMethod('upi');
    setCustomerRating(5);
    setSelectedFeedbackTags(['Punctual', 'Clean Work']);
    setCustomerStep('booking');
    showToast(
      'success',
      'Two-Way Settlement Completed',
      `₹${selectedService.baseRate} settled directly with Ramesh Pawar (${customerRating} ★). Reciprocal 5 ★ customer rating logged.`
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
      `${newAppWorker.name} (${newAppWorker.skill}) added to Live Directory with badge "App User • Digital KYC Verified".`
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

  return (
    <div className="min-h-screen bg-[#F0F9FF] text-[#0F172A] flex flex-col relative selection:bg-[#0284C7]/20 selection:text-[#0F172A]">
      {/* Subtle Light Ambient Mist */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      >
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#E0F2FE]/60 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-12 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
      </div>

      {/* =====================================================================
          GLOBAL LIGHT GLASSMORPHIC HEADER & NAVIGATION
      ===================================================================== */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-[#E0F2FE] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3.5 gap-4">
            {/* Brand Identity */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center font-bold text-base tracking-tight shrink-0 shadow-xs">
                  NS
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-lg font-bold tracking-tight text-[#0F172A] leading-none">
                      NakaSetu
                    </h1>
                    <span className="text-xs font-semibold text-[#0369A1] bg-[#E0F2FE] border border-sky-200 px-2.5 py-0.5 rounded-full">
                      30-Min SLA
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Hyperlocal Labor &amp; Service Gateway
                  </p>
                </div>
              </div>
            </div>

            {/* Center: Segmented Workspace Switcher */}
            <div
              role="tablist"
              aria-label="Workspace View Switcher"
              className="inline-flex items-center p-1 bg-[#E0F2FE]/60 border border-[#E0F2FE] rounded-2xl self-start lg:self-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'customer'}
                onClick={() => setActiveTab('customer')}
                className={`px-4 py-1.5 text-xs rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'customer'
                    ? 'bg-[#0284C7] text-white shadow-sm font-semibold'
                    : 'text-[#64748B] hover:text-[#0F172A] font-medium'
                }`}
              >
                Customer App View
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'operations'}
                onClick={() => setActiveTab('operations')}
                className={`px-4 py-1.5 text-xs rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'operations'
                    ? 'bg-[#0284C7] text-white shadow-sm font-semibold'
                    : 'text-[#64748B] hover:text-[#0F172A] font-medium'
                }`}
              >
                Field Operations &amp; Call Desk
              </button>
            </div>

            {/* Right: Frosted White "Register as a Partner / Worker" Button */}
            <div className="flex items-center gap-3 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-white hover:bg-[#E0F2FE]/50 text-[#0F172A] border border-[#E0F2FE] shadow-sm text-xs font-semibold transition-all inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <HardHat className="w-4 h-4 text-[#0284C7]" />
                <span>Register as a Partner / Worker</span>
              </button>
            </div>
          </div>
        </div>

        {/* Operational Metrics & Customer Verification Strip */}
        <div className="bg-[#F0F9FF]/90 border-t border-[#E0F2FE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[#64748B] font-medium tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#0284C7]" />
                <strong className="font-semibold text-[#0F172A]">28 Active Nearby</strong>
              </span>
              <span className="text-sky-200" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                <strong className="font-semibold text-[#0F172A]">4 Naka Hubs Online</strong>
              </span>
              <span className="text-sky-200" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                <strong className="font-semibold text-[#0F172A]">Avg Arrival: 18m</strong>
              </span>
            </div>

            {/* Customer Verified Strip (Preserved Semantic Green for Verification) */}
            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-3 py-0.5 rounded-full font-mono text-[11px] tabular-nums">
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
            className={`px-4 py-3 rounded-2xl backdrop-blur-md border flex items-center justify-between gap-3 text-xs shadow-sm ${
              toast.type === 'success'
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
                : toast.type === 'warning'
                  ? 'bg-amber-50/95 border-amber-200 text-amber-900'
                  : 'bg-white border-[#E0F2FE] text-[#0F172A]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  toast.type === 'success'
                    ? 'text-emerald-600'
                    : toast.type === 'warning'
                      ? 'text-amber-600'
                      : 'text-[#0284C7]'
                }`}
              />
              <div>
                <span className="font-bold text-[#0F172A]">{toast.title}: </span>
                <span>{toast.message}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer"
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
              <div className="bg-white border border-[#E0F2FE] shadow-sm shadow-sky-100/50 rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
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
                          <span className="text-sky-200 select-none" aria-hidden="true">
                            /
                          </span>
                        )}
                        <div
                          className={`inline-flex items-center gap-2 whitespace-nowrap ${
                            isCurrent
                              ? 'text-[#0F172A] font-bold'
                              : isPassed
                                ? 'text-emerald-700 font-semibold'
                                : 'text-[#64748B]'
                          }`}
                        >
                          <span
                            className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
                              isCurrent
                                ? 'bg-[#0284C7] text-white font-bold'
                                : isPassed
                                  ? 'bg-emerald-100/70 text-emerald-800 border border-emerald-200'
                                  : 'bg-[#F0F9FF] text-[#64748B] border border-[#E0F2FE]'
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
                    onClick={handleFinishAndReset}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Flow</span>
                  </button>
                )}
              </div>

              {/* =============================================================
                  STEP 1: 10-SERVICE CATALOG & BOOKING FORM
              ============================================================= */}
              {customerStep === 'booking' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left 7 Columns: 10 Service Tiers in White Cards */}
                  <div className="lg:col-span-7 bg-white border border-[#E0F2FE] shadow-sm shadow-sky-100/50 rounded-2xl p-5 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0F2FE]">
                      <div>
                        <h2 className="text-base font-semibold text-[#0F172A]">
                          All 10 Hyperlocal Service Tiers
                        </h2>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          Fixed base rates · Instant dispatch to smartphone partners &amp; Naka toli leads
                        </p>
                      </div>

                      {/* Segmented Category Filter */}
                      <div
                        role="tablist"
                        aria-label="Service Category Filter"
                        className="inline-flex items-center p-1 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl self-start"
                      >
                        <button
                          type="button"
                          role="tab"
                          aria-selected={selectedCategoryTab === 'All'}
                          onClick={() => handleSelectCategoryTab('All')}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                            selectedCategoryTab === 'All'
                              ? 'bg-[#0284C7] text-white shadow-sm font-semibold'
                              : 'text-[#64748B] hover:text-[#0F172A] font-medium'
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
                              ? 'bg-[#0284C7] text-white shadow-sm font-semibold'
                              : 'text-[#64748B] hover:text-[#0F172A] font-medium'
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
                              ? 'bg-[#0284C7] text-white shadow-sm font-semibold'
                              : 'text-[#64748B] hover:text-[#0F172A] font-medium'
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
                            className={`text-left p-4 rounded-2xl transition-all flex items-start justify-between gap-3 cursor-pointer ${
                              isSelected
                                ? 'bg-[#E0F2FE]/60 border-2 border-[#0284C7] shadow-md shadow-[#0284C7]/10'
                                : 'bg-white border border-[#E0F2FE] hover:border-sky-300 hover:bg-[#F0F9FF]/40 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                  isSelected
                                    ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                                    : 'bg-[#F0F9FF] text-[#0284C7] border-[#E0F2FE]'
                                }`}
                              >
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-sm text-[#0F172A] truncate">
                                  {service.label}
                                </div>
                                <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">
                                  {service.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-[11px] text-[#64748B] tabular-nums">
                                  <span>{service.category}</span>
                                  <span>·</span>
                                  <span className="text-[#0284C7] font-medium">
                                    ETA ~{service.defaultEtaMins}m
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Pricing Chip */}
                            <span
                              className={`font-mono text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 tabular-nums ${
                                isSelected
                                  ? 'bg-[#0284C7] text-white border border-[#0284C7] font-bold'
                                  : 'bg-[#E0F2FE]/70 text-[#0F172A] border border-[#E0F2FE]'
                              }`}
                            >
                              {service.rateDisplay}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right 5 Columns: Booking Configuration & Verified Trust Flow */}
                  <div className="lg:col-span-5 bg-white border border-[#E0F2FE] shadow-sm shadow-sky-100/50 rounded-2xl p-5 space-y-5">
                    <div className="pb-4 border-b border-[#E0F2FE] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-mono font-semibold text-[#64748B]">
                          DISPATCH CONFIGURATION
                        </span>
                        <h3 className="text-base font-semibold text-[#0F172A] mt-0.5">
                          {selectedService.label}
                        </h3>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#0369A1] bg-[#E0F2FE] border border-sky-200 px-3 py-1 rounded-full tabular-nums">
                        {selectedService.rateDisplay}
                      </span>
                    </div>

                    {/* Customer Verification Trust Pill Box (Semantic Green Preserved) */}
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-2.5 text-xs text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="leading-relaxed font-medium">
                        Customer Verified: Phone OTP (+91 98201 •••••) • Geo-Locked • Zero Advance Fee
                      </span>
                    </div>

                    {/* Urgency Selector */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-[#0F172A]">
                        Urgency Selector
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setUrgency('immediate')}
                          className={`p-3.5 rounded-xl text-left transition-all cursor-pointer ${
                            urgency === 'immediate'
                              ? 'bg-[#E0F2FE]/60 border-2 border-[#0284C7] shadow-sm shadow-[#0284C7]/10'
                              : 'bg-[#F0F9FF]/60 border border-[#E0F2FE] text-[#0F172A] hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-[#0284C7]" />
                              <span>Under 30 Mins</span>
                            </span>
                            <span
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                urgency === 'immediate'
                                  ? 'border-[#0284C7] bg-[#0284C7]'
                                  : 'border-sky-300 bg-white'
                              }`}
                            >
                              {urgency === 'immediate' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] mt-1">
                            Immediate 3 km radar &amp; IVR voice blast
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setUrgency('scheduled')}
                          className={`p-3.5 rounded-xl text-left transition-all cursor-pointer ${
                            urgency === 'scheduled'
                              ? 'bg-[#E0F2FE]/60 border-2 border-[#0284C7] shadow-sm shadow-[#0284C7]/10'
                              : 'bg-[#F0F9FF]/60 border border-[#E0F2FE] text-[#0F172A] hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                              <span>Scheduled</span>
                            </span>
                            <span
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                urgency === 'scheduled'
                                  ? 'border-[#0284C7] bg-[#0284C7]'
                                  : 'border-sky-300 bg-white'
                              }`}
                            >
                              {urgency === 'scheduled' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] mt-1">
                            Pre-assign a verified Naka worker or toli
                          </p>
                        </button>
                      </div>

                      {urgency === 'scheduled' && (
                        <div className="pt-1">
                          <select
                            value={scheduledSlot}
                            onChange={(e) => setScheduledSlot(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-[#E0F2FE] rounded-xl text-[#0F172A] font-medium focus:outline-none focus:border-[#0284C7]"
                          >
                            <option value="Today, 4:00 PM – 5:00 PM">
                              Today, 4:00 PM – 5:00 PM
                            </option>
                            <option value="Today, 6:00 PM – 7:00 PM">
                              Today, 6:00 PM – 7:00 PM
                            </option>
                            <option value="Tomorrow, 9:00 AM – 10:00 AM">
                              Tomorrow, 9:00 AM – 10:00 AM
                            </option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Task Note & Landmark */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="task-note-input"
                        className="block text-xs font-semibold text-[#0F172A]"
                      >
                        Task Note &amp; Landmark
                      </label>
                      <textarea
                        id="task-note-input"
                        rows={3}
                        value={taskNote}
                        onChange={(e) => setTaskNote(e.target.value)}
                        placeholder="Enter flat number, landmark, and brief task details..."
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E0F2FE] rounded-xl text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#0284C7] resize-none shadow-2xs"
                      />
                    </div>

                    {/* Simulated Photo Attachment */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#0F172A]">
                          Task Media Attachment
                        </span>
                        <button
                          type="button"
                          onClick={() => setAttachedPhoto((prev) => !prev)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E0F2FE] bg-[#F0F9FF] hover:bg-[#E0F2FE]/60 text-[#0F172A] transition-colors cursor-pointer shadow-2xs"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#0284C7]" />
                          <span>{attachedPhoto ? 'Remove Photo' : 'Attach Photo'}</span>
                        </button>
                      </div>

                      {attachedPhoto && (
                        <div className="p-2.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-lg border border-[#E0F2FE] bg-white shrink-0 overflow-hidden flex items-center justify-center">
                              <svg
                                viewBox="0 0 64 64"
                                className="w-full h-full"
                                role="img"
                                aria-label="sink_leakage.jpg preview"
                              >
                                <rect width="64" height="64" fill="#F0F9FF" />
                                <path
                                  d="M14 20 H36 V32 H50"
                                  stroke="#475569"
                                  strokeWidth="6"
                                  strokeLinecap="round"
                                  fill="none"
                                />
                                <circle cx="36" cy="26" r="5" fill="#334155" />
                                <path
                                  d="M36 36 C33 42, 39 42, 36 48"
                                  stroke="#0284c7"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  fill="none"
                                />
                                <circle cx="36" cy="53" r="2.5" fill="#0284c7" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0F172A] truncate">
                                <FileImage className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                                <span>sink_leakage.jpg</span>
                              </div>
                              <p className="text-[11px] text-[#64748B] mt-0.5">
                                1.2 MB · Attached to dispatch ticket
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAttachedPhoto(false)}
                            aria-label="Remove attached photo"
                            className="p-1 text-[#64748B] hover:text-[#0F172A] rounded cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Broadcast CTA */}
                    <div className="pt-2 border-t border-[#E0F2FE]">
                      <button
                        type="button"
                        onClick={handleBroadcastRequest}
                        className="w-full py-3 px-4 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Radio className="w-4 h-4" />
                        <span>Broadcast Request (3 km)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  STEP 2: INTERACTIVE MATCH RADAR WITH SOFT OCEAN BLUE RINGS
              ============================================================= */}
              {customerStep === 'matching' && (
                <div className="max-w-2xl mx-auto bg-white border border-[#E0F2FE] shadow-sm shadow-sky-100/50 rounded-2xl p-8 text-center space-y-6">
                  {/* Soft Radar Rings */}
                  <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-[#0284C7]/40 animate-ping opacity-40" />
                    <div className="absolute inset-4 rounded-full border border-[#0284C7]/30 bg-[#E0F2FE]/40 animate-pulse" />
                    <div className="absolute inset-10 rounded-full border border-[#E0F2FE] bg-white shadow-inner" />
                    <span className="absolute top-6 left-11 w-2.5 h-2.5 rounded-full bg-[#0284C7] shadow-xs" />
                    <span className="absolute top-12 right-7 w-2.5 h-2.5 rounded-full bg-[#0284C7] shadow-xs" />
                    <span className="absolute bottom-9 left-9 w-2.5 h-2.5 rounded-full bg-[#0F172A] shadow-xs" />
                    <span className="absolute bottom-7 right-12 w-2.5 h-2.5 rounded-full bg-[#0284C7] shadow-xs" />
                    <div className="relative w-14 h-14 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-md">
                      <Radio className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="inline-block font-mono text-[11px] font-semibold text-[#0369A1] bg-[#E0F2FE] border border-sky-200 px-3 py-1 rounded-full">
                      3 KM GEOFENCE RADAR ACTIVE
                    </span>
                    <h2 className="text-lg font-semibold text-[#0F172A]">
                      Broadcasting to 6 nearby verified workers...
                    </h2>
                    <p className="text-xs text-[#64748B] max-w-md mx-auto">
                      Pinging smartphone partners via FCM push and dialing offline Naka leads on automated bilingual IVR.
                    </p>
                  </div>

                  <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2 font-mono tabular-nums">
                    <div className="flex justify-between text-[#64748B]">
                      <span>Selected Service:</span>
                      <strong className="text-[#0F172A]">{selectedService.label}</strong>
                    </div>
                    <div className="flex justify-between text-[#64748B]">
                      <span>Locked Tariff:</span>
                      <strong className="text-[#0284C7]">{selectedService.rateDisplay}</strong>
                    </div>
                    <div className="flex justify-between text-[#64748B]">
                      <span>Urgency Window:</span>
                      <strong className="text-[#0F172A]">
                        {urgency === 'immediate' ? 'Under 30 Mins' : scheduledSlot}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  STEP 3: MATCHED WORKER CARD & DUAL START/STOP OTP DISPLAY
              ============================================================= */}
              {customerStep === 'assigned' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left 7 Columns: Matched Worker Card */}
                  <div className="lg:col-span-7 bg-white border border-[#E0F2FE] shadow-sm shadow-sky-100/50 rounded-2xl p-6 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E0F2FE]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                          Matched Worker En Route
                        </span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-[#0369A1] bg-[#E0F2FE] border border-sky-200 px-3 py-1 rounded-full tabular-nums">
                        Arriving in 14 mins
                      </span>
                    </div>

                    {/* Worker Identity */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-[#F0F9FF] border border-[#E0F2FE] flex items-center justify-center shrink-0 overflow-hidden">
                          <svg
                            viewBox="0 0 80 80"
                            className="w-full h-full"
                            role="img"
                            aria-label="Ramesh Pawar Avatar"
                          >
                            <rect width="80" height="80" fill="#E0F2FE" />
                            <circle cx="40" cy="30" r="14" fill="#0284C7" />
                            <path
                              d="M16 72 C16 54, 64 54, 64 72"
                              fill="#0F172A"
                            />
                          </svg>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg font-semibold text-[#0F172A]">
                              Ramesh Pawar
                            </h2>
                            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-amber-900 bg-amber-100/80 border border-amber-200 px-2.5 py-0.5 rounded-full tabular-nums">
                              4.9 ★
                            </span>
                          </div>
                          <p className="text-xs text-[#64748B] font-medium mt-0.5">
                            Senior {selectedService.label} · Station Road Chowk Naka
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 text-xs font-mono text-[#64748B]">
                            <Bike className="w-3.5 h-3.5 text-[#0284C7]" />
                            <span>Vehicle: MH-02-EF-4918</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsMaskedCallModalOpen(true)}
                        className="px-4 py-2.5 bg-white hover:bg-[#E0F2FE]/50 border border-[#E0F2FE] text-[#0F172A] shadow-xs text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-2 self-start sm:self-center shrink-0 cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>Call via Masked Number</span>
                      </button>
                    </div>

                    {/* Verification Badges (Semantic Green Preserved for Verification) */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Aadhaar Verified
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Police Background Checked
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F172A] bg-[#E0F2FE]/60 border border-[#E0F2FE] px-3 py-1 rounded-full font-mono tabular-nums">
                        418 Completed Jobs
                      </span>
                    </div>

                    {/* Job Context Summary */}
                    <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Service Tier</span>
                        <span className="font-semibold text-[#0F172A]">
                          {selectedService.label} ({selectedService.rateDisplay})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Landmark Note</span>
                        <span className="font-medium text-[#0F172A] text-right max-w-xs truncate">
                          {taskNote}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right 5 Columns: Dual Start/Stop OTP & Safety Controls */}
                  <div className="lg:col-span-5 bg-white border border-[#E0F2FE] shadow-sm shadow-sky-100/50 rounded-2xl p-6 space-y-5">
                    <div className="pb-3.5 border-b border-[#E0F2FE]">
                      <span className="text-[11px] font-mono font-semibold text-[#64748B]">
                        DUAL HANDSHAKE PROTOCOL
                      </span>
                      <h3 className="text-base font-semibold text-[#0F172A] mt-0.5">
                        Start &amp; Stop OTP Verification
                      </h3>
                    </div>

                    {/* Dual Start OTP & Stop OTP Display */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Start OTP */}
                      <div className="bg-[#E0F2FE]/50 border border-[#E0F2FE] rounded-xl p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1">
                            <Lock className="w-3 h-3 text-[#0284C7]" />
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
                              className="py-2 bg-white border border-sky-300 rounded-lg text-center font-mono text-base font-bold text-[#0F172A] shadow-2xs tabular-nums"
                            >
                              {digit}
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-[#64748B]">
                          Unlocks job session &amp; insurance cover
                        </p>
                      </div>

                      {/* Stop OTP */}
                      <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-[#0284C7]" />
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
                              className="py-2 bg-white border border-[#E0F2FE] rounded-lg text-center font-mono text-base font-bold text-[#0F172A] shadow-2xs tabular-nums"
                            >
                              {digit}
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-[#64748B]">
                          Share only after inspecting completed work
                        </p>
                      </div>
                    </div>

                    {/* Emergency SOS (Semantic Red Preserved) */}
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
                    <div className="pt-2 border-t border-[#E0F2FE]">
                      <button
                        type="button"
                        onClick={() => setCustomerStep('settlement')}
                        className="w-full py-3 px-4 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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
                  STEP 4: SETTLEMENT & TWO-WAY RATING RECIPROCITY
              ============================================================= */}
              {customerStep === 'settlement' && (
                <div className="max-w-3xl mx-auto bg-white border border-[#E0F2FE] shadow-sm shadow-sky-100/50 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E0F2FE]">
                    <div>
                      <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        ZERO PLATFORM COMMISSION · 100% TO WORKER
                      </span>
                      <h2 className="text-lg font-semibold text-[#0F172A] mt-2">
                        Settlement &amp; Two-Way Rating
                      </h2>
                    </div>
                    <div className="text-xs font-mono text-[#64748B] tabular-nums">
                      Invoice #INV-8841 · Worker: Ramesh Pawar
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Itemized Bill & UPI QR Modal Trigger */}
                    <div className="space-y-4">
                      <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl p-4 space-y-2.5 text-xs tabular-nums">
                        <div className="font-semibold text-[#0F172A] pb-2 border-b border-[#E0F2FE]">
                          Itemized Breakdown ({selectedService.label})
                        </div>
                        <div className="flex justify-between text-[#64748B]">
                          <span>Labor base</span>
                          <span className="font-mono font-semibold text-[#0F172A]">
                            ₹{selectedService.baseRate}
                          </span>
                        </div>
                        <div className="flex justify-between text-[#64748B]">
                          <span>Platform fee</span>
                          <span className="font-mono font-semibold text-emerald-700">
                            ₹0
                          </span>
                        </div>
                        <div className="pt-2 border-t border-[#E0F2FE] flex justify-between text-sm font-bold text-[#0F172A]">
                          <span>Total Payable</span>
                          <span className="font-mono text-[#0284C7]">
                            ₹{selectedService.baseRate}
                          </span>
                        </div>
                      </div>

                      {/* Payment Mode Toggle */}
                      <div className="space-y-2.5">
                        <label className="block text-xs font-semibold text-[#0F172A]">
                          Direct Worker Settlement Mode
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('upi')}
                            className={`py-2 px-3 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              paymentMethod === 'upi'
                                ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                                : 'bg-white text-[#0F172A] border-[#E0F2FE] hover:bg-[#F0F9FF]'
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
                                ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                                : 'bg-white text-[#0F172A] border-[#E0F2FE] hover:bg-[#F0F9FF]'
                            }`}
                          >
                            <Banknote className="w-3.5 h-3.5" />
                            <span>Cash Payment</span>
                          </button>
                        </div>

                        {paymentMethod === 'upi' ? (
                          <div className="p-4 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-16 h-16 bg-white p-1.5 border border-[#E0F2FE] rounded-lg shrink-0">
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
                                <div className="font-semibold text-[#0F172A]">
                                  rameshpawar.naka@upi
                                </div>
                                <p className="text-[11px] text-[#64748B]">
                                  Instant bank settlement + Hindi audio box alert
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsUpiQrModalOpen(true)}
                              className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#E0F2FE]/50 border border-[#E0F2FE] text-xs font-semibold text-[#0F172A] shrink-0 cursor-pointer shadow-2xs"
                            >
                              Enlarge QR
                            </button>
                          </div>
                        ) : (
                          <div className="p-4 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl text-xs space-y-1">
                            <div className="font-semibold text-[#0F172A]">
                              Hand ₹{selectedService.baseRate} Cash directly to Ramesh Pawar
                            </div>
                            <p className="text-[#64748B]">
                              Digital SMS receipt is sent automatically to both parties.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Customer Rating + Worker Rates Customer Reciprocity */}
                    <div className="space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-[#0F172A]">
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
                                      ? 'bg-amber-50 border-amber-400 text-amber-500 shadow-2xs'
                                      : 'bg-white border-[#E0F2FE] text-slate-300 hover:border-sky-300'
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
                          <label className="block text-xs font-semibold text-[#0F172A]">
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
                                      ? 'bg-[#E0F2FE] border-[#0284C7] text-[#0369A1]'
                                      : 'bg-white border-[#E0F2FE] text-[#64748B] hover:border-sky-300'
                                  }`}
                                >
                                  {isSelected ? `✓ ${tag}` : tag}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Worker Rates Customer Reciprocity Indicator */}
                        <div className="p-3.5 rounded-xl bg-[#E0F2FE]/50 border border-[#E0F2FE] space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#0F172A] inline-flex items-center gap-1.5">
                              <ArrowLeftRight className="w-3.5 h-3.5 text-[#0284C7]" />
                              Worker Rates Customer (Reciprocity Active)
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-[#0369A1]">
                              Customer Score: 4.95 ★
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] leading-relaxed">
                            Ramesh Pawar also rates your household via IVR/App on respectful conduct, accurate scope &amp; prompt settlement.
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E0F2FE]">
                        <button
                          type="button"
                          onClick={handleFinishAndReset}
                          className="w-full py-3 px-4 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Finish &amp; Reset</span>
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
              <div className="bg-white border border-[#E0F2FE] shadow-sm shadow-sky-100/50 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E0F2FE]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] border border-sky-200 text-[#0284C7] flex items-center justify-center shrink-0">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-[#0F172A]">
                        Helpline &amp; Naka Registration Desk (For Feature-Phone Workers)
                      </h2>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Fast registration for offline walk-ins and basic-phone callers with Toli capacity selector
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-[#0369A1] bg-[#E0F2FE] border border-sky-200 px-3 py-1 rounded-full self-start sm:self-center shrink-0">
                    2G Voice &amp; SMS Loop Ready
                  </span>
                </div>

                <form onSubmit={handleRegisterOfflineWorker} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div>
                      <label
                        htmlFor="enroll-name"
                        className="block text-xs font-semibold text-[#0F172A] mb-1"
                      >
                        Worker Name
                      </label>
                      <input
                        id="enroll-name"
                        type="text"
                        value={enrollName}
                        onChange={(e) => setEnrollName(e.target.value)}
                        placeholder="e.g. Govind Kale"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E0F2FE] rounded-xl text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="enroll-phone"
                        className="block text-xs font-semibold text-[#0F172A] mb-1"
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
                        className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E0F2FE] rounded-xl text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="enroll-skill"
                        className="block text-xs font-semibold text-[#0F172A] mb-1"
                      >
                        Skill Dropdown (All 10 Services)
                      </label>
                      <select
                        id="enroll-skill"
                        value={enrollSkillId}
                        onChange={(e) => setEnrollSkillId(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E0F2FE] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
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
                        className="block text-xs font-semibold text-[#0F172A] mb-1"
                      >
                        Base Naka / Hub
                      </label>
                      <select
                        id="enroll-hub"
                        value={enrollHub}
                        onChange={(e) => setEnrollHub(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E0F2FE] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
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
                        className="block text-xs font-semibold text-[#0F172A] mb-1"
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
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E0F2FE] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                      >
                        <option value="Solo">Solo</option>
                        <option value="Group of 2">Group of 2</option>
                        <option value="Group of 3-4 Helpers">Group of 3-4 Helpers</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E0F2FE]">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-[#0F172A] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={enrollPhysicalVerified}
                        onChange={(e) => setEnrollPhysicalVerified(e.target.checked)}
                        className="w-4 h-4 rounded border-[#E0F2FE] text-[#0284C7] focus:ring-[#0284C7]"
                      />
                      <span>Physical ID inspected at Naka drive</span>
                    </label>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium rounded-xl transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
                    >
                      <span>+ Register Offline Worker</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* =============================================================
                  2. LIVE WORKER DIRECTORY TABLE (APP + FEATURE-PHONE WORKERS)
              ============================================================= */}
              <div className="bg-white border border-[#E0F2FE] shadow-sm shadow-sky-100/50 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-[#E0F2FE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-[#0F172A]">
                      Live Worker Directory ({filteredWorkers.length})
                    </h2>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Unified roster showing online Smartphone App partners and offline Feature-Phone / Naka workers
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search worker, trade, naka..."
                        value={opsSearchQuery}
                        onChange={(e) => setOpsSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E0F2FE] rounded-xl text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>
                    <div className="inline-flex items-center p-1 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl">
                      {(['All', 'App', 'Feature Phone'] as const).map((pt) => (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => setOpsPhoneFilter(pt)}
                          className={`px-2.5 py-1 text-xs rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                            opsPhoneFilter === pt
                              ? 'bg-[#0284C7] text-white shadow-xs font-semibold'
                              : 'text-[#64748B] hover:text-[#0F172A] font-medium'
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

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E0F2FE] bg-[#F0F9FF] text-[11px] font-semibold text-[#64748B]">
                        <th className="py-3 px-4">Worker Details</th>
                        <th className="py-3 px-4">Primary Skill</th>
                        <th className="py-3 px-4">Device Type</th>
                        <th className="py-3 px-4">Group Size</th>
                        <th className="py-3 px-4">Verification Status</th>
                        <th className="py-3 px-4">Current Availability</th>
                        <th className="py-3 px-4 text-right">Dispatch Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0F2FE] text-xs tabular-nums">
                      {filteredWorkers.map((worker) => (
                        <tr key={worker.id} className="hover:bg-[#F0F9FF]/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-[#0F172A]">{worker.name}</div>
                            <div className="text-[11px] font-mono text-[#64748B] mt-0.5">
                              {worker.id} · {worker.phone} · {worker.hubLocation}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium text-[#0F172A]">{worker.skill}</div>
                            <div className="text-[11px] font-mono text-amber-700 font-medium">
                              ★ {worker.rating.toFixed(1)} ({worker.completedJobs} jobs)
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#0F172A] whitespace-nowrap">
                              {worker.phoneType === 'App' ? (
                                <>
                                  <Smartphone className="w-3.5 h-3.5 text-[#0284C7]" />
                                  <span>App User</span>
                                </>
                              ) : (
                                <>
                                  <Phone className="w-3.5 h-3.5 text-[#64748B]" />
                                  <span>Feature Phone / Helpline</span>
                                </>
                              )}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-medium text-[#0F172A] whitespace-nowrap">
                            {worker.groupSizeDisplay}
                          </td>

                          {/* Verification Badges (Semantic Green Preserved) */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {worker.verificationBadges.map((badge) => (
                                <span
                                  key={badge}
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2.5 py-0.5 rounded-full whitespace-nowrap"
                                >
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Semantic Status Colours Preserved */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                worker.status === 'Available'
                                  ? 'text-emerald-800 bg-emerald-100/70 border border-emerald-200'
                                  : 'text-amber-800 bg-amber-100/80 border border-amber-200'
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
                                className="px-3 py-1.5 bg-white hover:bg-[#E0F2FE]/50 border border-[#E0F2FE] text-[#0F172A] shadow-2xs text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                              >
                                <PhoneCall className="w-3.5 h-3.5 text-[#0284C7]" />
                                <span>Simulate Outbound Voice Call (IVR)</span>
                              </button>
                            ) : (
                              <span className="text-[11px] font-mono text-[#0284C7] font-medium">
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
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#E0F2FE] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-[#E0F2FE]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] border border-sky-200 text-[#0284C7] flex items-center justify-center shrink-0">
                  <HardHat className="w-4 h-4 text-[#0284C7]" />
                </div>
                <div>
                  <h3 id="partner-modal-title" className="text-sm font-semibold text-[#0F172A]">
                    Smartphone Partner Self-Registration
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Instant Digital KYC onboarding into NakaSetu Live Dispatch Directory
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(false)}
                className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer"
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
                    className="block text-xs font-semibold text-[#0F172A] mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="partner-name"
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="e.g. Vikramaditya More"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E0F2FE] rounded-xl text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="partner-phone"
                    className="block text-xs font-semibold text-[#0F172A] mb-1"
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
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E0F2FE] rounded-xl text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="partner-trade"
                    className="block text-xs font-semibold text-[#0F172A] mb-1"
                  >
                    Primary Trade
                  </label>
                  <select
                    id="partner-trade"
                    value={partnerTradeId}
                    onChange={(e) => setPartnerTradeId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E0F2FE] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
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
                    className="block text-xs font-semibold text-[#0F172A] mb-1"
                  >
                    Base Locality
                  </label>
                  <select
                    id="partner-locality"
                    value={partnerLocality}
                    onChange={(e) => setPartnerLocality(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E0F2FE] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
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
                <label className="block text-xs font-semibold text-[#0F172A]">
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
                          ? 'bg-[#E0F2FE]/60 border-2 border-[#0284C7] text-[#0F172A] shadow-xs'
                          : 'bg-[#F0F9FF] border border-[#E0F2FE] text-[#0F172A] hover:bg-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* ID & Certification Mock File Uploader */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0F172A]">
                  ID &amp; Certification Upload
                </label>
                <div className="p-3.5 rounded-xl bg-[#F0F9FF] border border-dashed border-sky-300 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs">
                    {partnerKycUploaded ? (
                      <>
                        <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-mono font-semibold text-[#0F172A]">
                            aadhaar_trade_cert_verified.pdf
                          </div>
                          <div className="text-[11px] text-[#64748B]">
                            Digital KYC checksum verified
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-[#64748B] shrink-0" />
                        <span className="text-[#64748B]">
                          Upload Aadhaar / ITI Trade Certificate
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPartnerKycUploaded((prev) => !prev)}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#E0F2FE]/50 border border-[#E0F2FE] text-xs font-semibold text-[#0F172A] cursor-pointer shrink-0 shadow-2xs"
                  >
                    {partnerKycUploaded ? 'Replace File' : 'Upload File'}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E0F2FE]">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium rounded-xl transition-all cursor-pointer shadow-sm"
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
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#E0F2FE] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-[#E0F2FE]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] border border-sky-200 text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
                  <Volume2 className="w-4 h-4 text-[#0284C7]" />
                </div>
                <div>
                  <h3 id="ivr-modal-title" className="text-sm font-semibold text-[#0F172A]">
                    Automated Voice Dispatch System (Simulated Call to +91 98201 XXXXX)
                  </h3>
                  <p className="text-xs text-[#64748B] font-mono mt-0.5">
                    Dialing: {ivrTargetWorker.name} ({ivrTargetWorker.phone}) · {ivrTargetWorker.hubLocation}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIvrTargetWorker(null)}
                className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer"
                aria-label="Close IVR modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                <span>BILINGUAL CALL AUDIO SCRIPT (2G VOICE)</span>
                <span className="text-[#0284C7] font-semibold">LIVE AUDIO STREAM</span>
              </div>
              <blockquote className="text-sm font-medium text-[#0F172A] leading-relaxed">
                &ldquo;Namaste Suresh ji. 1.2 km door luggage shifting ke liye 2 workers ki zaroorat hai. Budget ₹360. Kaam accept karne ke liye 1 dabayein, mana karne ke liye 2 dabayein.&rdquo;
              </blockquote>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Interactive Feature-Phone Keypad Response:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleIvrKeyPress('1')}
                  className="py-2.5 px-4 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Press 1 to Accept</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleIvrKeyPress('2')}
                  className="py-2.5 px-4 bg-white hover:bg-[#F0F9FF] text-[#0F172A] border border-[#E0F2FE] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
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
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#E0F2FE] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0F2FE]">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#0284C7]" />
                <h3 id="masked-call-title" className="text-sm font-semibold text-[#0F172A]">
                  Masked Number Proxy Line
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMaskedCallModalOpen(false)}
                className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl text-center space-y-2">
              <div className="text-xs font-mono font-semibold text-[#0284C7]">
                Connecting securely via proxy line...
              </div>
              <div className="text-sm font-bold text-[#0F172A]">
                Ramesh Pawar (+91 22-4890-7712)
              </div>
              <p className="text-xs text-[#64748B]">
                Both customer and worker phone numbers remain anonymized.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsMaskedCallModalOpen(false)}
                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium rounded-xl transition-all cursor-pointer shadow-xs"
              >
                End Proxy Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL D: EMERGENCY SOS MODAL (SEMANTIC RED PRESERVED)
      ===================================================================== */}
      {isSosModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sos-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white border border-red-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0F2FE]">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <h3 id="sos-modal-title" className="text-sm font-semibold">
                  Emergency SOS Broadcast Active
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSosModalOpen(false)}
                className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer"
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
                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
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
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#E0F2FE] rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0F2FE]">
              <h3 id="upi-qr-modal-title" className="text-sm font-semibold text-[#0F172A]">
                Direct Worker UPI QR (₹{selectedService.baseRate})
              </h3>
              <button
                type="button"
                onClick={() => setIsUpiQrModalOpen(false)}
                className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-44 h-44 mx-auto bg-white p-3 border border-[#E0F2FE] rounded-2xl shadow-2xs">
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
              <div className="font-mono font-bold text-[#0369A1]">
                rameshpawar.naka@upi
              </div>
              <p className="text-[#64748B]">
                100% direct transfer to worker · Zero platform cut
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsUpiQrModalOpen(false)}
              className="w-full py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-medium rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
