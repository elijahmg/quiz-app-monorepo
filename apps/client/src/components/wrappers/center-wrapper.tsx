import React from 'react';

interface Props {
  children: React.ReactNode;
}

export function CenterWrapper({ children }: Props) {
  return (
    <div className="max-w-screen-lg mx-auto mt-14 space-y-4 h-[100vh]">
      {children}
    </div>
  )
}