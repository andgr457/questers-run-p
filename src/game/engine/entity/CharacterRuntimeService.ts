import { GAME_STORAGE_KEYS } from '../../data/GameStorageKeys.data'
import type { CharacterEntity } from '../../entities/character/types/Character.types'
import { gameEventBus } from '../event-bus/GameEventBus'
import type { GameEvent } from '../event-bus/types/GameEvent.types'

class CharacterRuntimeService {
  private characters: Record<string, CharacterEntity> = {}

  private dirtyCharacters = new Set<string>()

  private saveInterval: number | undefined

  init() {
    const value = localStorage.getItem(
      GAME_STORAGE_KEYS.CHARACTERS_GAME
    )

    if (value) {
      const characters = JSON.parse(value) as CharacterEntity[]

      this.characters = {}

      for (const character of characters) {
        this.characters[character.id] = character
      }
    }

    gameEventBus.subscribe(event => {
      if (event.type === 'character:save') {
        this.save(event)
      }
    })
  }

  start() {
    if (this.saveInterval) {
      return
    }

    this.saveInterval = window.setInterval(() => {
      this.flushDirty()
    }, 5000)
  }

  stop() {
    if (!this.saveInterval) {
      return
    }

    clearInterval(this.saveInterval)

    this.saveInterval = undefined
  }

  getCharacter(id: string) {
    return this.characters[id]
  }

  getCharacters() {
    return Object.values(this.characters)
  }

  saveCharacter(character: CharacterEntity) {
    gameEventBus.emit({
      type: 'character:save',
      meta: {
        character
      }
    })
  }

  private save(event: GameEvent) {
    const character = event.meta?.character as CharacterEntity

    if (!character) {
      return
    }

    this.characters[character.id] = character

    this.dirtyCharacters.add(character.id)

    gameEventBus.emit({
      ...event,
      type: 'character:saved',
      meta: {
        ...event.meta,
        character
      }
    })
  }

  private flushDirty() {
    if (this.dirtyCharacters.size === 0) {
      return
    }

    localStorage.setItem(
      GAME_STORAGE_KEYS.CHARACTERS_GAME,
      JSON.stringify(
        Object.values(this.characters)
      )
    )

    this.dirtyCharacters.clear()
  }
}

export const characterRuntimeService =
  new CharacterRuntimeService()