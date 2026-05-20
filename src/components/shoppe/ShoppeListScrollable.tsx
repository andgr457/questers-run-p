import { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
}

export default function ScrollableShoppeList({ children }: Props) {
  const listRef = useRef<HTMLDivElement | null>(null)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = () => {
    const el = listRef.current
    if (!el) return

    setCanScrollLeft(el.scrollLeft > 5)

    setCanScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - 5
    )
  }

  useEffect(() => {
    updateScrollButtons()

    const el = listRef.current
    if (!el) return

    el.addEventListener('scroll', updateScrollButtons)

    window.addEventListener('resize', updateScrollButtons)

    return () => {
      el.removeEventListener('scroll', updateScrollButtons)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [children])

  const scroll = (direction: 'left' | 'right') => {
    const firstChild = listRef.current?.children[0] as HTMLElement

    const amount =
      (firstChild?.clientWidth ?? 340) + 12

    listRef.current?.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <div className='shoppe-item-list-wrapper'>
      {canScrollLeft && (
        <button
          className='shoppe-scroll-button left'
          onClick={() => scroll('left')}
        >
          {'<'}
        </button>
      )}

      {canScrollRight && (
        <button
          className='shoppe-scroll-button right'
          onClick={() => scroll('right')}
        >
          {'>'}
        </button>
      )}

      <div
        ref={listRef}
        className='shoppe-item-list open'
      >
        {children}
      </div>
    </div>
  )
}