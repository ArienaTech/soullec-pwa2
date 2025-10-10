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
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const { feeling, userId, uiLanguage } = JSON.parse(event.body || '{}');

    if (!feeling || !userId) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing required fields' }) };
    }

    const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();

    if (!user || user.soul_gems < 1) {
      return { statusCode: 403, headers, body: JSON.stringify({ message: 'Insufficient Soul Gems', soulGems: 0 }) };
    }

    const emotionResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are an expert in emotional intelligence. Identify the primary emotion from: hopeful, stressed, in love, lost, grateful, anxious, peaceful, uncertain, empowered. Respond with JSON: { "emotion": string, "confidence": number }` },
        { role: "user", content: feeling }
      ],
      response_format: { type: "json_object" },
    });

    const emotionResult = JSON.parse(emotionResponse.choices[0].message.content || "{}");
    const emotion = emotionResult.emotion || "uncertain";

    const toneMap = {
      hopeful: "uplifting and visionary",
      stressed: "deeply calming with practical wisdom",
      "in love": "romantic and mystical",
      lost: "illuminating and directive",
      grateful: "amplifying their power",
      anxious: "grounding with gentle authority",
      peaceful: "ethereal and transcendent",
      uncertain: "revelatory and confidence-building",
      empowered: "magnificently validating",
    };

    const tone = toneMap[emotion] || "warm and deeply insightful";
    const language = uiLanguage || "English";

    let systemContent = `You are a divine oracle. Create a personalized message that is ${tone}. Use 4-5 sentences. Reference their exact words. Make it specific and actionable. Write completely in ${language}.`;

    if (user.religion) {
      systemContent += `\n\nSPIRITUAL CONTEXT: The person follows ${user.religion}. Weave in relevant wisdom naturally.`;
    }

    const messageResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: `Their exact words: "${feeling}". Create a personalized message in ${language}.` }
      ],
      max_completion_tokens: 400,
      temperature: 0.9,
    });

    const message = messageResponse.choices[0].message.content || "The universe holds infinite wisdom for you.";

    await supabase.from('users').update({ soul_gems: user.soul_gems - 1 }).eq('id', userId);
    await supabase.from('messages').insert({ user_id: userId, input: feeling, ai_response: message, emotion: emotion, type: 'message' });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message, emotion: emotion, soulGems: user.soul_gems - 1 }),
    };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Error: ' + error.message }) };
  }
};