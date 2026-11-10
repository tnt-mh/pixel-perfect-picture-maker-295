export const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
];

export const POPULAR = [
  { from: "Alger", to: "Oran" },
  { from: "Alger", to: "Constantine" },
  { from: "Oran", to: "Tlemcen" },
  { from: "Alger", to: "Béjaïa" },
  { from: "Sétif", to: "Alger" },
];

export const formatDA = (n: number) => `${new Intl.NumberFormat("fr-DZ").format(n)} DA`;

/** Normalizes an Algerian mobile number to +213XXXXXXXXX, or returns null if invalid. */
export function normalizeDzPhone(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, "");
  let local = digits;
  if (local.startsWith("+213")) local = local.slice(4);
  else if (local.startsWith("00213")) local = local.slice(5);
  else if (local.startsWith("213")) local = local.slice(3);
  if (local.startsWith("0")) local = local.slice(1);
  if (!/^[567]\d{8}$/.test(local)) return null;
  return `+213${local}`;
}

export const PREFERENCES = [
  { key: "conversation", fr: "Conversation", icon: "MessageCircle" },
  { key: "quiet", fr: "Trajet calme", icon: "VolumeX" },
  { key: "music", fr: "Musique", icon: "Music" },
  { key: "luggage", fr: "Bagages", icon: "Briefcase" },
  { key: "no_smoking", fr: "Non-fumeur", icon: "CigaretteOff" },
  { key: "pets", fr: "Animaux acceptés", icon: "PawPrint" },
  { key: "ac", fr: "Climatisation", icon: "Snowflake" },
] as const;

export const DOC_TYPES = [
  { key: "id_card", label: "Carte d'identité nationale" },
  { key: "license", label: "Permis de conduire" },
  { key: "carte_grise", label: "Carte grise" },
  { key: "photo", label: "Photo de profil" },
] as const;
