import type { EventServiceIds, GameEventService } from '../types/EventService.types';

export const GAME_EVENT_SERVICE_IDS: Record<EventServiceIds, EventServiceIds> = {
  unkown_event_service: 'unkown_event_service',
  world_mode_event_service: 'world_mode_event_service',
  character_event_service: 'character_event_service',
  guild_event_service: 'guild_event_service',
  world_context_event_service: 'world_context_event_service'
}

export const GAME_EVENT_SERVICES: Record<EventServiceIds, GameEventService> = {
  unkown_event_service: {
    id: 'unkown_event_service',
    title: 'Unkown Event Service',
    description: 'An event service has not fully initialized, not properly configured, or failed while initializing.',
  },
  world_mode_event_service: {
    id: 'world_mode_event_service',
    title: 'World Mode Event Service',
    description: 'Handles events to change main, and overlay, modes to assist with transitions between views.'
  },
  character_event_service: {
    id: 'character_event_service',
    title: 'Character Event Service',
    description: 'Handles events to create, modify, save, and load characters.'
  },
  guild_event_service: {
    id: 'guild_event_service',
    title: 'Guild Event Service',
    description: 'Handle events to create, modify, save, and load guilds.'
  },
  world_context_event_service: {
    id: 'world_context_event_service',
    title: 'World Context Event Service',
    description: 'Handles events to store the player\'s current character id and guild id as context for use in many singular entity components like upgrades or halls.'
  }
}

