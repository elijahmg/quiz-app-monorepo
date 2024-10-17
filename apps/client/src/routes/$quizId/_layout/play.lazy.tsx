import React, { useEffect } from 'react'
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
import { usePlayerGameState } from '@/state/player-game.state'
import { QuizStatusStatusOptions } from '@/baas/pocketbase-types'

export const Route = createLazyFileRoute('/$quizId/_layout/play')({
  component: Play
})

const teamAnswerSchema = z.object({
  answer: z.string().min(1)
})

type SchemaType = z.infer<typeof teamAnswerSchema>

function Play() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()

  const { teamId } = useTeamData()
  const { toast } = useToast()

  const playerGameState = usePlayerGameState()

  const form = useForm<SchemaType>({
    resolver: zodResolver(teamAnswerSchema),
    defaultValues: {
      answer: ''
    }
  })

  useEffect(() => {
    if (playerGameState.status === QuizStatusStatusOptions.END_ROUND) {
      if (playerGameState.questionId && teamId) {
        // saves even empty answer
        mutateSubmitTeamAnswer({
          questionId: playerGameState.questionId,
          teamId,
          answer: form.getValues('answer')
        })
      }

      navigate({
        to: `/${quizId}/check-answers`
      })
    }
  }, [playerGameState.status])

  useEffect(() => {
    if (playerGameState.questionId && teamId) {
      // saves even empty answer
      mutateSubmitTeamAnswer({
        questionId: playerGameState.questionId,
        teamId,
        answer: form.getValues('answer')
      })
    }

    form.reset()
  }, [playerGameState.questionId])

  const { mutate: mutateSubmitTeamAnswer } = useMutation({
    mutationFn: submitTeamAnswer
  })

  function handleSubmitAnswer(data: SchemaType) {
    if (!playerGameState.questionId) {
      toast({
        description: 'Hm... Something is wrong, try to refresh page',
        variant: 'destructive'
      })

      return
    }

    mutateSubmitTeamAnswer(
      {
        questionId: playerGameState.questionId,
        teamId,
        answer: data.answer
      },
      {
        onSuccess: () =>
          toast({
            description: 'Answer has been submitted'
          })
      }
    )
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
