import { useEffect, useRef, useState } from 'react'
import './TutorialOverlay.css'

export type TutorialStep = {
  selector: string
  content: string
  action?: () => void
  waitMillis?: number
}

type Props = {
  steps: TutorialStep[]
  onComplete?: () => void
  onCancel?: () => void
  posLeft?: number
  posTop?: number
}

export const TutorialOverlay = ({
  steps,
  onComplete,
  onCancel,
  posLeft = 12,
  posTop = 12,
  
}: Props) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ left: posLeft, top: posTop })
    const [showToolTip, setShowToolTip] = useState(true)

  const step = steps[currentStep]
  

  // -----------------------------
  // Track target element
  // -----------------------------
  useEffect(() => {
    const selector = steps[currentStep]?.selector
    if (!selector) return

    const el = document.querySelector(selector) as HTMLElement | null
    if (!el) return

    const updateRect = () => setRect(el.getBoundingClientRect())

    updateRect()

    const resizeObserver = new ResizeObserver(updateRect)
    resizeObserver.observe(el)

    window.addEventListener('scroll', updateRect, true)
    window.addEventListener('resize', updateRect)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', updateRect, true)
      window.removeEventListener('resize', updateRect)
    }
  }, [currentStep, steps])

  // -----------------------------
  // Clamp tooltip inside viewport
  // -----------------------------
  useEffect(() => {
    if (!rect || !tooltipRef.current) return

    const padding = 12
    const tooltip = tooltipRef.current.getBoundingClientRect()

    const viewportW = window.innerWidth
    const viewportH = window.innerHeight
    const isMobile = viewportW < 768

    let left = rect.left
    let top = rect.top

    if (isMobile) {
      // 📱 MOBILE: always center below (or above if no space)

      left = rect.left + rect.width / 2 - tooltip.width / 2
      top = rect.bottom + padding

      // if bottom overflow → place above
      if (top + tooltip.height > viewportH) {
        top = rect.top - tooltip.height - padding
      }

      // clamp horizontally
      if (left < padding) left = padding
      if (left + tooltip.width > viewportW) {
        left = viewportW - tooltip.width - padding
      }
    } else {
      // 💻 DESKTOP: side positioning

      left = rect.right + padding
      top = rect.top

      if (left + tooltip.width > viewportW) {
        left = rect.left - tooltip.width - padding
      }

      if (top + tooltip.height > viewportH) {
        top = viewportH - tooltip.height - padding
      }

      if (top < padding) top = padding
      if (left < padding) left = padding
    }

    setTooltipPos({ left, top })
  }, [rect])

  const nextStep = async () => {
    setShowToolTip(false)
    if (currentStep + 1 >= steps.length) {
      step.action?.()

      // wait for layout + animations
      await new Promise(resolve => setTimeout(resolve, step?.waitMillis ?? 250))
      onComplete?.()
      setShowToolTip(true)
      return
    }
    step.action?.()
    // wait for layout + animations
    await new Promise(resolve => setTimeout(resolve, step?.waitMillis ?? 250))
    setCurrentStep(s => s + 1)
    setShowToolTip(true)
  }

  if (!rect) return null

  return (
    <>
      {/* Overlay spotlight */}
     <div
        className="tutorial-backdrop"
        onClick={onCancel}
      />

      {/* Spotlight */}
      {showToolTip && (
        <div
          className="tutorial-highlight"
          onClick={(e) => {
            e.stopPropagation()
            nextStep()
          }}
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
        />
      )}

      {/* Highlight */}

      {showToolTip && <div
        className="tutorial-highlight"
        onClick={() => {
          nextStep()
        }}
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }}
      />}

      {/* Tooltip */}
      {showToolTip && <div
        ref={tooltipRef}
        className="tutorial-tooltip"
        style={{
          right: tooltipPos.left,
          bottom: tooltipPos.top + 10,
        }}
      >
        <div className="tutorial-tooltip-content">
          {step.content}
        </div>

        <div className="tutorial-tooltip-buttons">
          <button onClick={() => {
            nextStep()
          }}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </button>

          <button className="close-btn" onClick={onCancel}>
            Close
          </button>
        </div>
      </div>}
    </>
  )
}