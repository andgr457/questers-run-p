import { useManagedCharacter } from '../../../engine/character/hooks/useManagedCharacters';
import { eventBus } from '../../../engine/event/EventBus';
import { getCharacterGold } from '../../../entity/character/utils/Character.utils';
import GoldDetail from '../../../ui/gold/GoldDetail';
import PopUpModal from '../../../ui/modal/pop-up/PopUpModal';
import { formatPrimitiveValueToString } from '../../utils/Game.utils';

export default function CharacterUpgradeList() {
  const {managedCharacter} = useManagedCharacter()

  if(!managedCharacter) return null
  return <PopUpModal
    onClose={() => {
      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'world:mode:change',
        meta: {
          worldMode: 'world'
        }
      })
    }}
    show={true}
    title={`${managedCharacter.name} Upgrades`}
  >
    <div>
      <GoldDetail gold={getCharacterGold(managedCharacter.id)} />
    </div>
  </PopUpModal>
}