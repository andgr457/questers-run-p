import { CURRENCY_ITEM_IDS } from '../../data/items/currency/Item.Currency.data';
import type { Character, CharacterClass, Stat, Stats } from '../../interfaces/characters/Character.types';
import type { Inventory } from '../../interfaces/inventories/Inventory.types';

export class CharacterService {
  protected character: Character
  protected characterClass: CharacterClass
  protected characterInventories: Inventory[]
  constructor(
    character: Character,
    characterClass: CharacterClass,
    characterInventories: Inventory[]
  ){
    this.character = character
    this.characterClass = characterClass
    this.characterInventories = characterInventories
  }

  getGold(): number {
    let gold = 0
    this.characterInventories.forEach(i => {
      const goldTransactions = i.transactions.filter(t => t.itemId === CURRENCY_ITEM_IDS.GOLD)
      goldTransactions.forEach(t => {
        gold += t.quantity
      })
    })
    return gold
  }

  getStats(): Stats {
    const characterStats: Stats = JSON.parse(JSON.stringify(this.character.stats))

    //apply class buffs
    for(const statField of Object.getOwnPropertyNames(characterStats)){
      //@ts-ignore
      const characterStat: Stat = characterStats[statField]
      characterStat.hint = `${this.character.name} ${characterStat.name} ${characterStat.value}\r\n\r\n`
      
      //@ts-ignore
      const classStat: Stat = this.characterClass.stats[statField]
      characterStat.hint += `CLASS BUFF +${classStat.value}\r\n`
      
      const appliedCharacterStatValue = characterStat.value + classStat.value
      characterStat.hint += `CLASS TOTAL +${appliedCharacterStatValue}\r\n`

      characterStat.value = appliedCharacterStatValue
    }
    //TODO: apply buffs/debuffs

    return characterStats
  }
}