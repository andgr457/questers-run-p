import type { Player } from '../../../entities/player/Player.types';

export interface PlayerCreateEventMeta {
  player: Player
}

export interface PlayerCreatedEventMeta {
  player: Player
}

//todo other events like add xp, hp, mana etc...

export interface PlayerEventMap {
  'player:create': PlayerCreateEventMeta
  'player:created': PlayerCreatedEventMeta
}
