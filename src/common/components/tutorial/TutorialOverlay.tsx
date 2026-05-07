import { useEffect, useState } from 'react'
import './TutorialOverlay.css'
import { AnimatedText } from '../AnimatedText'

export type TutorialStep = {
  selector: string
  content: string
  action?: () => void
}

type Props = {
  steps: TutorialStep[]
  onComplete?: () => void
  onCancel?: () => void
  posLeft?: number
  posTop?: number
  posBottom?: number
  posRight?: number
}

export const TutorialOverlay = ({ steps, onComplete, onCancel, posLeft = 15, posTop, posBottom, posRight }: Props) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)

  // useEffect(() => {
  //   const el = document.querySelector(steps[currentStep]?.selector)
  //   if (el) {
  //     const updateRect = () => {
  //       setRect(el.getBoundingClientRect())
  //     }

  //     updateRect()
  //     window.addEventListener('resize', updateRect)
  //     window.addEventListener('scroll', updateRect)

  //     return () => {
  //       window.removeEventListener('resize', updateRect)
  //       window.removeEventListener('scroll', updateRect)
  //     }
  //   }
  // }, [currentStep, steps])

  useEffect(() => {
    const selector = steps[currentStep]?.selector
    if (!selector) return

    const el = document.querySelector(selector) as HTMLElement | null
    if (!el) return

    const updateRect = () => {
      setRect(el.getBoundingClientRect())
    }

    updateRect()

    // 👇 watches element size changes
    const resizeObserver = new ResizeObserver(() => {
      updateRect()
    })

    resizeObserver.observe(el)

    // also track layout shifts
    window.addEventListener('scroll', updateRect, true)
    window.addEventListener('resize', updateRect)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', updateRect, true)
      window.removeEventListener('resize', updateRect)
    }
  }, [currentStep, steps])

  const nextStep = (action?: () => void) => {
    if (currentStep + 1 >= steps.length) {
      onComplete?.()
      return
    }
    if(action){
      action()
    }
    setCurrentStep(s => s + 1)
  }

  const step = steps[currentStep]
  const action = step?.action

  if (!rect) return null

  return (
    <>
      {/* Overlay */}
      <div className="tutorial-overlay"
      style={{
        // dynamic spotlight position
        '--x': `${rect.left + rect.width / 2}px`,
        '--y': `${rect.top + rect.height / 2}px`,
        '--r': `${Math.max(rect.width, rect.height) / 2 + 12}px`,
      } as React.CSSProperties} />

      {/* Highlight */}
      <div
        className="tutorial-highlight"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }}
      />

      {/* Tooltip */}
      <div
        className="tutorial-tooltip"
        style={{
          left: posLeft,
          top: posTop,
          bottom: posBottom,
          right: posRight
        }}
      >
        <div className='tutorial-tooltip-content'>
          {steps[currentStep].content}
        </div>
        <div className='tutorial-tooltip-buttons'>
          <button onClick={() => {nextStep(action)}}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </button>

          <button style={{float: 'right'}} onClick={onCancel}>
            Close
          </button>
        </div>
      </div>
    </>
  )
}