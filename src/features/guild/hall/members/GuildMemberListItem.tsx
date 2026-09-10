import ProgressBar from '../../../../core/components/progress-bar/ProgressBar'
import { clockRuntimeService } from '../../../../engine/clock/ClockRuntimeService'
import { eventBus } from '../../../../engine/events/EventBus'
import type { Character } from '../../../../interfaces/Character.types'
import { GUILD_MEMBER_ROLES } from '../../../../interfaces/GuildRole.types'
import { getWorldModeMainChangeEvent } from '../../../world/actions/utils/WorldActions.utils'
import styles from './GuildMemberListItem.module.css'

interface Props {
  member: Character
}

export default function GuildMemberListItem(props: Props){
  const {
    member
  } = props

  if(!member) return null

  return (
    <div
      className={`${styles.wrapper} section clickable`}
      onClick={() => {
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:context:character:add',
          created: clockRuntimeService.getNow(),
          meta: {
            characterId: member.id
          }
        })
        eventBus.emit(
          getWorldModeMainChangeEvent(
            'character:detail'
          )
        )
      }}
    >
      <div className={styles.title}>
        {member.title}
      </div>
      <div className={styles.role}>
        {GUILD_MEMBER_ROLES[member.guildRole].title}
      </div>
      <div className={styles.xpWrapper}>
        <div className={styles.xpNumbers}>
          {member.xp.value}/{member.xp.valueMax} XP
        </div>
        <div className={styles.xpProgress}>
          <ProgressBar 
            color='purple'
            max={member.xp.valueMax}
            value={member.xp.value}
            showLabel={false}
            showValues={false}
          />
        </div>
      </div>
    </div>
  )
}