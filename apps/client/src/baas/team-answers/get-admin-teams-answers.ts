import { db } from '@/baas/database'
import type {
  QuestionResponse,
  QuizStatusResponse,
  RoundResponse,
  TeamAnswersResponse,
  TeamResponse
} from '@/baas/pocketbase-types'

export const GET_ADMIN_TEAMS_ANSWERS_API_KEY = 'GET_ADMIN_TEAMS_ANSWERS_API_KEY'

interface ExpRound {
  round: RoundResponse
}

interface ExpCurrentQuestion {
  current_question: QuestionResponse<ExpRound>
}

interface ExpTeamAnswer {
  question: QuestionResponse
  team: TeamResponse
}

type Score = '0' | '0.5' | '1'

interface TeamAnswerToCheck {
  id: string
  score: Score
  question: {
    id: string
    content?: string
    answer?: string
  }
  answer: string
  team: {
    id: string
  }
}

type Response = Record<string, TeamAnswerToCheck[]>

export async function getAdminTeamsAnswers(quizId: string): Promise<Response> {
  const quizStatus = await db
    .quizStatus()
    .getFirstListItem<
      QuizStatusResponse<ExpCurrentQuestion>
    >(`quiz_via_quiz_status.id = "${quizId}"`, {
      expand: 'current_question.round'
    })

  const { items } = await db
    .teamAnswers()
    .getList<TeamAnswersResponse<ExpTeamAnswer>>(1, 20, {
      filter: `question.round = "${quizStatus.expand?.current_question.round}"`,
      expand: 'question,team',
      sort: '+created'
    })

  return items.reduce<Response>((acc, item) => {
    const teamName = item.expand?.team.name || ''
    const teamAnswer = item.answer
    const teamId = item.team
    const correctAnswer = item.expand?.question.answer
    const questionId = item.question
    const questionContent = item.expand?.question.content

    const teamAnswerData = {
      id: item.id,
      score: item.score.toString() as Score,
      question: {
        id: questionId,
        content: questionContent,
        answer: correctAnswer
      },
      answer: teamAnswer,
      team: {
        id: teamId
      }
    }

    if (acc[teamName]) {
      acc[teamName].push(teamAnswerData)
    } else {
      acc[teamName] = [teamAnswerData]
    }

    return acc
  }, {})
}
