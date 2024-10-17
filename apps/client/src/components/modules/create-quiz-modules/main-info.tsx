import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { FormInput } from '@/components/modules/form/form-input'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue
} from '@/components/ui/select'
import { createQuiz } from '@/baas/quiz/create-quiz'

interface MainInfoProps {
  onSuccess?: (quizId: string) => void
}

interface Question {
  content: string
  answer: string
}

const question = z.object({
  content: z.string().min(1),
  answer: z.string().min(1),
  round: z.string().min(1)
})

export const mainQuizInfoSchema = z.object({
  name: z.string().min(4).max(12),
  password: z.string().min(4).max(12),
  pin: z.string().min(4).max(6),
  questions: z.array(question)
})

export function MainInfo({ onSuccess }: MainInfoProps): React.ReactNode {
  const [rounds, setRounds] = useState<string[]>([])
  const [round, setRound] = useState('')
  const [activeRound, setActiveRound] = useState<string>('')

  const form = useForm<z.infer<typeof mainQuizInfoSchema>>({
    resolver: zodResolver(mainQuizInfoSchema),
    defaultValues: {
      name: '',
      password: '',
      pin: '',
      questions: []
    }
  })

  const { fields, append } = useFieldArray({
    control: form.control,
    name: `questions`
  })

  async function onSubmit(
    data: z.infer<typeof mainQuizInfoSchema>
  ): Promise<void> {
    const parsedQuestions = data.questions.reduce<Record<string, Question[]>>(
      (acc, value) => {
        const question = { content: value.content, answer: value.answer }

        if (!acc[value.round]) {
          acc[value.round] = [question]
        } else {
          acc[value.round].push(question)
        }
        return acc
      },
      {}
    )

    const dataToBackEnd = {
      ...data,
      questions: parsedQuestions
    }

    const quizId = await createQuiz(dataToBackEnd)

    onSuccess?.(quizId)
  }

  function handleAddRound(): void {
    setRounds((prevState) => [...prevState, round])

    setRound('')
  }

  function handleAddQuestion(): void {
    append({ content: '', answer: '', round: activeRound })
  }

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 gap-6 min-w-[1280px] h-[80%]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-4 p-4">
          <h2 className="text-4xl font-semibold mb-4">Main quiz info</h2>
          <FormInput form={form} label="Please name your quiz" name="name" />
          <FormInput form={form} label="Add the password" name="password" />
          <FormInput form={form} label="Add the pin" name="pin" />
          <div className="space-y-2">
            <Label htmlFor="round">Rounds</Label>
            <div className="flex">
              <Input
                id="round"
                onChange={(e) => {
                  setRound(e.target.value)
                }}
                value={round}
              />
              <Button onClick={handleAddRound} type="button" variant="outline">
                <Plus />
              </Button>
            </div>
            {rounds.map((addedRound) => (
              <Badge className="mr-0.5" key={addedRound}>
                {addedRound}
              </Badge>
            ))}
          </div>
          <Button type="submit">Create Quiz</Button>
        </div>
        <div className="space-y-4 max-h-[70%] overflow-y-scroll p-4">
          <h2 className="text-4xl font-semibold mb-4">Questions</h2>
          <Select
            onValueChange={(newActiveRound) => {
              setActiveRound(newActiveRound)
            }}
            value={activeRound}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a round" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Round</SelectLabel>
                {rounds.map((round) => (
                  <SelectItem key={round} value={round}>
                    {round}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fields.map((item, key) => (
            <div
              className={item.round === activeRound ? 'block' : 'hidden'}
              key={item.id}
            >
              <FormInput
                form={form}
                label="Question"
                name={`questions.${key}.content`}
              />
              <FormInput
                form={form}
                label="Answer"
                name={`questions.${key}.answer`}
              />
            </div>
          ))}
          <Button onClick={handleAddQuestion} type="button" variant="outline">
            <Plus />
          </Button>
        </div>
      </form>
    </Form>
  )
}
