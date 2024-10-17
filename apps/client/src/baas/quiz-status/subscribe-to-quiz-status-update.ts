import { db } from '@/baas/database'
import type {
  QuestionResponse,
  QuizStatusResponse,
  QuizStatusStatusOptions,
  RoundResponse
} from '@/baas/pocketbase-types'

interface ExpRound {
  round: RoundResponse
}

interface ExpCurrentQuestion {
  current_question: QuestionResponse<ExpRound>
}

interface CallbackArgs {
  status: QuizStatusStatusOptions
  question?: string
  questionId?: string
  roundName?: string
}

export async function subscribeToQuizStatusUpdate(
  quizId: string,
  callback: (callbackArgs: CallbackArgs) => void
) {
  const quizStatus = await db
    .quizStatus()
    .getFirstListItem<
      QuizStatusResponse<ExpCurrentQuestion>
    >(`quiz_via_quiz_status.id = "${quizId}"`, {
      expand: 'current_question,current_question.round',
      requestKey: 'SUBSCRIPTION'
    })

  callback({
    questionId: quizStatus.current_question,
    question: quizStatus.expand?.current_question.content,
    status: quizStatus.status,
    roundName: quizStatus.expand?.current_question.expand?.round.name
  })

  await db.quizStatus().subscribe<QuizStatusResponse<ExpCurrentQuestion>>(
    quizStatus.id,
    function ({ record }) {
      callback({
        question: record.expand?.current_question.content,
        status: record.status,
        questionId: record.current_question,
        roundName: record.expand?.current_question.expand?.round.name
      })
    },
    {
      expand: 'current_question,current_question.round'
    }
  )

  return {
    unsubscribe: async () => await db.quizStatus().unsubscribe(quizStatus.id)
  }
}
