import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
    <div className="flex flex-col gap-24 justify-center items-center h-[100vh] max-w-screen-lg mx-auto">
      <div className="flex w-full justify-between">
        <div>
          <h2 className="text-4xl font-bold">Name</h2>
          <p className="text-gray-600">Pin: 1234</p>
        </div>
        <Badge className="self-baseline">Teams online: 7</Badge>
      </div>
      <div className="flex flex-col space-y-4">
        <Button onClick={handleStartQuiz}>Start Quiz</Button>
        <Button variant="outline">Edit Quiz</Button>
        <Button variant="destructive">Delete Quiz</Button>
      </div>
    </div>
  )
}
