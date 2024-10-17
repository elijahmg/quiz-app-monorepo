import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useFieldArray, useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CenterWrapper } from '@/components/wrappers/center-wrapper'
import { AdminInGameHeader } from '@/components/modules/admin-in-game-header'
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  GET_ADMIN_TEAMS_ANSWERS_API_KEY,
  getAdminTeamsAnswers
} from '@/baas/team-answers/get-admin-teams-answers'
import type { RadioButtonOption } from '@/components/modules/form/form-radio-buttons'
import { FormRadioButtons } from '@/components/modules/form/form-radio-buttons'
import { Form } from '@/components/ui/form'
import { evaluateTeamsAnswers } from '@/baas/team-answers/evaluate-teams-answers'
import { moveQuizToScoreViewingState } from '@/baas/quiz-status/move-quiz-to-score-viewing-state'

export const Route = createLazyFileRoute('/admin/$quizId/teams-overview')({
  component: TeasOverview
})

const teamAnswerSchema = z.object({
  id: z.string(),
  question: z.object({
    id: z.string(),
    content: z.string().optional(),
    answer: z.string().optional()
  }),
  score: z.enum(['0', '0.5', '1']).default('0'),
  answer: z.string(),
  team: z.object({
    id: z.string()
  })
})

const answersSchema = z.record(z.string().min(1), z.array(teamAnswerSchema))

type AnswerSchemaType = z.infer<typeof answersSchema>

function TeasOverview() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()

  const form = useForm<AnswerSchemaType>({
    resolver: zodResolver(answersSchema)
  })

  const { data, isPending } = useQuery({
    queryKey: [GET_ADMIN_TEAMS_ANSWERS_API_KEY, quizId],
    queryFn: () => getAdminTeamsAnswers(quizId)
  })

  const { mutate: mutateMoveQuizToScoreViewingState } = useMutation({
    mutationFn: () => moveQuizToScoreViewingState(quizId),
    onSuccess: () =>
      navigate({
        to: `/admin/${quizId}/game-overview`
      })
  })

  const { mutate: submitTeamsScores } = useMutation({
    mutationFn: evaluateTeamsAnswers,
    onSuccess: () => mutateMoveQuizToScoreViewingState()
  })

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((teamName) => {
        form.setValue(teamName, data[teamName])
      })
    }
  }, [data])

  async function handleSubmitResults(data: AnswerSchemaType) {
    const parsedScoredAnswers = Object.values(data)
      .flat()
      .map((scoredTeamAnswer) => ({
        id: scoredTeamAnswer.id,
        score: Number(scoredTeamAnswer.score)
      }))

    submitTeamsScores(parsedScoredAnswers)
  }

  return (
    <CenterWrapper>
      <AdminInGameHeader quizId={quizId} />
      {isPending ? <p>Loading...</p> : null}
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmitResults)}
        >
          <Accordion className="w-full" collapsible type="single">
            {Boolean(data) &&
              Object.keys(data!).map((key) => (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger>{key}</AccordionTrigger>
                  <AccordionContent>
                    <TeamFormAnswers form={form} teamName={key} />
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
          <Button className="self-start" type="submit">
            Submit results
          </Button>
        </form>
      </Form>
    </CenterWrapper>
  )
}

// This component belong only here
function TeamFormAnswers({
  teamName,
  form
}: {
  teamName: string
  form: UseFormReturn<AnswerSchemaType>
}) {
  const { fields } = useFieldArray({
    control: form.control,
    name: teamName
  })

  const radioButtonOptions: RadioButtonOption[] = [
    {
      value: '0',
      label: '0 point'
    },
    {
      value: '0.5',
      label: '0.5 point'
    },
    {
      value: '1',
      label: '1 point'
    }
  ]

  return fields.map((field, index) => (
    <div className="p-3 bg-gray-200 rounded mb-2 space-y-3" key={field.id}>
      <p className="font-semibold text-xl">
        Q{index + 1}: {field.question.content}
        <i>({field.question.answer})</i>
      </p>
      <div className="text-lg">
        Team answer: <b>{field.answer}</b>
      </div>
      <div className="space-x-2">
        <FormRadioButtons
          form={form}
          name={`${teamName}.${index}.score`}
          options={radioButtonOptions}
        />
      </div>
    </div>
  ))
}
