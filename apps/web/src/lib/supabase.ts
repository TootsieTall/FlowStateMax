import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey)

// Example usage in your components:
// 
// import { supabase } from '@/lib/supabase'
//
// // Sign in with Google
// const { data, error } = await supabase.auth.signInWithOAuth({
//   provider: 'google',
// })
//
// // Get current user
// const { data: { user } } = await supabase.auth.getUser()
//
// // Real-time subscription
// const channel = supabase
//   .channel('custom-channel')
//   .on('postgres_changes', { event: '*', schema: 'public', table: 'TimeBlock' }, (payload) => {
//     console.log('Change received!', payload)
//   })
//   .subscribe()

