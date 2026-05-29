import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://avmemxowlunhlyfntiqu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bWVteG93bHVuaGx5Zm50aXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2OTIyOTMsImV4cCI6MjA5NTI2ODI5M30.R5DwGPSWZH_PXmsEnUntYu7WyHK6VHXsEUkq8zISRkw";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  console.log("Listing all visitor_heartbeats rows...");
  const { data, error } = await supabase.from('visitor_heartbeats').select('*');
  if (error) {
    console.error("Failed to list heartbeats:", error);
  } else {
    console.log("All heartbeats in database:", data);
  }
}

run();
