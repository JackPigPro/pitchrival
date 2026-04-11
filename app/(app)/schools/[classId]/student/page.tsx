// Student class management page for class members
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import StudentClassClient from './StudentClassClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StudentClassPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  console.log('StudentClassPage - User ID being checked:', user?.id)
  console.log('StudentClassPage - Class ID:', classId)

  if (!user) {
    console.log('StudentClassPage - Redirecting to /login: No user found')
    redirect('/login')
  }

  // Check if user is authenticated and completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_complete')
    .eq('id', user.id)
    .single()

  console.log('StudentClassPage - Profile data:', profile)

  if (!profile?.onboarding_complete) {
    console.log('StudentClassPage - Redirecting to /onboarding: Onboarding not complete')
    redirect('/onboarding')
  }

  // First fetch the class
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('*')
    .eq('id', classId)
    .single()

  console.log('StudentClassPage - Class data:', classData)
  console.log('StudentClassPage - Class error:', classError)

  if (classError || !classData) {
    console.log('StudentClassPage - Redirecting to /schools: Class not found or error')
    redirect('/schools')
  }

  // Then fetch the teacher's profile separately using classData.teacher_id
  const { data: teacherProfile, error: teacherError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', classData.teacher_id)
    .single()

  console.log('StudentClassPage - Teacher profile data:', teacherProfile)
  console.log('StudentClassPage - Teacher profile error:', teacherError)

  // Merge the data in JavaScript
  const mergedClassData = {
    ...classData,
    profiles: teacherProfile
  }

  // Check if user is a member of this class
  const { data: classMember, error: memberError } = await supabase
    .from('class_members')
    .select('*')
    .eq('class_id', classId)
    .eq('user_id', user.id)
    .maybeSingle()

  console.log('StudentClassPage - Class members query result:', classMember)
  console.log('StudentClassPage - Class members query error:', memberError)

  if (memberError || !classMember) {
    console.log('StudentClassPage - Redirecting to /schools: Not a class member or query error')
    redirect('/schools')
  }

  return <StudentClassClient classData={mergedClassData} />
}
