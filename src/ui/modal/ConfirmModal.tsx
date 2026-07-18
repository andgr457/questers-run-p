import Modal from './Modal'

interface ConfirmModalProps {
  showConfirmModal: boolean
  title: string
  message: string
  isYesNo: boolean
  onClose: () => void
  onConfirm: () => void
  content?: React.ReactNode
}

export default function ConfirmModal(props: ConfirmModalProps) {

  return <Modal
    isOpen={props.showConfirmModal}
    backdropHides={true}
    onClose={props.onClose}
    rightTitle={props.title}
  >
    <div className={`modal-content`}>
      <div className='modal-description'>
        {props.message}
      </div>
      {!props.content ? <></> : <div className='confirm-content'>{props.content}</div>}
      <div className='modal-actions'>

        {props.isYesNo === true && <>
          <button 
            className='button success'
            onClick={props.onConfirm}
            
          >
            Yes
          </button>
          <button 
            className='button danger'
            onClick={props.onClose}
            
          >
            No
          </button>
        </>}
        
        {props.isYesNo === false && < >
          <button 
            onClick={props.onClose}
            className='button dark'
            style={{width: '10%', textAlign: 'center'}}
          >
            OK
          </button>
        </>}
      </div>
    </div>
  </Modal>
}