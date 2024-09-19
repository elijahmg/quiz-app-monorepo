import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { FormInput } from '@/components/modules/form/form-input';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface MainInfoProps {
  onSuccess?: () => void
}

const mainQuizInfoSchema = z.object({
  name: z.string().min(4).max(12),
  password: z.string().min(4).max(12),
  pin: z.string().min(4).max(6),
  })

export function MainInfo({ onSuccess }: MainInfoProps): React.ReactNode {
  const [rounds, setRounds] = useState<string[]>([])
  const [round, setRound] = useState('')

  const form = useForm<z.infer<typeof mainQuizInfoSchema>>({
    resolver: zodResolver(mainQuizInfoSchema),
    defaultValues: {
      name: '',
      password: '',
      pin: '',
    }
  })

  function onSubmit(data: z.infer<typeof mainQuizInfoSchema>): void {
    console.log(data, rounds)

    onSuccess?.()
  }

  function handleAddRound(): void {
    setRounds((prevState) => [...prevState, round])

    setRound('')
  }

  return (
    <div>
      <h2 className="text-4xl font-semibold mb-4">Main quiz info</h2>
      <Form {...form}>
        <form className="space-y-4 min-w-[350px]" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput form={form} label="Please name your quiz" name="name"/>
          <FormInput form={form} label="Add the password" name="password"/>
          <FormInput form={form} label="Add the pin" name="pin"/>
          <div className="space-y-2">
            <Label htmlFor="round">Rounds</Label>
            <div className="flex">
              <Input id="round" onChange={(e) => { setRound(e.target.value); }} value={round} />
              <Button onClick={handleAddRound} type="button" variant="outline" ><Plus /></Button>
            </div>
            {rounds.map((addedRound) => <Badge className="mr-0.5" key={addedRound}>{addedRound}</Badge>)}
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}