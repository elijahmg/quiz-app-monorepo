import { db } from '@/baas/database'
import type {
  QuestionResponse,
  RoundResponse,
  TeamAnswersResponse,
  TeamResponse
} from '@/baas/pocketbase-types'

export const GET_ADMIN_TOTAL_TEAMS_RESULTS_API_KEY =
  'GET_ADMIN_TOTAL_TEAMS_RESULTS_API_KEY'

interface ExpQuestionResponse {
  round: RoundResponse
}

interface ExpTeamAnswers {
  team: TeamResponse
  question: QuestionResponse<ExpQuestionResponse>
}

type Response = Map<string, Team>

export class Team {
  name: string
  rounds = new Map<string, number>()
  total = 0

  constructor(name: string) {
    this.name = name
  }

  private setTotal(score: number) {
    this.total = this.total + score
  }

  setRoundScore(roundName: string, score: number) {
    if (this.rounds.has(roundName)) {
      this.rounds.set(roundName, this.rounds.get(roundName)! + score)
    } else {
      this.rounds.set(roundName, score)
    }

    this.setTotal(score)
  }
}

export async function getAdminTotalTeamsResults(quizId: string) {
  const { items } = await db
    .teamAnswers()
    .getList<TeamAnswersResponse<ExpTeamAnswers>>(1, 100, {
      filter: `question.round.quiz = "${quizId}"`,
      expand: 'question.round,team',
      sort: '+created'
    })

  const rounds = new Set<string>()

  const teamsScores = items.reduce<Response>((acc, teamAnswer) => {
    const teamName = teamAnswer.expand!.team.name
    const roundName = teamAnswer.expand!.question.expand!.round.name
    const score = teamAnswer.score

    rounds.add(roundName)

    const team = acc.get(teamName) || new Team(teamName)

    team.setRoundScore(roundName, score)

    acc.set(teamName, team)

    return acc
  }, new Map())

  return {
    teamsScores,
    rounds
  }
}
