import { db } from '@/baas/database'

interface ScoredTeamAnswer {
  id: string
  score: number
}

export async function evaluateTeamsAnswers(
  scoredTeamAnswers: ScoredTeamAnswer[]
) {
  for (const scoredTeamAnswer of scoredTeamAnswers) {
    await db.teamAnswers().update(scoredTeamAnswer.id, {
      score: scoredTeamAnswer.score
    })
  }
}
