import type { Character } from './Character.types';
import { hudCreateCharacter } from './Character.utils';

export class CharacterService {
  private character: Character
  
  constructor(){
    const stored = localStorage.getItem(
      'qr-hud-character'
    )
    if(!stored){
      this.character = hudCreateCharacter()
      this.save()
    } else {
      this.character = JSON.parse(stored)
    }
  }

  save(): void {
    if(this.character){
      localStorage.setItem(
        'qr-hud-character',
        JSON.stringify(this.character)
      )
    }
  }

  get(): Character {
    return this.character
  }

  setName(name: string): void {
    this.character.name = name
    this.emit()
  }

  getXpMax(): number {
    return this.character.level * 100
  }

  getHpMax(): number {
    return this.character.level * 100
  }

  getMpMax(): number {
    return this.character.level * 100
  }

  getStaminaMax(): number {
    return this.character.level * 100
  }

  getGoldMax(): number {
    return this.character.level * 100
  }

  addXp(xp: number): void {
    const max = this.getXpMax()

    if(this.character.level >= 10) {
      this.character.level = 10

      if(this.character.xp >= max){
        this.character.xp = max

        this.emit()
        return
      }
    }

    const added = this.character.xp + xp
    if(this.character.xp >= max){
      //level up
      this.character.level += 1
      const overflow = max - added
      this.character.xp = 0 + overflow
    }
    console.log('xp added', xp)
    this.emit()
  }

  //addHp

  //addMp

  //addStamina

  private emit(): void {
    //todo: emit after modifications
    this.save()
  }
}