import { DateTime } from 'luxon';
import type { Character } from '../../../interfaces/characters/Character.types';
import type { CharacterHistory } from '../../../interfaces/history/History.types';
import './CharacterHistory.css'

interface CharacterHistoryComponentProps{
  history: CharacterHistory[]
  character: Character
}

export default function CharacterHistoryComponent(props: CharacterHistoryComponentProps) {
  if(!props.history || !props.character){
    return null
  }

  return <div className='history-main'>
    <div className='header-2'>
      History
    </div>
    <div className='history-items'>
      {props.history.sort((a, b) => {
        return DateTime.fromISO(b.date).toMillis() - DateTime.fromISO(a.date).toMillis();
      }).map((h) => {
        
        return <div className='history-item'>
          <div className='history-item-header'>
            {DateTime.fromISO(h.date).toLocal().toLocaleString(DateTime.DATE_SHORT)}
          </div>
          <div className='history-description'>
            {h?.description}
          </div>
        </div>
      })}
    </div>
  </div>
}