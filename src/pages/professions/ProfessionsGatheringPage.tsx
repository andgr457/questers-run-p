import { useEffect } from 'react';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import { PROFESSION_GATHERING } from '../../data/items/professions/Profession.Gathering.data';
import '../../components/professions/Professions.css'
import ProfessionItemsList from '../../components/professions/ProfessionItemsList';
import CharacterStatCard from '../../components/characters/CharacterStatCard';
import type { Stat } from '../../interfaces/characters/Character.types';

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

  const gatheringItems = items?.filter(i => i.profession === PROFESSION_GATHERING.type) ?? []

  return <ProfessionItemsList 
    {...props}
    professionItems={gatheringItems}
    professionStatCard={<div style={{background: 'var(--bg-dark)'}}>
      <CharacterStatCard
        statItem={character?.professions.gathering as Stat}
        statType='attribute'
      />
    </div>}
  />
}