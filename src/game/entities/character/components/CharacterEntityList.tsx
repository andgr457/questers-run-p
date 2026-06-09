import type { CharacterEntity } from '../types/Character.types'
import CharacterEntityComp from './CharacterEntity'

type Props = {
  characters: CharacterEntity[]
}

export default function CharacterEntityListComp({
  characters,
}: Props) {

  return (
    <div>

      {characters.map(character => (
        <CharacterEntityComp
          key={character.id}
          character={character}
        />
      ))}

    </div>
  )
}