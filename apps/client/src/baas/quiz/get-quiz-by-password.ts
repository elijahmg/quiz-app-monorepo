import { ClientResponseError } from 'pocketbase'
import { db } from '@/baas/database.ts'
import { QuizStatusStatusOptions } from '@/baas/pocketbase-types.ts'
import type {
  QuizResponse,
  QuizStatusResponse
} from '@/baas/pocketbase-types.ts'

interface ExpQuizStatus {
  quiz_status: QuizStatusResponse
}

interface Success {
  quizId: string
  status: QuizStatusStatusOptions
}

interface Failure {
  quizId: null
  status: undefined
}

type Response = Success | Failure

export async function getQuizByPassword(password: string): Promise<Response> {
  try {
    const quiz = await db
      .quiz()
      .getFirstListItem<
        QuizResponse<ExpQuizStatus>
      >(`password = "${password}"`, {
        expand: 'quiz_status'
      })

    return {
      quizId: quiz.id,
      status: quiz.expand?.quiz_status.status ?? QuizStatusStatusOptions.JOINING
    }
  } catch (e) {
    if (e instanceof ClientResponseError && e.status === 404) {
      return {
        quizId: null,
        status: undefined
      }
    }
  }

  return {
    quizId: null,
    status: undefined
  }
}
