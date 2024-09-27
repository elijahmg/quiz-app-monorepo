import React, { useEffect, useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CenterWrapper } from '@/components/wrappers/center-wrapper'
import { useTeamData } from '@/hooks/use-team-data'
import { subscribeToQuizStatusUpdate } from '@/baas/quiz-status/subscribe-to-quiz-status-update'
import { QuizStatusStatusOptions } from '@/baas/pocketbase-types'
import { AlienTaken } from '../../../../svg-assets/alien-taken'

export const Route = createFileRoute('/$quizId/_layout/waiting')({
  component: Waiting,
})

function Waiting() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()
  const { teamName } = useTeamData()

  const unsubscribe = useRef<{ unsubscribe: () => void } | null>(null)

  function handleIncomingUpdate({
    status,
  }: {
    status: QuizStatusStatusOptions
  }) {
    if (status === QuizStatusStatusOptions.PLAYING) {
      navigate({
        to: `/${quizId}/play`,
      })
    }
  }

  // @TODO must be done in context and more centralized
  async function subscribeToUpdate() {
    unsubscribe.current = await subscribeToQuizStatusUpdate(
      quizId,
      handleIncomingUpdate,
    )
  }

  useEffect(() => {
    subscribeToUpdate()

    return () => {
      unsubscribe.current?.unsubscribe()
    }
  }, [])

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
