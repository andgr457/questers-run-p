import type { PlayerEntity, PlayerGoldTransaction } from '../../entity/player/types/PlayerEntity.types'
import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import type { GameEvent } from '../event/types/EventBus.types'
import { getPlayerGold } from '../../entity/player/utils/Player.utils'

class PlayerRuntimeService {
  private initialized = false
  private player: PlayerEntity | undefined
  private playerGoldTransactions: PlayerGoldTransaction[] = []

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true

    const playerValue = localStorage.getItem(
      GAME_STORAGE_KEYS.PLAYER_GAME
    )

    if (playerValue) {
      this.player = JSON.parse(playerValue)
    }

    const playerGoldValue = localStorage.getItem(
      GAME_STORAGE_KEYS.PLAYER_GOLD_GAME
    )

    if(playerGoldValue){
      this.playerGoldTransactions = JSON.parse(playerGoldValue)
    }

    eventBus.subscribe(event => {
      if (event.type === 'player:save') {
        this.save(event)
      }
      if(event.type === 'player:gold'){
        this.addGoldTransaction(event)
      }
      if(event.type === 'player:xp'){
        this.addXP(event)
      }
      if(event.type === 'player:token'){
        this.addTokens(event)
      }
    })
  }

  getPlayer() {
    return this.player
  }

  hasPlayer() {
    return !!this.player
  }

  getPlayerGoldTransactions() {
    return this.playerGoldTransactions
  }

  private addTokens(event: GameEvent){
    if(!this.player || !event.meta?.characterTokens) return
    
    this.player.characterTokens += event.meta.characterTokens

    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'player:token:added',
      meta: {
        characterTokens: event.meta.characterTokens
      }
    })
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'player:save',
      parentEventId: event.id,
      meta: {
        player: this.player,
      }
    })
  }

  private addGoldTransaction(event: GameEvent) {
    if(!this.player) return
    const txn = event.meta?.playerGoldTransaction as PlayerGoldTransaction
    if(txn.amount < 0){
      const playerGold = getPlayerGold()
      const wouldBeAmount = playerGold + txn.amount

      if(wouldBeAmount < 0){
        return
      }
    }
    this.playerGoldTransactions = [
      txn,
      ...this.playerGoldTransactions
    ]

    localStorage.setItem(
      GAME_STORAGE_KEYS.PLAYER_GOLD_GAME,
      JSON.stringify(this.playerGoldTransactions)
    )
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'player:gold:added',
      meta: {
        gold: txn.amount
      }
    })
  }

  private addXP(event: GameEvent) {
    if(!this.player || !event.meta?.xp) return

    const xp = event.meta?.xp
    const xpWithNew = this.player?.xp + xp
    console.log('player xpWithNew xpNext', xpWithNew, this.player.xpNextLevel)
    //if over, then level up
    if(xpWithNew >= this.player.xpNextLevel){
      const differenceXp = xpWithNew - this.player.xpNextLevel
      console.log('player level up difference xp', differenceXp)

      this.player.xp = Math.max(differenceXp, 0)
      console.log('player xp to difference', this.player.xp)
      console.log('player xp next forumula', 'this.player.xpNextLevel * 1.7', this.player.xpNextLevel * 1.7)
      this.player.xpNextLevel = this.player.xpNextLevel * 1.7
      console.log('player xp next set', this.player.xpNextLevel)

      this.player.level += 1
      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'player:level',
        meta: {
          level: this.player.level
        }
      })
      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'notification:save',
        meta: {
          notification: {
            title: `Player Event`,
            description: `You are now level ${this.player.level}!`
          }
        }
      })
    } else {
      this.player.xp += xp
    }

    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'player:xp:added',
      meta: {
        xp: xp
      }
    })
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'player:save',
      parentEventId: event.id,
      meta: {
        player: this.player
      }
    })
    
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