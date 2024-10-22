import { db } from '@/baas/database'
import type { QuizStatusResponse } from '@/baas/pocketbase-types'
import { QuizStatusStatusOptions } from '@/baas/pocketbase-types'

export async function moveQuizToEndState(quizId: string) {
  const quizStatus = await db
    .quizStatus()
    .getFirstListItem<QuizStatusResponse>(
      `quiz_via_quiz_status.id = "${quizId}"`
    )

  await db.quizStatus().update(quizStatus.id, {
    status: QuizStatusStatusOptions.END_QUIZ
  })
}
