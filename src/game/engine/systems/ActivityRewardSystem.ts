import { gameEventBus } from '../events/GameEventBus'

class ActivityRewardSystem {
  init() {
    gameEventBus.subscribe(event => {
      switch (event.type) {
        case 'activity:complete':
          this.onComplete(event)
          break
      }
    })
  }

  private onComplete(event: any) {
    switch (event.activityType) {
      case 'hunting':
        console.log('🎯 Give XP for hunting')
        break

      case 'quest':
        console.log('📜 Quest completed reward')
        break
    }
  }
}

export const activityRewardSystem = new ActivityRewardSystem()