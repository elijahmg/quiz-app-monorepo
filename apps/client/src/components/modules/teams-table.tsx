import React from 'react'
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table';

const MOCK = {
  'Team Alpha': {
      total: 3,
      math: 2,
      music: 1
  },
  'Team Beta': {
      total: 2,
      math: 1,
      music: 1
  }
}


export function TeamsTable() {
  const rounds = ['math', 'music']

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Team</TableHead>
          {rounds.map(round => (<TableHead key={round}>{round}</TableHead>))}
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.keys(MOCK).map((key) => (
          <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{MOCK[key].math}</TableCell>
            <TableCell>{MOCK[key].music}</TableCell>
            <TableCell className="text-right">{MOCK[key].total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}