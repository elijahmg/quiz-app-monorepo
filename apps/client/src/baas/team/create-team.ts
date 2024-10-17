import { db } from '@/baas/database'

interface Response {
  teamId: string
}

interface Args {
  teamName: string
  quizId: string
}

export async function createTeam({
  teamName,
  quizId
}: Args): Promise<Response> {
  const createdTeam = await db.team().create({
    name: teamName,
    quiz: quizId
  })

  return {
    teamId: createdTeam.id
  }
}
