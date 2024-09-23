import React from 'react';

interface Props {
  children: React.ReactNode;
}

export function CenterWrapper({ children }: Props) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-[100vh] max-w-screen-lg mx-auto">
      {children}
    </div>
  )
}