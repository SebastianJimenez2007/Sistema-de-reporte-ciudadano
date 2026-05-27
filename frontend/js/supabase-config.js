
const SUPABASE_URL = 'https://jafoecicahqdlyazxqqk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphZm9lY2ljYWhxZGx5YXp4cXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTAyMjcsImV4cCI6MjA5NTM4NjIyN30.dN5Vz5YsKz6FwT1ltz0t67yIxrB6W2blSu3g5a17mRM';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase };