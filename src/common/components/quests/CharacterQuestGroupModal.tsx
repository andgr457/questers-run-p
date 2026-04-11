import Modal, { type ModalProps } from '../modals/Modal';

interface CharacterQuestGroupProps extends ModalProps {

}
export default function CharacterQuestGroup(props: CharacterQuestGroupProps){

  return <Modal
    backdropHides={props.backdropHides}
    isOpen={props.isOpen}
    onClose={props.onClose}
    closeButton={props.closeButton}
    rightTitle={props.rightTitle}
    leftTitle={props.leftTitle}
    leftChildren={props.leftChildren}
  >
    <div>
      
    </div>
  </Modal>
}