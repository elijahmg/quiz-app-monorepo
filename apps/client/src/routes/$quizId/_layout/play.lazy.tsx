import React from 'react'
import { z } from 'zod'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { CenterWrapper } from '@/components/wrappers/center-wrapper'
import { TeamInGameHeader } from '@/components/modules/team-in-game-header'
import { Form } from '@/components/ui/form'
import { FormInput } from '@/components/modules/form/form-input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useTeamData } from '@/hooks/use-team-data'
import { submitTeamAnswer } from '@/baas/team-answers/submit-team-answer'
import { usePlayerGameState } from '@/state/player-game.state';

export const Route = createLazyFileRoute('/$quizId/_layout/play')({
  component: Play,
})

const teamAnswerSchema = z.object({
  answer: z.string().min(1),
})

type SchemaType = z.infer<typeof teamAnswerSchema>

function Play() {
  const navigate = useNavigate()
  const { teamId } = useTeamData()
  const { toast } = useToast()

  const playerGameState = usePlayerGameState()

  const form = useForm<SchemaType>({
    resolver: zodResolver(teamAnswerSchema),
    defaultValues: {
      answer: '',
    },
  })

  const { mutate: mutateSubmitTeamAnswer } = useMutation({
    mutationFn: submitTeamAnswer,
    onSuccess: () =>
      toast({
        description: 'Answer has been submitted',
      }),
  })

  function handleSubmitAnswer(data: SchemaType) {
    if (!playerGameState.questionId) {
      toast({
        description: 'Hm... Something is wrong, try to refresh page',
        variant: 'destructive',
      })

      return
    }

    mutateSubmitTeamAnswer({
      questionId: playerGameState.questionId,
      teamId,
      answer: data.answer,
    })
  }

  return (
    <CenterWrapper>
      <TeamInGameHeader />
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmitAnswer)}
        >
          <FormInput
            form={form}
            label={`Q: ${playerGameState.question}`}
            name="answer"
          />
          <Button type="submit">Submit answer</Button>
        </form>
      </Form>
    </CenterWrapper>
  )
}
