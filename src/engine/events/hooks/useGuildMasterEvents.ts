import { useEffect, useState, type RefObject } from 'react';
import type { GuildMaster } from '../../../entities/guild-master/types/GuildMaster.types';
import { guildMasterEventService } from '../services/GuildMasterEventService';
import { eventBus } from '../EventBus';
import { useFloatingTextEvents } from './useFloatingTextEvents';

const EVENT_TYPE_INCLUDES = 'gm:'

//References used by UI to show popup text over their div elements.
interface UseGuildMasterEventsProps {
  guilldMasterId: string
  xpReference: RefObject<HTMLDivElement | null>
  goldReference: RefObject<HTMLDivElement | null>
  tokenReference: RefObject<HTMLDivElement | null>
  levelReference: RefObject<HTMLDivElement | null>
}

export function useGuildMasterEvents(props: UseGuildMasterEventsProps){
  const [guildMaster, setGuildMaster] = useState<GuildMaster | undefined>(
    guildMasterEventService.getGuildMasterById(props.guilldMasterId)
  )
  const {
    floatingTexts: guildMasterFloatingTexts,
    addFloatingText: guildMasterAddFloatingText,
    removeFloatingText: guildMasterRemoveFloatingText
  } = useFloatingTextEvents()

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!event.type.includes(EVENT_TYPE_INCLUDES)) return

      if(event.type === 'gm:created' || event.type === 'gm:saved'){
        setGuildMaster(guildMasterEventService.getGuildMasterById(props.guilldMasterId))
      }

      if(event.type === 'gm:gold:added'){
        const positiveOrNegative = event.meta.amount < 0 ? '' : event.meta.amount > 0 ? '+' : ''

        guildMasterAddFloatingText({
          id: crypto.randomUUID(),
          color: 'gold',
          ref: props.goldReference,
          text: `${positiveOrNegative}${event.meta.amount.toLocaleString()}g`
        })
        setGuildMaster(guildMasterEventService.getGuildMasterById(props.guilldMasterId))
      }
      
    })
    return unsub
  }, [])

  return {
    guildMaster,
    guildMasterFloatingTexts,
    guildMasterRemoveFloatingText
  }
}