import { useEffect } from 'react'

export default function useDragScroll(
  ref: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const el = ref.current

    if (!el) return

    let isDown = false
    let startX = 0
    let scrollLeft = 0

    const onMouseDown = (e: MouseEvent) => {
      isDown = true

      el.classList.add('dragging')

      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
    }

    const stopDragging = () => {
      isDown = false
      el.classList.remove('dragging')
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return

      e.preventDefault()

      const x = e.pageX - el.offsetLeft
      const walk = (x - startX) * 1.5

      el.scrollLeft = scrollLeft - walk
    }

    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('mouseleave', stopDragging)
    el.addEventListener('mouseup', stopDragging)
    el.addEventListener('mousemove', onMouseMove)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      el.removeEventListener('mouseleave', stopDragging)
      el.removeEventListener('mouseup', stopDragging)
      el.removeEventListener('mousemove', onMouseMove)
    }
  }, [ref])
}