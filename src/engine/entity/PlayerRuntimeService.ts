import type { PlayerEntity } from '../../entity/player/types/PlayerEntity.types'
import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import type { GameEvent } from '../event/types/EventBus.types'

class PlayerRuntimeService {
  private initialized = false
  private player: PlayerEntity | undefined

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true

    const value = localStorage.getItem(
      GAME_STORAGE_KEYS.PLAYER_GAME
    )

    if (value) {
      this.player = JSON.parse(value)
    }

    eventBus.subscribe(event => {
      if (event.type === 'player:save') {
        this.save(event)
      }
      if(event.type === 'player:saved'){

      }
    })
  }

  getPlayer() {
    return this.player
  }

  private save(event: GameEvent) {
    const player = event.meta?.player as PlayerEntity

    this.player = player

    localStorage.setItem(
      GAME_STORAGE_KEYS.PLAYER_GAME,
      JSON.stringify(player)
    )

    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'player:saved',
      meta: {
        player
      }
    })
  }
}
export const playerRuntimeService =
  new PlayerRuntimeService()