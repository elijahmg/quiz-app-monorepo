import { createLazyFileRoute } from '@tanstack/react-router'
import React from 'react';
import { CenterWrapper } from '@/components/wrappers/center-wrapper';
import { AdminInGameHeader } from '@/components/modules/admin-in-game-header';

export const Route = createLazyFileRoute('/admin/$quizId/teams-overview')({
  component: TeasOverview,
})

function TeasOverview() {
  return (
    <CenterWrapper>
      <AdminInGameHeader/>
    </CenterWrapper>
  )
}
