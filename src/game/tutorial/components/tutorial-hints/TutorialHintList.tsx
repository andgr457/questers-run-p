import type { TutorialHint } from '../../types/Tutorial.types'
import TutorialHintListItem from './TutorialHintListItem'
import styles from './TutorialHintList.module.css'

interface Props {
  hints: TutorialHint[]
  tutorialIsComplete: boolean
  isTutorialCurrentTutorial: boolean
}

export default function TutorialHintList(props: Props){
  const {
    hints,
    tutorialIsComplete,
    isTutorialCurrentTutorial,
  } = props

  return <div className={styles.wrapper}>
    {hints.map((hint, index) => {
      return <TutorialHintListItem
        index={index}
        hint={hint}
        isCurrentTutorialComplete={tutorialIsComplete}
        isTutorialCurrentTutorial={isTutorialCurrentTutorial}
      />
    })}
  </div>
}
