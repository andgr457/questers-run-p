import { useMemo, useState } from 'react'

import styles from './CharacterEntityCreate.module.css'

import { GAME_CHARACTER_CLASSES, GAME_CLASSES } from '../../character-class/data/CharacterClassEntity.data'

import type { CharacterEntity } from '../types/Character.types'
import GameModal from '../../../components/modals/GameModal'
import type { PlayerEntity } from '../../player/types/PlayerEntity.types'
import CharacterClassEntityMiniList from '../../character-class/components/CharacterClassEntityMiniList'
import AlertMessage from '../../../components/ui/AlertMessage'
import type { CharacterClassId } from '../../character-class/types/CharacterClassEntity.types'
import GameModalFull from '../../../components/modals/GameModalFull'
import { getCharacterClassCharactersAmountByPlayerLevel } from '../../character-class/utils/CharacterClassEntity.utils'

type Props = {
  player: PlayerEntity
  playerCharacters: CharacterEntity[]
  onCreated: (
    character: CharacterEntity,
    player?: PlayerEntity
  ) => void
  onCancelled: () => void
}

export default function CharacterEntityCreate({
  onCreated,
  onCancelled,
  player,
  playerCharacters,
}: Props) {
  const [characterName, setCharacterName] =
    useState('')

  const [characterClassId, setCharacterClassId] =
    useState('')

  const [errorMessage, setErrorMessage] = useState('')

  const characterClass = useMemo(() => {
    if (!characterClassId) return null

    return GAME_CLASSES.find(
      gc => gc.id === characterClassId
    )
  }, [characterClassId])

  const numberOfClassesByPlayerLevel = getCharacterClassCharactersAmountByPlayerLevel(player?.level)
  let allMaxedOut = true
  const playerCharacterClassAmounts: Record<string, number> = {}
  Object.getOwnPropertyNames(GAME_CHARACTER_CLASSES).forEach(cId => {
    const playerAmount = playerCharacters?.filter(c => c.classId === cId as CharacterClassId)?.length ?? 0
    if(playerAmount < numberOfClassesByPlayerLevel){
      allMaxedOut = false
    }
    playerCharacterClassAmounts[cId] = playerAmount
  })

  const handleCreateCharacter = () => {
    setErrorMessage('')
    const characterNameTrimmed = characterName.trim()
    if (!characterNameTrimmed) {
      setErrorMessage('Character name is missing.')
      return
    }

    if (!characterClass) {
      setErrorMessage('Character Class not selected.')
      return
    }

    const existing = playerCharacters?.find(c => c.name.toLowerCase() === characterNameTrimmed.toLowerCase())

    if(existing){
      const existingClass = GAME_CHARACTER_CLASSES[existing.classId as CharacterClassId]
      setErrorMessage(`Character with that name already exists. Lvl. ${existing.level} ${existingClass.name}`)
      return
    }

    let newPlayer: PlayerEntity | undefined = undefined
    if(!player){
      newPlayer = {
        id: crypto.randomUUID(),
        characterTokens: 0,
        gold: 0,
        level: 1,
        xp: 0,
        xpNextLevel: 100
      }
    }

    const character: CharacterEntity = {
      id: crypto.randomUUID(),
      playerId: newPlayer?.id ?? player?.id,

      name: characterName.trim(),

      classId: characterClass.id,

      xp: 0,
      xpNextLevel: 100,
      level: 1,

      hp: 100,
      hpMax: 100,

      mana: 100,
      manaMax: 100,

      stamina: 100,
      staminaMax: 100,

      strength: 1 + characterClass.strength,
      intellect: 1 + characterClass.intellect,
      agility: 1 + characterClass.agility,
    }

    onCreated(character, newPlayer ?? undefined)
  }
  const playerTokens = player?.characterTokens ?? 1
  const text = !player ? <>
    Welcome to <strong>Quester's Run</strong>, create your first character to start your adventure.
  </> : <>
    The void is culminating a new adventurers, who shall it be?
  </>
  const canClose = typeof player !== 'undefined'
  return (
    <GameModalFull
      backdropHides={canClose}
      isOpen={true}
      onClose={onCancelled}
      title={`New Character`}
      closeButton={canClose}
    >
      <div className={styles.card}>
        <div className={styles.subtitle}>
          {playerTokens} token(s) available.
        </div>
        <br/>
        <div className={styles.subtitle}>
          {text}
        </div>

        <AlertMessage 
          onClose={() => {setErrorMessage('')}}
          type='error'
          message={errorMessage}
          title='Validation Error'
          closeButton={true}
        />
        <div className={styles.inputSection}>
          <div className={styles.inputSectionItem}>
            <div className={styles.inputSectionLabel}>
              Name
            </div>
            <div className={styles.inputSectionElement}>
              <input
                className='input'
                placeholder="Enter character name"
                value={characterName}
                maxLength={64}
                onChange={e =>
                  setCharacterName(
                    e.target.value
                  )
                }
              />
            </div>
          </div>          
        </div>
        
        <div className={styles.inputSectionLabel}>
          CLASS
        </div>

        <div className={styles.sectionClasses}>
          <CharacterClassEntityMiniList 
              playerCharacterClassAmounts={playerCharacterClassAmounts}
              numberOfCharacterTokens={playerTokens}
              numberOfCharactersCreatable={numberOfClassesByPlayerLevel}
              currentCharacterClassId={characterClassId}
              setCharacterClassId={setCharacterClassId}
            />

        </div>


        {playerTokens <= 0 && <AlertMessage 
          title='No Tokens'
          message={`You have no character tokens to use. Complete content to earn more!`}
          onClose={() => {}}
          closeButton={false}
          type='error'
        />}
        {playerTokens > 0 && allMaxedOut && <AlertMessage 
          title='No Availability'
          message={`All characters are maxed out at this time. Level up your player to earn more!`}
          onClose={() => {}}
          closeButton={false}
          type='error'
        />}
        {!allMaxedOut && playerTokens > 0 && <div className={styles.actions}>
          <button
            className="button-basic dark"
            onClick={
              handleCreateCharacter
            }
          >
            Create Character
          </button>
        </div>}
      </div>
    </GameModalFull>
  )
}