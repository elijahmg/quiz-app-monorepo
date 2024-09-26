import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTeamData } from '@/hooks/use-team-data';

export function TeamInGameHeader() {
  const { teamName } = useTeamData()

  return (
    <div className="flex w-full justify-between">
      <h2 className="text-2xl font-bold">{teamName}</h2>
      <Badge className="self-baseline">Round: <b>Math</b></Badge>
    </div>
  )
}