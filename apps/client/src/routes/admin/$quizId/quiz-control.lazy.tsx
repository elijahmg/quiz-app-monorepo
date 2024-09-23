import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useMemo, useState } from 'react';
import { AdminInGameHeader } from '@/components/modules/admin-in-game-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CenterWrapper } from '@/components/wrappers/center-wrapper';

export const Route = createLazyFileRoute('/admin/$quizId/quiz-control')({
  component: QuizControl,
})

const MOCK_QUESTIONS = [
  { content: '2+2', answer: 4, id: 1 },
  { content: '2+2', answer: 4, id: 2 },
  { content: '2+2', answer: 4, id: 3 }
]


function QuizControl() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()

  const [active, setActiveQuestion] = useState<number>(1)
  // @TODO enum
  const [status, setStatus] = useState<string>('END_ROUND')

  const lastQuestion = useMemo(() => MOCK_QUESTIONS[MOCK_QUESTIONS.length - 1], [MOCK_QUESTIONS])

  function getActiveQuestionStyles(id: number) {
    return active === id ? 'border border-green-500' : null
  }

  function handleNextQuestion() {
    setActiveQuestion((prevState) => prevState + 1)
  }

  function handleEndRound() {

  }

  async function handleCheckAnswers() {
    await navigate({
      to: `/admin/${quizId}/teams-overview`,
    })
  }

  const getSubmitButtonProps = useMemo(() => {
    if (status === 'END_ROUND') {
      return { label: 'Check answers', handler: handleCheckAnswers }
    }

    if (lastQuestion.id !== active) {
      return { label: 'Next Question', handler: handleNextQuestion }
    }

    return { label: 'End Round', handler: handleEndRound }
  }, [active, lastQuestion.id])

  return (
    <CenterWrapper>
      <AdminInGameHeader/>
      {MOCK_QUESTIONS.map(({ content, answer, id }, index) => (
        <div className={cn(getActiveQuestionStyles(id), 'self-start rounded-md bg-gray-100/5 w-full px-4 py-3')}
             key={id}>
          <p>Q {index + 1}: {content}</p>
          <p>A {index + 1}: {answer}</p>
        </div>
      ))}
      <Button onClick={getSubmitButtonProps.handler}>{getSubmitButtonProps.label}</Button>
    </CenterWrapper>
  )
}
