import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router'
import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { CenterWrapper } from '@/components/wrappers/center-wrapper'
import { AdminInGameHeader } from '@/components/modules/admin-in-game-header'
import type { TeamScores } from '@/components/modules/teams-table'
import { TeamsTable } from '@/components/modules/teams-table'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  GET_ADMIN_TOTAL_TEAMS_RESULTS_API_KEY,
  getAdminTotalTeamsResults
} from '@/baas/team-answers/get-admin-total-teams-results'
import {
  GET_NEXT_QUESTION_ID_API_KEY,
  getNextQuestionId
} from '@/baas/quiz-status/get-next-question-id'
import { startAnotherRound } from '@/baas/quiz-status/start-another-round'
import { moveQuizToEndState } from '@/baas/quiz-status/move-quiz-to-end-state.ts'

export const Route = createLazyFileRoute('/admin/$quizId/game-overview')({
  component: GameOverview
})

function GameOverview() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()

  const [isQuizEnded, setIsQuizEnded] = useState(false)

  const { data: teamsScores } = useQuery({
    queryKey: [GET_ADMIN_TOTAL_TEAMS_RESULTS_API_KEY, quizId],
    queryFn: () => getAdminTotalTeamsResults(quizId)
  })

  const { data: nextQuestion } = useQuery({
    queryKey: [GET_NEXT_QUESTION_ID_API_KEY, quizId],
    queryFn: () => getNextQuestionId(quizId)
  })

  const { mutate: mutateStartAnotherRound } = useMutation({
    mutationFn: startAnotherRound,
    onSuccess: () => navigate({ to: `/admin/${quizId}/quiz-control` })
  })

  const { mutate: mutateMoveQuizToEndState } = useMutation({
    mutationFn: moveQuizToEndState,
    onSuccess: () => setIsQuizEnded(true)
  })

  function handleOnSubmit() {
    if (nextQuestion?.nextQuestionId) {
      mutateStartAnotherRound({
        quizStatusId: nextQuestion.quizStatusId,
        newCurrentQuestionId: nextQuestion.nextQuestionId
      })
    } else {
      mutateMoveQuizToEndState(quizId)
    }
  }

  const buttonTitle = nextQuestion?.nextQuestionId
    ? 'Start another round'
    : 'Finish the quiz'

  return (
    <CenterWrapper>
      <AdminInGameHeader hideRoundInfo quizId={quizId} />
      {Boolean(teamsScores) && (
        <TeamsTable teamsScoresData={teamsScores as TeamScores} />
      )}
      {!isQuizEnded && <Button onClick={handleOnSubmit}>{buttonTitle}</Button>}
      {isQuizEnded && (
        <Link className={buttonVariants({ variant: 'outline' })} to="/">
          Back to main page
        </Link>
      )}
    </CenterWrapper>
  )
}
