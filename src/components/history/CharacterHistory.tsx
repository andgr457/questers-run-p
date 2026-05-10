import { DateTime } from 'luxon';
import type { Character } from '../../interfaces/characters/Character.types';
import type { CharacterHistory } from '../../interfaces/history/History.types';
import './CharacterHistory.css'
import CustomContainer from '../CustomContainer';
import CustomContainerItem from '../CustomContainerItem';

interface CharacterHistoryComponentProps{
  id?: string
  history: CharacterHistory[]
  character: Character
  expanded: boolean
}

export default function CharacterHistoryComponent(props: CharacterHistoryComponentProps) {
  const {
    id,
    history,
    character,
    expanded
  } = props

  const sortedHistoryDesc = props.history.sort((a, b) => 
    DateTime.fromISO(a.date).toMillis() - DateTime.fromISO(b.date).toMillis()
  )
  const groupedDates: {date: string, historyItems: CharacterHistory[]}[] = []

  sortedHistoryDesc?.forEach(h => {
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
 
  if(!history || !character){
    return null
  }

  return <div id='tutorial-history'>
    <CustomContainer
      id={id}
      expandable={true}
      expanded={expanded}
      isChildCustomContainer={false}
      title={'History'}
      description='View preview inventory transactions, achievements, items gained/sold, and much more.'
    >
      {groupedDates.map((gd, gdi) => {
        return <CustomContainer
          expandable={true}
          expanded={expanded}
          isChildCustomContainer={true}
          title={gd.date}
          headerLeft={gd.historyItems.length}
        >
          {gd.historyItems.map((h, i) => {
            return <div id={`hi__${gdi}__${i}`}>
              <CustomContainerItem>
                <div>
                  {DateTime.fromISO(h.date).toLocal().toLocaleString(DateTime.DATE_SHORT)}
                </div>
                <div>
                  {h?.description}
                </div>
              </CustomContainerItem>
            </div>
          })}
        </CustomContainer>
      })}
    </CustomContainer>
    
  </div>
  
}