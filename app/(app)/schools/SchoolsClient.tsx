'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/utils/supabase/client'

interface Class {
  id: string
  teacher_id: string
  name: string
  school_name: string
  teacher_name: string
  role: string
  join_code: string
  student_count: number
  created_at: string
}

interface TeacherVerification {
  id: string
  user_id: string
  full_name: string
  school_name: string
  role: string
  verified: boolean
  created_at: string
}

interface ClassMember {
  id: string
  class_id: string
  user_id: string
  joined_at: string
}

export default function SchoolsClient() {
  const { user, authLoading, profile } = useUser()
  const router = useRouter()
  const supabase = createClient()

  // State for different views
  const [userClass, setUserClass] = useState<Class | null>(null)
  const [teacherClasses, setTeacherClasses] = useState<Class[]>([])
  const [teacherVerification, setTeacherVerification] = useState<TeacherVerification | null>(null)
  const [loading, setLoading] = useState(true)

  // Form states
  const [joinCode, setJoinCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [showTeacherForm, setShowTeacherForm] = useState(false)
  const [teacherFormData, setTeacherFormData] = useState({
    full_name: '',
    school_name: '',
    role: 'Teacher'
  })
  const [teacherSuccess, setTeacherSuccess] = useState('')
  const [showCreateClassForm, setShowCreateClassForm] = useState(false)
  const [createClassFormData, setCreateClassFormData] = useState({
    name: '',
    school_name: ''
  })

  // Determine user state - ensure safe checks during loading
  const isTeacher = profile?.is_teacher === true
  const isVerifiedTeacher = profile?.teacher_verified === true
  const isInClass = !!userClass

  // Fetch user data
  useEffect(() => {
    if (user && !authLoading) {
      fetchUserData()
    } else if (!authLoading && !user) {
      setLoading(false)
    }
  }, [user, authLoading, isTeacher]) // Add isTeacher dependency

  const fetchUserData = async () => {
    if (!user) return

    try {
      // Only check class_members for students (not teachers)
      if (!isTeacher) {
        // Check if user is in a class
        const { data: classMember } = await supabase
          .from('class_members')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (classMember) {
          // Fetch class details
          const { data: classData } = await supabase
            .from('classes')
            .select('*')
            .eq('id', classMember.class_id)
            .single()
          
          if (classData) {
            setUserClass(classData)
          }
        }
      }

      // Check if user is a teacher and fetch their classes
      if (isTeacher) {
        // Fetch teacher verification
        const { data: verification } = await supabase
          .from('teacher_verifications')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (verification) {
          setTeacherVerification(verification)
        }

        // Fetch teacher's classes
        const { data: classes } = await supabase
          .from('classes')
          .select('*')
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false })
        
        if (classes) {
          setTeacherClasses(classes)
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle join class
  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault()
    setJoinError('')

    if (!joinCode || joinCode.length !== 6) {
      setJoinError('Please enter a valid 6-digit class code')
      return
    }

    if (!user) {
      setJoinError('You must be logged in to join a class')
      return
    }

    if (isTeacher) {
      setJoinError('Teachers cannot join classes as students')
      return
    }

    try {
      // Find class by join code
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('join_code', joinCode.toUpperCase())
        .single()

      if (classError || !classData) {
        setJoinError('Invalid class code')
        return
      }

      // Add user to class
      const { error: memberError } = await supabase
        .from('class_members')
        .insert({
          class_id: classData.id,
          user_id: user.id
        })

      if (memberError) {
        setJoinError('Failed to join class. Please try again.')
        return
      }

      // Update student count
      await supabase
        .from('classes')
        .update({ student_count: classData.student_count + 1 })
        .eq('id', classData.id)

      // Redirect to class view
      router.push(`/schools/${classData.id}`)
    } catch (error) {
      console.error('Error joining class:', error)
      setJoinError('An error occurred. Please try again.')
    }
  }

  // Handle teacher application
  const handleTeacherApplication = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      return
    }

    try {
      // Insert teacher verification
      const { error: verificationError } = await supabase
        .from('teacher_verifications')
        .insert({
          user_id: user.id,
          full_name: teacherFormData.full_name,
          school_name: teacherFormData.school_name,
          role: teacherFormData.role,
          verified: true // Auto-approve for now
        })

      if (verificationError) {
        console.error('Error creating teacher verification:', verificationError)
        return
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          is_teacher: true,
          teacher_verified: true // Auto-approve for now
        })
        .eq('id', user.id)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        return
      }

      setTeacherSuccess('Teacher access granted! You can now create classes.')
      setShowTeacherForm(false)
      
      // Refresh data
      await fetchUserData()
    } catch (error) {
      console.error('Error submitting teacher application:', error)
    }
  }

  // Handle create class
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      return
    }

    try {
      // Generate join code
      const { data: joinCodeData, error: joinCodeError } = await supabase
        .rpc('generate_join_code')

      if (joinCodeError || !joinCodeData) {
        console.error('Error generating join code:', joinCodeError)
        return
      }

      // Create class
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .insert({
          teacher_id: user.id,
          name: createClassFormData.name,
          school_name: createClassFormData.school_name || teacherVerification?.school_name || '',
          teacher_name: teacherVerification?.full_name || profile?.display_name || '',
          role: teacherVerification?.role || 'Teacher',
          join_code: joinCodeData,
          student_count: 0
        })
        .select()
        .single()

      if (classError || !classData) {
        console.error('Error creating class:', classError)
        return
      }

      // Reset form and refresh data
      setShowCreateClassForm(false)
      setCreateClassFormData({ name: '', school_name: '' })
      await fetchUserData()
    } catch (error) {
      console.error('Error creating class:', error)
    }
  }

  // Handle leave class
  const handleLeaveClass = async () => {
    if (!userClass || !user) return
    
    if (isTeacher) {
      console.error('Teachers should not be leaving classes as students')
      return
    }

    try {
      // Remove from class_members
      await supabase
        .from('class_members')
        .delete()
        .eq('user_id', user.id)

      // Update student count
      await supabase
        .from('classes')
        .update({ student_count: Math.max(0, userClass.student_count - 1) })
        .eq('id', userClass.id)

      setUserClass(null)
    } catch (error) {
      console.error('Error leaving class:', error)
    }
  }

  // Show loading skeleton
  if (authLoading || loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            fontSize: '48px', 
            fontWeight: 800, 
            letterSpacing: '-2px', 
            fontFamily: 'var(--font-display)', 
            color: 'var(--text)', 
            marginBottom: '32px',
            background: 'var(--border)',
            width: '300px',
            height: '48px',
            borderRadius: '8px'
          }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {[1, 2].map((i) => (
              <div key={i} style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                height: '400px'
              }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show login screen if not authenticated
  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        padding: '40px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          background: 'var(--card)', 
          borderRadius: '16px', 
          padding: '48px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
            Please Log In
          </h1>
          <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>
            You need to be logged in to access Schools.
          </p>
          <button
            onClick={() => router.push('/login')}
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'var(--green)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer'
            }}
          >
            Log In
          </button>
        </div>
      </div>
    )
  }

  // View 1: User is not in a class and not a teacher
  if (!isInClass && !isVerifiedTeacher) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 800, 
            letterSpacing: '-2px', 
            fontFamily: 'var(--font-display)', 
            color: 'var(--text)', 
            marginBottom: '32px'
          }}>
            Schools
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Join Class Card */}
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                marginBottom: '24px',
                fontFamily: 'var(--font-display)',
                color: 'var(--text)'
              }}>
                Join a Class
              </h2>
              
              <form onSubmit={handleJoinClass}>
                <div style={{ marginBottom: '20px' }}>
                  <input
                    type="text"
                    placeholder="Enter 6-digit class code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '16px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      background: 'var(--surface)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-body)',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      textAlign: 'center'
                    }}
                  />
                </div>
                
                {joinError && (
                  <div style={{ 
                    color: 'var(--red)', 
                    fontSize: '14px', 
                    marginBottom: '16px',
                    fontFamily: 'var(--font-body)'
                  }}>
                    {joinError}
                  </div>
                )}
                
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'var(--green)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-display)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#22c55e'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--green)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Join Class
                </button>
              </form>
            </div>

            {/* Become a Teacher Card */}
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                marginBottom: '24px',
                fontFamily: 'var(--font-display)',
                color: 'var(--text)'
              }}>
                Become a Teacher
              </h2>
              
              {!showTeacherForm ? (
                <div>
                  <p style={{ 
                    color: 'var(--text2)', 
                    marginBottom: '24px',
                    fontFamily: 'var(--font-body)',
                    lineHeight: '1.6'
                  }}>
                    Create and manage classes, track student progress, and access premium educational features.
                  </p>
                  
                  <button
                    onClick={() => setShowTeacherForm(true)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'var(--blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-display)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#3b82f6'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--blue)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    Apply for Teacher Access
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTeacherApplication}>
                  <div style={{ marginBottom: '20px' }}>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={teacherFormData.full_name}
                      onChange={(e) => setTeacherFormData({...teacherFormData, full_name: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '14px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        fontFamily: 'var(--font-body)',
                        marginBottom: '12px'
                      }}
                    />
                    
                    <input
                      type="text"
                      placeholder="School name"
                      value={teacherFormData.school_name}
                      onChange={(e) => setTeacherFormData({...teacherFormData, school_name: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '14px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        fontFamily: 'var(--font-body)',
                        marginBottom: '12px'
                      }}
                    />
                    
                    <select
                      value={teacherFormData.role}
                      onChange={(e) => setTeacherFormData({...teacherFormData, role: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '14px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        fontFamily: 'var(--font-body)',
                        marginBottom: '16px'
                      }}
                    >
                      <option value="Teacher">Teacher</option>
                      <option value="Professor">Professor</option>
                      <option value="Instructor">Instructor</option>
                      <option value="Coach">Coach</option>
                      <option value="Advisor">Advisor</option>
                    </select>
                  </div>
                  
                  <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '20px'
                  }}>
                    <p style={{ 
                      fontSize: '12px', 
                      color: 'var(--text2)',
                      fontFamily: 'var(--font-body)',
                      lineHeight: '1.5',
                      margin: 0
                    }}>
                      <strong>Disclaimer:</strong> Teacher accounts are for educators only. Misuse may result in account suspension.
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'var(--blue)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-display)',
                        cursor: 'pointer'
                      }}
                    >
                      Submit Application
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowTeacherForm(false)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-display)',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              
              {teacherSuccess && (
                <div style={{
                  background: 'var(--green-tint)',
                  border: '1px solid var(--green)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '20px'
                }}>
                  <p style={{ 
                    color: 'var(--green)',
                    fontFamily: 'var(--font-body)',
                    margin: 0
                  }}>
                    {teacherSuccess}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // View 2: User is a verified teacher
  if (isVerifiedTeacher) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 800, 
              letterSpacing: '-2px', 
              fontFamily: 'var(--font-display)', 
              color: 'var(--text)', 
              margin: 0
            }}>
              Teacher Dashboard
            </h1>
            
            <button
              onClick={() => setShowCreateClassForm(true)}
              style={{
                padding: '16px 24px',
                background: 'var(--green)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#22c55e'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--green)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Create New Class
            </button>
          </div>

          {/* Create Class Form Modal */}
          {showCreateClassForm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '500px',
                width: '90%'
              }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  marginBottom: '24px',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)'
                }}>
                  Create New Class
                </h3>
                
                <form onSubmit={handleCreateClass}>
                  <div style={{ marginBottom: '20px' }}>
                    <input
                      type="text"
                      placeholder="Class name"
                      value={createClassFormData.name}
                      onChange={(e) => setCreateClassFormData({...createClassFormData, name: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '14px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        fontFamily: 'var(--font-body)',
                        marginBottom: '12px'
                      }}
                    />
                    
                    <input
                      type="text"
                      placeholder="School name"
                      value={createClassFormData.school_name}
                      onChange={(e) => setCreateClassFormData({...createClassFormData, school_name: e.target.value})}
                      defaultValue={teacherVerification?.school_name || ''}
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '14px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        fontFamily: 'var(--font-body)',
                        marginBottom: '20px'
                      }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'var(--green)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-display)',
                        cursor: 'pointer'
                      }}
                    >
                      Create Class
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateClassForm(false)
                        setCreateClassFormData({ name: '', school_name: '' })
                      }}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-display)',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Classes Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {teacherClasses.map((classItem) => (
              <div key={classItem.id} style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  marginBottom: '16px',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)'
                }}>
                  {classItem.name}
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '8px' }}>
                    <strong>Join Code:</strong> <span style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '16px',
                      letterSpacing: '1px',
                      background: 'var(--surface)',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>{classItem.join_code}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '8px' }}>
                    <strong>Students:</strong> {classItem.student_count}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text2)' }}>
                    <strong>School:</strong> {classItem.school_name}
                  </div>
                </div>
                
                <button
                  onClick={() => { window.location.href = `/schools/${classItem.id}` }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--blue)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-display)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#3b82f6'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--blue)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Manage Class
                </button>
              </div>
            ))}
            
            {teacherClasses.length === 0 && (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center',
                gridColumn: '1 / -1'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}> classroom </div>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  marginBottom: '8px',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text)'
                }}>
                  No Classes Yet
                </h3>
                <p style={{ color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                  Create your first class to get started with managing students and assignments.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // View 3: User is a student in a class
  if (isInClass && userClass) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 800, 
            letterSpacing: '-2px', 
            fontFamily: 'var(--font-display)', 
            color: 'var(--text)', 
            marginBottom: '32px'
          }}>
            My Class
          </h1>

          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 700, 
              marginBottom: '16px',
              fontFamily: 'var(--font-display)',
              color: 'var(--text)'
            }}>
              {userClass.name}
            </h2>
            
            <div style={{ fontSize: '16px', color: 'var(--text2)', marginBottom: '24px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Teacher:</strong> {userClass.teacher_name}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>School:</strong> {userClass.school_name}
              </div>
              <div>
                <strong>Class Size:</strong> {userClass.student_count} students
              </div>
            </div>
            
            <div style={{ 
              background: 'var(--surface)', 
              border: '1px solid var(--border)', 
              borderRadius: '8px', 
              padding: '20px',
              marginBottom: '24px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                marginBottom: '12px',
                fontFamily: 'var(--font-display)',
                color: 'var(--text)'
              }}>
                Latest Activity
              </h3>
              <p style={{ color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                No active prompts at the moment. Check back soon for new assignments from your teacher.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={() => router.push(`/schools/${userClass.id}/student`)}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: 'var(--green)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#22c55e'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--green)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Go to Class
              </button>
              
              <button
                onClick={handleLeaveClass}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: 'var(--surface)',
                  color: 'var(--red)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--red)'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--surface)'
                  e.currentTarget.style.color = 'var(--red)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Leave Class
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback - this should not happen but prevents blank page
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg)',
      backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      padding: '40px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        background: 'var(--card)', 
        borderRadius: '16px', 
        padding: '48px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
          Something went wrong
        </h1>
        <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>
          Unable to determine your school status. Please refresh the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'var(--green)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            cursor: 'pointer'
          }}
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}
