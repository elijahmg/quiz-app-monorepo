import React from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PlayerGameStateProvider } from '@/state/player-game.state'

export const Route = createFileRoute('/$quizId/_layout')({
  component: PlayerGameLayout
})

function PlayerGameLayout() {
  const { quizId } = Route.useParams()

  return (
    <PlayerGameStateProvider quizId={quizId}>
      <Outlet />
    </PlayerGameStateProvider>
  )
}
