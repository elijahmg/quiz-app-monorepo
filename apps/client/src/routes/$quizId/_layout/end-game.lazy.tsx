import React from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { CenterWrapper } from '@/components/wrappers/center-wrapper.tsx'
import { useTeamData } from '@/hooks/use-team-data.ts'
import {
  CHECK_IF_TEAM_WON_API_KEY,
  checkIfTeamWon
} from '@/baas/team-answers/check-if-team-won.tsx'

export const Route = createLazyFileRoute('/$quizId/_layout/end-game')({
  component: EndGame
})

function EndGame() {
  const { quizId } = Route.useParams()
  const { teamId } = useTeamData()

  const { data, isLoading } = useQuery({
    queryKey: [CHECK_IF_TEAM_WON_API_KEY, quizId, teamId],
    queryFn: () => checkIfTeamWon({ quizId, teamId })
  })

  return (
    <CenterWrapper className="justify-center items-center flex h-screen">
      {isLoading && <p>Loading you result</p>}
      {!isLoading && !data?.isTeamWon && (
        <p className="text-3xl text-center font-semibold text-red-600">
          Oh, no... you lost 😭
        </p>
      )}
      {!isLoading && data?.isTeamWon && (
        <div className="flex flex-col gap-3">
          <p className="text-4xl text-center font-semibold text-yellow-600 shadow-blue-600 drop-shadow-lg animate-bounce">
            🏆Congrats🏆
          </p>
          <p className="text-4xl text-center font-semibold text-yellow-600 drop-shadow-lg animate-bounce">
            You are the Winner!
          </p>
        </div>
      )}
    </CenterWrapper>
  )
}
