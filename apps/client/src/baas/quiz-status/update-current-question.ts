import { db } from '@/baas/database'
import type { QuizStatusResponse } from '@/baas/pocketbase-types'

interface Args {
  quizStatusId: string
  newCurrentQuestionId: string
}

export async function updateCurrentQuestion({
  newCurrentQuestionId,
  quizStatusId
}: Args) {
  const updatedQuizStatus = await db
    .quizStatus()
    .update<QuizStatusResponse>(quizStatusId, {
      current_question: newCurrentQuestionId
    })

  return {
    newCurrentQuestionId: updatedQuizStatus.current_question
  }
}
