import { useTutorial } from '../../../engine/tutorial/hooks/useTutorial'
import GamePanel from '../../../ui/panel/GamePanel'
import { GAME_TUTORIALS } from '../data/Tutorial.data'
import TutorialListItem from './tutorial-rewards/TutorialListItem'
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
      title={`Tutorial ${tutorialProgress.completedTutorialIds.length}/${GAME_TUTORIALS.length}`}
      currentScreenName=''
    >
      <div className={styles.tutorial}>
        <div className={styles.title}>{`${tutorialProgress.completedTutorialIds.length + 1}. ${tutorial.title}`}</div>

        <div className={styles.description}>
          {tutorial.description}
        </div>
        <div className={styles.subtitle}>Rewards</div>
        {tutorial.rewards.length > 0 && <>
          <div className={styles.items}>
            {tutorial.rewards.map((r, i) => {
              const entries = [
                r.gold !== undefined ? { title: 'Gold', value: r.gold } : null,
                r.xp !== undefined ? { title: 'XP', value: r.xp } : null,
                r.characterTokens !== undefined
                  ? { title: 'Character Tokens', value: r.characterTokens }
                  : null,
              ].filter(Boolean)

              return (
                <div key={i} className={styles.rewardGroup}>
                  <div>{`${r.type === 'characters' ? 'All ' : ''}${r.type}`}</div>

                  {entries.map((e, idx) => (
                    <TutorialListItem
                      key={idx}
                      title={e!.title}
                      value={e!.value}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </>} 
        <div className={styles.subtitle}>Hints</div>
        {tutorial.hints.length > 0 && <div className={styles.items}>
          {tutorial.hints.map((hint, index) => {
            const title = `${index+1}. ${hint.title}`
            
            return <TutorialListItem 
              title={title}
              value={hint.description}
            />
          })}
        </div>}
      </div>
    </GamePanel>
  )
}