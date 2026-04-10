// ==============================
// ⚙️ CONFIGURAÇÃO DO SUPABASE
// ==============================

const SUPABASE_URL = "https://hkgfyzyzfhxdttyxvxkd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZ2Z5enl6Zmh4ZHR0eXh2eGtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODgwMDEsImV4cCI6MjA5MDQ2NDAwMX0.UVUKjnqFEcltTpOmowkGkTI6HVF0deaEfKfRJtXFHOA";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
