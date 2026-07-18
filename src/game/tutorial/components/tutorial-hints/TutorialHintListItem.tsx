import { eventBus } from '../../../../engine/event/EventBus'
import { ContextMenuIcon } from '../../../context-menu/data/ContextMenuIcon.data'
import type { TutorialHint } from '../../types/Tutorial.types'
import styles from './TutorialHintListItem.module.css'

interface Props {
  hint: TutorialHint,
  index: number
  isCurrentTutorialComplete: boolean
  isTutorialCurrentTutorial: boolean
}

export default function TutorialHintListItem(props: Props){
  const {
    hint,
    index,
    isCurrentTutorialComplete,
    isTutorialCurrentTutorial
  } = props
  const {
    description,
    title,
    alternate,
    quickOverlayMode,
    quickOverlayModeDescription,
  } = hint

  const canQuickNav = !isCurrentTutorialComplete 
    || isTutorialCurrentTutorial

  return (
    <div className={styles.wrapper}>
      {title && <div className={styles.title}>
        {index+1}. {title}
      </div>}
      <div className={styles.description}>
        {description}
      </div>
      {quickOverlayMode && (
        <div 
          title='Quick Navigate'
          className={`${styles.action} ${!canQuickNav ? styles.disabled : ''}`} 
          onClick={() => {
            if(!canQuickNav) return
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'world:mode:change',
              meta: {
                worldMode: quickOverlayMode
              }
            })
          }}
        >
          {ContextMenuIcon.start} {quickOverlayModeDescription}
        </div>
      )}
      {alternate && (<>
        <div className={styles.alternateWrapper}>
          <div className={styles.title}>
            Alternatively
          </div>
          <div className={styles.description}>
            {alternate.description}
          </div>
          {alternate.quickOverlayMode && (
            <div 
              title='Alternative Quick Navigate'
              className={`${styles.action} ${!canQuickNav ? styles.disabled : ''}`} 
              onClick={() => {
                if(!canQuickNav) return

                eventBus.emit({
                  id: crypto.randomUUID(),
                  type: 'world:mode:change',
                  meta: {
                    worldMode: alternate.quickOverlayMode
                  }
                })
              }}
            >
              {ContextMenuIcon.start} {alternate.quickOverlayModeDescription}
            </div>
          )}
        </div>
      </>)}
    </div>
  )
}