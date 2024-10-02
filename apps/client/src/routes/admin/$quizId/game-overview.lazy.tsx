import { createLazyFileRoute } from '@tanstack/react-router'
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CenterWrapper } from '@/components/wrappers/center-wrapper';
import { AdminInGameHeader } from '@/components/modules/admin-in-game-header';
import type { TeamScores } from '@/components/modules/teams-table';
import { TeamsTable } from '@/components/modules/teams-table';
import { Button } from '@/components/ui/button';
import {
  GET_ADMIN_TOTAL_TEAMS_RESULTS_API_KEY,
  getAdminTotalTeamsResults
} from '@/baas/team-answers/get-admin-total-teams-results';

export const Route = createLazyFileRoute('/admin/$quizId/game-overview')({
  component: GameOverview
})

function GameOverview() {
  const { quizId } = Route.useParams()

  const { data: teamsScores } = useQuery({
    queryKey: [GET_ADMIN_TOTAL_TEAMS_RESULTS_API_KEY, quizId],
    queryFn: () => getAdminTotalTeamsResults(quizId)
  })

  return (
    <CenterWrapper>
      <AdminInGameHeader hideRoundInfo quizId={quizId}/>
      {Boolean(teamsScores) && <TeamsTable teamsScores={teamsScores as TeamScores}/>}
      <Button>End quiz</Button>
    </CenterWrapper>
  )
}
