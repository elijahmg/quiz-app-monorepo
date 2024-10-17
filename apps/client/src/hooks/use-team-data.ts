import { useState, useEffect } from 'react'

interface TeamData {
  teamId: string
  teamName: string
}

export function useTeamData() {
  const [teamData, setTeamData] = useState<TeamData>({
    teamId: '',
    teamName: ''
  })

  useEffect(() => {
    const teamId = localStorage.getItem('teamId')
    const teamName = localStorage.getItem('teamName')

    setTeamData({
      teamId: teamId ?? '',
      teamName: teamName ?? ''
    })
  }, [])

  return teamData
}
