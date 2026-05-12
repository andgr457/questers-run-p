import CustomContainerItem from '../CustomContainerItem';
import CharacterQuest from './CharacterQuest';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import type { Quest } from '../../interfaces/quests/Quests.types';

interface CharacterQuestCurrentProps extends AppProperties {

}

export default function CharacterQuestCurrent(props: CharacterQuestCurrentProps){
  const {
    character,
    characterQuestProgress
  } = props
  return <div>
    {characterQuestProgress && <CharacterQuest questItemClassName='quest-item popup' showActions={true} handleShowPopup={() => {}} {...props} quest={props.characterQuestProgress?.quest as Quest}/>}
    {!characterQuestProgress && <CustomContainerItem>{character?.name} is not currently on a quest.</CustomContainerItem>}
  </div>
}