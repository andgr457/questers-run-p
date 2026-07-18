import TransitionDetailInteractive from '../../../../ui/transition/TransitionDetailInteractive'
import { getNewCharacter03Transition } from '../../utils/NewCharacterTransition.utils'

interface Props {
  characterName: string
  onComplete: () => void
}

export default function NewCharacterTransition03(props: Props){
  const {
    characterName,
    onComplete
  } = props
  const tsn = getNewCharacter03Transition(
    {
      onComplete
    },
    characterName
  )
  return <TransitionDetailInteractive 
    transition={tsn.transition}
    onComplete={tsn.onComplete}
    continueText={tsn.continueText}
  />
}