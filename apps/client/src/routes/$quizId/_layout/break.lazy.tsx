import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useEffect } from 'react'
import { CenterWrapper } from '@/components/wrappers/center-wrapper'
import { usePlayerGameState } from '@/state/player-game.state'
import { QuizStatusStatusOptions } from '@/baas/pocketbase-types'
import { PeopleParty } from '../../../../svg-assets/people-party'

export const Route = createLazyFileRoute('/$quizId/_layout/break')({
  component: Break
})

function Break() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()

  const { status } = usePlayerGameState()

  useEffect(() => {
    if (status === QuizStatusStatusOptions.SCORE_VIEWING) {
      navigate({
        to: `/${quizId}/score-viewing`
      })
    }
  }, [status])

  return (
    <CenterWrapper className="items-center flex flex-col gap-4">
      <h2 className="text-4xl font-bold">Time for a break.</h2>
      <PeopleParty />
      <p className="text-xl text-center">
        Your quiz master is checking your answers. In the meantime, have a chat
        and/or drink, we don&apos;t judge :)
      </p>
    </CenterWrapper>
  )
}
