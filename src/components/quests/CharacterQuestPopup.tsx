import Modal, { type ModalProps } from '../modals/Modal';

interface CharacterQuestGroupProps extends ModalProps {
  children: React.ReactNode
}
export default function CharacterQuestPopup(props: CharacterQuestGroupProps){

  return <Modal
    backdropHides={props.backdropHides}
    isOpen={props.isOpen}
    onClose={props.onClose}
    closeButton={props.closeButton}
    rightTitle={props.rightTitle}
    leftTitle={props.leftTitle}
    leftChildren={props.leftChildren}
  >
    <div className='quest-popup-content'>
      {props.children}
    </div>
  </Modal>
}