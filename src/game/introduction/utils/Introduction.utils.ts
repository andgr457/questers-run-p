import type { TransitionDetailInteractiveProps } from '../../../ui/transition/TransitionDetailInteractive';
import type { OverlayMode } from '../../context-menu/types/OverlayMode.types';
import type { IntroductionMode } from '../Introduction';


interface GetIntroProps {  
  hasPlayer: boolean,
  hasCharacters: boolean,
  setOverlayMode: (mode: OverlayMode) => void,
  setMode: (mode: IntroductionMode) => void
}
export function getIntroGameTitleTransition(props: GetIntroProps): TransitionDetailInteractiveProps {
  const {
    hasCharacters,
    hasPlayer,
    setMode,
    setOverlayMode
  } = props
  return {
    transition: {
      title: `Quester\'s Run`,
      textType: 'left-right',
      leftRightMeta: {
        leftText: `Quester's`,
        rightText: 'Run',
        leftRightStyle: 'both',
        delayBetween: 5000
      }
    },
    continueText: hasPlayer ? 'Continue' : 'Start',
    onComplete: () => {
      if(!hasPlayer){
        setMode('no_player')
        return
      }
      if(!hasCharacters){
        setMode('no_character')
        return
      }
      //all good
      setOverlayMode('characters')
    },
  }
}


