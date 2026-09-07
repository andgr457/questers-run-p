import { useEffect, useState } from 'react';
import { eventBus } from '../../EventBus';
import { guildEventService } from '../../services/GuildEventService';
import type { Guild } from '../../../../interfaces/Guild.types';

export function useGuilds(){
  const [guilds, setGuilds] = useState<Guild[]>(
    guildEventService.getGuilds() ?? []
  )

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!event.type.startsWith('guild:')) return

      if(
        event.type.includes(':added')
        || event.type.includes(':saved')
        || event.type.includes(':created')
      ){
        setGuilds(
          guildEventService.getGuilds()
        )
      }
    })
    return unsub
  })

  return {
    guilds
  }
}