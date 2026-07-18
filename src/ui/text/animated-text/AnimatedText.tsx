import { useEffect, useState } from 'react'
import styles from './AnimatedText.module.css'

interface Props {
  text: string
  textFancy?: React.ReactNode
  delay?: number
  onPrintingChange?: (printing: boolean) => void
}

const START_DELAY = 0
const END_DELAY = 1500

export default function AnimatedText({
  text,
  delay = 500,
  textFancy,
  onPrintingChange,
}: Props) {
  const [isComplete, setIsComplete] = useState(false)

  const characterCount = Math.max(
    1,
    text.replace(/\s/g, '').length,
  )

  const delayPerCharacter = delay / characterCount

  useEffect(() => {
    onPrintingChange?.(true)

    const timer = setTimeout(() => {
      onPrintingChange?.(false)
      setIsComplete(true)
    }, START_DELAY + delay + END_DELAY)

    return () => clearTimeout(timer)
  }, [text, delay, onPrintingChange])

  let letterIndex = 0

  return (
    <div className={styles.container} onClick={() => {setIsComplete(true)}}>
      {isComplete && (<div className={styles.originalText}>
        {textFancy ?? text}
      </div>)}
      {!isComplete && text.split(' ').map((word, wordIndex) => (
        <span key={wordIndex} className={styles.word}>
          {word.split('').map((letter, letterIdx) => {
            const currentIndex = letterIndex++

            return (
              <span
                key={letterIdx}
                className={styles.letter}
                style={{
                  animationDelay: `${
                    START_DELAY +
                    currentIndex * delayPerCharacter
                  }ms`,
                }}
              >
                {letter}
              </span>
            )
          })}
        </span>
      ))}
    </div>
  )
}