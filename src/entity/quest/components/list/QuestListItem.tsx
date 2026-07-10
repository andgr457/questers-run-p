import type { QuestWithActions } from './QuestList';
import styles from './QuestListItem.module.css'

interface Props {
  questWithActions: QuestWithActions
}

export default function QuestListItem(props: Props) {
  const {
    questWithActions
  } = props

  const {
    quest,
    actions,
  } = questWithActions

  // Placeholder until requirements are parsed
  const questLevel = 1

  return (
    <div className={styles.wrapper}>

      <div className={styles.title}>
        {quest.title}
      </div>

      <div className={styles.level}>
        Lv. <span className={styles.levelValue}>{questLevel}</span>
      </div>

      <div className={styles.actions}>
        {actions.map(a => {

          return (
            <div
              key={a.title}
              title={a.title}
              className={`${styles.action} ${a.isTutorial ? 'tutorial-hint pulse-tutorial' : ''}`}
              onClick={() => {
                if (a.fn) {
                  a.fn(quest)
                }
              }}
            >
              {a.icon}
            </div>
          )
        })}
      </div>

    </div>
  )
}