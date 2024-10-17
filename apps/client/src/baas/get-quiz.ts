import type {
  QuizResponse,
  RoundResponse,
  TeamResponse
} from '@/baas/pocketbase-types'
import { db } from '@/baas/database'

interface ExQuestion {
  question_via_round: QuizResponse
}

interface ExRound {
  round_via_quiz: RoundResponse<ExQuestion>
  team_via_quiz: TeamResponse[]
}

export const getQuiz = async () => {
  const quiz = await db
    .quiz()
    .getOne<QuizResponse<ExRound>>('0iss55t07zc0zf6', {
      expand: 'round_via_quiz.question_via_round,team_via_quiz'
    })

  console.log(quiz)
}
