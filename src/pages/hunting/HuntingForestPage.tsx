import { useEffect } from 'react';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import HuntingMobsList from '../../components/hunting/HuntingMobsList';

interface ProfessionGatheringPageProps extends AppProperties {

}

export default function HuntingForestPage(props: ProfessionGatheringPageProps){
  const {
    mobs,
    setLocation,
  } = props

  useEffect(() => {
    setLocation?.('Gathering')
  },[])

  const relatedMobs = mobs?.filter(m => m.location === 'forest') ?? []

  return <HuntingMobsList 
    {...props}
    huntingMobs={relatedMobs}
  />
}