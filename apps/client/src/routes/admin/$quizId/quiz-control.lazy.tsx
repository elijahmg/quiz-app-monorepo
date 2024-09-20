import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/$quizId/quiz-control')({
  component: () => <div>Hello /admin/quiz-control!</div>,
})
