import { useEffect, useRef, useState } from 'react';
import type { Character } from '../../../interfaces/characters/Character.types';
import type { Quest, QuestGroup, QuestProgress } from '../../../interfaces/quests/Quests.types';
import CustomContainer from '../CustomContainer';
import CustomContainerItem from '../CustomContainerItem';
import CharacterQuest from './CharacterQuest';
import type { QuestWithQuestProgress } from './CharacterQuests';
import type { Inventory } from '../../../interfaces/inventories/Inventory.types';
import { QuestService } from '../../../services/quests/QuestService';

interface CharacterQuestCurrentProps {
  id?: string
  characterQuestProgressItems: QuestProgress[]
  character: Character
  quests: Quest[]
  questGroups: QuestGroup[]
  characterInventories: Inventory[]
}

export default function CharacterQuestCurrent(props: CharacterQuestCurrentProps){
  const [questsWithProgress, setQuestsWithProgress] = useState<QuestWithQuestProgress[]>([])
  
  const {
    id,
    characterQuestProgressItems,
    character,
    questGroups,
    quests,
    characterInventories
  } = props

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
  
  
  const currentQuestProgress = questsWithProgress.find(qwp => qwp.questProgress)
  return <div>
  <CustomContainer
    id={id}
    expandable={true}
    expanded={true}
    title='Current Quest'
    description=''
    isChildCustomContainer={false}
  >
    {currentQuestProgress && <CharacterQuest showActions={false} handleShowPopup={() => {}} questWithProgress={currentQuestProgress} />}
    {!currentQuestProgress && <CustomContainerItem>{character?.name} is not currently on a quest.</CustomContainerItem>}
  </CustomContainer>
</div>
}