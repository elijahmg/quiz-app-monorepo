import { db } from '../database'

export interface SuccessResponse {
  isQuizExistByPin: true
  quizId: string
}

export const IS_QUIZ_EXIST_BY_PIN_API_KEY = 'IS_QUIZ_EXIST_BY_PIN_API_KEY'

export async function isQuizExistByPin(pin: string): Promise<SuccessResponse> {
  const quiz = await db.quiz().getFirstListItem(`pin="${pin}"`)

  return {
    isQuizExistByPin: true,
    quizId: quiz.id
  }
}
