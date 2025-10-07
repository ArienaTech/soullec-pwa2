interface BirthInfo {
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
}

interface ThaiLannaReading {
  dayOfWeek: string;
  weekdayAnimal: string;
  weekdayGod: string;
  element: string;
  luckyColor: string;
  meaning: string;
}

interface BaziReading {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  element: string;
  animal: string;
  yinYang: string;
  meaning: string;
}

interface WesternZodiacReading {
  sunSign: string;
  element: string;
  quality: string;
  rulingPlanet: string;
  meaning: string;
}

interface VedicReading {
  moonSign: string;
  nakshatra: string;
  pada: number;
  element: string;
  deity: string;
  meaning: string;
}

interface JapaneseReading {
  animalSign: string;
  bloodType: string;
  luckyDirection: string;
  luckyColor: string;
  meaning: string;
}

interface KoreanSajuReading {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  element: string;
  meaning: string;
}

export interface HoroscopeReading {
  thaiLanna?: ThaiLannaReading;
  bazi?: BaziReading;
  westernZodiac?: WesternZodiacReading;
  vedic?: VedicReading;
  japanese?: JapaneseReading;
  koreanSaju?: KoreanSajuReading;
}

const THAI_WEEKDAY_ANIMALS: Record<number, string> = {
  0: "Garuda (Sunday)",
  1: "Tiger (Monday)",
  2: "Lion (Tuesday)",
  3: "Elephant with Tusks (Wednesday AM)",
  4: "Elephant without Tusks (Wednesday PM)",
  5: "Mouse (Thursday)",
  6: "Guinea Pig (Friday)",
  7: "Dragon (Saturday)"
};

const THAI_WEEKDAY_GODS: Record<number, string> = {
  0: "Surya (Sun God)",
  1: "Chandra (Moon God)",
  2: "Mangala (Mars God)",
  3: "Budha (Mercury God - AM)",
  4: "Budha (Mercury God - PM)",
  5: "Brihaspati (Jupiter God)",
  6: "Shukra (Venus God)",
  7: "Shani (Saturn God)"
};

const THAI_WEEKDAY_COLORS: Record<number, string> = {
  0: "Red",
  1: "Yellow",
  2: "Pink",
  3: "Green",
  4: "Green",
  5: "Orange",
  6: "Blue",
  7: "Purple"
};

const THAI_WEEKDAY_ELEMENTS: Record<number, string> = {
  0: "Fire",
  1: "Water",
  2: "Fire",
  3: "Earth",
  4: "Earth",
  5: "Air",
  6: "Water",
  7: "Air"
};

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const CHINESE_ZODIAC_ANIMALS = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
];

const HEAVENLY_STEMS = [
  "Yang Wood", "Yin Wood", "Yang Fire", "Yin Fire", "Yang Earth", 
  "Yin Earth", "Yang Metal", "Yin Metal", "Yang Water", "Yin Water"
];

const EARTHLY_BRANCHES = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
];

const FIVE_ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"];

function getThaiLannaReading(birthDate: string, birthTime?: string): ThaiLannaReading {
  const date = new Date(birthDate);
  let dayOfWeek = date.getDay();
  let dayKey = dayOfWeek;
  
  if (dayOfWeek === 3 && birthTime) {
    const [hours] = birthTime.split(':').map(Number);
    dayKey = hours >= 12 ? 4 : 3;
  } else if (dayOfWeek === 6) {
    dayKey = 7;
  }

  return {
    dayOfWeek: WEEKDAY_NAMES[dayOfWeek],
    weekdayAnimal: THAI_WEEKDAY_ANIMALS[dayKey],
    weekdayGod: THAI_WEEKDAY_GODS[dayKey],
    element: THAI_WEEKDAY_ELEMENTS[dayKey],
    luckyColor: THAI_WEEKDAY_COLORS[dayKey],
    meaning: `Born under the protection of ${THAI_WEEKDAY_GODS[dayKey]}, your spirit animal is the ${THAI_WEEKDAY_ANIMALS[dayKey]}. Your dominant element is ${THAI_WEEKDAY_ELEMENTS[dayKey]}, and ${THAI_WEEKDAY_COLORS[dayKey]} brings you fortune.`
  };
}

function getBaziReading(birthDate: string, birthTime?: string): BaziReading {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const baseYear = 1924;
  const yearsSince = year - baseYear;
  const sexagenaryYear = (yearsSince + 0) % 60;
  
  const yearStemIndex = sexagenaryYear % 10;
  const yearBranchIndex = sexagenaryYear % 12;
  const yearStem = HEAVENLY_STEMS[yearStemIndex];
  const yearBranch = EARTHLY_BRANCHES[yearBranchIndex];
  
  const monthBranchIndex = (month - 1) % 12;
  const monthStemIndex = (yearStemIndex * 2 + month) % 10;
  const monthStem = HEAVENLY_STEMS[monthStemIndex];
  const monthBranch = EARTHLY_BRANCHES[monthBranchIndex];
  
  const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24)) + 11;
  const dayStemIndex = (daysSinceEpoch + 9) % 10;
  const dayBranchIndex = (daysSinceEpoch + 1) % 12;
  const dayStem = HEAVENLY_STEMS[dayStemIndex];
  const dayBranch = EARTHLY_BRANCHES[dayBranchIndex];
  
  let hourStem = HEAVENLY_STEMS[0];
  let hourBranch = EARTHLY_BRANCHES[0];
  if (birthTime) {
    const [hours, minutes] = birthTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const hourIndex = Math.floor((totalMinutes + 60) / 120) % 12;
    hourBranch = EARTHLY_BRANCHES[hourIndex];
    const hourStemIndex = (dayStemIndex * 2 + hourIndex) % 10;
    hourStem = HEAVENLY_STEMS[hourStemIndex];
  }
  
  const animal = CHINESE_ZODIAC_ANIMALS[yearBranchIndex];
  const element = FIVE_ELEMENTS[Math.floor(yearStemIndex / 2)];
  const yinYang = yearStemIndex % 2 === 0 ? "Yang" : "Yin";
  
  return {
    yearPillar: `${yearStem} ${yearBranch}`,
    monthPillar: `${monthStem} ${monthBranch}`,
    dayPillar: `${dayStem} ${dayBranch}`,
    hourPillar: `${hourStem} ${hourBranch}`,
    element,
    animal,
    yinYang,
    meaning: `You are a ${yinYang} ${element} ${animal}. Your Four Pillars reveal a destiny shaped by ${element} energy, with your Year Pillar (${yearStem} ${yearBranch}) representing your roots, Month Pillar (${monthStem} ${monthBranch}) your growth, Day Pillar (${dayStem} ${dayBranch}) your essence, and Hour Pillar (${hourStem} ${hourBranch}) your legacy.`
  };
}

function getWesternZodiacReading(birthDate: string): WesternZodiacReading {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const zodiacData: Record<string, { element: string; quality: string; planet: string; start: [number, number]; end: [number, number] }> = {
    "Aries": { element: "Fire", quality: "Cardinal", planet: "Mars", start: [3, 21], end: [4, 19] },
    "Taurus": { element: "Earth", quality: "Fixed", planet: "Venus", start: [4, 20], end: [5, 20] },
    "Gemini": { element: "Air", quality: "Mutable", planet: "Mercury", start: [5, 21], end: [6, 20] },
    "Cancer": { element: "Water", quality: "Cardinal", planet: "Moon", start: [6, 21], end: [7, 22] },
    "Leo": { element: "Fire", quality: "Fixed", planet: "Sun", start: [7, 23], end: [8, 22] },
    "Virgo": { element: "Earth", quality: "Mutable", planet: "Mercury", start: [8, 23], end: [9, 22] },
    "Libra": { element: "Air", quality: "Cardinal", planet: "Venus", start: [9, 23], end: [10, 22] },
    "Scorpio": { element: "Water", quality: "Fixed", planet: "Pluto", start: [10, 23], end: [11, 21] },
    "Sagittarius": { element: "Fire", quality: "Mutable", planet: "Jupiter", start: [11, 22], end: [12, 21] },
    "Capricorn": { element: "Earth", quality: "Cardinal", planet: "Saturn", start: [12, 22], end: [1, 19] },
    "Aquarius": { element: "Air", quality: "Fixed", planet: "Uranus", start: [1, 20], end: [2, 18] },
    "Pisces": { element: "Water", quality: "Mutable", planet: "Neptune", start: [2, 19], end: [3, 20] }
  };
  
  let sunSign = "Capricorn";
  for (const [sign, data] of Object.entries(zodiacData)) {
    const [startMonth, startDay] = data.start;
    const [endMonth, endDay] = data.end;
    
    if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
      sunSign = sign;
      break;
    }
  }
  
  const data = zodiacData[sunSign];
  return {
    sunSign,
    element: data.element,
    quality: data.quality,
    rulingPlanet: data.planet,
    meaning: `You are a ${sunSign}, a ${data.quality} ${data.element} sign ruled by ${data.planet}. Your element ${data.element} gives you natural ${data.element === 'Fire' ? 'passion and energy' : data.element === 'Earth' ? 'stability and practicality' : data.element === 'Air' ? 'intellect and communication' : 'emotion and intuition'}.`
  };
}

function getVedicReading(birthDate: string): VedicReading {
  const NAKSHATRAS = [
    { name: "Ashwini", deity: "Ashwini Kumaras", element: "Fire" },
    { name: "Bharani", deity: "Yama", element: "Earth" },
    { name: "Krittika", deity: "Agni", element: "Fire" },
    { name: "Rohini", deity: "Brahma", element: "Earth" },
    { name: "Mrigashira", deity: "Soma", element: "Earth" },
    { name: "Ardra", deity: "Rudra", element: "Water" },
    { name: "Punarvasu", deity: "Aditi", element: "Water" },
    { name: "Pushya", deity: "Brihaspati", element: "Water" },
    { name: "Ashlesha", deity: "Nagas", element: "Water" },
    { name: "Magha", deity: "Pitris", element: "Fire" },
    { name: "Purva Phalguni", deity: "Bhaga", element: "Water" },
    { name: "Uttara Phalguni", deity: "Aryaman", element: "Fire" },
    { name: "Hasta", deity: "Savitar", element: "Air" },
    { name: "Chitra", deity: "Vishvakarma", element: "Fire" },
    { name: "Swati", deity: "Vayu", element: "Air" },
    { name: "Vishakha", deity: "Indra-Agni", element: "Fire" },
    { name: "Anuradha", deity: "Mitra", element: "Water" },
    { name: "Jyeshtha", deity: "Indra", element: "Air" },
    { name: "Mula", deity: "Nirriti", element: "Air" },
    { name: "Purva Ashadha", deity: "Apas", element: "Water" },
    { name: "Uttara Ashadha", deity: "Vishvedevas", element: "Air" },
    { name: "Shravana", deity: "Vishnu", element: "Air" },
    { name: "Dhanishta", deity: "Vasus", element: "Ether" },
    { name: "Shatabhisha", deity: "Varuna", element: "Ether" },
    { name: "Purva Bhadrapada", deity: "Aja Ekapada", element: "Fire" },
    { name: "Uttara Bhadrapada", deity: "Ahir Budhnya", element: "Ether" },
    { name: "Revati", deity: "Pushan", element: "Ether" }
  ];
  
  const RASHI = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  
  const date = new Date(birthDate);
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  
  const nakshatraIndex = Math.floor((dayOfYear * 27) / 365) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const pada = (dayOfYear % 4) + 1;
  const moonSignIndex = Math.floor((dayOfYear * 12) / 365) % 12;
  const moonSign = RASHI[moonSignIndex];
  
  return {
    moonSign,
    nakshatra: nakshatra.name,
    pada,
    element: nakshatra.element,
    deity: nakshatra.deity,
    meaning: `Your Moon is in ${moonSign}, under the Nakshatra ${nakshatra.name} (Pada ${pada}), ruled by deity ${nakshatra.deity}. The ${nakshatra.element} element guides your emotional nature and inner world.`
  };
}

function getJapaneseReading(birthDate: string): JapaneseReading {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  const colors = ["Red", "Blue", "Yellow", "Green", "Purple", "White"];
  const directions = ["North", "East", "South", "West"];
  const bloodTypes = ["A", "B", "O", "AB"];
  
  const animalSign = animals[(year - 4) % 12];
  const bloodType = bloodTypes[year % 4];
  const luckyDirection = directions[year % 4];
  const luckyColor = colors[year % 6];
  
  return {
    animalSign,
    bloodType,
    luckyDirection,
    luckyColor,
    meaning: `Born in the year of the ${animalSign}, with blood type ${bloodType} traits. Your lucky direction is ${luckyDirection}, and ${luckyColor} brings you fortune. This combination shapes your personality and destiny.`
  };
}

function getKoreanSajuReading(birthDate: string, birthTime?: string): KoreanSajuReading {
  const KOREAN_STEMS = ["갑(甲) Wood", "을(乙) Wood", "병(丙) Fire", "정(丁) Fire", "무(戊) Earth", "기(己) Earth", "경(庚) Metal", "신(辛) Metal", "임(壬) Water", "계(癸) Water"];
  const KOREAN_BRANCHES = ["자(子) Rat", "축(丑) Ox", "인(寅) Tiger", "묘(卯) Rabbit", "진(辰) Dragon", "사(巳) Snake", "오(午) Horse", "미(未) Goat", "신(申) Monkey", "유(酉) Rooster", "술(戌) Dog", "해(亥) Pig"];
  
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const yearStemIndex = (year - 4) % 10;
  const yearBranchIndex = (year - 4) % 12;
  const monthStemIndex = (yearStemIndex * 2 + month) % 10;
  const monthBranchIndex = (month - 1) % 12;
  const dayStemIndex = (Math.floor(date.getTime() / 86400000) + 9) % 10;
  const dayBranchIndex = (Math.floor(date.getTime() / 86400000) + 1) % 12;
  
  let hourStem = KOREAN_STEMS[0];
  let hourBranch = KOREAN_BRANCHES[0];
  if (birthTime) {
    const [hours] = birthTime.split(':').map(Number);
    const hourIndex = Math.floor((hours + 1) / 2) % 12;
    hourBranch = KOREAN_BRANCHES[hourIndex];
    hourStem = KOREAN_STEMS[(dayStemIndex * 2 + hourIndex) % 10];
  }
  
  const element = FIVE_ELEMENTS[Math.floor(yearStemIndex / 2)];
  
  return {
    yearPillar: `${KOREAN_STEMS[yearStemIndex]} ${KOREAN_BRANCHES[yearBranchIndex]}`,
    monthPillar: `${KOREAN_STEMS[monthStemIndex]} ${KOREAN_BRANCHES[monthBranchIndex]}`,
    dayPillar: `${KOREAN_STEMS[dayStemIndex]} ${KOREAN_BRANCHES[dayBranchIndex]}`,
    hourPillar: `${hourStem} ${hourBranch}`,
    element,
    meaning: `Your Saju reveals ${element} as your dominant element. Year Pillar represents your ancestors and roots, Month Pillar your parents and early life, Day Pillar your true self, Hour Pillar your children and legacy.`
  };
}

export function calculateHoroscope(
  birthInfo: BirthInfo,
  preferences: string[]
): HoroscopeReading {
  const reading: HoroscopeReading = {};
  
  if (preferences.includes('thai-lanna')) {
    reading.thaiLanna = getThaiLannaReading(birthInfo.birthDate, birthInfo.birthTime);
  }
  
  if (preferences.includes('chinese-bazi')) {
    reading.bazi = getBaziReading(birthInfo.birthDate, birthInfo.birthTime);
  }
  
  if (preferences.includes('western-zodiac')) {
    reading.westernZodiac = getWesternZodiacReading(birthInfo.birthDate);
  }
  
  if (preferences.includes('vedic')) {
    reading.vedic = getVedicReading(birthInfo.birthDate);
  }
  
  if (preferences.includes('japanese')) {
    reading.japanese = getJapaneseReading(birthInfo.birthDate);
  }
  
  if (preferences.includes('korean-saju')) {
    reading.koreanSaju = getKoreanSajuReading(birthInfo.birthDate, birthInfo.birthTime);
  }
  
  return reading;
}

export function formatHoroscopeContext(reading: HoroscopeReading): string {
  const parts: string[] = [];
  
  if (reading.thaiLanna) {
    parts.push(`Thai Lanna Astrology: ${reading.thaiLanna.meaning}`);
  }
  
  if (reading.bazi) {
    parts.push(`Chinese Bazi Four Pillars: ${reading.bazi.meaning}`);
  }
  
  if (reading.westernZodiac) {
    parts.push(`Western Zodiac: ${reading.westernZodiac.meaning}`);
  }
  
  if (reading.vedic) {
    parts.push(`Vedic Astrology: ${reading.vedic.meaning}`);
  }
  
  if (reading.japanese) {
    parts.push(`Japanese Astrology: ${reading.japanese.meaning}`);
  }
  
  if (reading.koreanSaju) {
    parts.push(`Korean Saju: ${reading.koreanSaju.meaning}`);
  }
  
  return parts.join('\n\n');
}
