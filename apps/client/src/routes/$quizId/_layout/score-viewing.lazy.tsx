import React, { useEffect } from 'react'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTeamData } from '@/hooks/use-team-data'
import { CenterWrapper } from '@/components/wrappers/center-wrapper'
import { TeamInGameHeader } from '@/components/modules/team-in-game-header'
import { usePlayerGameState } from '@/state/player-game.state.tsx'
import { QuizStatusStatusOptions } from '@/baas/pocketbase-types.ts'
import {
  GET_TEAM_RESULT_FOR_ROUND_API_KEY,
  getTeamResultForRound
} from '@/baas/team-answers/get-team-resulst-for-round.ts'
import { TeamResultTable } from '@/components/modules/team-result-table.tsx'
import { Badge } from '@/components/ui/badge.tsx'

export const Route = createLazyFileRoute('/$quizId/_layout/score-viewing')({
  component: ScoreView
})

function ScoreView() {
  const navigate = useNavigate()
  const { quizId } = Route.useParams()
  const { teamId } = useTeamData()
  const { status } = usePlayerGameState()

  const { data } = useQuery({
    queryFn: () =>
      getTeamResultForRound({
        teamId,
        quizId
      }),
    queryKey: [GET_TEAM_RESULT_FOR_ROUND_API_KEY, quizId, teamId]
  })

  useEffect(() => {
    if (status === QuizStatusStatusOptions.PLAYING) {
      navigate({
        to: `/${quizId}/play`
      })
    }
  }, [status])

  return (
    <CenterWrapper>
      <TeamInGameHeader />
      {Boolean(data?.teamResults) && (
        <TeamResultTable teamResults={data!.teamResults} />
      )}
      <Badge className="self-end">Total points: {data?.total}</Badge>
    </CenterWrapper>
  )
}
