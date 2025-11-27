export const translations = {
  en: {
    // Tab names
    today: "Today",
    calendar: "Calendar",
    daily: "Daily",
    history: "History",
    settings: "Settings",

    // Today screen
    nextPeriodIn: "Next period in",
    ovulationIn: "Ovulation in",
    days: "days",
    day: "day",
    currentPhase: "Current Phase",

    // Phases
    menstrual: "Menstrual",
    follicular: "Follicular",
    ovulation: "Ovulation",
    luteal: "Luteal",

    // Phase descriptions
    menstrualDesc: "Your period is here. Take it easy and listen to your body.",
    follicularDesc: "Energy is rising. Great time for new beginnings and planning.",
    ovulationDesc: "Peak fertility window. You may feel most energetic and social.",
    lutealDesc: "Winding down phase. Focus on rest and self-care.",

    // Calendar screen
    selectDate: "Select a date",
    addPeriodStart: "Add Period Start",
    addPeriodEnd: "Add Period End",
    periodRange: "Period Range",
    noPeriodData: "No period data yet. Tap a date to add your first cycle.",
    phasesOfCycle: "Phases of the Menstrual Cycle",

    // Daily screen
    howAreYouFeeling: "How are you feeling today?",
    addNote: "Add a note (optional)",
    saveEntry: "Save Entry",
    editEntry: "Edit Entry",
    deleteEntry: "Delete Entry",
    noEntries: "No diary entries yet. Start tracking your mood!",
    yourEntries: "Your Entries",

    // Moods
    happy: "Happy",
    calm: "Calm",
    sad: "Sad",
    energetic: "Energetic",

    // History screen
    pastCycles: "Past Cycles",
    cycleLength: "Cycle Length",
    estimatedOvulation: "Est. Ovulation",
    noCycles: "No cycles recorded yet",
    started: "Started",
    ended: "Ended",

    // Settings screen
    yourName: "Your Name",
    namePlaceholder: "Enter your name",
    averageCycleLength: "Average Cycle Length",
    averagePeriodLength: "Average Period Length",
    language: "Language",
    english: "English",
    turkish: "Turkish",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    confirm: "Confirm",

    // Validation
    invalidCycleLength: "Cycle length must be between 21-45 days",
    invalidPeriodLength: "Period length must be between 2-10 days",
    periodEndBeforeStart: "Period end date must be after start date",
    overlappingPeriods: "This period overlaps with an existing cycle",
  },

  tr: {
    // Tab names
    today: "Bugün",
    calendar: "Takvim",
    daily: "Günlük",
    history: "Geçmiş",
    settings: "Ayarlar",

    // Today screen
    nextPeriodIn: "Sonraki regl",
    ovulationIn: "Yumurtlama",
    days: "gün",
    day: "gün",
    currentPhase: "Mevcut Dönem",

    // Phases
    menstrual: "Adet Dönemi",
    follicular: "Foliküler Dönem",
    ovulation: "Yumurtlama",
    luteal: "Luteal Dönem",

    // Phase descriptions
    menstrualDesc: "Regl dönemindesiniz. Dinlenin ve vücudunuzu dinleyin.",
    follicularDesc: "Enerjiniz artıyor. Yeni başlangıçlar ve planlama için harika bir zaman.",
    ovulationDesc: "Doğurganlık penceresi. En enerjik ve sosyal hissedebilirsiniz.",
    lutealDesc: "Sakinleşme dönemi. Dinlenmeye ve öz bakıma odaklanın.",

    // Calendar screen
    selectDate: "Tarih seçin",
    addPeriodStart: "Regl Başlangıcı Ekle",
    addPeriodEnd: "Regl Bitişi Ekle",
    periodRange: "Regl Aralığı",
    noPeriodData: "Henüz regl verisi yok. İlk döngünüzü eklemek için bir tarihe dokunun.",
    phasesOfCycle: "Adet Döngüsünün Evreleri",

    // Daily screen
    howAreYouFeeling: "Bugün nasıl hissediyorsun?",
    addNote: "Not ekle (isteğe bağlı)",
    saveEntry: "Kaydet",
    editEntry: "Düzenle",
    deleteEntry: "Sil",
    noEntries: "Henüz günlük girişi yok. Ruh halinizi takip etmeye başlayın!",
    yourEntries: "Girişleriniz",

    // Moods
    happy: "Mutlu",
    calm: "Sakin",
    sad: "Üzgün",
    energetic: "Enerjik",

    // History screen
    pastCycles: "Geçmiş Döngüler",
    cycleLength: "Döngü Uzunluğu",
    estimatedOvulation: "Tahmini Yumurtlama",
    noCycles: "Henüz kaydedilmiş döngü yok",
    started: "Başladı",
    ended: "Bitti",

    // Settings screen
    yourName: "Adınız",
    namePlaceholder: "Adınızı girin",
    averageCycleLength: "Ortalama Döngü Uzunluğu",
    averagePeriodLength: "Ortalama Regl Süresi",
    language: "Dil",
    english: "İngilizce",
    turkish: "Türkçe",
    save: "Kaydet",
    cancel: "İptal",
    delete: "Sil",
    edit: "Düzenle",
    confirm: "Onayla",

    // Validation
    invalidCycleLength: "Döngü uzunluğu 21-45 gün arasında olmalıdır",
    invalidPeriodLength: "Regl süresi 2-10 gün arasında olmalıdır",
    periodEndBeforeStart: "Regl bitiş tarihi başlangıç tarihinden sonra olmalıdır",
    overlappingPeriods: "Bu regl mevcut bir döngüyle çakışıyor",
  },
};

export type TranslationKey = keyof typeof translations.en;

// Phase-specific inspirational messages
export const phaseMessages = {
  en: {
    menstrual: [
      "This is your time to rest. Your body wants love and slowness from you.",
      "Pause for a moment, take a breath. Everything is flowing as it should.",
      "Be gentle with yourself. Your body is in a transformation process.",
      "Just exist today. Stay in the flow.",
      "Herbal tea, blanket, and peace: your prescription for today.",
    ],
    follicular: [
      "Your energy is rising! A perfect time for new ideas and beginnings.",
      "If you feel refreshed, you are on the right path.",
      "Your creativity is returning — plan something, inspiration will find you.",
      "Your body is renewing, your mind is opening. Welcome to a new cycle.",
      "This phase is your spring — plant seeds for your dreams.",
    ],
    ovulation: [
      "Your light is shining. Be social, express yourself, share.",
      "It is natural to feel strong, attractive, and vibrant. This is your time to shine.",
      "Communicate, connect, open your heart.",
      "Creativity and magnetism are at their peak — trust your feelings.",
      "Your energy is outward, speak, share, sparkle!",
    ],
    luteal: [
      "Prepare for closure. Time to turn inward, be more intuitive.",
      "Give yourself time. Allow everything to slow down a bit.",
      "You may feel a little sensitive, this is very normal. Rest and listen to your inner voice.",
      "Complete your projects, close unfinished business.",
      "This phase is the best excuse for self-care.",
    ],
  },
  tr: {
    menstrual: [
      "Bu senin dinlenme zamanın. Vücudun senden sevgi ve yavaşlık istiyor.",
      "Biraz dur, biraz nefes al. Her şey olması gerektiği gibi akıyor.",
      "Kendine nazik ol. Bedenin bir dönüşüm sürecinde.",
      "Bugün sadece var ol. Akışın içinde kal.",
      "Kupa çayı, battaniye ve huzur: senin bugünkü reçeten.",
    ],
    follicular: [
      "Enerjin yükseliyor! Yeni fikirler ve başlangıçlar için mükemmel bir zaman.",
      "Kendini tazelenmiş hissediyorsan, doğru yoldasın.",
      "Yaratıcılığın geri dönüyor — bir şeyleri planla, ilham seni bulacak.",
      "Vücudun yenileniyor, zihnin açılıyor. Yeni bir döngüye hoş geldin.",
      "Bu faz senin baharın — hayallerine tohum ek.",
    ],
    ovulation: [
      "Işığın parlıyor. Sosyal ol, kendini ifade et, paylaş.",
      "Kendini güçlü, çekici ve canlı hissetmen çok doğal. Bu senin parlama zamanın.",
      "İletişim kur, bağlantılar kur, kalbini aç.",
      "Yaratıcılık ve çekim gücü en yüksek seviyede — hislerine güven.",
      "Enerjin dışa dönük, konuş, paylaş, parılda!",
    ],
    luteal: [
      "Kapanışa hazırlan. Daha içe dönük, sezgisel olma zamanı.",
      "Kendine zaman tanı. Her şeyin biraz daha yavaşlamasına izin ver.",
      "Biraz hassas hissedebilirsin, bu çok normal. Dinlen ve iç sesini dinle.",
      "Projelerini tamamla, bitmemiş işleri kapat.",
      "Bu faz, kendine bakımın en güzel bahanesi.",
    ],
  },
};

// Helper function to get a random phase message
export const getRandomPhaseMessage = (
  phase: "menstrual" | "follicular" | "ovulation" | "luteal",
  language: "en" | "tr" = "en"
): string => {
  const messages = phaseMessages[language][phase];
  return messages[Math.floor(Math.random() * messages.length)];
};
