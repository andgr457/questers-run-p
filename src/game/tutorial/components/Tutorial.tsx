import { useEffect, useRef, useState } from 'react'
import { useTutorial } from '../../../engine/tutorial/hooks/useTutorial'
import GamePanel from '../../../ui/panel/GamePanel'
import { GAME_TUTORIALS } from '../data/Tutorial.data'
import TutorialList from './list/TutorialList'
import styles from './Tutorial.module.css'
import TutorialDetail from './detail/TutorialDetail'
import type { Tutorial, TutorialProgressMeta } from '../types/Tutorial.types'
import GamePanelSection from '../../../ui/panel/GamePanelSection'
import TutorialRewardsCollect from './collect/TutorialRewardsCollect'

export type TutorialMode = 'main'
  | 'detail'
  | 'collect'

export default function Tutorial() {
  const {
    tutorial,
    completedTutorials
  } = useTutorial()

  const targetRef = useRef<HTMLDivElement>(null);
  
  const [mode, setMode] = useState<TutorialMode>('main')
  const [tutorialDetail, setTutorialDetail] = useState<Tutorial | undefined>(tutorial)
  const completedAmount = completedTutorials?.length ?? 0

  useEffect(() => {
    scrollToSection()
  }, [mode])

  const scrollToSection = () => {
    if (targetRef.current) {
      window.location.hash = 'top';
      targetRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <GamePanel
      title={`Tutorials`}
      currentScreenName={mode === 'collect' ? 'Collect Rewards' : mode === 'detail' ? `Tutorial Detail` : ''}
    >
      <div ref={targetRef} className={styles.wrapper}>
        {tutorialDetail && mode === 'collect' && (
          <GamePanelSection
            expandable={false}
            actions={[]}
            onBack={() => {
              setMode('main')
              setTutorialDetail(undefined)
            }}
            onBackLabel='Tutorials'
          >  
            <TutorialRewardsCollect 
              tutorial={tutorialDetail}
              tutorialProgress={completedTutorials?.find(ct => ct.tutorialId === tutorialDetail.id) as TutorialProgressMeta}
            />
          </GamePanelSection>
        )}
        {tutorialDetail && mode === 'detail' && (
         <GamePanelSection
          actions={[]}
          onBack={() => {
            setMode('main')
            setTutorialDetail(undefined)
          }}
          onBackLabel='Tutorials'
         >  
           <TutorialDetail tutorial={tutorialDetail}  />
         </GamePanelSection>
        )}
        {tutorial && mode === 'main' && (
          <>
            <div className={styles.completeCount}>
              {completedAmount}/{GAME_TUTORIALS.length} complete
            </div>
            <GamePanelSection
              actions={[]}
              title={'Current Tutorial'}
              expandable={false}
            >
              <TutorialDetail index={completedAmount} tutorial={tutorial as Tutorial} />
            </GamePanelSection>
            <GamePanelSection
              actions={[]}
              title={'All Tutorials'}
              expandable={false}
            >
              <TutorialList setMode={setMode} setTutorialDetail={setTutorialDetail} />
            </GamePanelSection>
          </>
        )}
      </div>
    </GamePanel>
  )
}