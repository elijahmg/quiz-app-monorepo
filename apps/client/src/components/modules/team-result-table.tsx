import React from 'react'
import {
  Table,
  TableHeader,
  TableHead,
  TableCell,
  TableBody,
  TableRow
} from '@/components/ui/table'

interface TeamResult {
  score: number
  question: string
  answer: string
  correctAnswer: string
}

interface Props {
  teamResults: TeamResult[]
}

export function TeamResultTable({ teamResults }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Question</TableHead>
          <TableHead>Your Answer</TableHead>
          <TableHead>Correct answer</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teamResults.map((result: TeamResult) => (
          <TableRow key={result.question}>
            <TableCell>{result.question}</TableCell>
            <TableCell>{result.answer}</TableCell>
            <TableCell>{result.correctAnswer}</TableCell>
            <TableCell>{result.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
