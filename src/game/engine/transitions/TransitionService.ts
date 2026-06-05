type TransitionType =
  | 'travel'
  | 'scene_change'
  | 'intro'
  | 'teleport'

type TransitionPhase = 'enter' | 'mid' | 'exit' | 'idle'

type TransitionPayload = {
  title?: string
  description?: string
  travelTime?: number
  icon?: string
}

type TransitionState = {
  active: boolean
  type?: TransitionType
  from?: string
  to?: string
  phase: TransitionPhase
  duration: number
  payload?: TransitionPayload
}

type TransitionParams = {
  type: TransitionType
  from: string
  to: string
  midDuration?: number
  duration?: number
  payload?: TransitionPayload

  onEnter?: () => void
  onMid?: () => void
  onExit?: () => void
  onComplete?: () => void
}

type Listener = (state: TransitionState) => void

class TransitionService {
  private state: TransitionState = {
    active: false,
    phase: 'idle',
    duration: 800,
  }

  private listeners = new Set<Listener>()
  private currentToken = 0

  boot() {
    this.startTransition({
      type: 'scene_change',
      from: 'boot',
      to: 'world',
      duration: 800,
      payload: {
        title: '',
        description: '',
        travelTime: 2000,
      },
    })
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    listener(this.state)

    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit() {
    for (const l of this.listeners) {
      l(this.state)
    }
  }

  private nextToken() {
    return ++this.currentToken
  }

  startTransition(params: TransitionParams) {
    const token = this.nextToken()

    const duration = params.duration ?? 800

    // ENTER (fade OUT world → dark screen)
    this.state = {
      active: true,
      phase: 'enter',
      type: params.type,
      from: params.from,
      to: params.to,
      duration,
      payload: params.payload,
    }

    this.emit()
    params.onEnter?.()

    if (token !== this.currentToken) return

    // MID (fully dark / travel UI lives here)
    this.state = {
      ...this.state,
      phase: 'mid',
    }

    this.emit()
    params.onMid?.()

    // HOLD MID (travel duration / narrative time)
    if (token !== this.currentToken) return

    // EXIT (fade into destination world)
    this.state = {
      ...this.state,
      phase: 'exit',
    }

    this.emit()
    params.onExit?.()

    if (token !== this.currentToken) return

    // DONE
    this.state = {
      active: false,
      phase: 'idle',
      duration,
      from: params.from,
      to: params.to,
      payload: undefined,
    }

    this.emit()
    params.onComplete?.()

  }

  getState() {
    return this.state
  }
}

export const transitionService = new TransitionService()