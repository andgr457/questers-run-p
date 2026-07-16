import { characterRuntimeService } from '../../../engine/character/CharacterRuntimeService';

import type { TransitionDetailInteractiveProps } from '../../../ui/transition/TransitionDetailInteractive';
import type { OverlayMode } from '../../context-menu/types/OverlayMode.types';
import type { IntroductionMode } from '../Introduction';


interface GetIntroProps {
  hasPlayer: boolean;
  hasCharacters: boolean;
  setOverlayMode: (mode: OverlayMode) => void;
  setMode: (mode: IntroductionMode) => void;
}
export function getIntroductionGameTitleTransition(
  props: GetIntroProps
): TransitionDetailInteractiveProps {
  const {
    hasCharacters, hasPlayer, setMode, setOverlayMode
  } = props;
  return {
    className: 'title',
    transition: {
      textType: 'left-right',
      leftRightMeta: {
        text: `Quester's Run`,
        leftText: `Quester's`,
        rightText: 'Run',
        leftRightStyle: 'left-first',
        delayBetween: 750,
      }
    },
    continueText: characterRuntimeService.getCharacters().length > 0  ? 
      'continue' : 'start',
    onComplete: () => {
      if (!hasPlayer) {
        setMode('t_no_player_1');
        return;
      }
      if (!hasCharacters) {
        setMode('t_no_character_1');
        return;
      }
      //all good
      setOverlayMode('characters');
    },
  };
}
