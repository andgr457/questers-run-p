import { useEffect } from 'react';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import ProfessionItemsList from '../../components/professions/ProfessionItemsList';

interface ProfessionMiningPageProps extends AppProperties {

}

export default function ProfessionMiningPage(props: ProfessionMiningPageProps){
  const {
    items,
    setLocation,
  } = props

  useEffect(() => {
    setLocation?.('Mining')
  },[])

  const professionItems = items?.filter(i => i.profession?.type === 'mining') ?? []

  return <ProfessionItemsList 
    {...props}
    professionItems={professionItems}
  />
}