import React from 'react'
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table';
import type { Team } from '@/baas/team-answers/get-admin-total-teams-results';

export interface TeamScores {
  teamsScores: Map<string, Team>,
  rounds: Set<string>
}

interface Props {
  teamsScoresData: TeamScores
}

export function TeamsTable({ teamsScoresData }: Props) {
  const { rounds, teamsScores } = teamsScoresData

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Team</TableHead>
          {[...rounds.values()].map(round => (
            <TableHead className={round === 'total' ? 'text-right' : ''} key={round}>{round}</TableHead>))}
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...teamsScores.keys()].map((teamName) => (
          <TableRow key={teamName}>
            <TableCell className="font-medium">{teamName}</TableCell>
            {[...teamsScores.get(teamName)!.rounds.entries()].map(([round, score]) => (
              <TableCell className={round === 'total' ? 'text-right' : ''}
                         key={round}>{score}</TableCell>
            ))}
            <TableCell className="text-right">{teamsScores.get(teamName)!.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}