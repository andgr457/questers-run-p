import { characterRuntimeService } from '../../../../engine/character/CharacterRuntimeService'
import { playerRuntimeService } from '../../../../engine/player/PlayerRuntimeService'
import TransitionDetailInteractive from '../../../../ui/transition/TransitionDetailInteractive'
import type { OverlayMode } from '../../../context-menu/types/OverlayMode.types'
import type { IntroductionMode } from '../../Introduction'
import { getIntroductionGameTitleTransition } from '../../utils/Introduction.GameTitle.transitions'

interface Props {
  setOverlayMode: (mode: OverlayMode) => void
  setMode: (mode: IntroductionMode) => void
}

export default function GameTitleTransition(props: Props){
  const {
    setOverlayMode,
    setMode
  } = props
  const tsn = getIntroductionGameTitleTransition({
    hasCharacters: characterRuntimeService.getCharacters().length > 0,
    hasPlayer: playerRuntimeService.hasPlayer(),
    setMode,
    setOverlayMode,
  })
  return <TransitionDetailInteractive 
    transition={tsn.transition}
    onComplete={tsn.onComplete}
    continueText={tsn.continueText}
    className={tsn.className}
  />
}