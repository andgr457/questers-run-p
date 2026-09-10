import FeatureHeader from '../../../../core/components/feature/components/header/FeatureHeader'
import type { Character } from '../../../../interfaces/Character.types'
import styles from './GuildMemberList.module.css'
import GuildMemberListItem from './GuildMemberListItem'

interface Props {
  members: Character[]
  guildMaster: Character
}

export default function GuildMemberList(props: Props){
  const {
    members,
    guildMaster
  } = props

  if(!members) return null
  if(!guildMaster) return null

  return (
    <div className={styles.wrapper}>
      <FeatureHeader 
        text='Members'
        type='sub'
      />
      <GuildMemberListItem 
        member={guildMaster}
      />
      {members.map(m => {
        if(m.id === guildMaster.id) return null

        return <GuildMemberListItem 
          member={m}
        />
      })}    
    </div>
  )
}