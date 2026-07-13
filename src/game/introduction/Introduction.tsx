import { useEffect, useMemo, useState } from 'react'
import TransitionDetailInteractive, { type TransitionDetailInteractiveProps } from '../../ui/transition/TransitionDetailInteractive'
import { playerRuntimeService } from '../../engine/player/PlayerRuntimeService'
import type { OverlayMode } from '../context-menu/types/OverlayMode.types'
import { getIntroGameTitleTransition } from './utils/Introduction.utils'
import { characterRuntimeService } from '../../engine/character/CharacterRuntimeService'
import NewPlayerForm from '../../entity/player/components/new/NewPlayerForm'

interface Props {
  setOverlayMode: (worldMode: OverlayMode) => void
}

export type IntroductionMode = 'title'
  | 'no_player'
  | 'new_player'
  | 'no_character'
  | 'new_character'

export default function Introduction(props: Props){
  const {
    setOverlayMode
  } = props

  const [mode, setMode] = useState<IntroductionMode>('title')
  const hasPlayer = typeof playerRuntimeService.getPlayer() !== 'undefined'
  const hasCharacters = characterRuntimeService.getCharacters().length > 0
  
  const [currentTransition, setCurrentTransition] = useState<TransitionDetailInteractiveProps>(
    getIntroGameTitleTransition({
      hasPlayer,
      hasCharacters,
      setOverlayMode,
      setMode,
    })
  )

  useEffect(() => {
    if(mode === 'no_player'){
      setCurrentTransition({
        transition: {
          title: `The world comes to light...`,
          textType: 'animated',
          delay: 500,
          animatedMeta: {
            delay: 1000,
            text: `The world comes to light...`
          },
        },
        continueText: 'Next',
        onComplete: () => {
          setCurrentTransition({
            transition: {
              title: `Who are you?`,
              textType: 'animated',
              animatedMeta: {
                delay: 1000,
                text: `Who are you?`
              },
            },
            continueText: 'Next',
            onComplete: () => {
              setMode('new_player')
            }
          })
        }
      })
    }
  }, [mode])
  
  return <>
    {mode === 'title' && (
      <TransitionDetailInteractive 
        transition={currentTransition.transition}
        onComplete={currentTransition.onComplete}
        continueText={currentTransition.continueText}
      />
    )}
    {mode === 'no_player' && (
      <TransitionDetailInteractive 
        transition={currentTransition.transition}
        onComplete={currentTransition.onComplete}
        continueText={currentTransition.continueText}
      />
    )}
    {mode === 'no_character' && (
      <TransitionDetailInteractive 
        transition={currentTransition.transition}
        onComplete={currentTransition.onComplete}
        continueText={currentTransition.continueText}
      />
    )}
    {mode === 'new_player' && (
      <NewPlayerForm 
        onComplete={() => {
          const player = playerRuntimeService.getPlayer()
          if(player){
            setMode('no_character')
          }
        }}
      />
    )}
  </>
}