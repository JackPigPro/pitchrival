import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profileData = await request.json()
    
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        username: profileData.username.toLowerCase(),
        location: profileData.location,
        bio: profileData.bio,
        stage: profileData.stage,
        skills: profileData.skills,
        status_tags: profileData.status_tags,
        twitter: profileData.twitter || null,
        linkedin: profileData.linkedin || null,
        github: profileData.github || null
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
