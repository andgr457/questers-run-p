import type { QuestEntity } from '../../types/QuestEntity.types';
import QuestListItem from './QuestListItem';

export interface QuestAction {
  title: string
  icon: string
  isTutorial?: boolean
  isDisabled?: boolean
  fn?: (entity: QuestEntity) => void
}

export interface QuestWithActions {
  quest: QuestEntity
  actions: QuestAction[]
}

interface Props {
  questsWithActions: QuestWithActions[]
}

export default function QuestList(props: Props) {
  const {
    questsWithActions,
  } = props

  return <div>
    
    {questsWithActions.map(q => {

      return <QuestListItem questWithActions={q} />
    })}
  </div>
}
