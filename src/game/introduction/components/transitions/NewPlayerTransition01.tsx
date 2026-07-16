import TransitionDetailInteractive from '../../../../ui/transition/TransitionDetailInteractive'
import type { IntroductionMode } from '../../Introduction'
import { getIntroductionNewPlayer01Transition } from '../../utils/Introduction.NewPlayer.transitions'

interface Props {
  setMode: (mode: IntroductionMode) => void
}

export default function NewPlayerTransition01(props: Props){
  const {
    setMode
  } = props
  const tsn = getIntroductionNewPlayer01Transition({
    setMode,
  })
  return <TransitionDetailInteractive 
    transition={tsn.transition}
    onComplete={tsn.onComplete}
    continueText={tsn.continueText}
  />
}