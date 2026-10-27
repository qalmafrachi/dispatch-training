// Dispatch Desk settings.
// Lessons, trainees and the start date are edited in the app (Admin). This file
// only connects the app to Supabase.
window.TRAINING_CONFIG = {
  // Supabase project. The anon (public) key is in Supabase > Project Settings > API.
  // Never paste the service_role key here.
  supabaseUrl: "https://bmfoiyesrmkheineqkdp.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZm9peWVzcm1raGVpbmVxa2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzY5MzUsImV4cCI6MjA5NDM1MjkzNX0.IgRpUyjWVTJm3f09IblG9N9kfaCLzoGXcPvZiKrTAko",
  table: "training_events",

  // Who can sign in to Admin. Must match the email in schema.sql (is_training_admin).
  adminEmails: ["qalmafrachi@freeflowbev.com"],

  // Used only until the database has its own settings, and for the practice preview.
  programStart: "2026-10-27",
  trainees: ["Dana", "Devin"],
  // Which week unit each trainee starts on (0 = first). Dana week 1 = Devin week 5.
  rotation: { Dana: 0, Devin: 4 },

  // Admin passcode for practice mode only (before Supabase is connected).
  coachPasscode: "freeflow-coach"
};
