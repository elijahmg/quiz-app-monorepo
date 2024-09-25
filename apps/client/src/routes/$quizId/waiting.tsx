import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CenterWrapper } from '@/components/wrappers/center-wrapper'
import { AlienTaken } from '../../../svg-assets/alien-taken'

export const Route = createFileRoute('/$quizId/waiting')({
  component: Waiting,
})

function Waiting() {
  return (
    <CenterWrapper className="items-center flex flex-col gap-4">
      <h2 className="text-4xl font-bold">Getting ready</h2>
      <AlienTaken/>
      <p className="text-xl font-semibold text-center">Don't worry TEAM_NAME, the quiz will start in a few moments</p>
    </CenterWrapper>
  )
}
