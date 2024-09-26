import React, { useEffect, useRef, useState } from 'react'
import { z } from 'zod';
import { createLazyFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CenterWrapper } from '@/components/wrappers/center-wrapper';
import { TeamInGameHeader } from '@/components/modules/team-in-game-header';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/modules/form/form-input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { subscribeToQuizStatusUpdate } from '@/baas/quiz-status/subscribe-to-quiz-status-update';
import { useTeamData } from '@/hooks/use-team-data';
import { submitTeamAnswer } from '@/baas/team-answers/submit-team-answer';

export const Route = createLazyFileRoute('/$quizId/play')({
  component: Play
})

const teamAnswerSchema = z.object({
  answer: z.string().min(1)
})

type SchemaType = z.infer<typeof teamAnswerSchema>

interface IncomingUpdateArgs {
  question?: string
  questionId?: string
}

function Play() {
  const { quizId } = Route.useParams()
  const { teamId } = useTeamData()
  const { toast } = useToast()

  const unsubscribe = useRef<{ unsubscribe: () => void } | null>(null)

  const [currentQuestionData, setCurrentQuestionData] = useState<IncomingUpdateArgs | undefined>(undefined)

  const form = useForm<SchemaType>({
    resolver: zodResolver(teamAnswerSchema),
    defaultValues: {
      answer: ''
    }
  })

  const { mutate: mutateSubmitTeamAnswer } = useMutation({
    mutationFn: submitTeamAnswer,
    onSuccess: () => toast({
      description: 'Answer has been submitted',
    })
  })

  function handleIncomingUpdate({ question, questionId }: IncomingUpdateArgs) {
    setCurrentQuestionData({ question, questionId })

    form.reset()
  }

  // @TODO must be done in context and more centralized
  async function subscribeToUpdate() {
    unsubscribe.current = await subscribeToQuizStatusUpdate(quizId, handleIncomingUpdate)
  }

  useEffect(() => {
    subscribeToUpdate()

    return () => {
      unsubscribe.current?.unsubscribe()
    }
  }, [])


  function handleSubmitAnswer(data: SchemaType) {
    if (!currentQuestionData?.questionId) {
      toast({
        description: 'Hm... Something is wrong, try to refresh page',
        variant: 'destructive',
      })

      return
    }

    mutateSubmitTeamAnswer({
      questionId: currentQuestionData.questionId,
      teamId,
      answer: data.answer
    })
  }

  return (
    <CenterWrapper>
      <TeamInGameHeader/>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmitAnswer)}>
          <FormInput form={form} label={`Q: ${currentQuestionData?.question}`} name="answer"/>
          <Button type="submit">Submit answer</Button>
        </form>
      </Form>
    </CenterWrapper>
  )
}
