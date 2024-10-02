import React from 'react'
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table';

type RoundName = string
type TeamName = string

type TeamAnswer = Record<RoundName, number>

export type TeamScores = Record<TeamName, TeamAnswer>

interface Props {
  teamsScores: TeamScores
}

export function TeamsTable({ teamsScores }: Props) {
  const randomTeamName = Object.keys(teamsScores)[0]
  const rounds = Object.keys(teamsScores[randomTeamName])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Team</TableHead>
          {rounds.map(round => (
            <TableHead className={round === 'total' ? 'text-right' : ''} key={round}>{round}</TableHead>))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.keys(teamsScores).map((teamName) => (
          <TableRow key={teamName}>
            <TableCell className="font-medium">{teamName}</TableCell>
            {Object.keys(teamsScores[teamName]).map((round) => (
              <TableCell className={round === 'total' ? 'text-right' : ''}
                         key={round}>{teamsScores[teamName][round]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}