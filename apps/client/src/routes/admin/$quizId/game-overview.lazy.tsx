import { createLazyFileRoute } from '@tanstack/react-router'
import React from 'react';
import { CenterWrapper } from '@/components/wrappers/center-wrapper';
import { AdminInGameHeader } from '@/components/modules/admin-in-game-header';
import { TeamsTable } from '@/components/modules/teams-table';
import { Button } from '@/components/ui/button';

export const Route = createLazyFileRoute('/admin/$quizId/game-overview')({
  component: GameOverview
})

function GameOverview() {

  return (
    <CenterWrapper>
      <AdminInGameHeader hideRoundInfo />
      <TeamsTable/>
      <Button>End quiz</Button>
    </CenterWrapper>
  )
}
