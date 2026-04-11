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

  if (!user) redirect('/login')

  // Check if user is authenticated and completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_complete')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_complete) redirect('/onboarding')

  // Fetch the class with teacher name
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select(`
      *,
      profiles!classes_teacher_id_fkey (
        username
      )
    `)
    .eq('id', classId)
    .single()

  if (classError || !classData) redirect('/schools')

  // Check if user is a member of this class
  const { data: classMember, error: memberError } = await supabase
    .from('class_members')
    .select('*')
    .eq('class_id', classId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (memberError || !classMember) redirect('/schools')

  return <StudentClassClient classData={classData} />
}
