import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hcgelonzczmkglpopsua.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZ2Vsb256Y3pta2dscG9wc3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTcxMzQsImV4cCI6MjA5MzQ3MzEzNH0.AO0hlMUtkk9JH20u-2dYrG4ITJeSjs0GZZ4EG4USJqM'

export const supabase = createClient(supabaseUrl, supabaseKey)