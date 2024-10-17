import React, { useContext, useEffect, useRef, useState } from 'react'
import { subscribeToQuizStatusUpdate } from '@/baas/quiz-status/subscribe-to-quiz-status-update'
import type { QuizStatusStatusOptions } from '@/baas/pocketbase-types'

interface IncomingUpdateArgs {
  question?: string
  questionId?: string
  status: QuizStatusStatusOptions
  roundName?: string
}

const PlayerGameStateContext = React.createContext<IncomingUpdateArgs>(
  {} as IncomingUpdateArgs
)

interface Props {
  children: React.ReactNode
  quizId: string
}

export function PlayerGameStateProvider({ children, quizId }: Props) {
  const unsubscribe = useRef<{ unsubscribe: () => void } | null>(null)

  const [currentQuizStatus, setCurrentQuizStatus] =
    useState<IncomingUpdateArgs>({} as IncomingUpdateArgs)

  function handleIncomingUpdate({
    question,
    questionId,
    status,
    roundName
  }: IncomingUpdateArgs) {
    setCurrentQuizStatus({ question, questionId, status, roundName })
  }

  async function subscribeToUpdate() {
    unsubscribe.current = await subscribeToQuizStatusUpdate(
      quizId,
      handleIncomingUpdate
    )
  }

  useEffect(() => {
    subscribeToUpdate()

    return () => {
      unsubscribe.current?.unsubscribe()
    }
  }, [])

  return (
    <PlayerGameStateContext.Provider value={currentQuizStatus}>
      {children}
    </PlayerGameStateContext.Provider>
  )
}

export function usePlayerGameState() {
  const context = useContext(PlayerGameStateContext)

  if (!context) {
    throw new Error('Missing PlayerGameState provider')
  }

  return context
}
