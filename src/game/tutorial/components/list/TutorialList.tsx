import { useTutorial } from '../../../../engine/tutorial/hooks/useTutorial'
import { GAME_TUTORIALS } from '../../data/Tutorial.data'
import type { Tutorial, TutorialProgressMeta } from '../../types/Tutorial.types'
import type { TutorialMode } from '../Tutorial'
import TutorialListItem from './TutorialListItem'

interface Props {
  setMode: (mode: TutorialMode) => void
  setTutorialDetail: (tutorial: Tutorial) => void
}

export default function TutorialList(props: Props){
  const {tutorialProgress} = useTutorial()
  const {
    setMode,
    setTutorialDetail
  } = props
  return <div>
    {GAME_TUTORIALS.map((t, index) => {
      const progress = tutorialProgress?.playerTutorialProgress?.find(tp => 
        tp.tutorialId === t.id
      )
      return <TutorialListItem 
        progress={progress as TutorialProgressMeta}
        tutorial={t}
        index={index}
        onDetail={(tutorial) => {
          setTutorialDetail(tutorial)
          setMode('detail')
        }}
        onCollect={(tutorial) => {
          setTutorialDetail(tutorial)
          setMode('collect')
        }}
      />
    })}
  </div>
    
}