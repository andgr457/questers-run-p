import { gameEventBus } from '../event-bus/GameEventBus'
import { characterRuntimeService } from '../character/CharacterRuntimeService'
import { notificationService } from '../notifications/NotificationService'
import { GAME_UPGRADES } from '../../entities/upgrade/data/UpgradeEntity.data'

class UpgradeRuntimeService {

  init() {
    gameEventBus.subscribe(event => {
      if (event.type === 'upgrade:purchased') {
        this.upgrade(event.characterId, event.meta?.upgradeId as string)
      }
    })
  }


  private upgrade(characterId: string, upgradeId: string) {

    const upgrade = GAME_UPGRADES.find(u => u.id === upgradeId)
    if (!upgrade) return

    const character = characterRuntimeService.getCharacter(characterId)
    if (!character) return

    let totalCost = 0
    for(const req of upgrade.requirements){
      if(req.gold){
        totalCost += req.gold
      }
      if(req.characterLevel){
        if(req.characterLevel > character.level){
          notificationService.notify({
            lifetime: 5000,
            text: `${character.name} is not Lv. ${req.characterLevel} yet.`,
            type: 'info'
          })
          return
        }
      }
      if(req.upgradeId){
        
      }
    }
    const hasEnoughGold = character.gold >= totalCost
    if(!hasEnoughGold){
      notificationService.notify({
        lifetime: 5000,
        text: `${character.name} does not have enough gold.`,
        type: 'info'
      })
      return
    }
    character.gold = character.gold - totalCost

    // mark dirty via runtime
    gameEventBus.emit({
      type: 'character:dirty',
      characterId
    })

    // optional immediate save (recommended for safety)
    gameEventBus.emit({
      type: 'character:save',
      characterId
    })
  }

}

export const upgradeRuntimeService = new UpgradeRuntimeService()