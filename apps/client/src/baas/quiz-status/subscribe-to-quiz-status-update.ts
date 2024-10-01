import { db } from '@/baas/database';
import type { QuestionResponse, QuizStatusResponse, QuizStatusStatusOptions } from '@/baas/pocketbase-types';

interface ExpCurrentQuestion {
  current_question: QuestionResponse
}

interface CallbackArgs {
  status: QuizStatusStatusOptions,
  question?: string
  questionId?: string
}

export async function subscribeToQuizStatusUpdate(quizId: string, callback: (callbackArgs: CallbackArgs) => void) {
  const quizStatus = await db.quizStatus().getFirstListItem<QuizStatusResponse<ExpCurrentQuestion>>(`quiz_via_quiz_status.id = "${quizId}"`, {
    expand: 'current_question',
    requestKey: 'SUBSCRIPTION'
  })

  callback({
    questionId: quizStatus.current_question,
    question: quizStatus.expand?.current_question.content,
    status: quizStatus.status,
  })

  await db.quizStatus().subscribe<QuizStatusResponse<ExpCurrentQuestion>>(quizStatus.id, function ({ record }) {
    callback({
      question: record.expand?.current_question.content,
      status: record.status,
      questionId: record.current_question
    })
  }, {
    expand: 'current_question'
  })

  return {
    unsubscribe: async () => await db.quizStatus().unsubscribe(quizStatus.id)
  }
}