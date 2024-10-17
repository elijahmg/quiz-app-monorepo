import PocketBase from 'pocketbase'
import { Collections } from '@/baas/pocketbase-types'

const DB_URL = 'http://127.0.0.1:8090'

class Database {
  pb: PocketBase

  constructor() {
    this.pb = new PocketBase(DB_URL)
  }

  quiz() {
    return this.pb.collection(Collections.Quiz)
  }

  question() {
    return this.pb.collection(Collections.Question)
  }

  team() {
    return this.pb.collection(Collections.Team)
  }

  quizStatus() {
    return this.pb.collection(Collections.QuizStatus)
  }

  teamAnswers() {
    return this.pb.collection(Collections.TeamAnswers)
  }

  round() {
    return this.pb.collection(Collections.Round)
  }
}

export const db = new Database()
