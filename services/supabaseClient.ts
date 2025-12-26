
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://lwqvfqhcvfkprxmigzkp.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_zqsMoIo_ZpF3CHS9wZ2GXA_dhi5v84R';

export const supabase = createClient(supabaseUrl, supabaseKey);
