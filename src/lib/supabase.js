import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvvcethlbvomtvwnabqg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dmNldGhsYnZvbXR2d25hYnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5OTc3NzAsImV4cCI6MjEwNjU3Mzc3MH0.xQXEG07Os935qVAJLCkkiyE2C686_qrNPi3trrCHBjA';

export const supabase = createClient(supabaseUrl, supabaseKey);
