import styles from './GuildHallGuildDetail.module.css'
import type { Guild } from '../../../../interfaces/Guild.types'
import { formatPrimitiveValueToString } from '../../../../core/utils/Formatting.utils'
import Gold from '../../../../core/components/gold/Gold'
import ProgressBar from '../../../../core/components/progress-bar/ProgressBar'
import type { Character } from '../../../../interfaces/Character.types'

interface Props {
  guild: Guild
  members: Character[]
  guildMaster: Character
}

export default function GuildHallGuildDetail(props: Props){
  const {
    guild,
    members,
    guildMaster
  } = props
  return (
    <div
      className={`${styles.wrapper} section`}
    >
      <div className={styles.header}>
        <div className={styles.title}>
          {guild.title}
        </div>
        <div>
          Lv. {guild.level}
        </div>
        <div>
          {formatPrimitiveValueToString(guild.xp.value)}/{guild.xp.valueMax} XP
        </div>
        <div>
          <Gold value={guild.gold} />
        </div>
      </div>
      <div>
        <ProgressBar 
          color='purple'
          max={guild.xp.valueMax}
          value={guild.xp.value}
        />
      </div>
      <div className={styles.guildMaster}>
        Guild Master {guildMaster.title}
      </div>
    </div>
  )
}