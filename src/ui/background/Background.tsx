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
  return (
    <div className={styles.background}>
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