import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CenterWrapper } from '@/components/wrappers/center-wrapper';
import { FormInput } from '@/components/modules/form/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { createTeam } from '@/baas/team/create-team';

export const Route = createLazyFileRoute('/$quizId/create-team')({
  component: CreateTeam
})

const createTeamSchema = z.object({
  teamName: z.string().min(1)
})

type FormDataType = z.infer<typeof createTeamSchema>

function CreateTeam() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()

  const { mutate: mutateCreateTeam } = useMutation({
    mutationFn: createTeam,
    onSuccess: handleOnCreateTeamSuccess
  })

  const form = useForm<FormDataType>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      teamName: ''
    }
  })

  const teamName = form.watch('teamName')

  function handleOnCreateTeamSuccess({ teamId }: { teamId: string }) {
    // @TODO patch, can be done better
    localStorage.setItem('teamId', teamId)
    localStorage.setItem('teamName', teamName)

    navigate({
      to: `/${quizId}/waiting`
    })
  }

  function onFormSubmit({ teamName }: FormDataType) {
    mutateCreateTeam({
      teamName,
      quizId
    })
  }

  return (
    <CenterWrapper>
      <h2 className="font-bold text-3xl">Welcome</h2>
      <h2 className="font-semibold text-xl">How about we add your team name?</h2>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onFormSubmit)}>
          <FormInput form={form} label="Team name" name="teamName"/>
          <Button type="submit">Create Team</Button>
        </form>
      </Form>
    </CenterWrapper>
  )
}
