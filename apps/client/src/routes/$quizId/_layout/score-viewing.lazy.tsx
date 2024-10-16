import { createLazyFileRoute } from '@tanstack/react-router'
import { useTeamData } from '@/hooks/use-team-data';
import { CenterWrapper } from '@/components/wrappers/center-wrapper';
import { TeamInGameHeader } from '@/components/modules/team-in-game-header';

export const Route = createLazyFileRoute('/$quizId/_layout/score-viewing')({
  component: ScoreView,
})

function ScoreView() {
  const { teamId } = useTeamData()

  return (
    <CenterWrapper>
      <TeamInGameHeader/>
      <div>Hello /$quizId/_layout/score-viewing!</div>

    </CenterWrapper>
  )
}
