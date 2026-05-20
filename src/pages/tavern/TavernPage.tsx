import type { AppProperties } from '../../interfaces/AppProperties.types';
import type { TavernListItem } from '../../interfaces/tavern/Tavern.types';
import TavernItemsList from '../../components/tavern/TavernItemsList';
import { useEffect } from 'react';

interface TavernPageProps extends AppProperties {

}

export default function TavernPage(props: TavernPageProps) {
  const {
    setLocation
  } = props

  useEffect(() => {
    setLocation?.('Tavern')
  },[])

  const tavernItems: TavernListItem[] = [
    {
      id: 'tvn_eat_meal',
      title: 'Eat a Meal',
      description: 'Eat a meal at the tavern for a cost.',
      requirements: {
        gold: 5,
        timeInSeconds: 5
      },
      rewards: {
        statsModifyPercent: 20
      }
    },
    {
      id: 'tvn_rent_room',
      title: 'Rent a Room',
      description: 'Sleep in a rented room with a comfortable bed to fully replenish all stats.',
      requirements: {
        gold: 20,
        timeInSeconds: 10
      },
      rewards: {
        statsModifyPercent: 100
      }
    },
    {
      id: 'tvn_sleep_outside',
      title: 'Sleep in the Back Alley',
      description: 'Sleep outside to save money. However, you gain less stats replenishment.',
      requirements: {
        gold: 0,
        timeInSeconds: 25
      },
      rewards: {
        statsModifyPercent: 50
      }
    }
    
  ]

  return <div>
    <div className='character-section-title'>
      <div className='page-header-banner'>
        <div className='page-header-title'>
          TAVERN
        </div>
      </div>
    </div>
    <TavernItemsList 
      {...props}
      tavernItems={tavernItems}
    />
  </div>
}