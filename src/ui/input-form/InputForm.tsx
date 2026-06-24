import { useEffect, useState } from 'react'
import ViewTransition from '../transition/Transition'
import styles from './InputForm.module.css'
import type { InputScreen } from './types/InputForm.types'
import type { Transition } from '../transition/types/Transition.types'

interface Props {
  screens: InputScreen[]
  transition: Transition
}

interface ScreenIndexes {
  screenIndex: number
  screenStepIndex: number
}

export default function ViewInputScreen(props: Props) {
  const { screens, transition } = props

  const [screenIndexes] = useState<ScreenIndexes>({
    screenIndex: 0,
    screenStepIndex: 0
  })

  const [showTransition, setShowTransition] = useState(true)
  const [screenClass, setScreenClass] = useState('')

  const [formState, setFormState] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!showTransition) {
      requestAnimationFrame(() => {
        setScreenClass(styles.show)
      })
    }
  }, [showTransition])

  const screen = screens[screenIndexes.screenIndex]
  const step = screen.steps[screenIndexes.screenStepIndex]

  const getValue = (label: string) => formState[label] ?? ''

  const setValue = (label: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [label]: value
    }))
  }

  return (
    <div className={styles.wrapper}>

      {showTransition && (
        <ViewTransition
          transition={transition}
          onComplete={() => setShowTransition(false)}
        />
      )}

      <div className={`${styles.container} ${screenClass}`}>

        {step.title && (
          <div className={styles.title}>
            {step.title}
          </div>
        )}

        <div className={styles.content}>
          {step.content}
        </div>

        <div className={styles.inputs}>
          {step.inputs.map((input, i) => (
            <div key={step.id + i} className={styles.inputRow}>
              <label className={styles.label}>
                {input.label}
              </label>

              {input.render(
                getValue(input.label),
                (value) => setValue(input.label, value)
              )}
            </div>
          ))}
        </div>

        {step.onAccept && <div>
          <button className='button-basic dark' onClick={step.onAccept}>
            Confirm
          </button>  
        </div>}

      </div>
    </div>
  )
}