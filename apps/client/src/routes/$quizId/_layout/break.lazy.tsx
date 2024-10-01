import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$quizId/_layout/break')({
  component: () => <div>Hello /$quizId/_layout/break!</div>,
})
