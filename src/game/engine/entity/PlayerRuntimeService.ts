import { GAME_STORAGE_KEYS } from '../../data/GameStorageKeys.data'
import type { PlayerEntity } from '../../entities/player/types/PlayerEntity.types'
import { gameEventBus } from '../event-bus/GameEventBus'
import type { GameEvent } from '../event-bus/types/GameEvent.types'
import { notificationService } from '../notifications/NotificationService'

class PlayerRuntimeService {
  private player: PlayerEntity | undefined

  init() {
    const value = localStorage.getItem(
      GAME_STORAGE_KEYS.PLAYER_GAME
    )

    if (value) {
      this.player = JSON.parse(value)
    }

    gameEventBus.subscribe(event => {
      if (event.type === 'player:save') {
        this.save(event)
      }
      if(event.type === 'player:saved'){
        notificationService.notify({
          type: 'success',
          lifetime: 5000,
          text: `Player saved!`
        })
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

    gameEventBus.emit({
      ...event,
      type: 'player:saved',
      meta: {
        ...event.meta,
        player
      }
    })
  }
}
export const playerRuntimeService =
  new PlayerRuntimeService()