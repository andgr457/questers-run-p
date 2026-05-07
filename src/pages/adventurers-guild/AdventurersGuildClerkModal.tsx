import AdventurersGuildClerkAssist from '../../common/components/adventurers-guild/AdventurersGuildClerkAssist';
import AdventurersGuildClerkJoin from '../../common/components/adventurers-guild/AdventurersGuildClerkJoin';
import { AnimatedText } from '../../common/components/AnimatedText';
import type { ModalProps } from '../../common/components/modals/Modal';
import Modal from '../../common/components/modals/Modal';
import { GuildRanks, type Character } from '../../interfaces/characters/Character.types';
import './AdventurersGuild.css'

interface AdventurersGuildClerkModalProps extends ModalProps {
  onJoin: () => void
  character: Character
}

export default function AdventurersGuildClerkModal(props: AdventurersGuildClerkModalProps){

  let content
  if(props.character.guildRank === GuildRanks.None){
    content = <AdventurersGuildClerkJoin onJoin={props.onJoin} />
  } else {
    content = <AdventurersGuildClerkAssist />
  }

  return <Modal
    backdropHides={props.backdropHides}
    isOpen={props.isOpen}
    onClose={props.onClose}
    closeButton={props.closeButton}
    rightTitle={`${props.rightTitle}: Lithos`}
  >
    <div className='adv-g-clerk-content'>
        {content}
    </div>
  </Modal>
}
