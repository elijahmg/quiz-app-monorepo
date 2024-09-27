import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AdminInGameHeader } from '@/components/modules/admin-in-game-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CenterWrapper } from '@/components/wrappers/center-wrapper';
import { GET_ROUND_QUESTIONS_API_KEY, getRoundQuestions } from '@/baas/question/get-round-questions';
import { QuizStatusStatusOptions } from '@/baas/pocketbase-types';
import { updateCurrentQuestion } from '@/baas/quiz-status/update-current-question';
import { endRound } from '@/baas/round/end-round';

export const Route = createLazyFileRoute('/admin/$quizId/quiz-control')({
  component: QuizControl,
})

function QuizControl() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: [GET_ROUND_QUESTIONS_API_KEY, quizId],
    queryFn: () => getRoundQuestions(quizId),
  })

  const [activeQuestionId, setActiveQuestionId] = useState<string>(data?.currentQuestion || '')
  const [status, setStatus] = useState<QuizStatusStatusOptions | undefined>(data?.status)

  useEffect(() => {
    if (data) {
      setActiveQuestionId(data.currentQuestion)
      setStatus(data.status)
    }
  }, [data])

  const { mutate: mutateCurrenQuestion } = useMutation({
    mutationFn: updateCurrentQuestion,
    onSuccess: ({ newCurrentQuestionId, }) => setActiveQuestionId(newCurrentQuestionId),
  })

  const lastIndex = data?.questions.length || 1

  const lastQuestion = useMemo(() => data?.questions[lastIndex - 1], [data, lastIndex])

  function getActiveQuestionStyles(id: string) {
    return activeQuestionId === id ? 'border border-green-500' : null
  }

  function handleNextQuestion() {
    const currentQuestionIndex = data?.questions.findIndex(({ id }) => activeQuestionId === id) ?? -1

    if (currentQuestionIndex === -1) {
      throw new Error('Something went wrong')
    }

    const nextQuestion = data?.questions[currentQuestionIndex + 1]

    if (!nextQuestion) {
      throw new Error('Something went wrong')
    }

    mutateCurrenQuestion({
      newCurrentQuestionId: nextQuestion.id,
      quizStatusId: data.quizStatusId
    })
  }

  async function handleEndRound() {
    // @TODO useMutation
    await endRound(quizId)

    setStatus(QuizStatusStatusOptions.END_ROUND)
  }

  async function handleCheckAnswers() {
    // @TODO useMutation
    await navigate({
      to: `/admin/${quizId}/teams-overview`,
    })
  }

  const getSubmitButtonProps = useMemo(() => {
    if (status === QuizStatusStatusOptions.END_ROUND) {
      return { label: 'Check answers', handler: handleCheckAnswers }
    }

    if (lastQuestion?.id !== activeQuestionId) {
      return { label: 'Next Question', handler: handleNextQuestion }
    }

    return { label: 'End Round', handler: handleEndRound }
  }, [activeQuestionId, lastQuestion?.id, status])

  return (
    <CenterWrapper>
      <AdminInGameHeader quizId={quizId}/>
      {status === QuizStatusStatusOptions.PLAYING && data?.questions.map(({ content, answer, id }, index) => (
        <div className={cn(getActiveQuestionStyles(id), 'self-start rounded-md bg-gray-100/5 w-full px-4 py-3')}
             key={id}>
          <p>Q {index + 1}: {content}</p>
          <p>A {index + 1}: {answer}</p>
        </div>
      ))}
      {status === QuizStatusStatusOptions.END_ROUND &&
          <h2 className="font-semibold text-2xl">Let's give teams a chance to fix their answers one more time</h2>}
      <Button onClick={getSubmitButtonProps.handler}>{getSubmitButtonProps.label}</Button>
    </CenterWrapper>
  )
}

