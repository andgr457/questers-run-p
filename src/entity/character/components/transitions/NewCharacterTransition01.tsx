import TransitionDetailInteractive from '../../../../ui/transition/TransitionDetailInteractive'
import { getNewCharacter01Transition } from '../../utils/NewCharacterTransition.utils'

interface Props {
  onComplete: () => void
}

export default function NewCharacterTransition01(props: Props){
  const {
    onComplete
  } = props
  const tsn = getNewCharacter01Transition({
    onComplete
  })
  return <TransitionDetailInteractive 
    transition={tsn.transition}
    onComplete={tsn.onComplete}
    continueText={tsn.continueText}
  />
}