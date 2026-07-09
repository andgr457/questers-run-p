import type { TutorialHint } from '../../types/Tutorial.types'
import TutorialHintListItem from './TutorialHintListItem'
import styles from './TutorialHintList.module.css'

interface Props {
  hints: TutorialHint[]
}

export default function TutorialHintList(props: Props){
  const {
    hints
  } = props
  return <div className={styles.wrapper}>
    {hints.map(hint => {
      return <TutorialHintListItem
        title={hint.title}
        value={hint.description}
      />
    })}
  </div>
}
