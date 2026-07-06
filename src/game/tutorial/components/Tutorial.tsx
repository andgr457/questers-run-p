import { useTutorial } from '../../../engine/tutorial/hooks/useTutorial'
import GamePanel from '../../../ui/panel/GamePanel'
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

        <div className={styles.title}>Hints</div>
        {tutorial.hints.length > 0 && <div className={styles.hints}>
          {tutorial.hints.map(hint => {

            return <div className={styles.hint}>
              <div className={styles.title}>
                {hint.title}
              </div>
              <div className={styles.description}>
                {hint.description}
              </div>
            </div>
          })}
        </div>}
      </div>
    </GamePanel>
  )
}