import React, { useEffect } from 'react'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CenterWrapper } from '@/components/wrappers/center-wrapper';
import { TeamInGameHeader } from '@/components/modules/team-in-game-header';
import { useTeamData } from '@/hooks/use-team-data';
import { GET_TEAM_ANSWERS_API_KEY, getTeamAnswer } from '@/baas/team-answers/get-team-answers';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/modules/form/form-input';
import { Button } from '@/components/ui/button';
import { updateBatchTeamsAnswers } from '@/baas/team-answers/update-batch-teams-answers';
import { usePlayerGameState } from '@/state/player-game.state';
import { QuizStatusStatusOptions } from '@/baas/pocketbase-types';
import { useToast } from '@/hooks/use-toast';

export const Route = createLazyFileRoute('/$quizId/_layout/check-answers')({
  component: CheckAnswersPage,
})

const teamAnswerSchema = z.object({
  answer: z.string().min(1),
  question: z.string().min(1),
  teamAnswerId: z.string()
})

const teamAnswersSchema = z.object({
  answers: z.array(teamAnswerSchema)
})

// @TODO bad name
type Schema = z.infer<typeof teamAnswersSchema>

function CheckAnswersPage() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate();

  const { teamId } = useTeamData()

  const { status } = usePlayerGameState()

  const { toast } = useToast()

  const form = useForm<Schema>({
    resolver: zodResolver(teamAnswersSchema),
    defaultValues: {
      answers: []
    }
  })

  const { fields } = useFieldArray({
    control: form.control,
    name: `answers`
  });

  const { data } = useQuery({
    queryFn: () => getTeamAnswer({ quizId, teamId }),
    queryKey: [GET_TEAM_ANSWERS_API_KEY, quizId, teamId],
  })

  const { mutate: mutateUpdateBatchTeamAnswers } = useMutation({
    mutationFn: updateBatchTeamsAnswers,
    onSuccess: () => toast({
      description: 'Answers have been submitted'
    })
  })

  useEffect(() => {
    form.setValue('answers', data?.answers.map(({ question, answer, id }) => ({
      question,
      answer,
      teamAnswerId: id
    })) || [])
  }, [data]);

  useEffect(() => {
    if (status === QuizStatusStatusOptions.EVALUCATION) {
      navigate({
        to: ''
      })
    }
  }, [status]);

  function handleSubmitNewAnswers(data: Schema) {
    const parsedAnswers = data.answers.map((newAnswerData) => ({
      teamAnswerId: newAnswerData.teamAnswerId,
      answer: newAnswerData.answer
    }))

    mutateUpdateBatchTeamAnswers({
      newTeamAnswers: parsedAnswers
    })
  }

  return (
    <CenterWrapper>
      <TeamInGameHeader/>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmitNewAnswers)}>
          {fields.map((field, index) => (
            <FormInput form={form} key={field.teamAnswerId} label={`Q ${index + 1}: ${field.question}`}
                       name={`answers.${index}.answer`}/>
          ))}
          <Button type="submit">Submit answers</Button>
        </form>
      </Form>
    </CenterWrapper>
  )
}
