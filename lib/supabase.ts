import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Prefixo de isolamento para tabelas IRONLOG no projeto Supabase compartilhado */
export const IRONLOG_TABLE_PREFIX = "ironlog_";

export function ironlogTable(name: string) {
  return `${IRONLOG_TABLE_PREFIX}${name}`;
}
