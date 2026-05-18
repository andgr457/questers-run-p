import { useEffect } from 'react';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import ProfessionItemsList from '../../components/professions/ProfessionItemsList';

interface ProfessionGatheringPageProps extends AppProperties {

}

export default function ProfessionGatheringPage(props: ProfessionGatheringPageProps){
  const {
    items,
    setLocation,
  } = props

  useEffect(() => {
    setLocation?.('Gathering')
  },[])

  const professionItems = items?.filter(i => i.profession?.type === 'gathering') ?? []

  return <ProfessionItemsList 
    {...props}
    professionItems={professionItems}
  />
}