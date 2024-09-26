import { ClientResponseError } from 'pocketbase';
import { db } from '@/baas/database';

interface Args {
  teamId: string
  questionId: string
  answer: string
}

interface Response {
  teamAnswerId: string
}

export async function submitTeamAnswer({ teamId, questionId, answer }: Args) {
  try {
    const existingAnswer = await db.teamAnswers().getFirstListItem(`question = "${questionId}" && team="${teamId}"`)

    console.log({ existingAnswer })

    await db.teamAnswers().update(existingAnswer.id, {
      answer,
      team: teamId,
      question: questionId
    })

  } catch (e) {
    if (e instanceof ClientResponseError && e.status === 404) {
      await db.teamAnswers().create({
        answer,
        team: teamId,
        question: questionId
      })
    }
  }
}