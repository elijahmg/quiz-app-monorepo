import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Props {
  hideRoundInfo?: boolean;
}

export function AdminInGameHeader({ hideRoundInfo }: Props) {

  return (
    <>
      <div className="flex w-full justify-between">
        <div>
          <h2 className="text-4xl font-bold">Name</h2>
          <p className="text-gray-400">Pin: 1234</p>
        </div>
        <Badge className="self-baseline">Teams online: 7</Badge>
      </div>
      {!hideRoundInfo &&
          <p className="bg-gray-100 px-4 py-3 w-full rounded-md font-semibold">
              Round 1: Math
          </p>
      }
    </>
  )
}