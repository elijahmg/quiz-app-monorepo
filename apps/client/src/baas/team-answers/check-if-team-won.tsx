import { db } from '@/baas/database.ts'
import type {
  TeamAnswersResponse,
  TeamResponse
} from '@/baas/pocketbase-types.ts'

interface Props {
  teamId: string
  quizId: string
}

interface ExTeamAnswers {
  team_answers_via_team: TeamAnswersResponse[]
}

interface Response {
  isTeamWon: boolean
}

export const CHECK_IF_TEAM_WON_API_KEY = 'CHECK_IF_TEAM_WON_API_KEY'

export async function checkIfTeamWon({
  teamId,
  quizId
}: Props): Promise<Response> {
  const teams = await db.team().getList<TeamResponse<ExTeamAnswers>>(1, 100, {
    filter: `quiz = "${quizId}"`,
    expand: 'team_answers_via_team'
  })

  const teamsWithScores = teams.items
    .map((team) => ({
      totalScore:
        team.expand?.team_answers_via_team.reduce(
          (acc, { score }) => (acc += score),
          0
        ) ?? 0,
      name: team.name,
      id: team.id
    }))
    .sort((a, b) => b.totalScore - a.totalScore)

  return {
    isTeamWon: teamsWithScores[0].id === teamId
  }
}
