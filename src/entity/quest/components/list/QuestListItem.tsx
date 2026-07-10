import type { QuestWithActions } from './QuestList';
import styles from './QuestListItem.module.css'

interface Props {
  questWithActions: QuestWithActions
}

export default function QuestListItem(props: Props){
  const {
    questWithActions
  } = props

  const {
    quest,
    actions,
  } = questWithActions

  return <div className={styles.wrapper}>
    <div className={styles.text}>
      {quest.title}
    </div>

     <div className={styles.actions}>
      {actions.map(a => {
        
        return <div 
          title={a.title}
          className={`${styles.action} ${a.isTutorial ? 'tutorial-hint pulse-tutorial' : ''}`}
          onClick={() => {
            if(a.fn){
              a.fn?.(quest)
            }
          }}
        >
          {a.icon}
        </div>
      })}
    </div>
  </div>
}