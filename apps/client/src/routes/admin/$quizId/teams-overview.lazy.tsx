import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import React from 'react';
import { CenterWrapper } from '@/components/wrappers/center-wrapper';
import { AdminInGameHeader } from '@/components/modules/admin-in-game-header';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

export const Route = createLazyFileRoute('/admin/$quizId/teams-overview')({
  component: TeasOverview,
})

const MOCK = {
  'Team Alpha': [
    {
      'id': 1,
      'question': {
        'id': 101,
        'content': 'What is the capital of France?',
        'answer': 'Paris'
      },
      'answer': 'Paris',
      'teamId': 1,
      'team': {
        'id': 1,
        'name': 'Team Alpha'
      }
    },
    {
      'id': 2,
      'question': {
        'id': 102,
        'content': 'What is the capital of Japan?',
        'answer': 'Tokyo'
      },
      'answer': 'Tokyo',
      'teamId': 1,
      'team': {
        'id': 1,
        'name': 'Team Alpha'
      }
    }
  ],
  'Team Beta': [
    {
      'id': 3,
      'question': {
        'id': 103,
        'content': 'What is the largest ocean on Earth?',
        'answer': 'Pacific Ocean'
      },
      'answer': 'Atlantic Ocean',
      'teamId': 2,
      'team': {
        'id': 2,
        'name': 'Team Beta'
      }
    }
  ]
}


// @TODO redo buttons into radio buttons
// @TODO make better components


function TeasOverview() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()

  async function handleSubmitResults() {
    await navigate({
      to: `/admin/${quizId}/game-overview`,
    })
  }

  return (
    <CenterWrapper>
      <AdminInGameHeader/>
      <Accordion className="w-full" collapsible type="single">
        {Object.keys(MOCK).map((key) => (
          <AccordionItem key={key} value={key}>
            <AccordionTrigger>{key}</AccordionTrigger>
            <AccordionContent>
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */}
              {MOCK[key].map((answer) => (
                <div className="p-3 bg-gray-200 rounded mb-2 space-y-3" key={answer.id}>
                  <p className="font-semibold text-xl">{answer.question.content} <i>({answer.question.answer})</i></p>
                  <div className="text-lg">Team answer: <b>{answer.answer}</b></div>
                  <div className="space-x-2">
                    <Button variant="ghost">1 point</Button>
                    <Button variant="ghost">0.5 points</Button>
                    <Button variant="ghost">0 point</Button>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button className="self-start" onClick={handleSubmitResults}>Submit results</Button>
    </CenterWrapper>
  )
}
