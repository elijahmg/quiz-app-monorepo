import React from 'react'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { MainInfo } from '@/components/modules/create-quiz-modules/main-info'

export const Route = createLazyFileRoute('/admin/create/')({
  component: AdminIndex
})

function AdminIndex(): React.ReactNode {
  const navigate = useNavigate()

  async function onSuccessQuizCreate(quizId: string): Promise<void> {
    await navigate({
      to: `/admin/${quizId}`
    })
  }

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <MainInfo onSuccess={onSuccessQuizCreate} />
    </div>
  )
}
