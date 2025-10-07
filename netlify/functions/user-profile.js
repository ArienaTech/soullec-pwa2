const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
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
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (event.httpMethod === 'POST') {
      const { userId, birthDate, birthTime, birthPlace, religion, horoscopePreferences } = JSON.parse(event.body || '{}');

      if (!userId) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'User ID required' }) };
      }

      await supabase
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

      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    if (event.httpMethod === 'GET') {
      const pathParts = event.path.split('/');
      const userId = pathParts[pathParts.length - 1];
      
      if (!userId || userId === 'user-profile') {
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'User ID required' }) };
      }

      const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
      return { statusCode: 200, headers, body: JSON.stringify(user) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method not allowed' }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Error: ' + error.message }) };
  }
};