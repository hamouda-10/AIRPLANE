export type Lang = 'en' | 'ar';
export type RuqaaStyle = 'classic' | 'ink' | 'amiri';

export const SCENE_LAYERS = {
  sky: 'https://raft-blast-61784561.figma.site/_assets/v11/16b5007d9c93971e26ffe4e0e3e37946f6bd538c.png',
  backFour: 'https://raft-blast-61784561.figma.site/_assets/v11/8a7f8af50e0ce92ec2e228e7b0b4112178c51cf1.png',
  bazaar: 'https://raft-blast-61784561.figma.site/_assets/v11/864afe00e41e2fa20a5aa546e15cb807e0f81384.png',
  splitLeft: 'https://raft-blast-61784561.figma.site/_assets/v11/7536d7b60a1fce482cf6edf3f0bffd3bad5d0f8a.png',
  splitRight: 'https://raft-blast-61784561.figma.site/_assets/v11/392db6a6a6b98e868bd7f8d3f55bb719d51e5028.png',
  bridge: 'https://raft-blast-61784561.figma.site/_assets/v11/c6a6d8ef49bca43f708aa852692942c45ec950d4.png',
  frameTwo: 'https://raft-blast-61784561.figma.site/_assets/v11/ba75252bab2b1c510987b74837770f7bc8a6b2d4.png',
} as const;

export const SIGHT_ICONS = {
  icon1: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230438_d526b8b6-8a2e-4e3b-9993-3908acae03a7.png',
  icon2: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230442_140bc25b-b165-4249-904a-f708bff6970e.png',
  icon3: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230448_825949c9-ccdb-4857-b4a6-e349eccc9010.png',
} as const;

export const AVIATION_ASSETS = {
  // User's studio-clean transparent PNG of the Emirates aircraft flying across the sky after the bridge
  emiratesCutout: '/assets/aistudio/photo-1720463698294-7acd5f27112c_1d1caacb.png',
  // Small private jets & luxury cabin interiors available for charter
  airstairWalnut: '/assets/aistudio/image_2b8be996.png',
  midsizeTarmac: '/assets/aistudio/image_6f3d61b4.png',
  tarmacAstonVip: '/assets/aistudio/image_b95196a9.png',
  gulfstreamSunset: '/assets/aistudio/image_961663ed.png',
  falconTrijet: '/assets/aistudio/image_42f2495e.png',
  learjetDusk: '/assets/aistudio/image_da33ce14.png',
  cabinDining: '/assets/aistudio/image_44c3081b.png',
  gulfstreamTwilight: '/assets/aistudio/image_ffd125a8.png',
  cabinCockpitView: '/assets/aistudio/image_b6fb3ebe.png',
} as const;

export interface HighlightCardData {
  id: string;
  image: string;
  pin: string;
  aircraftId: string;
  en: {
    ariaLabel: string;
    kicker: string;
    title: string;
    description: string;
    detailNote: string;
    arrivalTip: string;
  };
  ar: {
    ariaLabel: string;
    kicker: string;
    title: string;
    description: string;
    detailNote: string;
    arrivalTip: string;
  };
}

export const CHARTER_HIGHLIGHTS: HighlightCardData[] = [
  {
    id: 'gulfstream-g650er',
    image: AVIATION_ASSETS.gulfstreamSunset,
    pin: SIGHT_ICONS.icon1,
    aircraftId: 'gulfstream-g650er',
    en: {
      ariaLabel: 'Open Gulfstream G650ER card',
      kicker: 'Ultra-Long Range',
      title: 'Gulfstream G650ER',
      description: 'Non-stop intercontinental reach from Dubai to New York or Tokyo.',
      detailNote:
        'Panoramic oval windows, 100% fresh cabin air refreshed every two minutes, and ultra-quiet four-zone living space engineered for effortless 14-hour crossings.',
      arrivalTip: 'Positioned in Dubai (DXB), London (FAB), and Geneva (GVA) for 4-hour dispatch.',
    },
    ar: {
      ariaLabel: 'فتح بطاقة غلف ستريم G650ER',
      kicker: 'مدى فائق الطول',
      title: 'غلف ستريم G650ER',
      description: 'رحلات عابرة للقارات دون توقف من دبي إلى نيويورك أو طوكيو.',
      detailNote:
        'نوافذ بانورامية بيضاوية، وتجديد هواء نقي بنسبة ١٠٠٪ كل دقيقتين، ومقصورة فاخرة بأربع مناطق معيشة هادئة لرحلات تتجاوز ١٤ ساعة.',
      arrivalTip: 'جاهزة للإقلاع الفوري خلال ٤ ساعات من دبي (DXB) ولندن (FAB) وجنيف (GVA).',
    },
  },
  {
    id: 'falcon-900lx',
    image: AVIATION_ASSETS.falconTrijet,
    pin: SIGHT_ICONS.icon2,
    aircraftId: 'falcon-900lx',
    en: {
      ariaLabel: 'Open Dassault Falcon 900LX card',
      kicker: 'Heavy Tri-Jet',
      title: 'Dassault Falcon 900LX',
      description: 'Tri-engine Alpine and Mediterranean precision with short-runway access.',
      detailNote:
        'Signature French tri-jet architecture delivers steep approach performance into Aspen, St. Moritz, and coastal Riviera fields with zero compromise on cabin volume.',
      arrivalTip: 'Direct ramp boarding with integrated airstair and private luggage hold.',
    },
    ar: {
      ariaLabel: 'فتح بطاقة داسو فالكون 900LX',
      kicker: 'ثلاثية المحركات',
      title: 'داسو فالكون 900LX',
      description: 'أداء ثلاثي المحركات للهبوط في المطارات الجبلية والساحلية القصيرة.',
      detailNote:
        'تصميم فرنسي متفرد بثلاثة محركات يمنح قدرة استثنائية على الوصول لمطارات جبال الألب والريفييرا مع مقصورة واسعة ورحبة.',
      arrivalTip: 'صعود مباشر عبر السلم المدمج مع صالة أمتعة خاصة وفورية.',
    },
  },
  {
    id: 'tarmac-chauffeur',
    image: AVIATION_ASSETS.tarmacAstonVip,
    pin: SIGHT_ICONS.icon3,
    aircraftId: 'challenger-650',
    en: {
      ariaLabel: 'Open Challenger 650 card',
      kicker: 'Tarmac VIP',
      title: 'Challenger 650',
      description: 'Car-to-cabin tarmac boarding with full stand-up widebody comfort.',
      detailNote:
        'Skip every commercial terminal. Your chauffeur pulls directly beside the airstair for 90-second departure clearance across 180+ countries.',
      arrivalTip: 'Includes coordinated luxury tarmac transfer at origin and destination.',
    },
    ar: {
      ariaLabel: 'فتح بطاقة تشالنجر 650',
      kicker: 'صعود مباشر للمدرج',
      title: 'بومباردييه تشالنجر 650',
      description: 'انتقال مباشر من السيارة الفارهة إلى سلم الطائرة دون صالات انتظار.',
      detailNote:
        'تجاوز مباني المطار كلياً؛ تصل سيارتك الخاصة إلى جانب سلم الطائرة لتقلع خلال ٩٠ ثانية نحو أكثر من ١٨٠ دولة حول العالم.',
      arrivalTip: 'تشمل الخدمة تنسيق سيارات فاخرة على المدرج في المغادرة والوصول.',
    },
  },
  {
    id: 'bespoke-cabin',
    image: AVIATION_ASSETS.cabinDining,
    pin: SIGHT_ICONS.icon1,
    aircraftId: 'citation-latitude',
    en: {
      ariaLabel: 'Open Citation Latitude card',
      kicker: 'Super-Midsize',
      title: 'Citation Latitude',
      description: 'Hand-stitched cream leather club seating, walnut entry, and fine dining.',
      detailNote:
        'Every flight features tailored culinary service, private Wi-Fi, acoustic insulation, and lie-flat berthing configured to your manifest.',
      arrivalTip: 'Custom Halal fine dining and specialty Arabic coffee curated onboard.',
    },
    ar: {
      ariaLabel: 'فتح بطاقة سايتيشن لاتيتيود',
      kicker: 'متوسطة فائقة',
      title: 'سايتيشن لاتيتيود',
      description: 'مدخل بخشب الجوز الطبيعي ومقاعد جلدية مخيطة يدوياً وضيافة فاخرة.',
      detailNote:
        'تجهيز كل رحلة بقوائم طعام منتقاة، وإنترنت فضائي سريع، وعزل صوتي فائق مع أسرّة مسطحة مريحة للنوم.',
      arrivalTip: 'مأدبة عربية حلال فاخرة وقهوة عربية مختصة تُحضر طازجة على متن الرحلة.',
    },
  },
  {
    id: 'learjet-express',
    image: AVIATION_ASSETS.learjetDusk,
    pin: SIGHT_ICONS.icon2,
    aircraftId: 'learjet-75',
    en: {
      ariaLabel: 'Open Learjet 75 Liberty card',
      kicker: 'Light Express',
      title: 'Learjet 75 Liberty',
      description: 'Agile high-speed regional hops ready for night and dusk departures.',
      detailNote:
        'Cruising above commercial traffic at 51,000 feet with flat-floor legroom and rapid 2-hour regional turnaround.',
      arrivalTip: 'Ideal for Gulf, Mediterranean, and European point-to-point missions.',
    },
    ar: {
      ariaLabel: 'فتح بطاقة ليرجيت 75 ليبرتي',
      kicker: 'نفاثة خفيفة سريعة',
      title: 'ليرجيت 75 ليبرتي',
      description: 'سرعة ورشاقة فائقة للرحلات الإقليمية والانطلاق الليلي الفوري.',
      detailNote:
        'تحلق فوق حركة الطيران التجاري على ارتفاع ٥١ ألف قدم مع أرضية مسطحة وجاهزية إقلاع خلال ساعتين.',
      arrivalTip: 'مثالية للتنقل السريع بين مدن الخليج وأوروبا والبحر المتوسط.',
    },
  },
];

export type AircraftCategory = 'all' | 'ultra' | 'heavy' | 'supermid' | 'light';

export interface AircraftSpec {
  id: string;
  category: Exclude<AircraftCategory, 'all'>;
  exteriorImage: string;
  cabinImage: string;
  rangeNm: number;
  rangeKm: number;
  cruiseKmh: number;
  mach: string;
  passengers: number;
  hourlyRateUsd: number;
  cabinHeightM: string;
  cabinLengthM: string;
  liveryHex: string;
  en: {
    name: string;
    manufacturer: string;
    tag: string;
    base: string;
    description: string;
    highlights: string[];
  };
  ar: {
    name: string;
    manufacturer: string;
    tag: string;
    base: string;
    description: string;
    highlights: string[];
  };
}

// All 9 uploaded small private jet & cabin photos power the charter fleet
export const AIRCRAFT_FLEET: AircraftSpec[] = [
  {
    id: 'gulfstream-g650er',
    category: 'ultra',
    exteriorImage: AVIATION_ASSETS.gulfstreamSunset,
    cabinImage: AVIATION_ASSETS.cabinDining,
    rangeNm: 7500,
    rangeKm: 13890,
    cruiseKmh: 956,
    mach: '0.90',
    passengers: 14,
    hourlyRateUsd: 12400,
    cabinHeightM: '1.91 m',
    cabinLengthM: '14.27 m',
    liveryHex: '#c8a464',
    en: {
      name: 'Gulfstream G650ER',
      manufacturer: 'Gulfstream Aerospace',
      tag: 'Ultra-Long Range',
      base: 'Dubai (DXB) · London (FAB) · New York (TEB)',
      description:
        'Flagship intercontinental twin-jet with 16 signature oval windows, private forward/aft staterooms, and non-stop range connecting any two global capitals.',
      highlights: ['16 Panoramic Windows', 'Non-Stop Global Range', 'Mach 0.90 High-Speed'],
    },
    ar: {
      name: 'غلف ستريم G650ER',
      manufacturer: 'غلف ستريم للطيران',
      tag: 'مدى فائق الطول',
      base: 'دبي (DXB) · لندن (FAB) · نيويورك (TEB)',
      description:
        'أيقونة الرحلات العابرة للقارات بست عشرة نافذة بانورامية وأجنحة نوم مستقلة ومدى طيران يربط عواصم العالم دون توقف.',
      highlights: ['١٦ نافذة بانورامية', 'رحلات عابرة للقارات', 'سرعة ماخ ٠.٩٠'],
    },
  },
  {
    id: 'gulfstream-g550-twilight',
    category: 'ultra',
    exteriorImage: AVIATION_ASSETS.gulfstreamTwilight,
    cabinImage: AVIATION_ASSETS.cabinCockpitView,
    rangeNm: 6750,
    rangeKm: 12501,
    cruiseKmh: 904,
    mach: '0.88',
    passengers: 16,
    hourlyRateUsd: 10800,
    cabinHeightM: '1.88 m',
    cabinLengthM: '13.39 m',
    liveryHex: '#4f7a9a',
    en: {
      name: 'Gulfstream G550 Executive',
      manufacturer: 'Gulfstream Aerospace',
      tag: 'Ultra-Long Range',
      base: 'Geneva (GVA) · Riyadh (RUH) · Tokyo (HND)',
      description:
        'Proven long-range executive transport configured for 16 passengers with dual lavatories, satellite office suite, and 6-bed overnight sleeping layout.',
      highlights: ['14-Hour Endurance', '6 Lie-Flat Berths', 'Ka-Band Wi-Fi'],
    },
    ar: {
      name: 'غلف ستريم G550 التنفيذية',
      manufacturer: 'غلف ستريم للطيران',
      tag: 'مدى فائق الطول',
      base: 'جنيف (GVA) · الرياض (RUH) · طوكيو (HND)',
      description:
        'طائرة تنفيذية بعيدة المدى تتسع لـ ١٦ راكباً مع مكتب اجتماعات جوي و٦ أسرّة فاخرة للرحلات الليلية الطويلة.',
      highlights: ['طيران متواصل ١٤ ساعة', '٦ أسرّة نوم فاخرة', 'إنترنت فضائي سريع'],
    },
  },
  {
    id: 'falcon-900lx',
    category: 'heavy',
    exteriorImage: AVIATION_ASSETS.falconTrijet,
    cabinImage: AVIATION_ASSETS.cabinDining,
    rangeNm: 4750,
    rangeKm: 8800,
    cruiseKmh: 900,
    mach: '0.85',
    passengers: 14,
    hourlyRateUsd: 9800,
    cabinHeightM: '1.88 m',
    cabinLengthM: '10.11 m',
    liveryHex: '#b44c4c',
    en: {
      name: 'Dassault Falcon 900LX',
      manufacturer: 'Dassault Aviation',
      tag: 'Heavy Tri-Jet',
      base: 'Paris (LBG) · Nice (NCE) · Dubai (DWC)',
      description:
        'Three-engine French engineering built for steep approaches into St. Moritz, Lugano, and Aspen while preserving three separate lounge zones.',
      highlights: ['3-Engine Alpine Access', 'Short-Runway Mastery', '52 dB Whisper Cabin'],
    },
    ar: {
      name: 'داسو فالكون 900LX',
      manufacturer: 'داسو للطيران الفرنسية',
      tag: 'طائرة ثقيلة ثلاثية المحركات',
      base: 'باريس (LBG) · نيس (NCE) · دبي (DWC)',
      description:
        'هندسة فرنسية بثلاثة محركات تمنح قدرة الهبوط في المدارج القصيرة والجبلية مثل سانت موريتز ونيس مع ثلاث مناطق جلوس.',
      highlights: ['أمان ثلاثي المحركات', 'مدارج جبلية قصيرة', 'هدوء فائق ٥٢ ديسيبل'],
    },
  },
  {
    id: 'challenger-650',
    category: 'heavy',
    exteriorImage: AVIATION_ASSETS.tarmacAstonVip,
    cabinImage: AVIATION_ASSETS.cabinCockpitView,
    rangeNm: 4000,
    rangeKm: 7408,
    cruiseKmh: 870,
    mach: '0.82',
    passengers: 12,
    hourlyRateUsd: 8900,
    cabinHeightM: '1.85 m',
    cabinLengthM: '7.80 m',
    liveryHex: '#a33b3b',
    en: {
      name: 'Bombardier Challenger 650',
      manufacturer: 'Bombardier',
      tag: 'Heavy Widebody',
      base: 'London (FAB) · Dubai (DXB) · Miami (MIA)',
      description:
        'Wide-cabin versatility paired with seamless tarmac chauffeur boarding and spacious baggage access for multi-city executive tours.',
      highlights: ['Widest Heavy Cabin', 'Tarmac Chauffeur Ready', 'Full Hot Galley'],
    },
    ar: {
      name: 'بومباردييه تشالنجر 650',
      manufacturer: 'بومباردييه الكندية',
      tag: 'ثقيلة واسعة المقصورة',
      base: 'لندن (FAB) · دبي (DXB) · ميامي (MIA)',
      description:
        'مقصورة عريضة استثنائية مع خدمة التوصيل المباشر إلى سلم الطائرة ومطبخ متكامل للجولات التنفيذية متعددة الوجهات.',
      highlights: ['أعرض مقصورة بفئتها', 'استقبال على المدرج', 'مطبخ متكامل ساخن'],
    },
  },
  {
    id: 'citation-latitude',
    category: 'supermid',
    exteriorImage: AVIATION_ASSETS.airstairWalnut,
    cabinImage: AVIATION_ASSETS.cabinDining,
    rangeNm: 2700,
    rangeKm: 5000,
    cruiseKmh: 826,
    mach: '0.80',
    passengers: 9,
    hourlyRateUsd: 6200,
    cabinHeightM: '1.83 m',
    cabinLengthM: '6.63 m',
    liveryHex: '#9d7c46',
    en: {
      name: 'Cessna Citation Latitude',
      manufacturer: 'Textron Aviation',
      tag: 'Super-Midsize',
      base: 'Geneva (GVA) · Riyadh (RUH) · Paris (LBG)',
      description:
        'Hand-finished walnut airstair entry, flat-floor stand-up interior, and low cabin altitude designed for fresh arrival across regional capitals.',
      highlights: ['Walnut Entry Craft', 'Flat-Floor Stand-Up', 'Rapid Turnaround'],
    },
    ar: {
      name: 'سيسنا سايتيشن لاتيتيود',
      manufacturer: 'تكسترون للطيران',
      tag: 'متوسطة فائقة الأداء',
      base: 'جنيف (GVA) · الرياض (RUH) · باريس (LBG)',
      description:
        'مدخل فاخر مكسو بخشب الجوز الطبيعي وأرضية مسطحة بارتفاع مريح للوقوف وضغط مقصورة منخفض لرحلات إقليمية مريحة.',
      highlights: ['تشطيبات خشب الجوز', 'أرضية مسطحة رحبة', 'جاهزية إقلاع سريعة'],
    },
  },
  {
    id: 'hawker-850xp',
    category: 'supermid',
    exteriorImage: AVIATION_ASSETS.midsizeTarmac,
    cabinImage: AVIATION_ASSETS.cabinCockpitView,
    rangeNm: 2642,
    rangeKm: 4893,
    cruiseKmh: 830,
    mach: '0.80',
    passengers: 9,
    hourlyRateUsd: 5400,
    cabinHeightM: '1.75 m',
    cabinLengthM: '6.50 m',
    liveryHex: '#6d8ba3',
    en: {
      name: 'Hawker 850XP Executive',
      manufacturer: 'Hawker Beechcraft',
      tag: 'Midsize Jet',
      base: 'London (FAB) · Nice (NCE) · Doha (DOH)',
      description:
        'Reliable midsize workhorse featuring winglet performance, generous club-four seating, and agile dispatch across Europe and the Middle East.',
      highlights: ['Club-Four Conference', '3-Hour Dispatch', 'Mediterranean Range'],
    },
    ar: {
      name: 'هوكر 850XP التنفيذية',
      manufacturer: 'هوكر بيتشكرافت',
      tag: 'متوسطة الحجم',
      base: 'لندن (FAB) · نيس (NCE) · الدوحة (DOH)',
      description:
        'طائرة أعمال متوسطة الحجم بأجنحة محسّنة ومقاعد اجتماعات رباعية وجاهزية إقلاع سريعة بين مدن أوروبا والشرق الأوسط.',
      highlights: ['مقاعد اجتماعات رباعية', 'إقلاع خلال ٣ ساعات', 'مثالية للبحر المتوسط'],
    },
  },
  {
    id: 'learjet-75',
    category: 'light',
    exteriorImage: AVIATION_ASSETS.learjetDusk,
    cabinImage: AVIATION_ASSETS.cabinCockpitView,
    rangeNm: 2080,
    rangeKm: 3852,
    cruiseKmh: 860,
    mach: '0.81',
    passengers: 8,
    hourlyRateUsd: 4950,
    cabinHeightM: '1.50 m',
    cabinLengthM: '6.04 m',
    liveryHex: '#d49a4c',
    en: {
      name: 'Learjet 75 Liberty',
      manufacturer: 'Bombardier Learjet',
      tag: 'Light Express Jet',
      base: 'Dubai (DXB) · Riyadh (RUH) · Los Angeles (LAX)',
      description:
        'High-speed light jet built for instant point-to-point missions with executive legroom, dusk/night capability, and 51,000-ft cruise ceiling.',
      highlights: ['51,000 ft Ceiling', '2-Hour Dispatch', 'Executive Legroom'],
    },
    ar: {
      name: 'ليرجيت 75 ليبرتي',
      manufacturer: 'بومباردييه ليرجيت',
      tag: 'نفاثة خفيفة سريعة',
      base: 'دبي (DXB) · الرياض (RUH) · لوس أنجلوس (LAX)',
      description:
        'نفاثة خفيفة فائقة السرعة للمهام العاجلة والانطلاق الليلي مع مساحة رحبة للأقدام وسقف تحليق يصل إلى ٥١ ألف قدم.',
      highlights: ['ارتفاع ٥١,٠٠٠ قدم', 'إقلاع خلال ساعتين', 'مساحة رحبة للأقدام'],
    },
  },
];

export interface AirportHub {
  code: string;
  lat: number;
  lon: number;
  en: {
    city: string;
    airport: string;
    region: string;
  };
  ar: {
    city: string;
    airport: string;
    region: string;
  };
}

export const GLOBAL_AIRPORTS: AirportHub[] = [
  {
    code: 'DXB',
    lat: 25.2532,
    lon: 55.3657,
    en: { city: 'Dubai', airport: 'Dubai Executive Terminal (DXB / DWC)', region: 'Middle East' },
    ar: { city: 'دبي', airport: 'صالة كبار الشخصيات — دبي (DXB / DWC)', region: 'الشرق الأوسط' },
  },
  {
    code: 'RUH',
    lat: 24.9576,
    lon: 46.6988,
    en: { city: 'Riyadh', airport: 'King Khalid Executive Terminal (RUH)', region: 'Middle East' },
    ar: { city: 'الرياض', airport: 'الصالة التنفيذية — الرياض (RUH)', region: 'الشرق الأوسط' },
  },
  {
    code: 'AUH',
    lat: 24.433,
    lon: 54.6511,
    en: { city: 'Abu Dhabi', airport: 'Al Bateen Executive (AZI)', region: 'Middle East' },
    ar: { city: 'أبوظبي', airport: 'مطار البطين التنفيذي (AZI)', region: 'الشرق الأوسط' },
  },
  {
    code: 'DOH',
    lat: 25.2731,
    lon: 51.6081,
    en: { city: 'Doha', airport: 'Hamad Executive FBO (DOH)', region: 'Middle East' },
    ar: { city: 'الدوحة', airport: 'صالة الطيران الخاص — الدوحة (DOH)', region: 'الشرق الأوسط' },
  },
  {
    code: 'FAB',
    lat: 51.2758,
    lon: -0.7763,
    en: { city: 'London', airport: 'Farnborough Private Airport (FAB)', region: 'Europe' },
    ar: { city: 'لندن', airport: 'مطار فارنبورو الخاص (FAB)', region: 'أوروبا' },
  },
  {
    code: 'GVA',
    lat: 46.2381,
    lon: 6.1089,
    en: { city: 'Geneva', airport: 'Geneva Private Aviation (GVA)', region: 'Europe' },
    ar: { city: 'جنيف', airport: 'مطار جنيف للطيران الخاص (GVA)', region: 'أوروبا' },
  },
  {
    code: 'LBG',
    lat: 48.9694,
    lon: 2.4414,
    en: { city: 'Paris', airport: 'Paris–Le Bourget FBO (LBG)', region: 'Europe' },
    ar: { city: 'باريس', airport: 'مطار باريس لو بورجيه الخاص (LBG)', region: 'أوروبا' },
  },
  {
    code: 'NCE',
    lat: 43.6584,
    lon: 7.2159,
    en: { city: 'Nice / Monaco', airport: 'Nice Côte d’Azur Private (NCE)', region: 'Europe' },
    ar: { city: 'نيس وموناكو', airport: 'صالة كوت دازور الخاصة (NCE)', region: 'أوروبا' },
  },
  {
    code: 'TEB',
    lat: 40.8501,
    lon: -74.0608,
    en: { city: 'New York', airport: 'Teterboro Private Jet Hub (TEB)', region: 'North America' },
    ar: { city: 'نيويورك', airport: 'مطار تيتربورو الخاص (TEB)', region: 'أمريكا الشمالية' },
  },
  {
    code: 'LAX',
    lat: 33.9416,
    lon: -118.4085,
    en: { city: 'Los Angeles', airport: 'Van Nuys Private Suites (VNY)', region: 'North America' },
    ar: { city: 'لوس أنجلوس', airport: 'صالة فان نايس الخاصة (VNY)', region: 'أمريكا الشمالية' },
  },
  {
    code: 'MIA',
    lat: 25.7959,
    lon: -80.287,
    en: { city: 'Miami', airport: 'Opa-locka Executive (OPF)', region: 'North America' },
    ar: { city: 'ميامي', airport: 'مطار أوبا لوكا التنفيذي (OPF)', region: 'أمريكا الشمالية' },
  },
  {
    code: 'SIN',
    lat: 1.4169,
    lon: 103.8678,
    en: { city: 'Singapore', airport: 'Seletar Business Aviation (XSP)', region: 'Asia-Pacific' },
    ar: { city: 'سنغافورة', airport: 'مطار سيليتار للطيران الخاص (XSP)', region: 'آسيا والمحيط الهادئ' },
  },
  {
    code: 'HND',
    lat: 35.5494,
    lon: 139.7798,
    en: { city: 'Tokyo', airport: 'Haneda Premier Gate (HND)', region: 'Asia-Pacific' },
    ar: { city: 'طوكيو', airport: 'بوابة هانيدا التنفيذية (HND)', region: 'آسيا والمحيط الهادئ' },
  },
  {
    code: 'SYD',
    lat: -33.9399,
    lon: 151.1753,
    en: { city: 'Sydney', airport: 'Sydney ExecJet Terminal (SYD)', region: 'Asia-Pacific' },
    ar: { city: 'سيدني', airport: 'صالة الطيران الخاص — سيدني (SYD)', region: 'آسيا والمحيط الهادئ' },
  },
];

export const COPY = {
  en: {
    brandName: 'Sovereign Sky',
    nav: {
      intro: 'Sky Flight',
      bridge: 'Ascent',
      hangar: '3D Hangar',
      fleet: 'Private Jets',
      routes: '3D Globe',
    },
    langLabel: 'EN',
    heroTitle: 'SOVEREIGN',
    introText:
      'From historic bridges to 45,000 feet — command private jets across 180+ countries with 4-hour global dispatch and bespoke tarmac boarding.',
    heroTags: ['Global Charter', 'Private Tarmac', 'Bespoke Cabins'],
    bridgePanel: {
      title: 'Rise above every horizon.',
      body: 'As the stone arch parts to open sky, step straight from chauffeur-driven tarmac arrival into your private jet cabin worldwide.',
      fact1Num: '4h',
      fact1Desc: 'Global aircraft dispatch readiness',
      fact2Num: '180+',
      fact2Desc: 'Countries & private FBOs served',
    },
    bazaarPanel: {
      title: 'Every capital stays within one flight.',
      body: 'Dubai, Riyadh, Geneva, London, New York, and Tokyo connect seamlessly on your schedule—with zero terminals and zero queues.',
      cta: 'Inspect 3D Private Jet',
    },
    emiratesSky: {
      kicker: 'EMIRATES WIDEBODY SKY PASSAGE · POST-BRIDGE ASCENT',
      headline: 'Command the Open Stratosphere.',
      subline:
        'Cleared above the bridge into open sky as the Emirates widebody banks across 3D cloud decks. Continue below to inspect our 3D private jet and charter your small executive aircraft.',
      telemetry: ['FL410 · 41,000 FT', 'MACH 0.85 CRUISE', '180+ COUNTRIES WORLDWIDE'],
      ctaPrimary: 'Enter 3D Jet Hangar',
      ctaSecondary: 'Explore Charter Fleet',
    },
    hangar3d: {
      kicker: 'Interactive WebGL Studio',
      title: '3D Private Jet Engineering Inspector',
      subtitle:
        'Drag 360° to orbit the fuselage, slide the exploded-view control to inspect wings and turbofans, and preview bespoke liveries.',
      liveryLabel: 'Livery',
      liveries: {
        pearl: 'Pearl & Gold',
        obsidian: 'Obsidian',
        emirates: 'Emirates White',
        silver: 'Arctic Silver',
      },
      explodedLabel: 'Exploded View',
      cameraLabel: 'Viewpoint',
      cameras: {
        hero: '3/4 Hero',
        engine: 'Turbofan',
        top: 'Top Plan',
        nose: 'Cockpit',
      },
      hideHud: 'Hide HUD',
      showHud: 'Show 3D Controls',
    },
    modal: {
      close: 'Close dossier',
      arrivalHeading: 'Dispatch & Tarmac Positioning',
      charterBtn: 'Select Jet & Calculate Route',
    },
    charter: {
      sectionKicker: 'Private Charter Fleet',
      fleetTitle: 'Small & Long-Range Private Jets for Charter',
      fleetSubtitle:
        'Every private jet shown below—exterior and cabin—is available for immediate worldwide charter. Switch between Exterior and Cabin views on any aircraft.',
      viewExterior: 'Exterior',
      viewCabin: 'Cabin Interior',
      categories: {
        all: 'All Private Jets (7)',
        ultra: 'Ultra-Long Range',
        heavy: 'Heavy Jets',
        supermid: 'Super-Midsize',
        light: 'Light Express',
      },
      specs: {
        range: 'Max Range',
        speed: 'Cruise Speed',
        pax: 'Passengers',
        rate: 'Hourly Rate',
        selectBtn: 'Charter This Jet',
        selectedBtn: 'Selected for Route',
      },
      routesTitle: 'Interactive 3D Globe & Worldwide Route Estimator',
      routesSubtitle:
        'Spin the 3D Earth, click any airport beacon directly on the globe, and calculate real great-circle distance, flight duration, and charter pricing.',
      originLabel: 'Departure Hub',
      destinationLabel: 'Arrival Hub',
      aircraftLabel: 'Charter Jet',
      passengersLabel: 'Passengers',
      tripTypeLabel: 'Trip Type',
      oneWay: 'One-Way',
      roundTrip: 'Round-Trip',
      dateLabel: 'Departure Date',
      swapAirports: 'Swap hubs',
      distanceLabel: 'Great-Circle Distance',
      durationLabel: 'Est. Flight Time',
      rangeStatusLabel: 'Range Feasibility',
      nonStopOk: 'Non-Stop Direct',
      techStopReq: '1 Tech Fuel Stop',
      totalEstimateLabel: 'Estimated Charter Total',
      breakdownFlight: 'Flight & Crew Operations',
      breakdownFbo: 'Global FBO, Landing & Handling',
      breakdownCatering: 'Bespoke In-Flight Dining',
      proceedBooking: 'Lock This Flight Plan',
      bookingTitle: '24/7 Global Charter Dispatch',
      bookingSubtitle:
        'Confirm your passenger manifest and hospitality preferences to receive tail-number registration within 15 minutes.',
      form: {
        name: 'Full Name / Principal',
        email: 'Corporate or Private Email',
        phone: 'Direct Phone / WhatsApp',
        hospitality: 'In-Flight Hospitality Preference',
        hospitalityOptions: [
          'Arabic & Mediterranean Halal Fine Dining',
          'European Michelin Tasting Menu',
          'Executive Light Refreshments & Arabic Coffee',
        ],
        notes: 'Ground Transfer, Diplomatic Clearance or Notes',
        submit: 'Submit Global Charter Request',
        reset: 'Plan Another Flight',
        errorRequired: 'Please enter your name, a valid email address, and phone number.',
        confirmedTitle: 'Charter Dossier Dispatched',
        confirmedSubtitle:
          'Our Dubai, London, and Geneva flight operations desk has received your itinerary and assigned a dedicated charter director.',
        refLabel: 'Flight Reference',
      },
      pillars: [
        {
          num: '01.',
          title: 'Global Dispatch in 4 Hours',
          body: 'Confirmed tail numbers positioned across Dubai, Riyadh, Geneva, London, New York, Singapore, and Tokyo.',
        },
        {
          num: '02.',
          title: 'Direct Car-to-Airstair Boarding',
          body: 'Bypass commercial terminals completely with private FBO tarmac access worldwide.',
        },
        {
          num: '03.',
          title: 'Tailored Arabic & Global Hospitality',
          body: 'Multilingual cabin crew, printed Arabic Ruq’ah menus, and curated Halal gourmet dining.',
        },
      ],
      ruqaaLabel: 'Arabic Calligraphy',
      ruqaaStyles: {
        classic: 'Ruq’ah Classic',
        ink: 'Ruq’ah Ink',
        amiri: 'Naskh Editorial',
      },
      footerNote: 'Sovereign Sky · Worldwide Private Jet Charter & 24/7 Flight Operations',
    },
  },
  ar: {
    brandName: 'سُمو السماء',
    nav: {
      intro: 'التحليق',
      bridge: 'الصعود للسماء',
      hangar: 'حظيرة 3D',
      fleet: 'طائرات التأجير',
      routes: 'الكرة الأرضية',
    },
    langLabel: 'عربي',
    heroTitle: 'سُمو السماء',
    introText:
      'من فوق الجسر إلى ارتفاع ٤٥ ألف قدم — استأجر طائرتك الخاصة إلى أكثر من ١٨٠ دولة بجاهزية إقلاع خلال ٤ ساعات وصعود مباشر للمدرج.',
    heroTags: ['تأجير عالمي', 'صعود مباشر للمدرج', 'مقصورات فاخرة'],
    bridgePanel: {
      title: 'حلّق فوق كلّ جسرٍ وأفق.',
      body: 'حين ينفرج المشهد نحو السماء المفتوحة، انتقل مباشرةً من سيارتك الخاصة على المدرج إلى مقصورتك التنفيذية في أي قارة.',
      fact1Num: '٤ س',
      fact1Desc: 'جاهزية إقلاع عالمية فورية',
      fact2Num: '١٨٠+',
      fact2Desc: 'دولة وصالة طيران خاص مخدومة',
    },
    bazaarPanel: {
      title: 'عواصم العالم على بُعد رحلة واحدة.',
      body: 'دبي والرياض وجنيف ولندن ونيويورك وطوكيو تتصل بجدولك الزمني بدقة تامة، بلا صالات انتظار وبلا طوابير.',
      cta: 'معاينة الطائرة بتقنية 3D',
    },
    emiratesSky: {
      kicker: 'عبور طائرة الإمارات في السماء · بعد تجاوز الكوبري',
      headline: 'سيادةُ الأجواءِ فوق السحاب.',
      subline:
        'تحلّق طائرة الإمارات بحرية تامة في السماء المفتوحة وسط السحب ثلاثية الأبعاد بعد الجسر. تابع للأسفل لاستكشاف الطائرة 3D وتأجير الطائرات الخاصة.',
      telemetry: ['ارتفاع ٤١,٠٠٠ قدم', 'سرعة ماخ ٠.٨٥', 'تغطية ١٨٠+ دولة حول العالم'],
      ctaPrimary: 'ادخل حظيرة 3D التفاعلية',
      ctaSecondary: 'تصفح طائرات التأجير',
    },
    hangar3d: {
      kicker: 'استوديو هندسي تفاعلي ثلاثي الأبعاد',
      title: 'استعراض الطائرة الخاصة بتقنية 3D التفاعلية',
      subtitle:
        'اسحب لتدوير الطائرة ٣٦٠ درجة، وحرّك شريط التفكيك الهندسي لمعاينة الأجنحة والمحركات، واختر طلاء الهيكل المفضل.',
      liveryLabel: 'طلاء الهيكل',
      liveries: {
        pearl: 'لؤلؤي وذهبي',
        obsidian: 'أسود ملكي',
        emirates: 'أبيض إماراتي',
        silver: 'فضي قطبي',
      },
      explodedLabel: 'تفكيك هندسي',
      cameraLabel: 'زاوية الكاميرا',
      cameras: {
        hero: 'منظور رئيسي',
        engine: 'المحركات',
        top: 'مسقط علوي',
        nose: 'قمرة القيادة',
      },
      hideHud: 'إخفاء الأدوات',
      showHud: 'إظهار تحكم 3D',
    },
    modal: {
      close: 'إغلاق الملف',
      arrivalHeading: 'الجاهزية والتموضع على المدرج',
      charterBtn: 'اختيار الطائرة وحساب المسار',
    },
    charter: {
      sectionKicker: 'أسطول التأجير الخاص',
      fleetTitle: 'الطائرات الخاصة المتاحة للتأجير حول العالم',
      fleetSubtitle:
        'جميع الطائرات الصغيرة ومتوسطة وبعيدة المدى أدناه متاحة للتأجير الفوري. بدّل بين صورة الهيكل الخارجي والمقصورة الداخلية لكل طائرة.',
      viewExterior: 'الهيكل الخارجي',
      viewCabin: 'المقصورة الداخلية',
      categories: {
        all: 'كافة الطائرات (٧)',
        ultra: 'المدى فائق الطول',
        heavy: 'الطائرات الثقيلة',
        supermid: 'المتوسطة الفائقة',
        light: 'النفاثات السريعة',
      },
      specs: {
        range: 'أقصى مدى',
        speed: 'سرعة الطيران',
        pax: 'عدد الركاب',
        rate: 'التكلفة بالساعة',
        selectBtn: 'استئجار هذه الطائرة',
        selectedBtn: 'محددة في الحاسبة',
      },
      routesTitle: 'الكرة الأرضية 3D وحاسبة الرحلات العالمية',
      routesSubtitle:
        'قم بتدوير الكرة الأرضية ثلاثية الأبعاد، واضغط على أي مطار دولي لحساب المسافة الجوية الفعلية وزمن الرحلة والتكلفة الفورية.',
      originLabel: 'مطار الإقلاع',
      destinationLabel: 'مطار الوصول',
      aircraftLabel: 'الطائرة المختارة',
      passengersLabel: 'عدد المسافرين',
      tripTypeLabel: 'نوع الرحلة',
      oneWay: 'ذهاب فقط',
      roundTrip: 'ذهاب وعودة',
      dateLabel: 'تاريخ الإقلاع',
      swapAirports: 'عكس المسار',
      distanceLabel: 'المسافة الجوية',
      durationLabel: 'المدة المقدرة',
      rangeStatusLabel: 'حالة المدى',
      nonStopOk: 'طيران مباشر دون توقف',
      techStopReq: 'يتطلب توقف تزود بالوقود',
      totalEstimateLabel: 'التكلفة التقديرية الشاملة',
      breakdownFlight: 'تشغيل الطائرة والطاقم',
      breakdownFbo: 'رسوم الصالات الخاصة والهبوط',
      breakdownCatering: 'الضيافة الملكية على متن الرحلة',
      proceedBooking: 'اعتماد مسار الرحلة للحجز',
      bookingTitle: 'مكتب الحجز والتشغيل العالمي ٢٤/٧',
      bookingSubtitle:
        'أرسل بيانات المسافرين وتفضيلات الضيافة لاستلام خطة التشغيل ورقم تسجيل الطائرة خلال ١٥ دقيقة.',
      form: {
        name: 'الاسم الكامل / اسم العميل',
        email: 'البريد الإلكتروني الخاص أو الرسمي',
        phone: 'رقم الهاتف / واتساب المباشر',
        hospitality: 'تفضيلات الضيافة على متن الطائرة',
        hospitalityOptions: [
          'مأدبة عربية ومتوسطية فاخرة (حلال)',
          'قائمة تذوق أوروبية من طهاة ميشلان',
          'ضيافة تنفيذية خفيفة وقهوة عربية مختصة',
        ],
        notes: 'توصيل أرضي، تصاريح دبلوماسية، أو ملاحظات خاصة',
        submit: 'إرسال طلب تأجير الطائرة',
        reset: 'تخطيط رحلة جديدة',
        errorRequired: 'يرجى إدخال الاسم، والبريد الإلكتروني الصحيح، ورقم الهاتف.',
        confirmedTitle: 'تم تسجيل ملف الرحلة بنجاح',
        confirmedSubtitle:
          'تسلّم مكتب العمليات في دبي ولندن وجنيف مسار رحلتك، وتم تعيين مدير طيران خاص لمتابعة الإقلاع.',
        refLabel: 'رقم مرجع الرحلة',
      },
      pillars: [
        {
          num: '٠١.',
          title: 'جاهزية إقلاع عالمية خلال ٤ ساعات',
          body: 'طائرات معتمدة متمركزة في دبي، الرياض، جنيف، لندن، نيويورك، سنغافورة، وطوكيو.',
        },
        {
          num: '٠٢.',
          title: 'صعود مباشر من السيارة إلى سلم الطائرة',
          body: 'تجاوز مباني المطار التجارية كلياً عبر الصالات التنفيذية الخاصة حول العالم.',
        },
        {
          num: '٠٣.',
          title: 'ضيافة عربية أصيلة بخط الرقعة',
          body: 'طاقم ضيافة متعدد اللغات، قوائم طعام مطبوعة بخط الرقعة العربي الفاخر، ومأكولات حلال منتقاة.',
        },
      ],
      ruqaaLabel: 'نوع الخط العربي',
      ruqaaStyles: {
        classic: 'خط الرقعة الكلاسيكي',
        ink: 'خط الرقعة بالحبر',
        amiri: 'خط النسخ الأميري',
      },
      footerNote: 'سُمو السماء · تأجير الطائرات الخاصة حول العالم · غرفة عمليات ٢٤ ساعة',
    },
  },
} as const;

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
