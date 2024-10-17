import { db } from '@/baas/database'
import type {
  QuestionResponse,
  QuizStatusResponse
} from '@/baas/pocketbase-types'

export const GET_NEXT_QUESTION_ID_API_KEY = 'GET_NEXT_QUESTION_ID_API_KEY'

interface Response {
  // null means, end of the quiz
  nextQuestionId: string | null
  quizStatusId: string
}

export async function getNextQuestionId(quizId: string): Promise<Response> {
  const quizStatus = await db
    .quizStatus()
    .getFirstListItem<QuizStatusResponse>(
      `quiz_via_quiz_status.id = "${quizId}"`
    )

  const { items: questions } = await db
    .question()
    .getList<QuestionResponse>(1, 50, {
      filter: `round.quiz.id = "${quizId}"`,
      sort: '+created'
    })

  const indexOfCurrentQuestion = questions.findIndex(
    ({ id }) => quizStatus.current_question === id
  )

  return {
    nextQuestionId: questions[indexOfCurrentQuestion + 1]?.id || null,
    quizStatusId: quizStatus.id
  }
}
