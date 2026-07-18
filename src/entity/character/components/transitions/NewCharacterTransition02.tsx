import TransitionDetailInteractive from '../../../../ui/transition/TransitionDetailInteractive'
import { getNewCharacter02Transition } from '../../utils/NewCharacterTransition.utils'

interface Props {
  onComplete: () => void
}

export default function NewCharacterTransition02(props: Props){
  const {
    onComplete
  } = props
  const tsn = getNewCharacter02Transition({
    onComplete
  })
  return <TransitionDetailInteractive 
    transition={tsn.transition}
    onComplete={tsn.onComplete}
    continueText={tsn.continueText}
  />
}