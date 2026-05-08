import type { Character } from '../../../interfaces/characters/Character.types'
import type { Quest, QuestGroup, QuestProgress } from '../../../interfaces/quests/Quests.types'
import './CharacterQuests.css'
import CharacterQuest from './CharacterQuest'
import { useCallback, useEffect, useRef, useState } from 'react'
import { QuestService } from '../../../services/quests/QuestService'
import type { Achievement } from '../../../interfaces/achievements/Achievement.types'
import type { Item } from '../../../interfaces/items/Item.types'
import type { Inventory, InventoryTransaction } from '../../../interfaces/inventories/Inventory.types'
import CustomContainer from '../CustomContainer'
import CustomContainerItem from '../CustomContainerItem'
import CharacterQuestPopup from './CharacterQuestPopup'

interface CharacterQuestsProps {
  id?: string
  character: Character
  characterQuestProgressItems: QuestProgress[]
  quests: Quest[]
  questGroups: QuestGroup[]
  characterInventories: Inventory[]
  showAllQuests: boolean
  showCurrentQuest: boolean
  expanded: boolean
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
}

interface GroupSetting {
  groupId: string
  show: boolean
}

export default function CharacterQuests(props: CharacterQuestsProps){
  const {
    id,
    character,
    characterQuestProgressItems,
    questGroups,
    quests,
    characterInventories,
    expanded
  } = props

  const [questsWithProgress, setQuestsWithProgress] = useState<QuestWithQuestProgress[]>([])
  const [showAllQuests, setShowAllQuests] = useState(false)
  const [groupSettings, setGroupSettings] = useState<GroupSetting[]>([])
  const [showPopupQuest, setShowPopupQuest] = useState(false)
  const [popupQuestContent, setPopupQuestContent] = useState<React.ReactNode>(undefined)
  const [popupTitle, setPopupTitle] = useState('')
  if(!character || !questGroups || !quests){
    return null
  }

  const dataRef = useRef({
    character,
    questGroups,
    quests,
    characterQuestProgressItems,
    characterInventories
  });

  useEffect(() => {
    dataRef.current = {
      character,
      questGroups,
      quests,
      characterQuestProgressItems,
      characterInventories
    };
  }, [character, questGroups, quests, characterQuestProgressItems, characterInventories]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const {
        character,
        questGroups,
        quests,
        characterQuestProgressItems,
        characterInventories
      } = dataRef.current;

      if (!character || !questGroups || !quests) return;

      const questService = new QuestService();
      const progress = await questService.getQuestsWithQuestProgress(
        character,
        quests,
        questGroups,
        characterQuestProgressItems,
        characterInventories
      )
      setQuestsWithProgress(progress)
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleGroupQuests = useCallback((groupId: string, value: boolean) => {
    const newGroupSettings: GroupSetting[] = []
    const exists = groupSettings.find(gs => gs.groupId === groupId)
    if(!exists){
      newGroupSettings.push({
        groupId,
        show: value
      })
    } else {
      exists.show = value
      newGroupSettings.push(exists)
    }

    for(const groupSetting of groupSettings){
      newGroupSettings.push(groupSetting)
    }
    setGroupSettings(newGroupSettings)
  }, [groupSettings])

  const handleShowPopup = useCallback((popupType: 'quest' | 'quest-group', relatedId: string) => {

    if(popupType === 'quest'){
      const quest = questsWithProgress.find(qwp => qwp.quest?.id === relatedId) as QuestWithQuestProgress
      setPopupQuestContent(
        <CharacterQuest showActions={false} handleShowPopup={() => {}} questWithProgress={quest} />
      )
      setPopupTitle(quest.quest?.title)
    } else if(popupType === 'quest-group'){
      const relatedQuests = questsWithProgress.filter(qwp => qwp.questGroup?.id === relatedId)
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
            return <CharacterQuest handleShowPopup={() => {}} questWithProgress={rq} />
          })}
        </CustomContainer>
        setPopupQuestContent(content)
        setPopupTitle(relatedQuests[0].questGroup?.title as string)
      }
    }
    setShowPopupQuest(true)
  }, [questsWithProgress])

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

    <CustomContainer
      id={id}
      expandable={true}
      expanded={expanded}
      isChildCustomContainer={false}
      title='Quests'
      description=''
    >
      <div className='quest-groups'>
        {questGroups.map(qg => {
          const relatedQuests = questsWithProgress.filter(
            qwp => qwp?.questGroup?.id === qg.id
          )

          const completedAmount = relatedQuests.filter(
            rq => rq.questProgress?.status === 'complete'
          )

          return (
            <div key={qg.id} className='quest-group'>
              <CustomContainer
                expandable={true}
                expanded={expanded}
                isChildCustomContainer={true}
                title={
                  <div
                    className='quest-group-title'
                    onClick={() => handleShowPopup('quest-group', qg.id)}
                  >
                    {qg?.title}
                  </div>
                }
                description={qg?.description}
                headerLeft={
                  <span>
                    {completedAmount.length} / {relatedQuests.length}
                  </span>
                }
              >
                <div className='quest-group-quest-list'>
                  {relatedQuests?.map(q => (
                    <CharacterQuest
                      key={q.quest.id}
                      handleShowPopup={handleShowPopup}
                      questWithProgress={q}
                    />
                  ))}
                </div>
              </CustomContainer>
            </div>
          )
        })}
      </div>
    </CustomContainer>
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