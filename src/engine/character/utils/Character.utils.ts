import { characterRuntimeService } from '../CharacterRuntimeService'

export function getCharacterGold(characterId: string) {
  const txns = characterRuntimeService.getCharacterGoldTransactions(characterId)
  return txns.map(t => t.amount).reduce((acc, curr) => acc + curr, 0)
}

export function getPlayerHasEnoughGold(characterId: string, goldNeeded: number){
  const characterGold = getCharacterGold(characterId)
  if(characterGold >= goldNeeded){
    return true
  }
  return false
}
