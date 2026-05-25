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
    Component: React.ComponentType<any>,
    props?: any
  ) => void

  closeWindow: (id: string) => void

  moveWindow: (id: string, x: number, y: number) => void

  resizeWindow: (id: string, width: number, height: number) => void

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
      const topZ = Math.max(0, ...prev.map(w => w.zIndex))

      return prev.map(w =>
        w.id === id
          ? { ...w, zIndex: topZ + 1 }
          : w
      )
    })
  }

  function openWindow(
    id: string,
    title: string,
    Component: React.ComponentType<any>,
    props: any = {}
  ) {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id)
      const topZ = Math.max(0, ...prev.map(w => w.zIndex))

      // already exists → just focus + bring to front
      if (existing) {
        return prev.map(w =>
          w.id === id
            ? {
                ...w,
                zIndex: topZ + 1,
                props: props ?? w.props ?? {}   // 👈 CRITICAL FIX
              }
            : w
        )
      }
      return [
        ...prev,
        {
          id,
          title,
          Component,
          props: props ?? {},

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
    setWindows(prev => prev.filter(w => w.id !== id))
  }

  function moveWindow(id: string, x: number, y: number) {
    setWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, x, y } : w
      )
    )
  }

  function resizeWindow(id: string, width: number, height: number) {
    setWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, width, height } : w
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
        resizeWindow,
        focusWindow
      }}
    >
      {children}
    </WindowContext.Provider>
  )
}

export function useWindows() {
  const context = useContext(WindowContext)

  if (!context) {
    throw new Error('useWindows must be inside WindowProvider')
  }

  return context
}