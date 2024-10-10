import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTeamData } from '@/hooks/use-team-data';
import { usePlayerGameState } from '@/state/player-game.state';

export function TeamInGameHeader() {
  const { teamName } = useTeamData()
  const { roundName } = usePlayerGameState()

  return (
    <div className="flex w-full justify-between">
      <h2 className="text-2xl font-bold">{teamName}</h2>
      <Badge className="self-baseline">Round:&nbsp;<b>{roundName}</b></Badge>
    </div>
  )
}