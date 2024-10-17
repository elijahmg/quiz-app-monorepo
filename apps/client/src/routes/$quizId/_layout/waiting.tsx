import React, { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CenterWrapper } from '@/components/wrappers/center-wrapper'
import { useTeamData } from '@/hooks/use-team-data'
import { QuizStatusStatusOptions } from '@/baas/pocketbase-types'
import { usePlayerGameState } from '@/state/player-game.state'
import { AlienTaken } from '../../../../svg-assets/alien-taken'

export const Route = createFileRoute('/$quizId/_layout/waiting')({
  component: Waiting
})

function Waiting() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()
  const { teamName } = useTeamData()
  const { status } = usePlayerGameState()

  useEffect(() => {
    if (status === QuizStatusStatusOptions.PLAYING) {
      navigate({
        to: `/${quizId}/play`
      })
    }
  }, [status])

  return (
    <CenterWrapper className="items-center flex flex-col gap-4">
      <h2 className="text-4xl font-bold">Getting ready</h2>
      <AlienTaken />
      <p className="text-xl text-center">
        Don't worry <b>{teamName}</b>, the quiz will start in a few moments
      </p>
    </CenterWrapper>
  )
}
