'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  
  // Route Super Admin directly to the Super Admin dashboard
  if (email === 'admin@lumistay.com' || email === 'superadmin@hotel.com') {
    redirect('/superadmin')
  }

  // Everyone else goes to their hotel admin dashboard
  redirect('/admin')
}
