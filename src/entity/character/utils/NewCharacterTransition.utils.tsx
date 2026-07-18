import TextWithColor from '../../../ui/text/text-color/TextWithColor'
import type { TransitionDetailInteractiveProps } from '../../../ui/transition/TransitionDetailInteractive'

interface FirstCharacterTransitionProps {
  onComplete: () => void  
}

export function getNewCharacter01Transition(
  props: FirstCharacterTransitionProps
): TransitionDetailInteractiveProps {
  const {
    onComplete
  } = props
  return {
    transition: {
      textType: 'animated',
      animatedMeta: {
        text: `Requesting soul service from the Gods...
The Gods accept your request.
Preparing the summoning altar for isekai transfer...
Provide details for the new soul.`
      },
    },
    continueText: 'Summoning Altar',
    onComplete
  }
}

export function getNewCharacter02Transition(
  props: FirstCharacterTransitionProps
): TransitionDetailInteractiveProps {
  const {
    onComplete
  } = props
  return {
    transition: {
      textType: 'animated',
      animatedMeta: {
        text: `Searching the countless worlds for a worthy soul... Compatible host located. Initiating isekai transfer... Transfer complete.`,
        delay: 5000,
        textFancy: <>
          Searching the countless worlds for 
          a worthy{' '}<TextWithColor 
            text=' soul'
            color='var(--danger)'
          />... {' '}Compatible <TextWithColor 
            text=' host'
          />{' '}located. Initiating {' '}<TextWithColor 
            text=' isekai '
            color='var(--danger)'
          />transfer...{' '}Transfer<TextWithColor 
            text=' complete'
            pulse={true}
          />.
        </>
      },
    },
    continueText: 'Next',
    onComplete
  }
}

export function getNewCharacter03Transition(
  props: FirstCharacterTransitionProps,
  characterName: string
): TransitionDetailInteractiveProps {
  const {
    onComplete
  } = props
  return {
    transition: {
      textType: 'animated',
      animatedMeta: {
        text: `Transporting ${characterName} to the world of Aetherra... Arrival confirmed. Placing ${characterName} in the Oron Woods, where every great adventure begins.`,
        textFancy: <>
        Transporting {' '}<TextWithColor 
          text={characterName}
          color='var(--success)'
          pulse={true}
        /> to the world 
        of {' '}<TextWithColor 
          text='Aetherra'
        />... Arrival {' '}<TextWithColor 
          text='confirmed'
          color='var(--blue-sd-lighter-2)'
        />. Placing {' '}<TextWithColor 
          text={characterName}
          color='var(--success)'
          pulse={true}
        /> in the {' '}<TextWithColor 
          text='Oron Woods'
        />, where every great adventure begins.
        </>
      },
    },
    continueText: 'Aetherra',
    onComplete
  }
}