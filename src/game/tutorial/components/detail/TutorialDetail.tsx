import type { Tutorial } from '../../types/Tutorial.types'
import TutorialHintList from '../tutorial-hints/TutorialHintList'
import TutorialRewardList from '../tutorial-rewards/TutorialRewardList'
import styles from './TutorialDetail.module.css'

interface Props {
  tutorial: Tutorial
  index?: number
}

export default function TutorialDetail(props: Props){
  const {
    tutorial,
    index
  } = props
  return <div className={styles.wrapper}>
    <div className={styles.title}>
      {!index ? '' : `${index+1}.`} {tutorial.title}
    </div>

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
}