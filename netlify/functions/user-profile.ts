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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // GET /api/user/profile/:userId
    if (event.httpMethod === 'GET') {
      const userId = event.path.split('/').pop();
      
      if (!userId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'User ID required' }),
        };
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(user),
      };
    }

    // POST /api/user/profile (update)
    if (event.httpMethod === 'POST') {
      const {
        userId,
        birthDate,
        birthTime,
        birthPlace,
        religion,
        horoscopePreferences,
      } = JSON.parse(event.body || '{}');

      if (!userId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'User ID required' }),
        };
      }

      const { error } = await supabase
        .from('users')
        .update({
          birth_date: birthDate,
          birth_time: birthTime,
          birth_place: birthPlace,
          religion: religion,
          horoscope_preferences: horoscopePreferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  } catch (error: any) {
    console.error('Profile error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error: ' + error.message }),
    };
  }
};