import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ClassManagementClient from './ClassManagementClient'

export default async function ClassManagementPage({ params }: { params: { classId: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is authenticated and completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_complete, is_teacher, teacher_verified')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_complete) {
    redirect('/onboarding')
  }

  // Fetch the class to verify ownership
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('*')
    .eq('id', params.classId)
    .single()

  if (classError || !classData) {
    redirect('/schools')
  }

  // Verify this user is the teacher of this class
  if (classData.teacher_id !== user.id) {
    redirect('/schools')
  }

  return <ClassManagementClient classData={classData} />
}
