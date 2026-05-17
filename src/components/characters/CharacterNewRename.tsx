import { useCallback, useEffect, useState } from 'react'
import { DateTime } from 'luxon'

import {
  StatSort,
  type Character,
  type CharacterClass,
  type Stat,
} from '../../interfaces/characters/Character.types'

import type { Inventory } from '../../interfaces/inventories/Inventory.types'
import type { CharacterHistory } from '../../interfaces/history/History.types'

import type { AppProperties } from '../../interfaces/AppProperties.types'

import { CharacterClassRepository } from '../../repository/characters/CharacterClassRepository'

import { CHARACTER_MAIN_DEFAULT } from '../../data/characters/MainCharacter.data'
import { CLASS_WARRIOR } from '../../data/characters/CharacterClasses.data'

import { ACHIEVEMENT_INTRO_MAIN_CHARACTER } from '../../data/achievements/Achievements.Intro.data'

import {
  getInventoryIntroCurrencyPouch,
  getInventoryIntroStarterPouch,
} from '../../data/inventories/Inventories.Intro.data'

import { QUEST_INTRO_ADVENTURERS_GUILD } from '../../data/quests/Quests.Intro.data'

import { useConfirm } from '../../providers/ConfirmProvider'
import CharacterStatCardMin from './CharacterStatCardMin'

interface NewCharacterModalProps extends AppProperties {

}

const NAME_MIN_LENGTH = 3
const NAME_MAX_LENGTH = 50

export default function CharacterNewRename(
  props: NewCharacterModalProps
) {
  const {
    character,
    handleAddHistory,
    handleAddInventory,
    handleAddQuest,
    handleSetCharacter,
  } = props

  const isRename = Boolean(character?.name)

  const [characterClasses, setCharacterClasses] = useState<
    CharacterClass[]
  >([])

  const [selectedClass, setSelectedClass] =
    useState<CharacterClass>()

  const [error, setError] = useState('')

  const [characterForm, setCharacterForm] =
    useState<Character>(
      character
        ? { ...character }
        : { ...CHARACTER_MAIN_DEFAULT }
    )

  const [newName, setNewName] = useState(
    character?.name ?? ''
  )

  const { showConfirm } = useConfirm()

  /**
   * Load classes
   */
  useEffect(() => {
    const loadClasses = async () => {
      const repo = new CharacterClassRepository()
      const classes = await repo.list()

      setCharacterClasses(classes)

      const foundClass = classes.find(
        c => c.id === characterForm.classId
      )

      setSelectedClass(foundClass ?? CLASS_WARRIOR)
    }

    loadClasses()
  }, [characterForm.classId])

  /**
   * Reset form when modal opens/character changes
   */
  useEffect(() => {
    setCharacterForm(
      character
        ? { ...character }
        : { ...CHARACTER_MAIN_DEFAULT }
    )

    setNewName(character?.name ?? '')
    setError('')
  }, [character])

  const currentName = isRename
    ? newName
    : characterForm.name

  const validateName = useCallback((name: string) => {
    const trimmed = name.trim()

    return (
      trimmed.length >= NAME_MIN_LENGTH &&
      trimmed.length <= NAME_MAX_LENGTH
    )
  }, [])

  const handleNameChange = useCallback(
    (name: string) => {
      setError('')

      if (isRename) {
        setNewName(name)
        return
      }

      setCharacterForm(prev => ({
        ...prev,
        name,
      }))
    },
    [isRename]
  )

  const handleClassChange = useCallback(
    (classId: string) => {
      setCharacterForm(prev => ({
        ...prev,
        classId,
      }))

      const foundClass = characterClasses.find(
        cc => cc.id === classId
      )

      setSelectedClass(foundClass)
    },
    [characterClasses]
  )

  const buildHistory = (
    description: string,
    offset = 0
  ): CharacterHistory => ({
    id: `h_${characterForm.id}_${DateTime.utc().toMillis() + offset}`,
    characterId: characterForm.id,
    date: DateTime.utc().toISO(),
    description,
  })

  const handleSubmit = useCallback(async () => {
    setError('')

    const trimmedName = currentName.trim()

    if (!validateName(trimmedName)) {
      setError(
        `Name must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters long.`
      )

      return
    }

    const confirmMessage = isRename
      ? `Rename the ${selectedClass?.name} "${characterForm.name}" to "${trimmedName}"?`
      : `Create the ${selectedClass?.name} "${trimmedName}"?`

    const confirmed = await showConfirm({
      title: `${isRename ? 'Rename' : 'Create'} Main Character`,
      message: confirmMessage,
      isYesNo: true,
    })

    if (!confirmed) return

    /**
     * RENAME
     */
    if (isRename) {
      handleAddHistory?.([
        buildHistory(
          `"${characterForm.name}" is now known as "${trimmedName}".`,
          100
        ),
      ])

      handleSetCharacter?.({
        ...characterForm,
        name: trimmedName,
      })

      return
    }

    /**
     * CREATE
     */
    const createdCharacter: Character = {
      ...characterForm,
      name: trimmedName,
    }

    const histories: CharacterHistory[] = []

    histories.push(
      buildHistory(
        `"${createdCharacter.name}" isekai'd and resurrected here.`,
        100
      )
    )

    createdCharacter.achievements.push({
      achievementDate: DateTime.utc().toISO(),
      achievementId:
        ACHIEVEMENT_INTRO_MAIN_CHARACTER.id,
    })

    histories.push(
      buildHistory(
        `Achievement "${ACHIEVEMENT_INTRO_MAIN_CHARACTER.title}" earned!`,
        200
      )
    )

    const currencyPouch =
      getInventoryIntroCurrencyPouch(
        createdCharacter.id,
        `${DateTime.utc().toMillis()}`
      )

    const starterPouch =
      getInventoryIntroStarterPouch(
        createdCharacter.id,
        `${DateTime.utc().toMillis()}`
      )

    const starterInventories: Inventory[] = [
      currencyPouch,
      starterPouch,
    ]

    histories.push(
      buildHistory(
        `"${currencyPouch.title}" bag received!`,
        300
      )
    )

    histories.push(
      buildHistory(
        `"${starterPouch.title}" bag received!`,
        400
      )
    )

    histories.push(
      buildHistory(
        `"${QUEST_INTRO_ADVENTURERS_GUILD.title}" quest received!`,
        500
      )
    )

    handleAddInventory?.(starterInventories)
    handleAddHistory?.(histories)

    handleAddQuest?.(
      QUEST_INTRO_ADVENTURERS_GUILD,
      createdCharacter.id
    )

    handleSetCharacter?.(createdCharacter)

  }, [
    currentName,
    validateName,
    isRename,
    selectedClass,
    characterForm,
    showConfirm,
    handleAddHistory,
    handleSetCharacter,
    handleAddInventory,
    handleAddQuest,
  ])

  const handleCancel = useCallback(() => {
    setNewName(character?.name ?? '')
    setError('')
  }, [character?.name])

  const characterClass = characterClasses.find(c => c.id === selectedClass?.id)
  return <div className='adv-g-clerk-layout'>
    <div className='adv-g-clerk-sidebar'>
      <div className='adv-g-clerk-section'>
        <div className='adv-g-clerk-section-title'>
          Actions
        </div>
        <div key={`action-save`}>
          <button
            className='success'
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
        <div>
          {isRename && (
            <button
              className='danger'
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
    
    <div className='adv-g-clerk-discussion'>
      <div className={`adv-g-clerk-discussion-content show`}>
        <div>
          {isRename
            ? 'Apply for a name change.'
            : ACHIEVEMENT_INTRO_MAIN_CHARACTER.description}
        </div>
        <div style={{marginTop: '5px'}}>
          <div>
            <div className='adv-g-clerk-section-title'>
              Name
            </div>

            <div style={{textAlign: 'center'}}>
              <input
                type='text'
                style={{ width: '90%', margin: '5px' }}
                placeholder={
                  isRename
                    ? `Rename ${characterForm.name}...`
                    : 'Enter name...'
                }
                value={currentName}
                maxLength={NAME_MAX_LENGTH}
                onChange={e =>
                  handleNameChange(
                    e.currentTarget.value
                  )
                }
              />
            </div>

            <div className='foot-note'  style={{textAlign: 'center'}} >
              {currentName.length} /{' '}
              {NAME_MAX_LENGTH} character(s)
            </div>
          </div>

          <div>
            <div className='adv-g-clerk-section-title'>
              Class
            </div>
            
            <div style={{textAlign: 'center'}}>
              <select
                disabled={isRename}
                value={characterForm.classId}
                style={{ width: '90%', margin: '5px' }}
                onChange={e =>
                  handleClassChange(
                    e.currentTarget.value
                  )
                }
              >
                <option value='' disabled>
                  Select Class
                </option>

                {characterClasses.map(cc => (
                  <option
                    key={cc.id}
                    value={cc.id}
                  >
                    {cc.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{textAlign: 'center'}} className='foot-note danger'>
              {error}
            </div>
          </div>

          <div style={{marginTop: '5px'}}>
            <div className='adv-g-clerk-section-title'>
              {characterClass?.name} Attributes
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px'}}>
              {Object
                .getOwnPropertyNames(characterClass?.stats ?? {})
                .map((propertyName) => {
                  //@ts-ignore
                  return characterClass?.stats[propertyName] as Stat
                })
                .filter((statItem) => !!statItem)
                .sort((a, b) => {
                  //@ts-ignore
                  const aSort = StatSort[a.name]
                  //@ts-ignore
                  const bSort = StatSort[b.name]
          
                  return (aSort ?? 999) - (bSort ?? 999)
                })
                .map((statItem) => {
                  return (
                    <CharacterStatCardMin
                      statItem={statItem}
                      statType='attribute'
                    />
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}