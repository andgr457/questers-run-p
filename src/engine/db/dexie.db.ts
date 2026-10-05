import Dexie, { type Table } from 'dexie';
import type { Player } from '../../entities/player/Player.types';

export class DexieService extends Dexie {
  player!: Table<Player, number>; //second argument tells what the index type is

  constructor(){
    super('qr-kick')
    this.version(1).stores({
      player: '++id', //index top level props eg 'id, name, level'. ++ auto-increments

    })
  }
}

export const db = new DexieService()