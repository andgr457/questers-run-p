import ProgressBar from '../../../core/components/progress-bar/ProgressBar'
import { formatPrimitiveValueToString } from '../../../core/utils/Formatting.utils'
import { clockRuntimeService } from '../../../engine/clock/ClockRuntimeService'
import { eventBus } from '../../../engine/events/EventBus'
import type { Guild } from '../../../interfaces/Guild.types'
import { getWorldModeMainChangeEvent } from '../../world/actions/utils/WorldActions.utils'
import styles from './GuildListItem.module.css'

interface Props {
  guild: Guild
  membersAmount: number
}

export default function GuildListItem(props: Props){
  const {
    guild,
    membersAmount
  } = props

  return (
    <div
      className={`${styles.wrapper} section clickable`}
      onClick={() => {
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:context:guild:add',
          created: clockRuntimeService.getNow(),
          meta: {
            guildId: guild.id
          }
        })
        eventBus.emit(
          getWorldModeMainChangeEvent(
            'guild:hall'
          )
        )
      }}
    >

      <div>{guild.title}</div>
      <div>Lv. {guild.level}</div>
      <div>Members: {formatPrimitiveValueToString(membersAmount)}</div>
      <div>Upgrades: 0</div>
      <div className={styles.xpWrapper}>
        <div>
          <ProgressBar 
            color='purple'
            max={guild.xp.valueMax}
            value={guild.xp.value}
            label='XP'
          />
        </div>
      </div>
    </div>
  )
}