import { useEffect } from 'react';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import ProfessionItemsList from '../../components/professions/ProfessionItemsList';

interface ProfessionFishingPageProps extends AppProperties {

}

export default function ProfessionFishingPage(props: ProfessionFishingPageProps){
  const {
    items,
    setLocation,
  } = props

  useEffect(() => {
    setLocation?.('Fishing')
  },[])

  const professionItems = items?.filter(i => i.profession?.type === 'fishing') ?? []

  return <ProfessionItemsList 
    {...props}
    professionItems={professionItems}
  />
}