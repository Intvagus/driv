// Pakistan's electricity distribution companies. All use the same national
// (uniform) residential tariff; the main difference on a home bill is the
// provincial electricity duty. Duty rates marked `verified: false` come from
// a single secondary source and should be checked against the province's
// finance act.

export type Disco = {
  slug: string;
  name: string;
  fullName: string;
  nameUr: string;
  areas: string;
  province: string;
  dutyPercent: number;
  dutyVerified: boolean;
  billUrl: string;
};

const pitc = (code: string) => `https://bill.pitc.com.pk/${code}bill`;

export const DISCOS: Disco[] = [
  { slug: "lesco", name: "LESCO", fullName: "Lahore Electric Supply Company", nameUr: "لیسکو", areas: "Lahore, Kasur, Okara, Sheikhupura, Nankana Sahib", province: "Punjab", dutyPercent: 1.5, dutyVerified: true, billUrl: pitc("lesco") },
  { slug: "gepco", name: "GEPCO", fullName: "Gujranwala Electric Power Company", nameUr: "گیپکو", areas: "Gujranwala, Sialkot, Gujrat, Narowal, Mandi Bahauddin, Hafizabad", province: "Punjab", dutyPercent: 1.5, dutyVerified: true, billUrl: pitc("gepco") },
  { slug: "fesco", name: "FESCO", fullName: "Faisalabad Electric Supply Company", nameUr: "فیسکو", areas: "Faisalabad, Sargodha, Jhang, Toba Tek Singh, Mianwali, Bhakkar", province: "Punjab", dutyPercent: 1.5, dutyVerified: true, billUrl: pitc("fesco") },
  { slug: "iesco", name: "IESCO", fullName: "Islamabad Electric Supply Company", nameUr: "آئیسکو", areas: "Islamabad, Rawalpindi, Attock, Jhelum, Chakwal", province: "Islamabad & Punjab", dutyPercent: 1.5, dutyVerified: false, billUrl: pitc("iesco") },
  { slug: "mepco", name: "MEPCO", fullName: "Multan Electric Power Company", nameUr: "میپکو", areas: "Multan, Bahawalpur, Dera Ghazi Khan, Sahiwal, Rahim Yar Khan", province: "Punjab", dutyPercent: 1.5, dutyVerified: true, billUrl: pitc("mepco") },
  { slug: "pesco", name: "PESCO", fullName: "Peshawar Electric Supply Company", nameUr: "پیسکو", areas: "Peshawar, Mardan, Swat, Kohat, Bannu, Dera Ismail Khan", province: "Khyber Pakhtunkhwa", dutyPercent: 1, dutyVerified: false, billUrl: pitc("pesco") },
  { slug: "hazeco", name: "HAZECO", fullName: "Hazara Electric Supply Company", nameUr: "ہزیکو", areas: "Abbottabad, Mansehra, Haripur, Battagram, Kohistan", province: "Khyber Pakhtunkhwa", dutyPercent: 1, dutyVerified: false, billUrl: "https://hazeco.com.pk/" },
  { slug: "tesco", name: "TESCO", fullName: "Tribal Electric Supply Company", nameUr: "ٹیسکو", areas: "Merged tribal districts of Khyber Pakhtunkhwa", province: "Khyber Pakhtunkhwa", dutyPercent: 1, dutyVerified: false, billUrl: pitc("tesco") },
  { slug: "hesco", name: "HESCO", fullName: "Hyderabad Electric Supply Company", nameUr: "حیسکو", areas: "Hyderabad, Mirpur Khas, Thatta, Badin, Nawabshah", province: "Sindh", dutyPercent: 1.5, dutyVerified: false, billUrl: pitc("hesco") },
  { slug: "sepco", name: "SEPCO", fullName: "Sukkur Electric Power Company", nameUr: "سیپکو", areas: "Sukkur, Larkana, Khairpur, Jacobabad, Shikarpur", province: "Sindh", dutyPercent: 1.5, dutyVerified: false, billUrl: pitc("sepco") },
  { slug: "qesco", name: "QESCO", fullName: "Quetta Electric Supply Company", nameUr: "کیسکو", areas: "Quetta and most of Balochistan", province: "Balochistan", dutyPercent: 0, dutyVerified: false, billUrl: pitc("qesco") },
  { slug: "k-electric", name: "K-Electric", fullName: "K-Electric (Karachi)", nameUr: "کے الیکٹرک", areas: "Karachi, and parts of Hub and Uthal", province: "Sindh", dutyPercent: 1.5, dutyVerified: true, billUrl: "https://www.ke.com.pk/" },
];

export const getDisco = (slug: string) => DISCOS.find((d) => d.slug === slug);
