export interface WorldContextCharacterAddEventMeta {
  characterId: string
}
export interface WorldContextCharacterAddedEventMeta {
  characterId: string
}

export interface WorldContextGuildAddEventMeta {
  guildId: string
}

export interface WorldContextGuildAddedEventMeta {
  guildId: string
}

export interface WorldContextEventMap {
  'world:context:character:add': WorldContextCharacterAddEventMeta
  'world:context:character:added': WorldContextCharacterAddedEventMeta
  'world:context:guild:add': WorldContextGuildAddEventMeta
  'world:context:guild:added': WorldContextGuildAddedEventMeta
}