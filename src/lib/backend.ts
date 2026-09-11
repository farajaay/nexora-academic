import { createClient } from "@supabase/supabase-js";
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const db =
  url && key
    ? createClient(url, key, { auth: { persistSession: false } })
    : null;
export type Order = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  stage: string;
  major: string;
  service: string;
  description: string;
  quantity: number;
  pages: number;
  language: string;
  deadline: string;
  difficulty: string;
  extras: string[];
  files_url: string;
  preferred_contact: string;
  status: string;
  quoted_total: number | null;
};
export type Payment = {
  id: string;
  order_id: string;
  amount: number;
  reference: string;
  paid_at: string;
};
