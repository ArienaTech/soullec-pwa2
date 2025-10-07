export interface TarotCard {
  id: string;
  name: string;
  suit?: string;
  arcana: "major" | "minor";
  number?: number;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
}

export const TAROT_DECK: TarotCard[] = [
  {
    id: "fool",
    name: "The Fool",
    arcana: "major",
    number: 0,
    keywords: ["new beginnings", "innocence", "spontaneity", "free spirit"],
    uprightMeaning: "New adventures, leaps of faith, embracing the unknown with optimism",
    reversedMeaning: "Recklessness, naivety, foolish risks, poor judgment"
  },
  {
    id: "magician",
    name: "The Magician",
    arcana: "major",
    number: 1,
    keywords: ["manifestation", "resourcefulness", "power", "action"],
    uprightMeaning: "Manifestation, creative power, taking inspired action, utilizing your skills",
    reversedMeaning: "Manipulation, wasted talent, illusion, trickery"
  },
  {
    id: "high-priestess",
    name: "The High Priestess",
    arcana: "major",
    number: 2,
    keywords: ["intuition", "sacred knowledge", "divine feminine", "subconscious"],
    uprightMeaning: "Intuition, sacred knowledge, divine feminine, the subconscious mind",
    reversedMeaning: "Secrets, withdrawal, silence, repressed feelings"
  },
  {
    id: "empress",
    name: "The Empress",
    arcana: "major",
    number: 3,
    keywords: ["femininity", "beauty", "nature", "nurturing", "abundance"],
    uprightMeaning: "Femininity, beauty, nature, abundance, nurturing",
    reversedMeaning: "Creative block, dependence on others, smothering, lack of progress"
  },
  {
    id: "emperor",
    name: "The Emperor",
    arcana: "major",
    number: 4,
    keywords: ["authority", "structure", "control", "fatherhood"],
    uprightMeaning: "Authority, establishment, structure, father figure",
    reversedMeaning: "Domination, excessive control, lack of discipline, inflexibility"
  },
  {
    id: "hierophant",
    name: "The Hierophant",
    arcana: "major",
    number: 5,
    keywords: ["spiritual wisdom", "tradition", "conformity", "education"],
    uprightMeaning: "Spiritual wisdom, religious beliefs, conformity, tradition, institutions",
    reversedMeaning: "Personal beliefs, freedom, challenging the status quo"
  },
  {
    id: "lovers",
    name: "The Lovers",
    arcana: "major",
    number: 6,
    keywords: ["love", "harmony", "relationships", "values", "choices"],
    uprightMeaning: "Love, harmony, relationships, values alignment, choices",
    reversedMeaning: "Self-love, disharmony, imbalance, misalignment of values"
  },
  {
    id: "chariot",
    name: "The Chariot",
    arcana: "major",
    number: 7,
    keywords: ["control", "willpower", "success", "determination"],
    uprightMeaning: "Control, willpower, success, action, determination",
    reversedMeaning: "Self-discipline, opposition, lack of direction"
  },
  {
    id: "strength",
    name: "Strength",
    arcana: "major",
    number: 8,
    keywords: ["strength", "courage", "persuasion", "influence", "compassion"],
    uprightMeaning: "Strength, courage, persuasion, influence, compassion",
    reversedMeaning: "Inner strength, self-doubt, low energy, raw emotion"
  },
  {
    id: "hermit",
    name: "The Hermit",
    arcana: "major",
    number: 9,
    keywords: ["soul searching", "introspection", "inner guidance"],
    uprightMeaning: "Soul searching, introspection, being alone, inner guidance",
    reversedMeaning: "Isolation, loneliness, withdrawal"
  },
  {
    id: "wheel-of-fortune",
    name: "Wheel of Fortune",
    arcana: "major",
    number: 10,
    keywords: ["good luck", "karma", "life cycles", "destiny"],
    uprightMeaning: "Good luck, karma, life cycles, destiny, turning point",
    reversedMeaning: "Bad luck, resistance to change, breaking cycles"
  },
  {
    id: "justice",
    name: "Justice",
    arcana: "major",
    number: 11,
    keywords: ["justice", "fairness", "truth", "cause and effect", "law"],
    uprightMeaning: "Justice, fairness, truth, cause and effect, law",
    reversedMeaning: "Unfairness, lack of accountability, dishonesty"
  },
  {
    id: "hanged-man",
    name: "The Hanged Man",
    arcana: "major",
    number: 12,
    keywords: ["pause", "surrender", "letting go", "new perspectives"],
    uprightMeaning: "Pause, surrender, letting go, new perspectives",
    reversedMeaning: "Delays, resistance, stalling, indecision"
  },
  {
    id: "death",
    name: "Death",
    arcana: "major",
    number: 13,
    keywords: ["endings", "change", "transformation", "transition"],
    uprightMeaning: "Endings, change, transformation, transition",
    reversedMeaning: "Resistance to change, personal transformation, inner purging"
  },
  {
    id: "temperance",
    name: "Temperance",
    arcana: "major",
    number: 14,
    keywords: ["balance", "moderation", "patience", "purpose"],
    uprightMeaning: "Balance, moderation, patience, purpose",
    reversedMeaning: "Imbalance, excess, self-healing, re-alignment"
  },
  {
    id: "devil",
    name: "The Devil",
    arcana: "major",
    number: 15,
    keywords: ["shadow self", "attachment", "addiction", "restriction"],
    uprightMeaning: "Shadow self, attachment, addiction, restriction, sexuality",
    reversedMeaning: "Releasing limiting beliefs, exploring dark thoughts, detachment"
  },
  {
    id: "tower",
    name: "The Tower",
    arcana: "major",
    number: 16,
    keywords: ["sudden change", "upheaval", "chaos", "revelation"],
    uprightMeaning: "Sudden change, upheaval, chaos, revelation, awakening",
    reversedMeaning: "Personal transformation, fear of change, averting disaster"
  },
  {
    id: "star",
    name: "The Star",
    arcana: "major",
    number: 17,
    keywords: ["hope", "faith", "purpose", "renewal", "spirituality"],
    uprightMeaning: "Hope, faith, purpose, renewal, spirituality",
    reversedMeaning: "Lack of faith, despair, self-trust, disconnection"
  },
  {
    id: "moon",
    name: "The Moon",
    arcana: "major",
    number: 18,
    keywords: ["illusion", "fear", "anxiety", "subconscious", "intuition"],
    uprightMeaning: "Illusion, fear, anxiety, subconscious, intuition",
    reversedMeaning: "Release of fear, repressed emotion, inner confusion"
  },
  {
    id: "sun",
    name: "The Sun",
    arcana: "major",
    number: 19,
    keywords: ["positivity", "fun", "warmth", "success", "vitality"],
    uprightMeaning: "Positivity, fun, warmth, success, vitality",
    reversedMeaning: "Inner child, feeling down, overly optimistic"
  },
  {
    id: "judgement",
    name: "Judgement",
    arcana: "major",
    number: 20,
    keywords: ["judgement", "rebirth", "inner calling", "absolution"],
    uprightMeaning: "Judgement, rebirth, inner calling, absolution",
    reversedMeaning: "Self-doubt, inner critic, ignoring the call"
  },
  {
    id: "world",
    name: "The World",
    arcana: "major",
    number: 21,
    keywords: ["completion", "accomplishment", "travel", "fulfillment"],
    uprightMeaning: "Completion, accomplishment, travel, fulfillment",
    reversedMeaning: "Seeking personal closure, short-cuts, delays"
  },
  // WANDS (Fire - Action, Passion, Energy)
  {
    id: "ace-of-wands",
    name: "Ace of Wands",
    suit: "wands",
    arcana: "minor",
    number: 1,
    keywords: ["inspiration", "new opportunities", "growth", "potential"],
    uprightMeaning: "Inspiration, new opportunities, growth, creative spark",
    reversedMeaning: "Emerging ideas, lack of direction, delays"
  },
  {
    id: "two-of-wands",
    name: "Two of Wands",
    suit: "wands",
    arcana: "minor",
    number: 2,
    keywords: ["planning", "decisions", "discovery", "personal power"],
    uprightMeaning: "Future planning, progress, decisions, discovery",
    reversedMeaning: "Fear of unknown, lack of planning, poor choices"
  },
  {
    id: "three-of-wands",
    name: "Three of Wands",
    suit: "wands",
    arcana: "minor",
    number: 3,
    keywords: ["expansion", "foresight", "opportunities", "progress"],
    uprightMeaning: "Expansion, foresight, overseas opportunities, leadership",
    reversedMeaning: "Obstacles, delays, frustration, limitations"
  },
  // CUPS (Water - Emotions, Relationships, Creativity)
  {
    id: "ace-of-cups",
    name: "Ace of Cups",
    suit: "cups",
    arcana: "minor",
    number: 1,
    keywords: ["love", "new relationships", "compassion", "creativity"],
    uprightMeaning: "Love, new relationships, compassion, emotional awakening",
    reversedMeaning: "Emotional loss, blocked creativity, emptiness"
  },
  {
    id: "two-of-cups",
    name: "Two of Cups",
    suit: "cups",
    arcana: "minor",
    number: 2,
    keywords: ["partnership", "unity", "romance", "connection"],
    uprightMeaning: "Unified love, partnership, mutual attraction, connection",
    reversedMeaning: "Imbalance, broken communication, tension"
  },
  {
    id: "three-of-cups",
    name: "Three of Cups",
    suit: "cups",
    arcana: "minor",
    number: 3,
    keywords: ["celebration", "friendship", "community", "joy"],
    uprightMeaning: "Celebration, friendship, creativity, community",
    reversedMeaning: "Independence, alone time, social withdrawal"
  },
  // SWORDS (Air - Thoughts, Communication, Conflict)
  {
    id: "ace-of-swords",
    name: "Ace of Swords",
    suit: "swords",
    arcana: "minor",
    number: 1,
    keywords: ["clarity", "breakthrough", "truth", "mental power"],
    uprightMeaning: "Breakthrough, clarity, sharp mind, new ideas",
    reversedMeaning: "Confusion, chaos, lack of clarity, misinformation"
  },
  {
    id: "two-of-swords",
    name: "Two of Swords",
    suit: "swords",
    arcana: "minor",
    number: 2,
    keywords: ["difficult decisions", "balance", "stalemate", "avoidance"],
    uprightMeaning: "Difficult decisions, weighing options, stalemate",
    reversedMeaning: "Indecision, confusion, information overload"
  },
  {
    id: "three-of-swords",
    name: "Three of Swords",
    suit: "swords",
    arcana: "minor",
    number: 3,
    keywords: ["heartbreak", "sorrow", "grief", "painful truth"],
    uprightMeaning: "Heartbreak, emotional pain, sorrow, grief",
    reversedMeaning: "Recovery, forgiveness, moving on"
  },
  // PENTACLES (Earth - Material, Career, Finances)
  {
    id: "ace-of-pentacles",
    name: "Ace of Pentacles",
    suit: "pentacles",
    arcana: "minor",
    number: 1,
    keywords: ["opportunity", "prosperity", "new venture", "manifestation"],
    uprightMeaning: "New financial opportunity, prosperity, manifestation",
    reversedMeaning: "Lost opportunity, missed chance, bad investment"
  },
  {
    id: "two-of-pentacles",
    name: "Two of Pentacles",
    suit: "pentacles",
    arcana: "minor",
    number: 2,
    keywords: ["balance", "adaptability", "priorities", "juggling"],
    uprightMeaning: "Multiple priorities, time management, adaptability",
    reversedMeaning: "Disorganization, overwhelmed, reprioritization"
  },
  {
    id: "three-of-pentacles",
    name: "Three of Pentacles",
    suit: "pentacles",
    arcana: "minor",
    number: 3,
    keywords: ["teamwork", "collaboration", "skill", "learning"],
    uprightMeaning: "Teamwork, collaboration, learning, building",
    reversedMeaning: "Lack of teamwork, disharmony, misalignment"
  },
  // Complete remaining WANDS
  { id: "four-of-wands", name: "Four of Wands", suit: "wands", arcana: "minor", number: 4, keywords: ["celebration", "harmony", "homecoming"], uprightMeaning: "Celebration, joy, harmony, relaxation", reversedMeaning: "Transition, lack of harmony" },
  { id: "five-of-wands", name: "Five of Wands", suit: "wands", arcana: "minor", number: 5, keywords: ["conflict", "competition", "tension"], uprightMeaning: "Conflict, disagreements, competition", reversedMeaning: "Inner conflict, avoiding conflict" },
  { id: "six-of-wands", name: "Six of Wands", suit: "wands", arcana: "minor", number: 6, keywords: ["success", "victory", "recognition"], uprightMeaning: "Success, public recognition, progress", reversedMeaning: "Private victory, self-doubt" },
  { id: "seven-of-wands", name: "Seven of Wands", suit: "wands", arcana: "minor", number: 7, keywords: ["challenge", "perseverance", "protection"], uprightMeaning: "Challenge, competition, perseverance", reversedMeaning: "Exhaustion, giving up, overwhelmed" },
  { id: "eight-of-wands", name: "Eight of Wands", suit: "wands", arcana: "minor", number: 8, keywords: ["movement", "action", "swiftness"], uprightMeaning: "Movement, fast paced change, action", reversedMeaning: "Delays, frustration, resisting change" },
  { id: "nine-of-wands", name: "Nine of Wands", suit: "wands", arcana: "minor", number: 9, keywords: ["resilience", "courage", "persistence"], uprightMeaning: "Resilience, courage, persistence", reversedMeaning: "Inner resources, struggle, overwhelm" },
  { id: "ten-of-wands", name: "Ten of Wands", suit: "wands", arcana: "minor", number: 10, keywords: ["burden", "responsibility", "hard work"], uprightMeaning: "Burden, extra responsibility, hard work", reversedMeaning: "Doing it all, delegation" },
  { id: "page-of-wands", name: "Page of Wands", suit: "wands", arcana: "minor", keywords: ["inspiration", "ideas", "discovery"], uprightMeaning: "Inspiration, ideas, discovery, potential", reversedMeaning: "Newly formed ideas, self-limiting beliefs" },
  { id: "knight-of-wands", name: "Knight of Wands", suit: "wands", arcana: "minor", keywords: ["energy", "passion", "adventure"], uprightMeaning: "Energy, passion, inspired action", reversedMeaning: "Passion project, haste, scattered energy" },
  { id: "queen-of-wands", name: "Queen of Wands", suit: "wands", arcana: "minor", keywords: ["courage", "confidence", "independence"], uprightMeaning: "Courage, confidence, independence", reversedMeaning: "Self-respect, introverted" },
  { id: "king-of-wands", name: "King of Wands", suit: "wands", arcana: "minor", keywords: ["leadership", "vision", "honour"], uprightMeaning: "Natural leader, vision, entrepreneur", reversedMeaning: "Impulsiveness, haste, ruthless" },
  // Complete remaining CUPS
  { id: "four-of-cups", name: "Four of Cups", suit: "cups", arcana: "minor", number: 4, keywords: ["meditation", "contemplation", "apathy"], uprightMeaning: "Meditation, contemplation, apathy", reversedMeaning: "Retreat, checking in for alignment" },
  { id: "five-of-cups", name: "Five of Cups", suit: "cups", arcana: "minor", number: 5, keywords: ["regret", "loss", "disappointment"], uprightMeaning: "Regret, failure, disappointment", reversedMeaning: "Personal setbacks, self-forgiveness" },
  { id: "six-of-cups", name: "Six of Cups", suit: "cups", arcana: "minor", number: 6, keywords: ["nostalgia", "memories", "innocence"], uprightMeaning: "Revisiting past, childhood memories", reversedMeaning: "Living in past, forgiveness" },
  { id: "seven-of-cups", name: "Seven of Cups", suit: "cups", arcana: "minor", number: 7, keywords: ["opportunities", "choices", "illusion"], uprightMeaning: "Opportunities, choices, wishful thinking", reversedMeaning: "Alignment, personal values" },
  { id: "eight-of-cups", name: "Eight of Cups", suit: "cups", arcana: "minor", number: 8, keywords: ["disappointment", "abandonment", "withdrawal"], uprightMeaning: "Disappointment, abandonment, withdrawal", reversedMeaning: "Trying one more time, indecision" },
  { id: "nine-of-cups", name: "Nine of Cups", suit: "cups", arcana: "minor", number: 9, keywords: ["wishes", "contentment", "satisfaction"], uprightMeaning: "Contentment, satisfaction, wish come true", reversedMeaning: "Inner happiness, materialism" },
  { id: "ten-of-cups", name: "Ten of Cups", suit: "cups", arcana: "minor", number: 10, keywords: ["harmony", "happiness", "alignment"], uprightMeaning: "Divine love, blissful relationships, harmony", reversedMeaning: "Disconnection, misaligned values" },
  { id: "page-of-cups", name: "Page of Cups", suit: "cups", arcana: "minor", keywords: ["creative opportunities", "intuition", "curiosity"], uprightMeaning: "Creative opportunities, intuitive messages", reversedMeaning: "New ideas, doubting intuition" },
  { id: "knight-of-cups", name: "Knight of Cups", suit: "cups", arcana: "minor", keywords: ["romance", "charm", "imagination"], uprightMeaning: "Romance, charm, imagination, beauty", reversedMeaning: "Overactive imagination, unrealistic" },
  { id: "queen-of-cups", name: "Queen of Cups", suit: "cups", arcana: "minor", keywords: ["compassion", "intuition", "warmth"], uprightMeaning: "Compassionate, emotionally stable, intuitive", reversedMeaning: "Inner feelings, self-care, self-love" },
  { id: "king-of-cups", name: "King of Cups", suit: "cups", arcana: "minor", keywords: ["emotional balance", "diplomacy", "compassion"], uprightMeaning: "Emotionally balanced, compassionate, wise", reversedMeaning: "Emotional manipulation, volatility" },
  // Complete remaining SWORDS
  { id: "four-of-swords", name: "Four of Swords", suit: "swords", arcana: "minor", number: 4, keywords: ["rest", "restoration", "contemplation"], uprightMeaning: "Rest, relaxation, meditation, recuperation", reversedMeaning: "Exhaustion, burnout, stagnation" },
  { id: "five-of-swords", name: "Five of Swords", suit: "swords", arcana: "minor", number: 5, keywords: ["conflict", "defeat", "win at all costs"], uprightMeaning: "Unbridled ambition, win at all costs", reversedMeaning: "Personal dignity, end of conflict" },
  { id: "six-of-swords", name: "Six of Swords", suit: "swords", arcana: "minor", number: 6, keywords: ["transition", "change", "rite of passage"], uprightMeaning: "Transition, change, releasing baggage", reversedMeaning: "Personal transition, resistance to change" },
  { id: "seven-of-swords", name: "Seven of Swords", suit: "swords", arcana: "minor", number: 7, keywords: ["deception", "strategy", "betrayal"], uprightMeaning: "Betrayal, deception, acting strategically", reversedMeaning: "Imposter syndrome, self-deceit" },
  { id: "eight-of-swords", name: "Eight of Swords", suit: "swords", arcana: "minor", number: 8, keywords: ["restriction", "imprisonment", "victim mentality"], uprightMeaning: "Negative thoughts, self-imposed restriction", reversedMeaning: "Self-limiting beliefs, inner critic" },
  { id: "nine-of-swords", name: "Nine of Swords", suit: "swords", arcana: "minor", number: 9, keywords: ["anxiety", "worry", "fear"], uprightMeaning: "Anxiety, worry, fear, nightmares", reversedMeaning: "Inner turmoil, deep-seated fears" },
  { id: "ten-of-swords", name: "Ten of Swords", suit: "swords", arcana: "minor", number: 10, keywords: ["painful endings", "betrayal", "loss"], uprightMeaning: "Painful endings, deep wounds, crisis", reversedMeaning: "Recovery, regeneration, resisting end" },
  { id: "page-of-swords", name: "Page of Swords", suit: "swords", arcana: "minor", keywords: ["new ideas", "curiosity", "thirst for knowledge"], uprightMeaning: "New ideas, curiosity, communicating", reversedMeaning: "Self-expression, all talk no action" },
  { id: "knight-of-swords", name: "Knight of Swords", suit: "swords", arcana: "minor", keywords: ["action", "impulsiveness", "ambition"], uprightMeaning: "Ambitious, action-oriented, driven to succeed", reversedMeaning: "Restless, unfocused, burn-out" },
  { id: "queen-of-swords", name: "Queen of Swords", suit: "swords", arcana: "minor", keywords: ["independent", "unbiased", "clear thinking"], uprightMeaning: "Independent, unbiased judgement, direct", reversedMeaning: "Overly-emotional, cold, bitter" },
  { id: "king-of-swords", name: "King of Swords", suit: "swords", arcana: "minor", keywords: ["intellectual power", "authority", "truth"], uprightMeaning: "Mental clarity, intellectual power, truth", reversedMeaning: "Quiet power, misuse of power" },
  // Complete remaining PENTACLES
  { id: "four-of-pentacles", name: "Four of Pentacles", suit: "pentacles", arcana: "minor", number: 4, keywords: ["security", "conservation", "scarcity"], uprightMeaning: "Saving money, security, conservatism", reversedMeaning: "Over-spending, greed, self-protection" },
  { id: "five-of-pentacles", name: "Five of Pentacles", suit: "pentacles", arcana: "minor", number: 5, keywords: ["financial loss", "poverty", "insecurity"], uprightMeaning: "Financial loss, poverty, isolation", reversedMeaning: "Recovery from financial loss" },
  { id: "six-of-pentacles", name: "Six of Pentacles", suit: "pentacles", arcana: "minor", number: 6, keywords: ["generosity", "charity", "sharing"], uprightMeaning: "Generosity, charity, sharing wealth", reversedMeaning: "Self-care, unpaid debts" },
  { id: "seven-of-pentacles", name: "Seven of Pentacles", suit: "pentacles", arcana: "minor", number: 7, keywords: ["long-term vision", "perseverance", "investment"], uprightMeaning: "Long-term view, perseverance, investment", reversedMeaning: "Lack of long-term vision, impatience" },
  { id: "eight-of-pentacles", name: "Eight of Pentacles", suit: "pentacles", arcana: "minor", number: 8, keywords: ["apprenticeship", "skill", "mastery"], uprightMeaning: "Apprenticeship, mastery, skill development", reversedMeaning: "Self-development, perfectionism" },
  { id: "nine-of-pentacles", name: "Nine of Pentacles", suit: "pentacles", arcana: "minor", number: 9, keywords: ["abundance", "luxury", "independence"], uprightMeaning: "Abundance, luxury, self-sufficiency", reversedMeaning: "Self-worth, over-investment in work" },
  { id: "ten-of-pentacles", name: "Ten of Pentacles", suit: "pentacles", arcana: "minor", number: 10, keywords: ["wealth", "legacy", "family"], uprightMeaning: "Wealth, financial security, long-term success", reversedMeaning: "Financial failure, loneliness" },
  { id: "page-of-pentacles", name: "Page of Pentacles", suit: "pentacles", arcana: "minor", keywords: ["manifestation", "opportunities", "new ventures"], uprightMeaning: "Manifestation, financial opportunity", reversedMeaning: "Lack of progress, procrastination" },
  { id: "knight-of-pentacles", name: "Knight of Pentacles", suit: "pentacles", arcana: "minor", keywords: ["hard work", "efficiency", "responsibility"], uprightMeaning: "Hard work, productivity, routine, efficiency", reversedMeaning: "Self-discipline, boredom, feeling stuck" },
  { id: "queen-of-pentacles", name: "Queen of Pentacles", suit: "pentacles", arcana: "minor", keywords: ["nurturing", "practical", "providing"], uprightMeaning: "Nurturing, practical, providing financially", reversedMeaning: "Financial independence, self-care" },
  { id: "king-of-pentacles", name: "King of Pentacles", suit: "pentacles", arcana: "minor", keywords: ["wealth", "business", "abundance"], uprightMeaning: "Wealth, business success, leadership, security", reversedMeaning: "Financially inept, obsessed with wealth" }
];

export interface TarotReading {
  cards: {
    card: TarotCard;
    position: string;
    reversed: boolean;
  }[];
  spread: string;
  question?: string;
}

export function drawCards(count: number): TarotReading["cards"] {
  const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
  const positions = ["Past", "Present", "Future", "Advice", "Outcome"];
  
  return shuffled.slice(0, count).map((card, index) => ({
    card,
    position: positions[index] || `Card ${index + 1}`,
    reversed: Math.random() > 0.5
  }));
}
