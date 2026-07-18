import { useManagedCharacter } from '../../engine/character/hooks/useManagedCharacters'
import AnimatedText from '../text/animated-text/AnimatedText'
import styles from './Background.module.css'

interface Props {
  topText: string
  bottomText?: string
}

export default function Background({
  topText,
  bottomText
}: Props) {
  const {managedCharacter, location} = useManagedCharacter()

  return (
    <div className={styles.background}>
      {managedCharacter && <div className={styles.character}>
        {managedCharacter.name} - Lv. {managedCharacter.level} - {location?.name}
      </div>}
      <div className={styles.line} />

      <div className={styles.text}>
        <div className={styles.top}>
          <AnimatedText
            text={topText}
            delay={1000}
          />
        </div>

        {bottomText && (
          <div className={styles.bottom}>
            <AnimatedText
              text={bottomText}
              delay={1500}
            />
          </div>
        )}
      </div>

    </div>
  )
}