import { useEffect, useState } from 'react'
import ViewTransition from '../transition/ViewTransition'
import styles from './ViewInputScreen.module.css'
import type { ViewTransition as ViewTransitionType } from '../transition/types/ViewTransition.types'

interface Props {
  screens: InputScreen[]
  transition: ViewTransitionType
}

export interface InputScreen {
  index: number
  steps: InputScreenStep[]
}

export interface InputScreenStep {
  id: string
  title?: React.ReactNode
  content: React.ReactNode
  inputs: ViewInputScreenStepInput[]
  onAccept?: () => void
  onCancel?: () => void
}

export interface InputValidationResult {
  isValid: boolean
  error?: string
}

export interface ViewInputScreenStepInput {
  label: string
  value: string
  onValidate: (value: string) => InputValidationResult
  render: (value: string, onChange: (v: string) => void) => React.ReactNode
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