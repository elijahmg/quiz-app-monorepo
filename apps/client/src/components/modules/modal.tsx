import React from 'react'
import { createPortal } from 'react-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ModalProps {
  title: string
  children: React.ReactNode
  onSubmit: () => void
  open: boolean
}

export function Modal({ children, title, onSubmit, open }: ModalProps) {
  if (!open) return null

  return createPortal(
    <div className="fixed flex top-0 left-0 w-full h-[100vh] bg-gray-900/50 items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          <Button onClick={onSubmit}>Submit</Button>
        </CardFooter>
      </Card>
    </div>,
    document.getElementById('modal-root')!
  )
}
