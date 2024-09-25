import React from 'react';
import { Badge } from '@/components/ui/badge';

export function TeamInGameHeader() {
  return (
    <div className="flex w-full justify-between">
      <h2 className="text-4xl font-bold">Team name</h2>
      <Badge className="self-baseline">Round: <b>Math</b></Badge>
    </div>
  )
}