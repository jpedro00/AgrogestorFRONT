import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import { Platform } from "react-native";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const hasAuthConfiguration = Boolean(url || key);
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: {
          ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: Platform.OS === "web",
          lock: processLock,
        },
      })
    : null;

export function requireSupabase() {
  if (!supabase)
    throw new Error(
      "Cadastro indisponível: a conexão com o banco ainda não foi configurada.",
    );
  return supabase;
}
