import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnon)
  throw new Error("Supabase keys are required");

export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnon);
