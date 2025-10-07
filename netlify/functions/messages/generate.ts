import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function detectEmotion(text: string): Promise<{ emotion: string; confidence: number }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert in emotional intelligence. Identify the primary emotion from: hopeful, stressed, in love, lost, grateful, anxious, peaceful, uncertain, empowered. Respond with JSON: { "emotion": string, "confidence": number }`,
        },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      emotion: result.emotion || "uncertain",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
    };
  } catch (error) {
    console.error('Emotion detection error:', error);
    return { emotion: "uncertain", confidence: 0.5 };
  }
}

async function generateMessage(
  feeling: string,
  emotion: string,
  horoscopeContext?: string,
  religion?: string,
  language: string = "English"
): Promise<string> {
  const toneMap: Record<string, string> = {
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

  let systemContent = `You are a divine oracle. Create a personalized message that is ${tone}. Use 4-5 sentences. Reference their exact words. Make it specific and actionable. Write completely in ${language}.`;

  if (horoscopeContext) {
    systemContent += `\n\nASTROLOGICAL CONTEXT (mention specific elements/animals by name):\n${horoscopeContext}`;
  }

  if (religion) {
    systemContent += `\n\nSPIRITUAL CONTEXT: The person follows ${religion}. Weave in relevant wisdom naturally.`;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: `Their exact words: "${feeling}". Create a personalized message in ${language}.` },
    ],
    max_completion_tokens: 400,
    temperature: 0.9,
  });

  return response.choices[0].message.content || "The universe holds infinite wisdom for you.";
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method not allowed' }) };
  }

  try {
    const { feeling, userId, uiLanguage } = JSON.parse(event.body || '{}');

    if (!feeling || !userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    // Check soul gems
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user || user.soul_gems < 1) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ message: 'Insufficient Soul Gems', soulGems: 0 }),
      };
    }

    // Generate message
    const emotionAnalysis = await detectEmotion(feeling);
    const language = uiLanguage || "English";
    const message = await generateMessage(
      feeling,
      emotionAnalysis.emotion,
      undefined,
      user.religion || undefined,
      language
    );

    // Deduct gem and save message
    await supabase
      .from('users')
      .update({ soul_gems: user.soul_gems - 1 })
      .eq('id', userId);

    await supabase
      .from('messages')
      .insert({
        user_id: userId,
        input: feeling,
        ai_response: message,
        emotion: emotionAnalysis.emotion,
        type: 'message',
      });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message,
        emotion: emotionAnalysis.emotion,
        soulGems: user.soul_gems - 1,
      }),
    };
  } catch (error: any) {
    console.error('Message generation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error generating message: ' + error.message }),
    };
  }
};