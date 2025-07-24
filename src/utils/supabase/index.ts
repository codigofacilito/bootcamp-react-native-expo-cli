import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import "react-native-url-polyfill/auto";

const supabaseUrl = "TU_SUPABASE_URL"; // Reemplaza con tu URL de Supabase
const supabaseAnonKey = "TU_SUPABASE_ANON_KEY"; // Reemplaza con tu clave anónima de Supabase

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
});