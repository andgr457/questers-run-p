import GamePanel from '../../../ui/panel/GamePanel'
import { useTutorial } from '../hooks/useTutorial'
import styles from './Tutorial.module.css'

export default function Tutorial() {
  const {
    tutorial,
    tutorialProgress
  } = useTutorial()

  if(!tutorial || !tutorialProgress){
    return <GamePanel
      title='Tutorial'
      currentScreenName=''
    >
      <div className={styles.tutorial}>
        <div className={styles.title}>Tutorial Complete!</div>
      </div>
    </GamePanel>
  }

  return (
    <GamePanel
      title='Tutorial'
      currentScreenName=''
    >
      <div className={styles.tutorial}>
        <div className={styles.title}>{`${tutorialProgress.completedTutorialIds.length + 1}. ${tutorial.title}`}</div>

        <div className={styles.description}>
          {tutorial.description}
        </div>

        {tutorial.hints.length > 0 && <div className={styles.hints}>
          {tutorial.hints.map(hint => {

            return <div className={styles.hint}>
              <div className={styles.hintTitle}>
                {hint.title}
              </div>
              <div className={styles.hintDescription}>
                {hint.description}
              </div>
            </div>
          })}
        </div>}
      </div>
    </GamePanel>
  )
}