import React, { useState } from 'react'
import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { ClientResponseError } from 'pocketbase'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp'
import { Input } from '@/components/ui/input'
import type { SuccessResponse } from '@/baas/quiz/is-quiz-exist-by-pin'
import {
  IS_QUIZ_EXIST_BY_PIN_API_KEY,
  isQuizExistByPin
} from '@/baas/quiz/is-quiz-exist-by-pin'
import { useToast } from '@/hooks/use-toast'
import { getQuizByPassword } from '@/baas/quiz/get-quiz-by-password.ts'
import type { QuizStatusStatusOptions } from '@/baas/pocketbase-types.ts'
import { STATUS_TO_ROUTES } from '@/util/status-to-router-map.ts'

export const Route = createLazyFileRoute('/')({
  component: App
})

function App(): JSX.Element {
  const navigate = useNavigate()
  const [clientPin, setClientPin] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  const { toast } = useToast()

  const { mutate: checkIsQuizExistByPin, isPending } = useMutation({
    mutationFn: isQuizExistByPin,
    mutationKey: [IS_QUIZ_EXIST_BY_PIN_API_KEY, clientPin],
    onSuccess: handleOnSuccessPin,
    onError: (error) => {
      if (error instanceof ClientResponseError && error.status === 404) {
        toast({
          variant: 'destructive',
          description: 'Quiz does not exist'
        })
      }
    }
  })

  const { mutate: mutateGetQuizByPassword } = useMutation({
    mutationFn: getQuizByPassword,
    onSuccess: handleNavigateToGameState
  })

  function handleNavigateToGameState({
    quizId,
    status
  }: {
    quizId: string | null
    status?: QuizStatusStatusOptions
  }) {
    if (quizId && status) {
      navigate({
        to: `/admin/${quizId}${STATUS_TO_ROUTES[status]}`
      })
    } else {
      toast({
        variant: 'destructive',
        description: 'Hmm... Something went wrong'
      })
    }
  }

  function handleOnSuccessPin(data: SuccessResponse): void {
    navigate({
      to: `${data.quizId}/create-team`
    })
  }

  return (
    <div className="lg:grid-cols-2 sm:flex lg:grid items-center justify-center h-[100vh] max-w-screen-xl sm:m-4 lg:mx-auto">
      <div className="space-y-4 justify-self-center">
        <h1 className="text-6xl font-bold">Hello there!</h1>
        <h2 className="text-xl font-bold">Are you ready to play?</h2>
        <h2 className="text-xl">
          Time to enter your quiz’s PIN and let’s get started
        </h2>
        <InputOTP disabled={isPending} maxLength={4} onChange={setClientPin}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
        <div className="space-x-4">
          <Button
            disabled={isPending}
            onClick={() => checkIsQuizExistByPin(clientPin)}
          >
            Enter the game!
          </Button>
        </div>
      </div>
      <div className="space-y-4 justify-self-center">
        <h1 className="text-6xl font-bold">Wanna create or manage the game?</h1>
        <h2 className="text-xl font-bold">
          Enter the password of the created game
        </h2>
        <Input
          onChange={(e) => {
            setAdminPassword(e.target.value)
          }}
          placeholder="Password..."
        />
        <Button onClick={() => mutateGetQuizByPassword(adminPassword)}>
          Manage the game!
        </Button>
        <h2 className="text-xl font-bold">OR</h2>
        <Link
          className={buttonVariants({ variant: 'outline' })}
          to="/admin/create"
        >
          Create new quiz
        </Link>
      </div>
    </div>
  )
}
