import { db } from '@/baas/database'
import type {
  QuestionResponse,
  QuizStatusResponse,
  RoundResponse
} from '@/baas/pocketbase-types'

interface ExQuestions {
  question_via_round: QuestionResponse[]
}

interface ExpRound {
  round: RoundResponse<ExQuestions>
}

interface ExpCurrentQuestion {
  current_question: QuestionResponse<ExpRound>
}

export const GET_ROUND_QUESTIONS_API_KEY = 'GET_ROUND_QUESTIONS_API_KEY'

export async function getRoundQuestions(quizId: string) {
  const quizStatus = await db
    .quizStatus()
    .getFirstListItem<
      QuizStatusResponse<ExpCurrentQuestion>
    >(`quiz_via_quiz_status.id = "${quizId}"`, {
      expand: 'current_question.round.question_via_round'
    })

  return {
    questions:
      quizStatus.expand?.current_question.expand?.round.expand
        ?.question_via_round || [],
    currentQuestion: quizStatus.current_question,
    status: quizStatus.status,
    quizStatusId: quizStatus.id
  }
}
