import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    let userId = body.userId;

    // Create or get user
    if (!userId) {
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({ email: null })
        .select()
        .single();

      if (error) throw error;
      userId = newUser.id;
    } else {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!existingUser) {
        const { data: newUser, error } = await supabase
          .from('users')
          .insert({ email: null })
          .select()
          .single();

        if (error) throw error;
        userId = newUser.id;
      } else {
        // Refresh daily gems if needed
        const today = new Date().toISOString().split('T')[0];
        if (existingUser.last_free_gems_date !== today && existingUser.subscription_status !== 'premium') {
          await supabase
            .from('users')
            .update({
              soul_gems: (existingUser.soul_gems || 0) + 1,
              last_free_gems_date: today,
            })
            .eq('id', userId);
        }
      }
    }

    // Get updated user data
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        userId,
        soulGems: user?.soul_gems || 1,
        isPremium: user?.subscription_status === 'premium',
      }),
    };
  } catch (error: any) {
    console.error('Session error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error creating session: ' + error.message }),
    };
  }
};