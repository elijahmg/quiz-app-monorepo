import { db } from '@/baas/database'
import { QuizStatusStatusOptions } from '@/baas/pocketbase-types'

interface Args {
  quizStatusId: string
  newCurrentQuestionId: string
}

export async function startAnotherRound({
  newCurrentQuestionId,
  quizStatusId
}: Args) {
  await db.quizStatus().update(quizStatusId, {
    current_question: newCurrentQuestionId,
    status: QuizStatusStatusOptions.PLAYING
  })
}
