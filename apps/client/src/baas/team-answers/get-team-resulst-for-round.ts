import { db } from '@/baas/database.ts'
import type {
  QuestionResponse,
  QuizStatusResponse,
  TeamAnswersResponse
} from '@/baas/pocketbase-types.ts'

interface Args {
  teamId: string
  quizId: string
}

interface ExpRound {
  current_question: QuestionResponse
}

interface ExpTeamAnswer {
  question: QuestionResponse
}

interface TeamResult {
  score: number
  question: string
  answer: string
  correctAnswer: string
}

interface Response {
  total: number
  teamResults: TeamResult[]
}

export const GET_TEAM_RESULT_FOR_ROUND_API_KEY =
  'GET_TEAM_RESULT_FOR_ROUND_API_KEY'

export async function getTeamResultForRound({
  teamId,
  quizId
}: Args): Promise<Response> {
  const quizStatus = await db
    .quizStatus()
    .getFirstListItem<
      QuizStatusResponse<ExpRound>
    >(`quiz_via_quiz_status.id = "${quizId}"`, {
      expand: 'current_question'
    })

  const { items } = await db
    .teamAnswers()
    .getList<TeamAnswersResponse<ExpTeamAnswer>>(1, 20, {
      filter: `question.round = "${quizStatus.expand?.current_question.round}" && team = "${teamId}"`,
      expand: 'question',
      sort: '+created'
    })

  const teamResults = items.map<TeamResult>((teamAnswer) => ({
    score: teamAnswer.score,
    question: teamAnswer.expand?.question.content ?? '',
    answer: teamAnswer.answer ?? '',
    correctAnswer: teamAnswer.expand?.question.answer ?? ''
  }))

  const { items: allTeamAnswers } = await db.teamAnswers().getList(1, 20, {
    filter: `team = "${teamId}"`
  })

  const total = allTeamAnswers.reduce((acc, { score }) => (acc += score), 0)

  return {
    total,
    teamResults
  }
}
