import TransitionDetailInteractive from '../../../../ui/transition/TransitionDetailInteractive'
import type { IntroductionMode } from '../../Introduction'
import { getIntroductionNewPlayer02Transition } from '../../utils/Introduction.NewPlayer.transitions'

interface Props {
  setMode: (mode: IntroductionMode) => void
}

export default function NewPlayerTransition02(props: Props){
  const {
    setMode
  } = props
  const tsn = getIntroductionNewPlayer02Transition({
    setMode,
  })
  return <TransitionDetailInteractive 
    transition={tsn.transition}
    onComplete={tsn.onComplete}
    continueText={tsn.continueText}
  />
}