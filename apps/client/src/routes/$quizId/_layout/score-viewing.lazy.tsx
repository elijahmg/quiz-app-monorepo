import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$quizId/_layout/score-viewing')({
  component: () => <div>Hello /$quizId/_layout/score-viewing!</div>,
})
