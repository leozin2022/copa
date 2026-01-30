
import { createClient } from '@supabase/supabase-js';

// URL e Chave Anon fornecidas pelo usuário para conexão direta com o banco de dados
const supabaseUrl = 'https://kuarblmlafyidkwifpil.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1YXJibG1sYWZ5aWRrd2lmcGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NDAzNTIsImV4cCI6MjA4NTMxNjM1Mn0.RY2QqQVIRryazRKYf1786QntYBLqFFSIWWWc0Vvtcqk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
