import React, { useEffect, useRef, useState } from 'react'
import { z } from 'zod';
import { createLazyFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CenterWrapper } from '@/components/wrappers/center-wrapper';
import { TeamInGameHeader } from '@/components/modules/team-in-game-header';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/modules/form/form-input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { subscribeToQuizStatusUpdate } from '@/baas/quiz-status/subscribe-to-quiz-status-update';

export const Route = createLazyFileRoute('/$quizId/play')({
  component: Play
})

const teamAnswerSchema = z.object({
  answer: z.string().min(1)
})

type SchemaType = z.infer<typeof teamAnswerSchema>

function Play() {
  const { quizId } = Route.useParams()
  const form = useForm<SchemaType>({
    resolver: zodResolver(teamAnswerSchema),
    defaultValues: {
      answer: ''
    }
  })

  const { toast } = useToast()

  const unsubscribe = useRef<{ unsubscribe: () => void } | null>(null)

  const [currentQuestion, setCurrentQuestion] = useState<string | undefined>(undefined)

  function handleIncomingUpdate(newQuestion: string | undefined) {
    setCurrentQuestion(newQuestion)
  }

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
    toast({
      description: 'Answer has been submitted',
    })
  }

  return (
    <CenterWrapper>
      <TeamInGameHeader/>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmitAnswer)}>
          <FormInput form={form} label={`Q: ${currentQuestion}`} name="answer"/>
          <Button type="submit">Submit answer</Button>
        </form>
      </Form>
    </CenterWrapper>
  )
}
