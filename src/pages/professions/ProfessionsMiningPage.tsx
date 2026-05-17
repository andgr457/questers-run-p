import { useEffect } from 'react';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import ProfessionItemsList from '../../components/professions/ProfessionItemsList';
import type { Stat } from '../../interfaces/characters/Character.types';
import CharacterInfoMiniStatCard from '../../components/characters/CharacterInfoMiniStatCard';

interface ProfessionMiningPageProps extends AppProperties {

}

export default function ProfessionMiningPage(props: ProfessionMiningPageProps){
  const {
    character,
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
    professionStatCard={<div style={{background: 'var(--bg-dark)', color: 'var(--text)', letterSpacing: '1px'}}>
      <CharacterInfoMiniStatCard
        statItem={character?.professions.mining as Stat}
        statType='attribute'
      />
    </div>}
  />
}