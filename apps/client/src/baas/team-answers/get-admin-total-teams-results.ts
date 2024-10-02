import { db } from '@/baas/database';
import type { QuestionResponse, RoundResponse, TeamAnswersResponse, TeamResponse } from '@/baas/pocketbase-types';

export const GET_ADMIN_TOTAL_TEAMS_RESULTS_API_KEY = 'GET_ADMIN_TOTAL_TEAMS_RESULTS_API_KEY'

interface ExpQuestionResponse {
  round: RoundResponse
}

interface ExpTeamAnswers {
  team: TeamResponse
  question: QuestionResponse<ExpQuestionResponse>
}

type TeamResult = Record<string, number>

type Response = Record<string, TeamResult | undefined>

export async function getAdminTotalTeamsResults(quizId: string) {
  const { items } = await db.teamAnswers().getList<TeamAnswersResponse<ExpTeamAnswers>>(1, 100, {
    filter: `question.round.quiz = "${quizId}"`,
    expand: 'question.round,team',
    sort: '+created'
  })

  return items.reduce<Response>((acc, teamAnswer) => {
    const teamName = teamAnswer.expand!.team.name
    const roundName = teamAnswer.expand!.question.expand!.round.name
    const score = teamAnswer.score

    if (acc[teamName]?.[roundName]) {
      acc[teamName][roundName] = acc[teamName][roundName] + score
      acc[teamName].total = (acc[teamName].total || 0) + score

      return acc
    }

    if (acc[teamName] && !acc[teamName][roundName]) {
      acc[teamName][roundName] = score
      acc[teamName].total = score

      return acc
    }

    acc[teamName] = {
      [roundName]: score,
      total: score
    }

    return acc
  }, {})
}