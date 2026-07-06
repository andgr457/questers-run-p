import { playerRuntimeService } from '../../../engine/player/PlayerRuntimeService'

export function getPlayerGold() {
  const txns = playerRuntimeService.getPlayerGoldTransactions()
  return txns.map(t => t.amount).reduce((acc, curr) => acc + curr, 0)
}

export function getPlayerHasEnoughGold(goldNeeded: number){
  const playerGold = getPlayerGold()
  if(playerGold >= goldNeeded){
    return true
  }
  return false
}
