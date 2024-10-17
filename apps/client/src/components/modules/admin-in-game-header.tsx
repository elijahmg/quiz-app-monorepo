import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import {
  GET_ADMIN_HEADER_DATA_API_KEY,
  getAdminHeaderData
} from '@/baas/quiz/get-admin-header-data'

interface Props {
  hideRoundInfo?: boolean
  quizId: string
}

export function AdminInGameHeader({ hideRoundInfo, quizId }: Props) {
  const { data } = useQuery({
    queryKey: [GET_ADMIN_HEADER_DATA_API_KEY, quizId],
    queryFn: () => getAdminHeaderData(quizId)
  })

  return (
    <>
      <div className="flex w-full justify-between">
        <div>
          <h2 className="text-4xl font-bold">{data?.name}</h2>
          <p className="text-gray-400">Pin: {data?.pin}</p>
        </div>
        <Badge className="self-baseline">Teams online: 7</Badge>
      </div>
      {!hideRoundInfo && (
        <p className="bg-gray-100 px-4 py-3 w-full rounded-md font-semibold">
          Round: {data?.currentRoundName}
        </p>
      )}
    </>
  )
}
