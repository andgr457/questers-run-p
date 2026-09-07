import { useEffect, useState } from 'react';
import { eventBus } from '../../EventBus';
import { guildEventService } from '../../services/GuildEventService';
import type { Guild } from '../../../../interfaces/Guild.types';
import type { GuildBaseEventMeta } from '../../types/GuildEvents.types';

interface Props {
  guildId: string
}

export function useGuild(props: Props){
  const [guild, setGuild] = useState<Guild | undefined>(
    guildEventService.getGuildById(props.guildId)
  )

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!event.type.startsWith('guild:')) return
      const meta = event.meta as GuildBaseEventMeta
      if(meta.guildId !== props.guildId) return
      
      if(
        event.type.includes(':added')
        || event.type.includes(':saved')
        || event.type.includes(':created')
      ){  
        setGuild(
          guildEventService.getGuildById(props.guildId)
        )
      }
    })
    return unsub
  })

  return {
    guild
  }
}