import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = "https://xajnqukwcqlznshorthv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhham5xdWt3Y3Fsem5zaG9ydGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzc1ODAsImV4cCI6MjA2Nzg1MzU4MH0.AJwoPBuaZkJ_AydPQ6JVB61ffny8rEUfM62359RARIM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});