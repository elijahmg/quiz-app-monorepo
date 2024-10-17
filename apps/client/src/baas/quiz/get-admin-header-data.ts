import type {
  QuestionResponse,
  QuizResponse,
  QuizStatusResponse,
  RoundResponse
} from '@/baas/pocketbase-types'
import { db } from '../database'

export const GET_ADMIN_HEADER_DATA_API_KEY = 'GET_ADMIN_HEADER_DATA'

interface ExRound {
  round: RoundResponse
}

interface ExpCurrentQuestion {
  current_question: QuestionResponse<ExRound>
}

interface ExpQuizStatus {
  quiz_status: QuizStatusResponse<ExpCurrentQuestion>
}

// @TODO add teams online
export async function getAdminHeaderData(quizId: string) {
  const quiz = await db.quiz().getOne<QuizResponse<ExpQuizStatus>>(quizId, {
    expand: 'quiz_status.current_question.round',
    fields: '*,expand, name, pin'
  })

  return {
    pin: quiz.pin,
    name: quiz.name,
    currentRoundName:
      quiz.expand?.quiz_status.expand?.current_question.expand?.round.name
  }
}
