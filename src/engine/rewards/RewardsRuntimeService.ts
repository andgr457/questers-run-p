import { eventBus } from '../event/EventBus'
import { clockRuntimeService } from '../clock/ClockRuntimeService'
import { characterRuntimeService } from '../character/CharacterRuntimeService'

class RewardsRuntimeService {
  private initialized = false

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true

    eventBus.subscribe(event => {
      if (event.type === 'rewards:grant') {
        this.handleGrant(event)
      }
    })
  }

  private handleGrant(event: any) {
    const { rewards, source } = event.meta || {}

    if (!rewards || !Array.isArray(rewards)) {
      return
    }

    for (const reward of rewards) {
      this.applyReward(reward, source)
    }
  }

  private applyReward(reward: any, source: any) {
    const now = clockRuntimeService.getNow()

    switch (reward.type) {
      case 'player': {
        if (reward.gold) {
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'player:gold',
            meta: {
              playerGoldTransaction: {
                id: crypto.randomUUID(),
                amount: reward.gold,
                date: now,
              },
            },
          })
        }

        if (reward.xp) {
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'player:xp',
            meta: {
              xp: reward.xp,
            },
          })
        }

        if (reward.characterTokens) {
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'player:token',
            meta: {
              characterTokens: reward.characterTokens,
            },
          })
        }

        break
      }

      case 'character': {
        const characterId = source?.meta?.characterId

        if (!characterId) {
          break
        }

        if (reward.gold) {
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'character:gold',
            meta: {
              characterGoldTransaction: {
                id: crypto.randomUUID(),
                characterId,
                amount: reward.gold,
                date: now,
              },
            },
          })
        }

        if (reward.xp) {
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'character:xp',
            meta: {
              characterId,
              xp: reward.xp,
            },
          })
        }

        break
      }

      case 'characters': {
        const characters = characterRuntimeService.getCharacters()

        for (const character of characters) {
          if (reward.gold) {
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'character:gold',
              meta: {
                characterGoldTransaction: {
                  id: crypto.randomUUID(),
                  characterId: character.id,
                  amount: reward.gold,
                  date: now,
                },
              },
            })
          }

          if (reward.xp) {
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'character:xp',
              meta: {
                characterId: character.id,
                xp: reward.xp,
              },
            })
          }
        }

        break
      }
    }
  }
}

export const rewardsRuntimeService = new RewardsRuntimeService()