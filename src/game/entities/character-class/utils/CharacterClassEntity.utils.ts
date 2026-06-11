export function getCharacterClassCharactersAmountByPlayerLevel(playerLevel: number){
  if(!playerLevel || playerLevel <= 0){
    return 1
  }

  if(playerLevel > 5){
    return 4
  }

  switch(playerLevel){
    case 1: return 1
    case 2: return 2
    case 3: return 2
    case 4: return 2
    case 5: return 3
    default: return 1
  }
}

export const CHARACTER_CLASS_MAX_PLAYER_LEVEL: Record<string, number> = {
  '1': 1,
  '2': 2,
  '3': 2,
  '4': 3,
  '5': 3
}