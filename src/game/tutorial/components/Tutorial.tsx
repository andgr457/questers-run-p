import { useTutorial } from '../../../engine/tutorial/hooks/useTutorial'
import GamePanel from '../../../ui/panel/GamePanel'
import { GAME_TUTORIALS } from '../data/Tutorial.data'
import TutorialHintList from './tutorial-hints/TutorialHintList'
import TutorialRewardList from './tutorial-rewards/TutorialRewardList'
import TutorialRewardListItem from './tutorial-rewards/TutorialRewardListItem'
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
      title={`Tutorial ${tutorialProgress.completedTutorialIds?.length ?? 0}/${GAME_TUTORIALS.length}`}
      currentScreenName=''
    >
      <div className={styles.wrapper}>
        <div className={styles.title}>{`${tutorialProgress.completedTutorialIds.length + 1}. ${tutorial.title}`}</div>

        <div className={styles.description}>
          {tutorial.description}
        </div>

        <div className={styles.sections}>
          <div className={styles.section}>
            <div className={styles.subtitle}>Rewards</div>
            {tutorial.rewards.length > 0 && <>
              <TutorialRewardList rewards={tutorial.rewards} />
            </>} 
          </div>
          <div className={styles.section}>
            <div className={styles.subtitle}>Hints</div>
            {tutorial.hints.length > 0 && <div>
              <TutorialHintList hints={tutorial.hints} />
            </div>}
          </div>
        </div>
      </div>
    </GamePanel>
  )
}