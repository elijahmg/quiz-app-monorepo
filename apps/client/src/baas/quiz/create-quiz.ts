import { z } from 'zod'
import { schemaValidator } from '@/baas/validators/schema.validator'
import { db } from '@/baas/database'
import { QuizStatusStatusOptions } from '@/baas/pocketbase-types'

const questionSchema = z.object({
  content: z.string().min(1),
  answer: z.string().min(1)
})

const schema = z.object({
  name: z.string().min(4).max(12),
  password: z.string().min(4).max(12),
  pin: z.string().min(4).max(6),
  questions: z.record(z.string().min(1), z.array(questionSchema))
})

export async function createQuiz(
  data: z.infer<typeof schema>
): Promise<string> {
  schemaValidator(schema, data)

  const quiz = await db.quiz().create({
    password: data.password,
    name: data.name,
    pin: data.pin
  })

  let isFirstQuestionSet = false

  for (const round of Object.keys(data.questions)) {
    const createdRound = await db.round().create({
      name: round,
      quiz: quiz.id
    })

    const questions = data.questions[round]

    for (const question of questions) {
      const createdQuestion = await db
        .question()
        .create({ ...question, round: createdRound.id })

      if (!isFirstQuestionSet) {
        const quizStatus = await db.quizStatus().create({
          status: QuizStatusStatusOptions.JOINING,
          current_question: createdQuestion.id
        })

        await db.quiz().update(quiz.id, {
          quiz_status: quizStatus.id
        })

        isFirstQuestionSet = true
      }
    }
  }

  return quiz.id
}
