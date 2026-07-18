import TransitionDetailInteractive from '../../../../ui/transition/TransitionDetailInteractive'
import type { IntroductionMode } from '../../Introduction'
import { getIntroductionNoCharacterTransition } from '../../utils/Introduction.NoCharacter.transitions'

interface Props {
  setMode: (mode: IntroductionMode) => void
}

export default function NoCharacterTransition(props: Props){
  const {
    setMode
  } = props
  const tsn = getIntroductionNoCharacterTransition({
    setMode,
  })
  return <TransitionDetailInteractive 
    transition={tsn.transition}
    onComplete={tsn.onComplete}
    continueText={tsn.continueText}
  />
}