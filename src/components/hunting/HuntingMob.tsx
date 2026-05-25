import { useNavigate } from 'react-router-dom'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import { GuildRankByLevel, GuildRankLevelByRank, type Character } from '../../interfaces/characters/Character.types'
import type { Mob } from '../../interfaces/mobs/Mob.types'
import StateOverlay from '../state-overlay/StateOverlay'

interface HuntingMobProps extends AppProperties {
  huntingMob: Mob
  canDo: boolean
  handleHuntMobClicked: (mob: Mob, char: Character) => Promise<void>
}

export default function HuntingMob(props: HuntingMobProps) {
  const {
    character,
    canDo,
    allQuestProgress,
    characterMobProgress,
    huntingMob,
    handleHuntMobClicked,
    items,
    showConfirm,
    quests
  } = props

  const navigate = useNavigate()

  const clickFn = canDo
    ? async () => {
        await handleHuntMobClicked(huntingMob, character)
      }
    : undefined

  // =========================
  // GUILD RANK LOCK CHECK
  // =========================
  let lockReason: string | null = null

  if (character?.guildRank && typeof huntingMob.guildRankLevel === 'number') {
    const charRankLevel = GuildRankLevelByRank[character.guildRank]
    //@ts-ignore
    const mobRank = GuildRankByLevel[huntingMob.guildRankLevel]

    if (charRankLevel < huntingMob.guildRankLevel) {
      lockReason = `Guild Rank ${mobRank} Required`
    }
  }

  // =========================
  // QUEST REQUIREMENT (mob kill tracking)
  // =========================
  const inProgressQuestProgress = allQuestProgress?.find(aqp => 
    aqp.characterId === character.id &&
    aqp.status === 'in-progress'
  )
  const relatedInProgressQuest = quests?.find(q => q.id === inProgressQuestProgress?.questId)

  const relatedQuest = relatedInProgressQuest?.completionRequirements?.find(
    req => req.mobId === huntingMob.id
  )

  const allRelatedMobProgress = characterMobProgress?.filter(mp => mp.mobId === huntingMob.id)
  const questRelatedMobProgress = allRelatedMobProgress?.filter(mp => mp.questProgressId === inProgressQuestProgress?.id)
  const content = (
    <div id={huntingMob.id} className="shoppe-item open">
      <div className="shoppe-item-name">
        {huntingMob.name}
      </div>

      <div className="shoppe-item-description">
        {huntingMob.description}
      </div>

      
        {relatedQuest && (
          <div className='shoppe-item-info-list' style={{ justifyContent: 'center' }}>
            <div className="shoppe-item-info small" onClick={async () => {
                if(await showConfirm({
                  isYesNo: true,
                  title: 'Head Back?',
                  message: 'Head back to the adventurers guild?'
                })){
                  navigate(`/town/adventurers-guild#${inProgressQuestProgress?.questId}`)
                }
              }}>
              <div>
                <span style={{ color: 'var(--blue-sd-lighter-2)' }}>
                  {/* you can replace this with real tracked kills later */}
                  {Math.min(questRelatedMobProgress?.length ?? 0, relatedQuest.mobAmount as number)}
                </span>
                {' / '}
                {relatedQuest.mobAmount}
              </div>
              <div>Quest Progress</div>
            </div>
          </div>
        )}

      <div className="shoppe-item-info-list" style={{ justifyContent: 'center' }}>
        <div className="shoppe-item-info small">
          <div>
            Lv.
          </div>
          <div  style={{ color: 'gold' }}>
            {huntingMob.level}
          </div>
        </div>

        <div className="shoppe-item-info small">
          <div>
            <span style={{ color: 'gold' }}>+{huntingMob.xp}</span>
          </div>
          <div>XP</div>
        </div>

        <div className="shoppe-item-info small">
          <div style={{ textTransform: 'capitalize', color: 'gold' }}>
            {huntingMob.location}
          </div>
        </div>        
      </div>

      <div className="shoppe-item-description" style={{color: 'gold'}}>
        LOOT
      </div>
      <div className='shoppe-item-info-list' style={{ justifyContent: 'center' }}>
        {huntingMob.loot.map(lootItem => {
          const item = items?.find(i => i.id === lootItem.itemId)
          return <div className="shoppe-item-info small" title={`${lootItem.chance * 100}% chance to drop when defeated.`}>
            <div>
              {item?.name}
            </div>
            <div style={{color: 'gold'}}>
              x{lootItem.itemAmount}
            </div>
            <div>
              <span style={{color: 'gold', fontSize: 'smaller'}}>{lootItem.chance * 100}%</span>
            </div>
          </div>
        })}
      </div>

      <div className="shoppe-item-bottom">
        <div
          className={`shoppe-item-info ${canDo ? 'add' : 'zero'}`}
          onClick={clickFn}
        >
          HUNT
        </div>
      </div>
    </div>
  )

  // =========================
  // OVERLAY (LOCKED STATE)
  // =========================
  return (
    <StateOverlay active={canDo === false || typeof lockReason === 'string'} text="LOCKED" subText={lockReason ?? `Hunting "${huntingMob.name}"`}>
      {content}
    </StateOverlay>
  )

  return content
}