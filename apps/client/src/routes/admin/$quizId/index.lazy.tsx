import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import React from 'react'
import { Button } from '@/components/ui/button'
import { AdminInGameHeader } from '@/components/modules/admin-in-game-header';
import { CenterWrapper } from '@/components/wrappers/center-wrapper';

export const Route = createLazyFileRoute('/admin/$quizId/')({
  component: IndexQuizAdminScreen,
  loader: () => ({
    quizData: 'bla'
  })
})

function IndexQuizAdminScreen() {
  const data = Route.useLoaderData()
  console.log({ data })

  const { quizId } = Route.useParams()
  const navigate = useNavigate()

  async function handleStartQuiz() {
    await navigate({
      to: `/admin/${quizId}/quiz-control`,
    })
  }

  return (
    <CenterWrapper>
      <AdminInGameHeader/>
      <div className="flex flex-col space-y-4">
        <Button onClick={handleStartQuiz}>Start Quiz</Button>
        <Button variant="outline">Edit Quiz</Button>
        <Button variant="destructive">Delete Quiz</Button>
      </div>
    </CenterWrapper>
  )
}
