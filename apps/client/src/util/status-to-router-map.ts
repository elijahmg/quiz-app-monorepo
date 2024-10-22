import { QuizStatusStatusOptions } from '@/baas/pocketbase-types.ts'

export const STATUS_TO_ROUTES = {
  [QuizStatusStatusOptions.JOINING]: '',
  [QuizStatusStatusOptions.PLAYING]: '/quiz-control',
  [QuizStatusStatusOptions.EVALUCATION]: '/teams-overview',
  [QuizStatusStatusOptions.SCORE_VIEWING]: '/game-overview',
  [QuizStatusStatusOptions.END_QUIZ]: '/game-overview',
  [QuizStatusStatusOptions.END_ROUND]: '/game-overview'
}
