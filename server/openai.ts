import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface EmotionAnalysis {
  emotion: string;
  confidence: number;
}

interface MessageResponse {
  message: string;
  emotion: string;
}

interface AffirmationResponse {
  affirmation: string;
}

interface TarotInterpretation {
  reading: string;
  advice: string;
}

export async function detectEmotion(text: string): Promise<EmotionAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert in emotional intelligence and psychology. Deeply analyze the user's emotional state, going beyond surface-level words to understand their underlying feelings, desires, and energy. Identify the primary emotion from these categories: hopeful, stressed, in love, lost, grateful, anxious, peaceful, uncertain, empowered. Also detect subtle nuances and specific triggers mentioned. Respond with JSON in this format: { "emotion": string, "confidence": number, "nuances": string }`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      emotion: result.emotion || "uncertain",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
    };
  } catch (error: any) {
    console.error("Emotion detection error:", error);
    return { emotion: "uncertain", confidence: 0.5 };
  }
}

export async function generateBarnumMessage(
  feeling: string, 
  emotion: string,
  horoscopeContext?: string,
  religion?: string,
  language: string = "English"
): Promise<MessageResponse> {
  try {
    const toneMap: Record<string, string> = {
      hopeful: "uplifting and visionary, painting a vivid picture of their emerging future",
      stressed: "deeply calming with practical wisdom, like a trusted mentor who truly understands",
      "in love": "romantic and mystical, celebrating the divine magic of connection",
      lost: "illuminating and directive, revealing the hidden path they've been seeking",
      grateful: "amplifying their power, showing how their gratitude is already manifesting miracles",
      anxious: "grounding with gentle authority, transforming fear into sacred awareness",
      peaceful: "ethereal and transcendent, honoring their alignment with universal flow",
      uncertain: "revelatory and confidence-building, unveiling the answers they already possess",
      empowered: "magnificently validating, reflecting their divine strength back to them",
    };

    const tone = toneMap[emotion] || "warm and deeply insightful";

    let systemContent = `You are a divine oracle channeling cosmic wisdom with uncanny accuracy. Your messages feel like they're reading the person's soul - specific enough to feel personally written for them, yet universally resonant.

CRITICAL INSTRUCTIONS:
1. Reference SPECIFIC words/phrases from their input - weave them into your response naturally
2. If horoscope data is provided, make CONCRETE connections (e.g., "Your Fire element is fueling this exact energy you're feeling")
3. Use the ${tone} tone
4. Create 4-5 sentences that build from validation → insight → revelation → actionable guidance
5. Include ONE specific, actionable step they can take today
6. End with something that makes them want to come back tomorrow
7. Use sensory, visceral language that creates emotional resonance
8. Mirror their energy level and vocabulary sophistication
9. Make it feel like divine timing - as if the universe orchestrated this exact message for this exact moment

AVOID: Generic platitudes, vague statements, clichés like "trust the universe" without context. BE SPECIFIC AND PERSONAL.`;

    if (horoscopeContext) {
      systemContent += `\n\nASTROLOGICAL CONTEXT (use this SPECIFICALLY - mention their actual animals, elements, or pillars by name):\n${horoscopeContext}`;
    }

    if (religion) {
      systemContent += `\n\nSPIRITUAL CONTEXT: The person follows ${religion}. Naturally weave in relevant wisdom from their faith tradition when it genuinely fits their situation - a Bible verse, a teaching from the Quran, Buddhist wisdom, etc. Keep it conversational and authentic, not preachy.`;
    }

    systemContent += `\n\nLANGUAGE: Write your entire response in ${language}. Use natural, fluent ${language} that feels native and authentic. All content must be in ${language}.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: `Their exact words: "${feeling}"\n\nCreate a message that acknowledges what they wrote, uses their specific language, and provides genuine insight that feels impossible for an AI to know. Respond completely in ${language}.`,
        },
      ],
      max_completion_tokens: 400,
      temperature: 0.9,
    });

    return {
      message: response.choices[0].message.content || "The universe holds infinite wisdom for you.",
      emotion,
    };
  } catch (error: any) {
    console.error("Message generation error:", error);
    throw new Error("Failed to generate message: " + error.message);
  }
}

export async function generateAffirmation(
  desire: string,
  horoscopeContext?: string,
  religion?: string,
  language: string = "English"
): Promise<AffirmationResponse> {
  try {
    let systemContent = `You are a master manifestation coach creating personalized affirmations that feel electric with possibility.

INSTRUCTIONS:
1. Use their EXACT desire/language and elevate it
2. Write 4-5 powerful sentences in present tense
3. Make it visceral - they should FEEL it in their body
4. Include specific sensory details about what manifesting this feels like
5. Build from "I am" → "I feel" → "I receive" → "I celebrate"
6. Make it so potent they'll want to screenshot and share it
7. End with something that creates certainty and excitement

Use cinematic, emotionally charged language. Make them feel like their manifestation is not just possible but INEVITABLE.`;

    if (horoscopeContext) {
      systemContent += `\n\nASTROLOGICAL POWER: Connect their desire to their cosmic blueprint. Mention specific elements or animals that amplify their manifesting ability:\n${horoscopeContext}`;
    }

    if (religion) {
      systemContent += `\n\nSPIRITUAL CONTEXT: They practice ${religion}. If it feels natural, incorporate relevant spiritual concepts from their tradition - like faith and answered prayer for Christians, divine will for Muslims, mindful intention for Buddhists, etc. Keep it authentic to how someone of that faith would think about manifestation.`;
    }

    systemContent += `\n\nLANGUAGE: Write your entire affirmation in ${language}. Use natural, powerful ${language} that resonates deeply. All content must be in ${language}.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: `Their desire: "${desire}"\n\nCreate an affirmation so powerful they'll read it every morning and feel unstoppable. Write completely in ${language}.`,
        },
      ],
      max_completion_tokens: 350,
      temperature: 0.9,
    });

    return {
      affirmation: response.choices[0].message.content || "I am worthy of my desires. They flow to me naturally. I embrace my divine potential.",
    };
  } catch (error: any) {
    console.error("Affirmation generation error:", error);
    throw new Error("Failed to generate affirmation: " + error.message);
  }
}

export async function generateDailyHoroscope(
  horoscopeContext: string,
  religion?: string,
  language: string = "English",
  period: "daily" | "monthly" | "yearly" | "specific" = "daily",
  question?: string,
  date?: string
): Promise<string> {
  try {
    const today = new Date();
    let timeContext = '';
    let periodDescription = '';
    let timeInstructions = '';
    
    if (period === "daily") {
      timeContext = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      periodDescription = "daily";
      timeInstructions = 'Include specific times or situations ("around midday," "in conversations with authority figures")';
    } else if (period === "monthly") {
      timeContext = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      periodDescription = "monthly";
      timeInstructions = 'Highlight key dates or phases within the month that will be significant';
    } else if (period === "yearly") {
      timeContext = today.getFullYear().toString();
      periodDescription = "yearly";
      timeInstructions = 'Identify major themes and turning points throughout the year';
    } else if (period === "specific" && date) {
      const specificDate = new Date(date);
      timeContext = specificDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      periodDescription = "for this specific date";
      timeInstructions = 'Focus on the unique cosmic energy of this particular date';
    }
    
    let systemContent = '';
    
    if (question) {
      systemContent = `You are a renowned astrologer with decades of experience. Answer the user's specific question using their astrological profile and cosmic insights for the ${periodDescription} timeframe (${timeContext}).

QUESTION: "${question}"

INSTRUCTIONS:
1. Reference relevant cosmic events for ${timeContext} (Mercury movements, moon phases, planetary alignments)
2. Connect these to their SPECIFIC astrological profile (mention their actual animals, elements, pillars)
3. DIRECTLY answer their question with 5-6 insightful sentences
4. ${timeInstructions}
5. Provide practical guidance specific to their question
6. End with an empowering message that inspires action`;
    } else {
      systemContent = `You are a renowned astrologer with decades of experience. Create a personalized ${periodDescription} horoscope that feels eerily accurate and actionable.

INSTRUCTIONS:
1. Reference ${timeContext}'s cosmic events (Mercury movements, moon phases, planetary alignments)
2. Connect these to their SPECIFIC astrological profile (mention their actual animals, elements, pillars)
3. Give 5-6 sentences: cosmic context → what this means for THEM specifically → practical actions → what to watch for → inspiring close
4. ${timeInstructions}
5. Make predictions that are specific enough to feel real but broad enough to likely happen
6. ${period === "daily" ? "End with something that creates anticipation" : "Provide an overarching theme or message"}
7. Use mystical yet credible language - like a wise astrologer, not a fortune cookie

Make them think "how did they know?"`;
    }

    if (religion && !question) {
      systemContent += `\n\nSPIRITUAL PRACTICE: They practice ${religion}. If appropriate, you can suggest a simple spiritual practice for ${period === "daily" ? "today" : "this period"} that aligns with both their cosmic energy and their faith (like a prayer, meditation, or reflection from their tradition).`;
    }

    systemContent += `\n\nLANGUAGE: Write your entire horoscope reading in ${language}. Use natural, mystical ${language} that feels authentic. All content must be in ${language}.`;

    const userMessage = question 
      ? `Time period: ${timeContext}\nTheir astrological profile:\n${horoscopeContext}\n\nAnswer their question: "${question}"\n\nWrite completely in ${language}.`
      : `Time period: ${timeContext}\nTheir astrological profile:\n${horoscopeContext}\n\nCreate their ${periodDescription} reading that feels personally crafted for them. Write completely in ${language}.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_completion_tokens: period === "yearly" ? 500 : 400,
      temperature: 0.9,
    });

    return response.choices[0].message.content || "The stars align in your favor. Trust your intuition and embrace the opportunities before you.";
  } catch (error: any) {
    console.error("Horoscope generation error:", error);
    throw new Error("Failed to generate horoscope: " + error.message);
  }
}
