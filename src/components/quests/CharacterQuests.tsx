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

interface CharacterQuestsProps extends AppProperties {
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
    allQuestsWithProgress
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

        return (
          <div key={qg.id} className='quest-group'>
            <div className='quest-group-title'>
              {qg.title}
            </div>
            <div className='quest-group-description'>
              {qg.description}
            </div>
            <div className='quest-group-quest-list reveal'>
              {relatedQuests?.map(q => {
                return <div>
                  <CharacterQuest
                    {...props}
                    key={q.quest.id}
                    handleShowPopup={handleShowPopup}
                    quest={q.quest}
                    showActions={true}
                  />
                </div>
              })}
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