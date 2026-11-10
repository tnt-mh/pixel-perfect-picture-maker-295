import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "ar" | "en";

const fr = {
  slogan: "Le covoiturage rendu facile.",
  start: "Commencer",
  login: "Se connecter",
  signup: "Créer un compte",
  logout: "Se déconnecter",
  next: "Suivant",
  back: "Retour",
  skip: "Passer",
  save: "Enregistrer",
  cancel: "Annuler",
  confirm: "Confirmer",
  ob1t: "Trouvez un trajet",
  ob1d: "Des conducteurs vérifiés partout en Algérie, vers votre destination.",
  ob2t: "Partagez les frais",
  ob2d: "Conducteurs : remplissez vos places vides et réduisez vos dépenses de carburant.",
  ob3t: "Voyagez en confiance",
  ob3d: "Documents vérifiés, profils transparents et réservations sécurisées.",
  email: "Adresse e-mail",
  password: "Mot de passe",
  fullName: "Nom complet",
  phone: "Téléphone",
  dob: "Date de naissance",
  haveAccount: "Déjà un compte ?",
  noAccount: "Pas encore de compte ?",
  checkEmail: "Vérifiez votre e-mail pour confirmer votre compte.",
  hello: "Bonjour",
  whereTo: "Où souhaitez-vous aller ?",
  from: "Départ",
  to: "Destination",
  date: "Date",
  passengers: "Passagers",
  search: "Rechercher",
  recent: "Recherches récentes",
  popular: "Destinations populaires",
  upcoming: "Mes prochaines réservations",
  nothingYet: "Rien pour le moment",
  results: "Trajets disponibles",
  noResults: "Aucun trajet trouvé pour cette recherche.",
  seatsLeft: "places restantes",
  perSeat: "par passager",
  verified: "Vérifié",
  book: "Réserver",
  bookSent: "Demande de réservation envoyée",
  bookingStatus: "Statut de votre réservation",
  rideDetails: "Détails du trajet",
  driver: "Conducteur",
  vehicle: "Véhicule",
  pickup: "Point de rendez-vous",
  dropoff: "Point de dépose",
  stops: "Arrêts",
  prefs: "Préférences",
  navHome: "Accueil",
  navSearch: "Rechercher",
  navPublish: "Publier",
  navTrips: "Trajets",
  navProfile: "Profil",
  driverSpace: "Espace conducteur",
  verification: "Vérification",
  st_not_submitted: "Non soumis",
  st_pending: "En cours d'examen",
  st_verified: "Vérifié",
  st_rejected: "Refusé",
  st_expired: "Expiré",
  b_pending: "En attente",
  b_accepted: "Acceptée",
  b_rejected: "Refusée",
  b_cancelled: "Annulée",
  b_onboard: "À bord",
  b_completed: "Terminée",
  publishRide: "Publier un trajet",
  mustVerify: "Vous devez être un conducteur vérifié pour publier un trajet.",
  goVerify: "Vérifier mon profil",
  legalWarning: "Le prix doit correspondre à un partage légal des frais, et non à un transport commercial non autorisé.",
  asPassenger: "En tant que passager",
  asDriver: "En tant que conducteur",
  accept: "Accepter",
  reject: "Refuser",
  markOnboard: "À bord",
  completeRide: "Terminer le trajet",
  cancelRide: "Annuler le trajet",
  settings: "Paramètres",
  language: "Langue",
  admin: "Administration",
  submit: "Soumettre",
  upcomingRides: "Trajets à venir",
  requests: "Demandes",
  completed: "Terminés",
  contributions: "Contributions reçues",
};

type Dict = typeof fr;
export type TKey = keyof Dict;

const en: Dict = {
  slogan: "Carpooling made easy.", start: "Get started", login: "Sign in", signup: "Create account", logout: "Sign out",
  next: "Next", back: "Back", skip: "Skip", save: "Save", cancel: "Cancel", confirm: "Confirm",
  ob1t: "Find a ride", ob1d: "Verified drivers across Algeria, heading your way.",
  ob2t: "Share the costs", ob2d: "Drivers: fill your empty seats and cut your fuel spending.",
  ob3t: "Travel with confidence", ob3d: "Verified documents, transparent profiles and secure bookings.",
  email: "Email address", password: "Password", fullName: "Full name", phone: "Phone", dob: "Date of birth",
  haveAccount: "Already have an account?", noAccount: "No account yet?", checkEmail: "Check your email to confirm your account.",
  hello: "Hello", whereTo: "Where would you like to go?", from: "From", to: "To", date: "Date", passengers: "Passengers",
  search: "Search", recent: "Recent searches", popular: "Popular destinations", upcoming: "My upcoming bookings",
  nothingYet: "Nothing yet", results: "Available rides", noResults: "No rides found for this search.",
  seatsLeft: "seats left", perSeat: "per passenger", verified: "Verified", book: "Book", bookSent: "Booking request sent",
  bookingStatus: "Your booking status", rideDetails: "Ride details", driver: "Driver", vehicle: "Vehicle",
  pickup: "Pickup point", dropoff: "Drop-off point", stops: "Stops", prefs: "Preferences",
  navHome: "Home", navSearch: "Search", navPublish: "Publish", navTrips: "Trips", navProfile: "Profile",
  driverSpace: "Driver space", verification: "Verification",
  st_not_submitted: "Not submitted", st_pending: "Pending review", st_verified: "Verified", st_rejected: "Rejected", st_expired: "Expired",
  b_pending: "Pending", b_accepted: "Accepted", b_rejected: "Rejected", b_cancelled: "Cancelled", b_onboard: "Onboard", b_completed: "Completed",
  publishRide: "Publish a ride", mustVerify: "You must be a verified driver to publish a ride.", goVerify: "Verify my profile",
  legalWarning: "The price must reflect lawful cost-sharing, not unauthorized commercial transport.",
  asPassenger: "As passenger", asDriver: "As driver", accept: "Accept", reject: "Reject", markOnboard: "Onboard",
  completeRide: "Complete ride", cancelRide: "Cancel ride", settings: "Settings", language: "Language", admin: "Admin",
  submit: "Submit", upcomingRides: "Upcoming rides", requests: "Requests", completed: "Completed", contributions: "Contributions received",
};

const ar: Dict = {
  slogan: "التنقل المشترك أصبح سهلاً.", start: "ابدأ", login: "تسجيل الدخول", signup: "إنشاء حساب", logout: "تسجيل الخروج",
  next: "التالي", back: "رجوع", skip: "تخطي", save: "حفظ", cancel: "إلغاء", confirm: "تأكيد",
  ob1t: "اعثر على رحلة", ob1d: "سائقون موثقون في كل أنحاء الجزائر نحو وجهتك.",
  ob2t: "تقاسم التكاليف", ob2d: "السائقون: املؤوا المقاعد الفارغة وقللوا مصاريف الوقود.",
  ob3t: "سافر بثقة", ob3d: "وثائق موثقة، ملفات شفافة وحجوزات آمنة.",
  email: "البريد الإلكتروني", password: "كلمة المرور", fullName: "الاسم الكامل", phone: "الهاتف", dob: "تاريخ الميلاد",
  haveAccount: "لديك حساب؟", noAccount: "ليس لديك حساب؟", checkEmail: "تحقق من بريدك الإلكتروني لتأكيد حسابك.",
  hello: "مرحباً", whereTo: "إلى أين تريد الذهاب؟", from: "الانطلاق", to: "الوجهة", date: "التاريخ", passengers: "الركاب",
  search: "بحث", recent: "عمليات البحث الأخيرة", popular: "وجهات شائعة", upcoming: "حجوزاتي القادمة",
  nothingYet: "لا شيء حالياً", results: "الرحلات المتاحة", noResults: "لم يتم العثور على رحلات.",
  seatsLeft: "مقاعد متبقية", perSeat: "للراكب", verified: "موثق", book: "احجز", bookSent: "تم إرسال طلب الحجز",
  bookingStatus: "حالة حجزك", rideDetails: "تفاصيل الرحلة", driver: "السائق", vehicle: "المركبة",
  pickup: "نقطة الالتقاء", dropoff: "نقطة النزول", stops: "التوقفات", prefs: "التفضيلات",
  navHome: "الرئيسية", navSearch: "بحث", navPublish: "نشر", navTrips: "رحلاتي", navProfile: "حسابي",
  driverSpace: "فضاء السائق", verification: "التوثيق",
  st_not_submitted: "غير مقدم", st_pending: "قيد المراجعة", st_verified: "موثق", st_rejected: "مرفوض", st_expired: "منتهي",
  b_pending: "قيد الانتظار", b_accepted: "مقبول", b_rejected: "مرفوض", b_cancelled: "ملغى", b_onboard: "على متن", b_completed: "مكتمل",
  publishRide: "نشر رحلة", mustVerify: "يجب أن تكون سائقاً موثقاً لنشر رحلة.", goVerify: "توثيق حسابي",
  legalWarning: "يجب أن يمثل السعر تقاسماً قانونياً للتكاليف، وليس نقلاً تجارياً غير مرخص.",
  asPassenger: "كراكب", asDriver: "كسائق", accept: "قبول", reject: "رفض", markOnboard: "على متن",
  completeRide: "إنهاء الرحلة", cancelRide: "إلغاء الرحلة", settings: "الإعدادات", language: "اللغة", admin: "الإدارة",
  submit: "إرسال", upcomingRides: "الرحلات القادمة", requests: "الطلبات", completed: "مكتملة", contributions: "المساهمات المستلمة",
};

const dicts: Record<Lang, Dict> = { fr, en, ar };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string };
const I18nContext = createContext<Ctx>({ lang: "fr", setLang: () => {}, t: (k) => fr[k] });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  useEffect(() => {
    const saved = localStorage.getItem("waslni-lang") as Lang | null;
    if (saved && saved in dicts) setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const setLang = (l: Lang) => {
    localStorage.setItem("waslni-lang", l);
    setLangState(l);
  };
  return (
    <I18nContext.Provider value={{ lang, setLang, t: (k) => dicts[lang][k] ?? fr[k] }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
export const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
];
