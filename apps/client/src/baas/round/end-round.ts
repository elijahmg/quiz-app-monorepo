import type { QuizStatusResponse } from '@/baas/pocketbase-types'
import { QuizStatusStatusOptions } from '@/baas/pocketbase-types'
import { db } from '../database'

export async function endRound(quizId: string) {
  const quizStatus = await db
    .quizStatus()
    .getFirstListItem<QuizStatusResponse>(
      `quiz_via_quiz_status.id = "${quizId}"`
    )

  await db.quizStatus().update(quizStatus.id, {
    status: QuizStatusStatusOptions.END_ROUND
  })
}
