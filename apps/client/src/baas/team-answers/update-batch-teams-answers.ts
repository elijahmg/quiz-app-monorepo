import { db } from '../database'

interface Args {
  newTeamAnswers: { teamAnswerId: string; answer: string }[]
}

export async function updateBatchTeamsAnswers({ newTeamAnswers }: Args) {
  for (const newTeamAnswer of newTeamAnswers) {
    await db.teamAnswers().update(newTeamAnswer.teamAnswerId, {
      answer: newTeamAnswer.answer
    })
  }
}
