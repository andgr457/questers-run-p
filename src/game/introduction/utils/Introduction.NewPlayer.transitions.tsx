import TextWithColor from '../../../ui/text/text-color/TextWithColor'
import type { TransitionDetailInteractiveProps } from '../../../ui/transition/TransitionDetailInteractive'
import type { IntroductionMode } from '../Introduction'

interface NewPlayerTransitionProps {
  setMode: (mode: IntroductionMode) => void
}

export function getIntroductionNewPlayer01Transition(
  props: NewPlayerTransitionProps
): TransitionDetailInteractiveProps {
  const {
    setMode
  } = props

  return {
    transition: {
      textType: 'animated',
      animatedMeta: {
        text: `Across countless worlds, brave souls are summoned to Aetherra to seek adventure, forge legends, and protect a land that can no longer defend itself alone. Yet even the greatest heroes require guidance.`,
        textFancy: (
          <>
            Across countless worlds, brave souls are summoned to
            {' '}<TextWithColor 
              text='Aetherra'
              pulse={true}
            />{' '}
            to seek adventure, forge legends, and protect a land that can no longer 
            defend itself alone. Yet even the greatest heroes require{' '}<TextWithColor 
              text='guidance'
              pulse={true}
            />.
          </>
        ),
      },
    },
    continueText: 'Next',
    onComplete: () => {
      setMode('t_no_player_2')
    },
    skippable: true,
    onSkip: () => {
      setMode('new_player_form')
    }
  }
}

export function getIntroductionNewPlayer02Transition(
  props: NewPlayerTransitionProps
): TransitionDetailInteractiveProps {
  const {
    setMode
  } = props

  return {
    transition: {
      textType: 'animated',
      animatedMeta: {
        text: `After much deliberation, the gods have entrusted you with this sacred duty. As the one who will guide these adventurers from humble beginnings to legendary heroes, what shall the people of Aetherra call you?`,
        textFancy: (
          <>
            After much deliberation, the
            {' '}<TextWithColor 
              text='gods'
              pulse={true}
            />{' '}
            have entrusted you with this 
            {' '}<TextWithColor 
              text='sacred duty'
              pulse={true}
            />. 
            As the one who will guide these adventurers from humble beginnings to legendary heroes, 
            {' '}<TextWithColor 
              text='what shall the people of Aetherra call you'
              pulse={true}
            />?
          </>
        ),
      },
      
    },
    continueText: 'Speak Thy Name',
    onComplete: () => {
      setMode('new_player_form')
    }
  }
}