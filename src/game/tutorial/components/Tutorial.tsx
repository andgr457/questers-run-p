import { useState } from 'react'
import { useTutorial } from '../../../engine/tutorial/hooks/useTutorial'
import GamePanel from '../../../ui/panel/GamePanel'
import { GAME_TUTORIALS } from '../data/Tutorial.data'
import TutorialList from './list/TutorialList'
import styles from './Tutorial.module.css'
import TutorialDetail from './detail/TutorialDetail'
import type { Tutorial, TutorialProgressMeta } from '../types/Tutorial.types'
import GamePanelSection from '../../../ui/panel/GamePanelSection'
import TutorialRewardsCollect from './collect/TutorialRewardsCollect'
import type { ItemAction } from '../../../ui/item-action/types/ItemAction.types'
import { eventBus } from '../../../engine/event/EventBus'
import { characterRuntimeService } from '../../../engine/character/CharacterRuntimeService'

export type TutorialMode = 'main'
  | 'detail'
  | 'collect'

export default function Tutorial() {
  const {
    tutorial,
    completedTutorials
  } = useTutorial()
  
  const [mode, setMode] = useState<TutorialMode>('main')
  const [tutorialDetail, setTutorialDetail] = useState<Tutorial | undefined>(tutorial)
  const completedAmount = completedTutorials?.length ?? 0

  const tutorialDetailProgress = completedTutorials?.find(t => t.tutorialId === tutorialDetail?.id)
  const detailActions: ItemAction<TutorialProgressMeta>[] = []
  if(tutorialDetailProgress?.completed === true && tutorialDetailProgress?.collected === false){
    detailActions.push({
      name: 'Collect',
      fn: () => {
        if(!tutorialDetailProgress?.completed){
          return
        }
        if(tutorialDetailProgress?.collected === true){
          return
        }
        setMode('collect')
      },
      className: 'button success'
    })
  }
  return (
    <GamePanel
      title={`Tutorials`}
      currentScreenName={mode === 'collect' ? 'Collect Rewards' : mode === 'detail' ? `Tutorial Detail` : ''}
    >
      <div className={styles.wrapper}>
        {tutorialDetail && mode === 'collect' && (
          <GamePanelSection<Tutorial>
            expandable={false}
            actions={[
              {
                name: 'Confirm & Collect',
                fn: () => {
                  eventBus.emit({
                    id: crypto.randomUUID(),
                    type: 'rewards:start',
                    meta: {
                      characterId: characterRuntimeService.getManagingCharacter()?.id,
                      tutorialId: tutorialDetail.id,
                      tutorialRewards: tutorialDetail.rewards  
                    }
                  })
                },
                className: 'button success'
              }
            ]}
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
          actions={detailActions}
          actionsLocation='top'
          onBack={() => {
            setMode('main')
            setTutorialDetail(undefined)
          }}
          onBackLabel='Tutorials'
         >  
          <TutorialDetail 
            tutorial={tutorialDetail}
            tutorialProgress={tutorialDetailProgress}
            isTutorialComplete={tutorialDetailProgress?.completed === true}
            isTutorialCurrentTutorial={tutorialDetail.id === tutorial?.id}
          />
         </GamePanelSection>
        )}
        {tutorial && mode === 'main' && (
          <>
            <div className={styles.completeCount}>
              {completedAmount}/{GAME_TUTORIALS.length} complete
            </div>

            <GamePanelSection
              actions={[]}
              title={'All Tutorials'}
              expandable={false}
            >
              <TutorialList 
                setMode={setMode} 
                setTutorialDetail={setTutorialDetail} 
              />
            </GamePanelSection>
          </>
        )}
      </div>
    </GamePanel>
  )
}