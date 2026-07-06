import { GAME_CHARACTER_CLASSES } from '../../character-class/data/CharacterClassEntity.data'
import type { CharacterEntity } from '../../character/types/CharacterEntity.types'
import type { PartyEntity, PartyJoinResponse } from '../types/PartyEntity.types'
import type { PartyRole } from '../types/PartyRole.types'

export function canJoinParty(
  party: PartyEntity,
  character: CharacterEntity,
  joinRole: PartyRole
): PartyJoinResponse {
  const characterClass = GAME_CHARACTER_CLASSES[character.classId]

  // 1. CLASS ROLE VALIDATION
  if (!characterClass.roles.includes(joinRole)) {
    return {
      canJoin: false,
      cantJoinReason: `This class cannot play role: ${joinRole}.`
    }
  }

  // 2. PARTY SIZE LIMIT
  if (party.members.length >= 5) {
    return {
      canJoin: false,
      cantJoinReason: 'Party is full.'
    }
  }

  // 3. ROLE LIMITS IN PARTY
  const roleCount = (role: PartyRole) =>
    party.members.filter(m => m.role === role).length

  if (joinRole === 'tank' && roleCount('tank') >= 1) {
    return {
      canJoin: false,
      cantJoinReason: 'Party already has a Tank.'
    }
  }

  if (joinRole === 'healer' && roleCount('healer') >= 1) {
    return {
      canJoin: false,
      cantJoinReason: 'Party already has a Healer.'
    }
  }

  if (joinRole === 'damage' && roleCount('damage') >= 3) {
    return {
      canJoin: false,
      cantJoinReason: 'Party already has 3 Damage roles.'
    }
  }

  return {
    canJoin: true,
    cantJoinReason: ''
  }
}