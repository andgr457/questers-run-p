import GamePanel from '../../../ui/panel/GamePanel'
import styles from './Tutorial.module.css'

interface TutorialOption {
  id: string
  label: string
}

interface Props {
  title: string
  description: string
  options?: TutorialOption[]
  onSelectOption?: (optionId: string) => void
}

export default function Tutorial(props: Props) {
  const {
    title,
    description,
    options,
    onSelectOption,
  } = props

  return (
    <GamePanel
      title='Tutorial'
      currentScreenName=''
    >
      <div className={styles.tutorial}>
        <div className={styles.title}>{title}</div>

        <div className={styles.description}>
          {description}
        </div>

        {options && options.length > 0 && (
          <div className={styles.options}>
            {options.map(option => (
              <button
                key={option.id}
                className={styles.option}
                onClick={() =>
                  onSelectOption?.(option.id)
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </GamePanel>
  )
}