import TransitionOverlay from '../../core/components/transition-overlay/TransitionOverlay'
import type { WorldModeMain } from '../../engine/events/types/WorldModeEvents.types'

interface Props {
  text: string
  onCompleteModeMainChangeTo: WorldModeMain
}

export default function TransitionModeMainScreen(props: Props) {
  const {
    onCompleteModeMainChangeTo,
    text
  } = props
  return (
    <TransitionOverlay 
      text={text}
      onCompleteModeMainChangeTo={onCompleteModeMainChangeTo}
    />
  )
}