import { useCallback, useEffect, useMemo, useState } from 'react'
import { DateTime } from 'luxon'

import Modal, { type ModalProps } from '../modals/Modal'

import type {
  Character,
  CharacterClass,
  Stat,
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

interface NewCharacterModalProps
  extends AppProperties,
    ModalProps {}

const NAME_MIN_LENGTH = 3
const NAME_MAX_LENGTH = 50

export default function NewCharacterModal(
  props: NewCharacterModalProps
) {
  const {
    character,
    isOpen,
    onClose,
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

  const [showClassInfo, setShowClassInfo] =
    useState(!isRename)

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
    setShowClassInfo(!character?.name)
  }, [character, isOpen])

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

      onClose()

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
        `"${currencyPouch.title}" pouch received!`,
        300
      )
    )

    histories.push(
      buildHistory(
        `"${starterPouch.title}" pouch received!`,
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

    onClose()
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
    onClose,
  ])

  const handleCancel = useCallback(() => {
    setNewName(character?.name ?? '')
    setError('')
    onClose()
  }, [character?.name, onClose])

  const statInfos = useMemo(() => {
    return Object.values(
      selectedClass?.stats ?? {}
    ).map(statItem => {
      const stat = statItem as Stat

      return (
        <div
          key={stat.name}
          className='character-info-stat-item'
        >
          <div>+</div>

          <div>{stat.name}</div>

          <div>{stat.value}</div>
        </div>
      )
    })
  }, [selectedClass])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdropHides={isRename}
      closeButton={isRename}
      rightTitle={
        isRename
          ? `Rename ${characterForm.name}`
          : ACHIEVEMENT_INTRO_MAIN_CHARACTER.title
      }
      leftTitle='Class Information'
      leftChildren={
        selectedClass &&
        showClassInfo && (
          <div>
            <div>{selectedClass.name}</div>

            <hr />

            <div
              className='character-info-stats-xp'
              style={{ fontSize: '0.7em' }}
            >
              {statInfos}
            </div>
          </div>
        )
      }
    >
      <div style={{ textAlign: 'center' }}>
        <div className='description'>
          {isRename
            ? 'Apply for a name change.'
            : ACHIEVEMENT_INTRO_MAIN_CHARACTER.description}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '5px',
            justifyContent: 'center',
          }}
        >
          {/* NAME */}
          <div>
            <div className='form-label'>
              Name
            </div>

            <input
              type='text'
              style={{ width: '250px' }}
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

            <div className='foot-note'>
              {currentName.length} /{' '}
              {NAME_MAX_LENGTH} character(s)
            </div>
          </div>

          {/* CLASS */}
          <div style={{ width: '250px' }}>
            <div className='form-label'>
              Class
            </div>

            <select
              disabled={isRename}
              value={characterForm.classId}
              style={{ width: '265px' }}
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

            <div className='foot-note danger'>
              {error}
            </div>
          </div>
        </div>

        <hr />

        <div className='modal-actions'>
          <button
            className='success'
            onClick={handleSubmit}
          >
            {isRename ? 'Rename' : 'Create'}
          </button>

          {isRename && (
            <button
              className='danger'
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}

          <button
            className='basic'
            onClick={() =>
              setShowClassInfo(prev => !prev)
            }
          >
            {showClassInfo ? 'Hide' : 'Show'}{' '}
            Class Stats
          </button>
        </div>
      </div>
    </Modal>
  )
}