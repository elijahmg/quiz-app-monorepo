import { db } from '@/baas/database'
import type {
  QuestionResponse,
  QuizStatusResponse,
  RoundResponse,
  TeamAnswersResponse
} from '@/baas/pocketbase-types'

export const GET_TEAM_ANSWERS_API_KEY = 'GET_TEAM_ANSWERS_API_KEY'

interface ExpRound {
  round: RoundResponse
}

interface ExpCurrentQuestion {
  current_question: QuestionResponse<ExpRound>
}

interface Args {
  teamId: string
  quizId: string
}

interface ExpTeamAnswer {
  question: QuestionResponse
}

export async function getTeamAnswer({ teamId, quizId }: Args) {
  const quizStatus = await db
    .quizStatus()
    .getFirstListItem<
      QuizStatusResponse<ExpCurrentQuestion>
    >(`quiz_via_quiz_status.id = "${quizId}"`, {
      expand: 'current_question.round'
    })

  const teamsAnswersData = await db
    .teamAnswers()
    .getList<TeamAnswersResponse<ExpTeamAnswer>>(1, 20, {
      filter: `question.round = "${quizStatus.expand?.current_question.round}" && team = "${teamId}"`,
      expand: 'question',
      sort: '+created'
    })

  return {
    answers: teamsAnswersData.items.map((item) => ({
      ...item,
      question: item.expand?.question.content || ''
    }))
  }
}
