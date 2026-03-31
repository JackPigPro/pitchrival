'use client'

import { useRouter } from 'next/navigation'
import ComingSoon from '@/components/ComingSoon'

export default function LearnPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/')
  }

  return <ComingSoon onBack={handleBack} />
}