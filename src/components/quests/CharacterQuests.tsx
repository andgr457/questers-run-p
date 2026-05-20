import type { Quest, QuestGroup, QuestProgress } from '../../interfaces/quests/Quests.types'
import './CharacterQuests.css'
import CharacterQuest from './CharacterQuest'
import { useCallback, useState } from 'react'
import type { Achievement } from '../../interfaces/achievements/Achievement.types'
import type { Item } from '../../interfaces/items/Item.types'
import type { InventoryTransaction } from '../../interfaces/inventories/Inventory.types'
import CustomContainer from '../CustomContainer'
import CharacterQuestPopup from './CharacterQuestPopup'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import useScrollReveal from '../../hooks/useScrollReveal'
import ScrollableShoppeList from '../shoppe/ShoppeListScrollable'

interface CharacterQuestsProps extends AppProperties {
  showOneTimeCompletedQuests: boolean
  showIneligibleQuests: boolean
}

export interface QuestWithQuestProgress {
  quest: Quest
  questGroup: QuestGroup | undefined
  questProgress: QuestProgress | undefined
  canTakeQuest: boolean
  canCompleteQuest: boolean
  questRequirementsAchievements: Achievement[]
  questRequirementsItems: Item[]
  questRequirementsInventoryTxns: InventoryTransaction[]
  questRequirementsQuests: Quest[]
  questRewardItems: Item[]
}

export default function CharacterQuests(props: CharacterQuestsProps){
  const {
    character,
    questGroups,
    quests,
    allQuestsWithProgress,
  } = props
  useScrollReveal()
  const [showPopupQuest, setShowPopupQuest] = useState(false)
  const [popupQuestContent, setPopupQuestContent] = useState<React.ReactNode>(undefined)
  const [popupTitle, setPopupTitle] = useState('')

  const handleShowPopup = useCallback((popupType: 'quest' | 'quest-group', relatedId: string) => {

    if(popupType === 'quest'){
      const foundQuestWithProgress = allQuestsWithProgress?.find(qwp => qwp.quest?.id === relatedId) as QuestWithQuestProgress
      setPopupQuestContent(
        <CharacterQuest showActions={false} handleShowPopup={() => {}} {...props} quest={foundQuestWithProgress.quest} />
      )
      setPopupTitle(foundQuestWithProgress.quest?.title)
    } else if(popupType === 'quest-group'){
      const relatedQuests = allQuestsWithProgress?.filter(qwp => qwp.questGroup?.id === relatedId)
      if(relatedQuests && relatedQuests.length > 0){
        const completedAmount = relatedQuests.filter(rq => rq.questProgress?.status === 'complete')
        const content = <CustomContainer
          expandable={false}
          isChildCustomContainer={false}
          title={relatedQuests[0].questGroup?.title}
          description={relatedQuests[0].questGroup?.description}
          headerLeft={<>{completedAmount.length} / {relatedQuests.length}</>}
        >
          {relatedQuests.map(rq => {
            return <CharacterQuest handleShowPopup={() => {}} {...props} quest={rq.quest} />
          })}
        </CustomContainer>
        setPopupQuestContent(content)
        setPopupTitle(relatedQuests[0].questGroup?.title as string)
      }
    }
    setShowPopupQuest(true)
  }, [allQuestsWithProgress])

  if(!character || !questGroups || !quests){
    return null
  }
  return <div className='quest-page'>
    <CharacterQuestPopup
      backdropHides={true}
      isOpen={showPopupQuest}
      onClose={() => {
        setShowPopupQuest(false)
        setPopupQuestContent(undefined)
      }}
      closeButton={true}
      rightTitle={popupTitle}
    >
      {popupQuestContent}
    </CharacterQuestPopup>

    <div className='quest-groups'>
      {questGroups.map(qg => {
        const relatedQuests = allQuestsWithProgress?.filter(qwp => qwp?.questGroup?.id === qg.id)
        relatedQuests?.sort((a, b) => {
          const aLevel = a.quest.startRequirements.find(sr => sr.level)?.level
          const bLevel = b.quest.startRequirements.find(sr => sr.level)?.level

          const aNoReq = aLevel == null
          const bNoReq = bLevel == null

          // 1. no requirement first
          if (aNoReq !== bNoReq) return aNoReq ? -1 : 1

          // 2. both have no requirement → equal
          if (aNoReq && bNoReq) return 0

          // 3. both have requirement → sort by level
          return (aLevel! - bLevel!)
        })
        return (
          <div key={qg.id} className='quest-group'>
            <div className='character-section-title'>
              <div className='page-header-banner'>
                <div className='page-header-title'>
                  {qg.title} <span className='quest-group-description'>{qg.description}</span>
                </div>
              </div>
            </div>
              <div className=''>
                <ScrollableShoppeList>
                  {relatedQuests?.map(q => {
                    return <CharacterQuest
                      {...props}
                      key={q.quest.id}
                      handleShowPopup={handleShowPopup}
                      quest={q.quest}
                      showActions={true}
                    />
                  })}
                </ScrollableShoppeList>
              </div>
          </div>
        )
      })}
    </div>
  </div>
  // return <div>
  //   <CharacterQuestPopup 
  //     backdropHides={true}
  //     isOpen={showPopupQuest}
  //     onClose={() => {
  //       setShowPopupQuest(false)
  //       setPopupQuestContent(undefined)
  //     }}
  //     closeButton={true}
  //     rightTitle={popupTitle}
  //   >
  //     {popupQuestContent}
  //   </CharacterQuestPopup>

  //   <div>
  //     <CustomContainer
  //       expandable={true}
  //       expanded={expanded}
  //       isChildCustomContainer={false}
  //       title='Quests'
  //       description=''
  //     >
  //       <div >
  //         {questGroups.map(qg => {
  //           const relatedQuests = questsWithProgress.filter(qwp => qwp?.questGroup?.id === qg.id)
  //           const completedAmount = relatedQuests.filter(rq => rq.questProgress?.status === 'complete')

  //           return <div>
  //             <CustomContainer
  //               expandable={true}
  //               expanded={expanded}
  //               isChildCustomContainer={true}
  //               title={<><div onClick={() => {
  //                 handleShowPopup('quest-group', qg.id)}}>{qg?.title}</div></>
  //               }
  //               description={qg?.description}
  //               headerLeft={<>{completedAmount.length} / {relatedQuests.length}</>}
  //             >
  //               <div className='quest-group-quest-list'>
  //                 {relatedQuests?.map(q => {
  //                   return <CharacterQuest handleShowPopup={handleShowPopup} questWithProgress={q} />
  //                 })}
  //               </div>
  //             </CustomContainer>
  //           </div>
  //         })}
  //       </div>
  //     </CustomContainer>        
  //   </div>
  // </div>
}