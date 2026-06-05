import type { Character } from '../../../interfaces/characters/Character.types';
import type { Mob } from '../../../interfaces/mobs/Mob.types';

export function calculateCombatDamage(
  entity: Mob | Character
) {
  return (
    entity.level +
    (entity.stats.strength?.value ?? 0) +
    (entity.stats.agility?.value ?? 0) +
    (entity.stats.intelligence?.value ?? 0)
  )
}