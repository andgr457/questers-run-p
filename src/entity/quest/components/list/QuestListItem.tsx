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

  const levelRequirement = quest.requirements.start.find(r => r.level)
  return (
    <div className={styles.wrapper}>

      <div className={styles.title}>
        {quest.title}
      </div>

      {levelRequirement && <div className={styles.level}>
        Lv. <span className={styles.levelValue}>{levelRequirement.level}</span>
      </div>}

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