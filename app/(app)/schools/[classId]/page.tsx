import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ClassManagementClient from './ClassManagementClient'

export default async function ClassManagementPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_complete, is_teacher, teacher_verified')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_complete) redirect('/onboarding')

  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('*')
    .eq('id', classId)
    .single()

  if (classError || !classData) redirect('/schools')
  if (classData.teacher_id !== user.id) redirect('/schools')

  return <ClassManagementClient classData={classData} />
}
