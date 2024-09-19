import React from 'react'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { MainInfo } from '@/components/modules/create-quiz-modules/main-info';

export const Route = createLazyFileRoute('/admin/create/')({
  component: AdminIndex,
})

function AdminIndex(): React.ReactNode {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <MainInfo/>
    </div>
  )
}
