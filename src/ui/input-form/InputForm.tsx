import { useEffect, useState } from 'react'
import TransitionDetail from '../transition/TransitionDetail'
import styles from './InputForm.module.css'
import type { InputScreen } from './types/InputForm.types'
import type { Transition } from '../transition/types/Transition.types'

interface Props {
  actionsLocation: 'top' | 'bottom'
  screens: InputScreen[]
  transition: Transition
  showCancel: boolean
}

interface ScreenIndexes {
  screenIndex: number
  screenStepIndex: number
}

export default function ViewInputScreen(props: Props) {
  const { 
    screens, 
    transition,
    showCancel,
    actionsLocation = 'bottom'
  } = props

  const [screenIndexes, setScreenIndexes] = useState<ScreenIndexes>({
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
  const step = screen?.steps[screenIndexes.screenStepIndex]
  const prevStep = screen?.steps[screenIndexes.screenStepIndex - 1]
  const nextStep = screen?.steps[screenIndexes.screenStepIndex + 1]
  
  const prevScreen = screens[screenIndexes.screenIndex - 1]

  const nextScreen = screens[screenIndexes.screenIndex + 1]

  const getValue = (label: string) => formState[label] ?? ''

  const setValue = (label: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [label]: value
    }))
  }

  const prevStepExists = typeof prevStep !== 'undefined'
  const prevScreenExists = typeof prevScreen !== 'undefined'
  const canGoBack = prevStepExists || prevScreenExists

  const actions = <div className='game-panel-section-actions'>
    <div className='game-panel-section-action'>
      <button className='button success' onClick={() => {
        const accepted = step.onAccept()
        if(!accepted) return
        
        if(nextStep){
          setScreenIndexes(prev => {
            if (!prev) return prev

            return {
              screenIndex: prev.screenIndex,
              screenStepIndex: prev.screenStepIndex + 1
            }
          })
          return
        }
        if(nextScreen){
          setScreenIndexes(prev => {
            if (!prev) return prev

            return {
              screenIndex: prev.screenIndex + 1,
              screenStepIndex: 0
            }
          })
          return
        }
      }}>
        Confirm
      </button>  
    </div>
    {showCancel && <div className='game-panel-section-action'>
      <button className='button dark' onClick={step.onCancel}>
        Cancel
      </button>  
    </div>}
    {canGoBack && <div className='game-panel-section-action'>
      <button className='button dark' onClick={() => {
        if(prevStep){
          //this screen previous step
          setScreenIndexes(prev => {
            if (!prev) return prev

            return {
              screenIndex: prev.screenIndex,
              screenStepIndex: prev.screenStepIndex - 1
            }
          })
          return
        }
        if(prevScreen){
          //last screen last step
          setScreenIndexes(prev => {
            if (!prev) return prev

            return {
              screenIndex: prev.screenIndex - 1,
              screenStepIndex: prevScreen.steps.length - 1
            }
          })
          return
        }
      }}>
        Back
      </button>  
    </div>}
  </div>  

  return (
    <div className={styles.wrapper}>

      {showTransition && (
        <TransitionDetail
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
        {actionsLocation === 'top' && actions}

        <div className={styles.content}>
          {step.content}
        </div>

        <div className={styles.inputs}>
          {step.inputs.map((input, i) => (
            <div key={step.id + i} className={styles.inputRow}>
              <label className='form-label'>
                {input.label}
              </label>

              {input.render(
                getValue(input.label),
                (value) => setValue(input.label, value)
              )}
            </div>
          ))}
        </div>
        {actionsLocation === 'bottom' && actions}
      </div>
    </div>
  )
}