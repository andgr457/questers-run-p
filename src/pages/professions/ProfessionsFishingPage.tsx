import { useEffect } from 'react';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import '../../components/professions/Professions.css'
import ProfessionItemsList from '../../components/professions/ProfessionItemsList';
import type { Stat } from '../../interfaces/characters/Character.types';
import CharacterInfoMiniStatCard from '../../components/characters/CharacterInfoMiniStatCard';

interface ProfessionFishingPageProps extends AppProperties {

}

export default function ProfessionFishingPage(props: ProfessionFishingPageProps){
  const {
    character,
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
    professionStatCard={<div style={{background: 'var(--bg-dark)', color: 'var(--text)', letterSpacing: '1px'}}>
      <CharacterInfoMiniStatCard
        statItem={character?.professions.fishing as Stat}
        statType='attribute'
      />
    </div>}
  />
}