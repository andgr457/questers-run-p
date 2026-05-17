import { useEffect } from 'react';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import ProfessionItemsList from '../../components/professions/ProfessionItemsList';
import type { Stat } from '../../interfaces/characters/Character.types';
import CharacterInfoMiniStatCard from '../../components/characters/CharacterInfoMiniStatCard';

interface ProfessionGatheringPageProps extends AppProperties {

}

export default function ProfessionGatheringPage(props: ProfessionGatheringPageProps){
  const {
    character,
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
    professionStatCard={<div style={{background: 'var(--bg-dark)', color: 'var(--text)', letterSpacing: '1px'}}>
      <CharacterInfoMiniStatCard
        statItem={character?.professions.gathering as Stat}
        statType='attribute'
      />
    </div>}
  />
}