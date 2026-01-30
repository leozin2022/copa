
// Since actual Supabase keys are environment-specific, 
// we assume createClient will work with injected process.env.
// For this demo, we'll provide a mockable interface or a real client if available.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Nota: Como este é um ambiente de demonstração, as funções de dados
 * falharão se as chaves não forem válidas. Em um app real, 
 * você preencheria as tabelas: teams, matches, craque_partida.
 */
