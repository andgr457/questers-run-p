import { useRef } from 'react'
import type { WindowData } from './Windows.types'
import { useWindows } from './WindowProvider'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Props {
  win: WindowData
}

export default function GameWindow(props: Props) {
  const { win } = props

  const {
    closeWindow,
    moveWindow,
    resizeWindow,
    focusWindow
  } = useWindows()

  const isMobile = useIsMobile()

  const dragging = useRef(false)
  const resizing = useRef(false)

  const dragOffset = useRef({ x: 0, y: 0 })

  const resizeStart = useRef({
    width: 0,
    height: 0,
    mouseX: 0,
    mouseY: 0
  })

  // =========================
  // DRAGGING
  // =========================
  function handleDragStart(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    dragging.current = true

    dragOffset.current = {
      x: e.clientX - win.x,
      y: e.clientY - win.y
    }

    focusWindow(win.id)

    window.addEventListener('mousemove', handleDragMove)
    window.addEventListener('mouseup', handleDragEnd)
  }

  function handleDragMove(e: MouseEvent) {
    if (!dragging.current) return

    moveWindow(
      win.id,
      e.clientX - dragOffset.current.x,
      e.clientY - dragOffset.current.y
    )
  }

  function handleDragEnd() {
    dragging.current = false

    window.removeEventListener('mousemove', handleDragMove)
    window.removeEventListener('mouseup', handleDragEnd)
  }

  // =========================
  // RESIZING
  // =========================
  function handleResizeStart(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    e.stopPropagation()

    resizing.current = true

    resizeStart.current = {
      width: win.width,
      height: win.height,
      mouseX: e.clientX,
      mouseY: e.clientY
    }

    focusWindow(win.id)

    window.addEventListener('mousemove', handleResizeMove)
    window.addEventListener('mouseup', handleResizeEnd)
  }

  function handleResizeMove(e: MouseEvent) {
    if (!resizing.current) return

    const deltaX =
      e.clientX - resizeStart.current.mouseX

    const deltaY =
      e.clientY - resizeStart.current.mouseY

    const newWidth = Math.max(
      win.minWidth || 300,
      resizeStart.current.width + deltaX
    )

    const newHeight = Math.max(
      win.minHeight || 200,
      resizeStart.current.height + deltaY
    )

    resizeWindow(win.id, newWidth, newHeight)
  }

  function handleResizeEnd() {
    resizing.current = false

    window.removeEventListener('mousemove', handleResizeMove)
    window.removeEventListener('mouseup', handleResizeEnd)
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div
      className={`window ${isMobile ? 'mobile' : ''}`}
      style={
        isMobile
          ? undefined
          : {
              left: win.x,
              top: win.y,
              width: win.width,
              height: win.height,
              zIndex: win.zIndex
            }
      }
      onMouseDown={() => focusWindow(win.id)}
    >
      <div
        className="window-header"
        onMouseDown={handleDragStart}
      >
        <div>{win.title}</div>

        <div
          className="window-close"
          onClick={() => closeWindow(win.id)}
        >
          X
        </div>
      </div>

      <div className="window-content">
        {win.content}
      </div>

      <div
        className="window-resize-handle"
        onMouseDown={handleResizeStart}
      />
    </div>
  )
}