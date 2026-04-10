import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SchoolsClient from './SchoolsClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SchoolsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_teacher, teacher_verified, username')
    .eq('id', user.id)
    .single()

  // Fetch class membership
  const { data: classMember } = await supabase
    .from('class_members')
    .select('class_id')
    .eq('user_id', user.id)
    .maybeSingle()
  
  console.log('Server: user id:', user.id)
console.log('Server: classMember result:', classMember)
console.log('Server: profile result:', profile)

  // Fetch class details if in a class
  let userClass = null
  if (classMember) {
    const { data: classData } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classMember.class_id)
      .single()
    userClass = classData
  }

  // Fetch teacher classes if teacher
  let teacherClasses = []
  if (profile?.is_teacher && profile?.teacher_verified) {
    const { data: classes } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false })
    teacherClasses = classes || []
  }

  // Fetch teacher verification if teacher but not verified
  let teacherVerification = null
  if (profile?.is_teacher && !profile?.teacher_verified) {
    const { data: verification } = await supabase
      .from('teacher_verifications')
      .select('*')
      .eq('user_id', user.id)
      .single()
    teacherVerification = verification
  }

  return (
    <SchoolsClient
      userId={user.id}
      profile={profile}
      userClass={userClass}
      teacherClasses={teacherClasses}
      teacherVerification={teacherVerification}
      debug={{ classMember, profile, userId: user.id }}
    />
  )
}

