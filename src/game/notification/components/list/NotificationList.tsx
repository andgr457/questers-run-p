import { useState } from 'react';
import type { SortDirection } from '../../../types/Game.types';
import GamePanel from '../../../../ui/panel/GamePanel';
import { useNotifications } from '../../../../engine/notification/hooks/useNotifications';
import NotificationListItem from './NotificationListItem';

type FilterView = 'all' | 'read' | 'unread'

export default function NotificationList(){
  const [filterView, setFilterView] = useState<FilterView>('unread')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const {notifications} = useNotifications()
  
  const read = notifications.filter(h => h.viewed === true)
  const unread = notifications.filter(h => h.viewed === false)
  const filtered = filterView === 'all' ? notifications : 
    filterView === 'read' ? read : 
    filterView === 'unread' ? unread : []

  const sorted = filtered.sort((a, b) => {
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

      <div>
        {sorted.length === 0 && <div className='event-history-list-no-results'>
          EMPTY  
        </div>}
        {sorted.map(h => {

          return <NotificationListItem entity={h} />
          
          // <div className='event-history-list-item-wrapper'>
          //   <div className='event-history-list-item-title'>
          //     {h.title}
          //   </div>
          //   <div className='event-history-list-item-description'>
          //     {h.description}
          //   </div>
          //   <div className='event-history-list-item-date'>
          //     {formatDateFromMillis(h.date)}
          //   </div>
          //   <div>
          //     {!h.viewed && <button
          //       className='button dark'
          //       onClick={() => {
          //         notificationRuntimeService.markViewed(h.id)
          //       }}
          //     >
          //       Mark Viewed
          //     </button>}
          //   </div>
          // </div>
        })}
        
      </div>
    </div>
  </GamePanel>
}