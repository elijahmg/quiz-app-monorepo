import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
}

export function CenterWrapper({ children, className }: Props) {
  return (
    <div
      className={cn(
        'max-w-screen-lg px-6 lg:mx-auto p-14 space-y-4 max-h-screen',
        className
      )}
    >
      {children}
    </div>
  )
}
