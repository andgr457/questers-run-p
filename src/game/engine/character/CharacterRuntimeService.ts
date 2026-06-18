import type { CharacterEntity } from '../../entities/character/types/Character.types'
import { gameEventBus } from '../event-bus/GameEventBus'

type Listener = () => void

class CharacterRuntimeService {
  private characters = new Map<string, CharacterEntity>()
  private listeners = new Set<Listener>()

  init(characters: CharacterEntity[]) {
    this.characters.clear()

    for (const character of characters) {
      this.characters.set(
        character.id,
        structuredClone(character)
      )
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    for (const listener of this.listeners) {
      listener()
    }
  }

  start() {
    gameEventBus.subscribe(event => {
      switch (event.type) {
        case 'character:xp:add':
          this.addXp(
            event.characterId,
            event.amount
          )
          break

        case 'character:stamina:add':
          this.addStamina(
            event.characterId,
            event.amount
          )
          break

        case 'character:stamina:remove':
          this.removeStamina(
            event.characterId,
            event.amount
          )
          break
      }
    })
  }

  getCharacter(characterId: string) {
    return this.characters.get(characterId)
  }

  getAll() {
    return Array.from(this.characters.values())
  }

  setCharacter(character: CharacterEntity) {
    this.characters.set(
      character.id,
      character
    )

    gameEventBus.emit({
      type: 'character:dirty',
      characterId: character.id
    })

    this.notify()
  }

  addXp(characterId: string, amount: number) {
    const character =
      this.characters.get(characterId)

    if (!character) return

    character.xp += amount

    gameEventBus.emit({
      type: 'character:dirty',
      characterId
    })

    this.notify()
  }

  addStamina(characterId: string, amount: number) {
    const character =
      this.characters.get(characterId)

    if (!character) return

    character.stamina = Math.min(
      character.staminaMax,
      character.stamina + amount
    )

    gameEventBus.emit({
      type: 'character:dirty',
      characterId
    })

    this.notify()
  }

  removeStamina(characterId: string, amount: number) {
    const character =
      this.characters.get(characterId)

    if (!character) return

    character.stamina = Math.max(
      0,
      character.stamina - amount
    )

    gameEventBus.emit({
      type: 'character:dirty',
      characterId
    })

    this.notify()
  }
}

export const characterRuntimeService =
  new CharacterRuntimeService()