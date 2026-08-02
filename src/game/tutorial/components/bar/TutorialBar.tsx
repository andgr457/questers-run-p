import { useState } from 'react'
import styles from './TutorialBar.module.css'
import GoldDetail from '../../../../ui/gold/GoldDetail'
import PlayerCharacterTokens from '../../../../entity/player/components/detail/PlayerCharacterTokens'
import { useTutorial } from '../../../../engine/tutorial/hooks/useTutorial'
import { formatPrimitiveValueToString } from '../../../utils/Game.utils'
import { eventBus } from '../../../../engine/event/EventBus'

export default function TutorialBar() {
  const [expanded, setExpanded] = useState(false)

  const { completedTutorialsProgress: completedTutorials, tutorial, tutorialProgress } = useTutorial()
  
  const currentProgress = tutorialProgress?.playerTutorialProgress?.find(p => p.tutorialId === tutorial?.id)
  
  const isCompleted = currentProgress?.completed === true
  const isCollected = currentProgress?.collected === true
  const canCollect = isCompleted === true && isCollected === false
  return (
    <div className={styles.wrapper}>
      <button
        className={styles.header}
        onClick={() => setExpanded(v => !v)}
      >
        <div className={styles.headerTitle}>
          ＋ TUTORIAL #{(completedTutorials?.length ?? 0)+1}
        </div>
        <div className={styles.tutorialTitle}>
          {tutorial?.title}
        </div>
        <div>
          {expanded ? '▲' : '▼'}
        </div>
      </button>

      {expanded && (
        <div className={styles.content}>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              DESCRIPTION
            </div>
            <div className={styles.sectionContent}>
              {tutorial?.description}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              OBJECTIVE
            </div>
            <div className={styles.sectionContent}>
              {tutorial?.requirement}
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              REWARDS
            </div>
            <div className={styles.sectionContent}>
              {tutorial?.rewards.map(r => {

                return <div className={styles.reward}>
                  <div> 
                    {r.type.toUpperCase()}
                  </div>
                  <div>
                    <GoldDetail gold={r.gold ?? 0} />
                  </div>
                  <div>
                     {formatPrimitiveValueToString(r.xp ?? 0)}XP
                  </div>
                  <div>
                    <PlayerCharacterTokens tokens={r.characterTokens ?? 0} />
                  </div>
                </div>
              })}
            </div>
            <button
              className={`${canCollect ? 'button success' : 'button disabled'}`}
              onClick={() => {
                eventBus.emit({
                  id: crypto.randomUUID(),
                  type: 'tutorial:collect',
                  meta: {
                    tutorialId: tutorial?.id
                  }
                })
              }}
            >
              Collect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}