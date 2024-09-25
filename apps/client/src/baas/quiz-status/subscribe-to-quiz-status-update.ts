import { db } from '@/baas/database';
import type { QuestionResponse, QuizStatusResponse, RoundResponse } from '@/baas/pocketbase-types';

interface ExpCurrentQuestion {
  current_question: QuestionResponse
}

export async function subscribeToQuizStatusUpdate(quizId: string, callback: (question: string | undefined) => void) {
  const quizStatus = await db.quizStatus().getFirstListItem<QuizStatusResponse<ExpCurrentQuestion>>(`quiz_via_quiz_status.id = "${quizId}"`, {
    expand: 'current_question'
  })

  await db.quizStatus().subscribe<QuizStatusResponse<ExpCurrentQuestion>>(quizStatus.id, function ({ record }) {
    callback(record.expand?.current_question.content)
  }, {
    expand: 'current_question'
  })

  return {
    unsubscribe: async () => await db.quizStatus().unsubscribe(quizStatus.id)
  }
}