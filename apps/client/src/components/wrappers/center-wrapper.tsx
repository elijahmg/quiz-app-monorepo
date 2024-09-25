import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function CenterWrapper({ children, className }: Props) {
  return (
    <div className={cn("max-w-screen-lg mx-6 lg:mx-auto mt-14 space-y-4 h-[100vh]", className)}>
      {children}
    </div>
  )
}