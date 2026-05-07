import { DateTime } from 'luxon';
import type { Character } from '../../../interfaces/characters/Character.types';
import type { CharacterHistory } from '../../../interfaces/history/History.types';
import './CharacterHistory.css'
import CustomContainer from '../CustomContainer';
import CustomContainerItem from '../CustomContainerItem';

interface CharacterHistoryComponentProps{
  history: CharacterHistory[]
  character: Character
}

export default function CharacterHistoryComponent(props: CharacterHistoryComponentProps) {
  if(!props.history || !props.character){
    return null
  }

  const sortedHistoryDesc = props.history.sort((a, b) => 
    DateTime.fromISO(a.date).toMillis() - DateTime.fromISO(b.date).toMillis()
  )
  const groupedDates: {date: string, historyItems: CharacterHistory[]}[] = []

  sortedHistoryDesc.forEach(h => {
    const yearMonthDay = DateTime.fromISO(h.date).toLocal().toFormat('yyyy-MM-dd')
    const found = groupedDates.find(d => d.date === yearMonthDay)
    if(!found){
      groupedDates.push({
        date: yearMonthDay,
        historyItems: []
      })
    } else {
      found.historyItems.push(h)
    }
  })

  return <div id='tutorial-history'>
    <CustomContainer
      expandable={true}
      isChildCustomContainer={false}
      title={'History'}
      description='View what happened to tracked activities and actions.'
    >
      {groupedDates.map(gd => {
        return <CustomContainer
          expandable={true}
          isChildCustomContainer={true}
          title={gd.date}
          headerLeft={gd.historyItems.length}
        >
          {gd.historyItems.map(h => {
            return <CustomContainerItem>
              <div>
                {DateTime.fromISO(h.date).toLocal().toLocaleString(DateTime.DATE_SHORT)}
              </div>
              <div>
                {h?.description}
              </div>
            </CustomContainerItem>
          })}
        </CustomContainer>
      })}
    </CustomContainer>
    
  </div>
  
}