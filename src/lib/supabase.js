import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

let supabaseClient

export function getSupabaseConfigurationError() {
  const missingVariables = []

  if (!supabaseUrl) missingVariables.push('VITE_SUPABASE_URL')
  if (!supabasePublishableKey) missingVariables.push('VITE_SUPABASE_PUBLISHABLE_KEY')

  if (missingVariables.length === 0) return null

  return `Supabase is not configured. Add ${missingVariables.join(' and ')} to the project-root .env.local file, then restart the Vite dev server. The public portfolio remains available.`
}

export function getSupabaseClient() {
  const configurationError = getSupabaseConfigurationError()
  if (configurationError) throw new Error(configurationError)

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabasePublishableKey)
  }

  return supabaseClient
}
