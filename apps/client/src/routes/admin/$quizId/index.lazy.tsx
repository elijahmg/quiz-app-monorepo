import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import React from 'react'
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button'
import { AdminInGameHeader } from '@/components/modules/admin-in-game-header';
import { CenterWrapper } from '@/components/wrappers/center-wrapper';
import { startQuiz } from '@/baas/quiz-status/start-quiz';

export const Route = createLazyFileRoute('/admin/$quizId/')({
  component: IndexQuizAdminScreen,
})

function IndexQuizAdminScreen() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()

  const { mutate: startQuizMutation } = useMutation({
    mutationFn: startQuiz,
    onSuccess: () => navigate({
      to: `/admin/${quizId}/quiz-control`,
    })
  })

  return (
    <CenterWrapper>
      <AdminInGameHeader hideRoundInfo quizId={quizId}/>
      <div className="flex space-x-4 w-max">
        <Button onClick={() => startQuizMutation(quizId)}>Start Quiz</Button>
        <Button variant="outline">Edit Quiz</Button>
        <Button variant="destructive">Delete Quiz</Button>
      </div>
    </CenterWrapper>
  )
}
