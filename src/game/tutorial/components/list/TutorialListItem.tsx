import { ContextMenuIcon } from '../../../context-menu/data/ContextMenuIcon.data'
import type { Tutorial, TutorialProgressMeta } from '../../types/Tutorial.types'
import styles from './TutorialListItem.module.css'

interface Props {
  tutorial: Tutorial
  progress: TutorialProgressMeta
  index: number
  onDetail: (tutorial: Tutorial) => void
  onCollect: (tutorial: Tutorial) => void
}

export default function TutorialListItem(props: Props){
  const {
    progress,
    tutorial,
    index,
    onDetail,
    onCollect
  } = props

  const isCompleted = progress?.completed === true
  const isCollected = progress?.collected === true
  const isCurrent = typeof progress != 'undefined'
  return <div className={`${styles.wrapper} ${isCurrent ? styles.gold : ''}`}>
    <div>
      {index+1}.
    </div>
    <div className={`${styles.title} ${isCompleted ? styles.completed : ''}`}>
       {tutorial.title}
    </div>
    <div className={`${styles.description} ${isCompleted ? styles.completed : ''}`}>
      {tutorial.description}
    </div>
    <div className={styles.actions}>
      {(isCompleted || isCollected) && <div className={styles.action}>
        {isCompleted === true && isCollected === true && <div className={styles.collected}>{ContextMenuIcon.check}</div>}

        {isCompleted === true && isCollected === false && <button 
          className='button success-alt'
          onClick={() => {
            onCollect(tutorial)
          }}
        >
          Collect
        </button>}
      </div>}
      <div 
        title='View Tutorial Details'
        className={styles.action} 
        onClick={() => {onDetail(tutorial)}}
      >
        {ContextMenuIcon.eye}
      </div>

    </div>
  </div>
}