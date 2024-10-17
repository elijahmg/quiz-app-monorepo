import { db } from '@/baas/database'
import type { QuizResponse } from '@/baas/pocketbase-types'
import { QuizStatusStatusOptions } from '@/baas/pocketbase-types'

export async function startQuiz(quizId: string): Promise<void> {
  const quiz = await db.quiz().getOne<QuizResponse | undefined>(quizId)

  if (!quiz) {
    throw new Error('Bad request')
  }

  await db.quizStatus().update(quiz.quiz_status, {
    status: QuizStatusStatusOptions.PLAYING
  })
}
