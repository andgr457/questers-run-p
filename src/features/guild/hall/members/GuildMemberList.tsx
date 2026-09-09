import FeatureHeader from '../../../../core/components/feature/components/header/FeatureHeader'
import type { Character } from '../../../../interfaces/Character.types'
import styles from './GuildMemberList.module.css'
import GuildMemberListItem from './GuildMemberListItem'

interface Props {
  members: Character[]
}

export default function GuildMemberList(props: Props){
  const {
    members
  } = props

  if(!members) return null

  return (
    <div className={styles.wrapper}>
      <FeatureHeader 
        text='Members'
        type='sub'
      />
      {members.map(m => {

        return <GuildMemberListItem 
          member={m}
        />
      })}    
    </div>
  )
}