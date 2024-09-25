import React from 'react'
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

export const Route = createLazyFileRoute('/$quizId/play')({
  component: Play
})

const teamAnswerSchema = z.object({
  answer: z.string().min(1)
})

type SchemaType = z.infer<typeof teamAnswerSchema>

function Play() {
  const form = useForm<SchemaType>({
    resolver: zodResolver(teamAnswerSchema),
    defaultValues: {
      answer: ''
    }
  })

  const { toast } = useToast()

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
          <FormInput form={form} label="Q: 1+1" name="answer"/>
          <Button type="submit">Submit answer</Button>
        </form>
      </Form>
    </CenterWrapper>
  )
}
