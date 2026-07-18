import { useState } from 'react'
import { playerRuntimeService } from '../../engine/player/PlayerRuntimeService'
import type { OverlayMode } from '../context-menu/types/OverlayMode.types'
import NewPlayerForm from '../../entity/player/components/new/NewPlayerForm'
import GameTitleTransition from './components/transitions/GameTitleTransition'
import NewPlayerTransition01 from './components/transitions/NewPlayerTransition01'
import NewPlayerTransition02 from './components/transitions/NewPlayerTransition02'
import NoCharacterTransition from './components/transitions/NoCharacterTransition'
import NewCharacterForm from '../../entity/character/components/new/NewCharacterForm'
import NewCharacterTransition01 from '../../entity/character/components/transitions/NewCharacterTransition01'
import NewCharacterTransition02 from '../../entity/character/components/transitions/NewCharacterTransition02'
import NewCharacterTransition03 from '../../entity/character/components/transitions/NewCharacterTransition03'
import type { CharacterEntity } from '../../entity/character/types/CharacterEntity.types'

interface Props {
  setOverlayMode: (worldMode: OverlayMode) => void
}

export type IntroductionMode = 'title'
  | 't_no_player_1'
  | 't_no_player_2'
  | 'new_player_form'
  | 't_no_character_1'
  | 'new_character_form'
  | 't_new_character_1'
  | 't_new_character_2'
  | 't_new_character_3'

export default function Introduction(props: Props){
  const {
    setOverlayMode
  } = props
  const [mode, setMode] = useState<IntroductionMode>('title')
  const [newCharacter, setNewCharacter] = useState<CharacterEntity | undefined>(undefined)

  return <>
    {mode === 'title' && (
      <GameTitleTransition 
        setMode={setMode}
        setOverlayMode={setOverlayMode}
      />
    )}
    {mode === 't_no_player_1' && (
      <NewPlayerTransition01 
        setMode={setMode}
      />
    )}
    {mode === 't_no_player_2' && (
      <NewPlayerTransition02 
        setMode={setMode}
      />
    )}
    {mode === 'new_player_form' && (
      <NewPlayerForm 
        onComplete={() => {
          if(playerRuntimeService.hasPlayer()){
            setMode('t_no_character_1')
          }
        }}
      />
    )}
    {mode === 't_no_character_1' && (
      <NoCharacterTransition 
        setMode={setMode}
      />
    )}
    {mode === 't_new_character_1' && (
      <NewCharacterTransition01
        onComplete={() => {
          setMode('new_character_form')
        }}
      />
    )}
    {mode === 'new_character_form' && (
      <NewCharacterForm 
        onComplete={(character: CharacterEntity) => {
          if(!character) return

          setNewCharacter(character)
          setMode('t_new_character_2')
        }}
      />
    )}
    {mode === 't_new_character_2' && (
      <NewCharacterTransition02
        onComplete={() => {
          setMode('t_new_character_3')
        }}
      />
    )}
    {mode === 't_new_character_3' && newCharacter && (
      <NewCharacterTransition03
        characterName={newCharacter.name}
        onComplete={() => {
          setOverlayMode('character_manage')
        }}
      />
    )}
  </>
}