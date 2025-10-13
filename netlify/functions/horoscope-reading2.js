const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai').default;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Initialize Supabase and OpenAI with environment variables from Netlify
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const { userId, uiLanguage, period = "daily", question, date } = JSON.parse(event.body || '{}');

    if (!userId) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing userId' }) };
    }

    if (!["daily", "monthly", "yearly", "specific"].includes(period)) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Invalid period. Must be one of: daily, monthly, yearly, specific' }) };
    }

    if (period === "specific" && !date) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Date is required for specific period' }) };
    }

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return { statusCode: 404, headers, body: JSON.stringify({ message: 'User not found' }) };
    }

    // Check Soul Gems balance
    if (user.soul_gems < 1) {
      return { 
        statusCode: 403, 
        headers, 
        body: JSON.stringify({ message: 'Insufficient Soul Gems', soulGems: 0 }) 
      };
    }

    // Check if user has birth info set up
    if (!user.birth_date) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ message: 'Please set up your birth info first' }) 
      };
    }

    // Build horoscope context from user's birth info
    const birthDate = new Date(user.birth_date);
    const language = uiLanguage || "English";
    
    // Calculate basic astrological data
    const westernZodiac = getWesternZodiacSign(birthDate);
    const chineseZodiac = getChineseZodiacSign(birthDate.getFullYear());
    
    const horoscopeContext = `
Western Zodiac: ${westernZodiac}
Chinese Zodiac: ${chineseZodiac}
Birth Date: ${birthDate.toLocaleDateString('en-US')}
${user.birth_time ? `Birth Time: ${user.birth_time}` : ''}
${user.birth_place ? `Birth Place: ${user.birth_place}` : ''}
    `.trim();

    // Prepare time context based on period
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

    // Build system prompt
    let systemContent = '';
    
    if (question) {
      systemContent = `You are a renowned astrologer with decades of experience. Answer the user's specific question using their astrological profile and cosmic insights for the ${periodDescription} timeframe (${timeContext}).

QUESTION: "${question}"

INSTRUCTIONS:
1. Reference relevant cosmic events for ${timeContext} (Mercury movements, moon phases, planetary alignments)
2. Connect these to their SPECIFIC astrological profile (${westernZodiac} sign, ${chineseZodiac} animal)
3. DIRECTLY answer their question with 5-6 insightful sentences
4. ${timeInstructions}
5. Provide practical guidance specific to their question
6. End with an empowering message that inspires action`;
    } else {
      systemContent = `You are a renowned astrologer with decades of experience. Create a personalized ${periodDescription} horoscope that feels eerily accurate and actionable.

INSTRUCTIONS:
1. Reference ${timeContext}'s cosmic events (Mercury movements, moon phases, planetary alignments)
2. Connect these to their SPECIFIC astrological profile (${westernZodiac} sign, ${chineseZodiac} animal)
3. Give 5-6 sentences: cosmic context → what this means for THEM specifically → practical actions → what to watch for → inspiring close
4. ${timeInstructions}
5. Make predictions that are specific enough to feel real but broad enough to likely happen
6. ${period === "daily" ? "End with something that creates anticipation" : "Provide an overarching theme or message"}
7. Use mystical yet credible language - like a wise astrologer, not a fortune cookie

Make them think "how did they know?"`;
    }

    if (user.religion && !question) {
      systemContent += `\n\nSPIRITUAL PRACTICE: They practice ${user.religion}. If appropriate, you can suggest a simple spiritual practice for ${period === "daily" ? "today" : "this period"} that aligns with both their cosmic energy and their faith (like a prayer, meditation, or reflection from their tradition).`;
    }

    systemContent += `\n\nLANGUAGE: Write your entire horoscope reading in ${language}. Use natural, mystical ${language} that feels authentic. All content must be in ${language}.`;

    const userMessage = question 
      ? `Time period: ${timeContext}\nTheir astrological profile:\n${horoscopeContext}\n\nAnswer their question: "${question}"\n\nWrite completely in ${language}.`
      : `Time period: ${timeContext}\nTheir astrological profile:\n${horoscopeContext}\n\nCreate their ${periodDescription} reading that feels personally crafted for them. Write completely in ${language}.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userMessage }
      ],
      max_completion_tokens: period === "yearly" ? 500 : 400,
      temperature: 0.9,
    });

    const horoscope = response.choices[0].message.content || "The stars align in your favor. Trust your intuition and embrace the opportunities before you.";

    // Save message to database
    const inputText = question 
      ? `${period.charAt(0).toUpperCase() + period.slice(1)} Horoscope Reading2 - Question: ${question}`
      : `${period.charAt(0).toUpperCase() + period.slice(1)} Horoscope Reading2${date ? ` for ${date}` : ''}`;

    await supabase.from('messages').insert({
      user_id: userId,
      input: inputText,
      ai_response: horoscope,
      type: 'horoscope',
    });

    // Deduct 1 Soul Gem
    const { data: updatedUser } = await supabase
      .from('users')
      .update({ soul_gems: user.soul_gems - 1 })
      .eq('id', userId)
      .select()
      .single();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        horoscope: horoscope,
        soulGems: updatedUser ? updatedUser.soul_gems : user.soul_gems - 1
      }),
    };
  } catch (error) {
    console.error('Horoscope Reading2 error:', error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ message: 'Error generating horoscope: ' + error.message }) 
    };
  }
};

// Helper function to get Western Zodiac sign
function getWesternZodiacSign(date) {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

// Helper function to get Chinese Zodiac sign
function getChineseZodiacSign(year) {
  const animals = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat"];
  return animals[year % 12];
}
