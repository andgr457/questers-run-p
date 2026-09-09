import ProgressBar from '../../../../core/components/progress-bar/ProgressBar'
import type { Character } from '../../../../interfaces/Character.types'
import { GUILD_MEMBER_ROLES } from '../../../../interfaces/GuildRole.types'
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
      className={styles.wrapper}
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