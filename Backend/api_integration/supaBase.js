const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[supabase] ⚠️ Missing SUPABASE_URL or SUPABASE_ANON_KEY. Client not initialized.');
    module.exports = null;
} else {
    // Only log once
    if (!global.supabaseClient) {
        console.log('[supabase] ✅ Supabase client initialized');
        global.supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    module.exports = global.supabaseClient;
}
