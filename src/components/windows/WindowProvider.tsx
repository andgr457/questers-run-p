import {
  createContext,
  useContext,
  useState
} from 'react'
import type { WindowData } from './Windows.types'


type WindowContextType = {
  windows: WindowData[]

  openWindow: (
    id: string,
    title: string,
    content: React.ReactNode
  ) => void

  closeWindow: (id: string) => void

  moveWindow: (
    id: string,
    x: number,
    y: number
  ) => void

  resizeWindow: (
    id: string,
    width: number,
    height: number
  ) => void

  focusWindow: (id: string) => void
}

const WindowContext = createContext<WindowContextType | null>(null)

export function WindowProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [windows, setWindows] = useState<WindowData[]>([])

  function focusWindow(id: string) {
    setWindows(prev => {
      const topZ = Math.max(
        0,
        ...prev.map(w => w.zIndex)
      )

      return prev.map(window =>
        window.id === id
          ? {
              ...window,
              zIndex: topZ + 1
            }
          : window
      )
    })
  }

  function openWindow(
    id: string,
    title: string,
    content: React.ReactNode
  ) {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id)

      const topZ = Math.max(
        0,
        ...prev.map(w => w.zIndex)
      )

      // already open -> recenter + focus
      if (existing) {
        return prev.map(win =>
          win.id === id
            ? {
                ...win,
                x: window.innerWidth / 2 - 200,
                y: window.innerHeight / 2 - 150,
                zIndex: topZ + 1
              }
            : win
        )
      }

      return [
        ...prev,
        {
          id,
          title,
          content,

          // x: window.innerWidth / 2 - 200,
          // y: window.innerHeight / 2 - 150,
          x: 7,
          y: 90,

          width: 550,
          height: 550,

          zIndex: topZ + 1
        }
      ]
    })
  }

  function closeWindow(id: string) {
    setWindows(prev =>
      prev.filter(w => w.id !== id)
    )
  }

  function moveWindow(
    id: string,
    x: number,
    y: number
  ) {
    setWindows(prev =>
      prev.map(window =>
        window.id === id
          ? { ...window, x, y }
          : window
      )
    )
  }

  function resizeWindow(
    id: string,
    width: number,
    height: number
  ) {
    setWindows(prev =>
      prev.map(win =>
        win.id === id
          ? {
              ...win,
              width,
              height
            }
          : win
      )
    )
  }

  return (
    <WindowContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        moveWindow,
        focusWindow,
        resizeWindow,
      }}
    >
      {children}
    </WindowContext.Provider>
  )
}

export function useWindows() {
  const context = useContext(WindowContext)

  if (!context) {
    throw new Error(
      'useWindows must be inside WindowProvider'
    )
  }

  return context
}