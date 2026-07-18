import TextWithColor from '../../../ui/text/text-color/TextWithColor'
import type { TransitionDetailInteractiveProps } from '../../../ui/transition/TransitionDetailInteractive'
import type { IntroductionMode } from '../Introduction'

interface NoCharacterTransitionProps {
  setMode: (mode: IntroductionMode) => void  
}

export function getIntroductionNoCharacterTransition(
  props: NoCharacterTransitionProps
): TransitionDetailInteractiveProps {
  const {
    setMode
  } = props
  return {
    transition: {
      textType: 'animated',
      animatedMeta: {
        text: `Before your journey can truly begin, you must summon the first soul to guide. Brought from another world, they will awaken in Aetherra with no knowledge of its lands, people, or dangers.`,
        textFancy: (<>
          Before your journey can truly begin, you 
          must{' '}<TextWithColor 
            text='summon the first soul'
          />
          {' '} to guide. Brought from another world, they will awaken 
          in {' '}<TextWithColor 
            text='Aetherra'
          />
          {' '} with no knowledge of its lands, people, or dangers.
        </>)
      },
    },
    continueText: 'Next',
    onComplete: () => {
      setMode('new_character_form')
    }
  }
}