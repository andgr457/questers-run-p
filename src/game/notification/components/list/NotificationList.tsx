import { useEffect, useState } from 'react';
import { eventBus } from '../../../../engine/event/EventBus';
import { eventHistoryRuntimeService } from '../../../../engine/event/EventHistoryRuntimeService';
import { formatDateFromMillis } from '../../../../engine/clock/utils/formatTimeRemaining';
import type { SortDirection } from '../../../types/Game.types';
import GamePanel from '../../../../ui/panel/GamePanel';

type FilterView = 'all' | 'read' | 'unread'

export default function NotificationList(){
  const [history, setHistory] = useState(eventHistoryRuntimeService.getHistory())
  const [filterView, setFilterView] = useState<FilterView>('unread')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'event:history:updated'){
        setHistory(eventHistoryRuntimeService.getHistory())
      }
    })
    return unsub
  }, [])

  const read = history.filter(h => h.viewed === true)
  const unread = history.filter(h => h.viewed === false)
  const filteredHistory = filterView === 'all' ? history : 
    filterView === 'read' ? read : 
    filterView === 'unread' ? unread : []

  const historySorted = filteredHistory.sort((a, b) => {
    if(sortDirection === 'desc'){
      return b.date - a.date
    } else {
      return a.date - b.date
    }
  })
  return <GamePanel
    currentScreenName=''
    title='INBOX'
  >
    <div className='event-history-list-wrapper'>
      <div className='filter-list'>
        <div>
          <button 
            className={`button ${filterView === 'all' ? 'selected' : 'dark'}`}
            onClick={() => setFilterView('all')}
          >
            ALL
          </button> 
        </div>
        <div>
          <button 
            className={`button ${filterView === 'unread' ? 'selected' : 'dark'}`}
            onClick={() => setFilterView('unread')}
          >
            UNREAD [ {unread.length} ]
          </button> 
        </div>
        <div>
          <button 
            className={`button ${filterView === 'read' ? 'selected' : 'dark'}`}
            onClick={() => setFilterView('read')}
          >
            READ
          </button> 
        </div>
        <div>
          <button 
            className={`button selected`}
            onClick={() => {
              if(sortDirection === 'asc'){
                setSortDirection('desc')
              } else {
                setSortDirection('asc')
              }
            }}
          >
            {sortDirection.toUpperCase()}
          </button> 
        </div>
      </div>

      <div className='event-history-list'>
        {historySorted.length === 0 && <div className='event-history-list-no-results'>
          EMPTY  
        </div>}
        {historySorted.map(h => {

          return <div className='event-history-list-item-wrapper'>
            <div className='event-history-list-item-title'>
              {h.title}
            </div>
            <div className='event-history-list-item-description'>
              {h.description}
            </div>
            <div className='event-history-list-item-date'>
              {formatDateFromMillis(h.date)}
            </div>
            <div>
              {!h.viewed && <button
                className='button dark'
                onClick={() => {
                  eventHistoryRuntimeService.markViewed(h.id)
                }}
              >
                Mark Viewed
              </button>}
            </div>
          </div>
        })}
        
      </div>
    </div>
  </GamePanel>
}