import type { Guild } from '../../../interfaces/Guild.types';

export function getGuildForCreate(): Guild {
  return {
    id: `guild-${crypto.randomUUID()}`,
    guildMasterId: '',
    title: '',
    description: '',
    gold: 0,
    level: 1,
    xp: {
      progressBarType: 'fill',
      title: 'XP',
      value: 0,
      valueMax: 100,
    },
  }
}