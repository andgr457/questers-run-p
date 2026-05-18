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
    <div className={`confirm-modal ${props.isYesNo === true ? 'confirm-yes-no' : 'confirm-ok'}`}>
      <div className='confirm-description' style={{textAlign: 'center'}}>
        {props.message}
      </div>
      {!props.content ? <></> : <div className='confirm-content'>{props.content}</div>}
      <div className='modal-actions'>

        {props.isYesNo === true && <>
          <button 
            className='success'
            onClick={props.onConfirm}
            style={{width: '10%', textAlign: 'center'}}
          >
            Yes
          </button>
          <button 
            className='danger'
            onClick={props.onClose}
            style={{width: '10%', textAlign: 'center'}}
          >
            No
          </button>
        </>}
        
        {props.isYesNo === false && < >
          <button 
            onClick={props.onClose}
            className='yellow'
            style={{width: '10%', textAlign: 'center'}}
          >
            OK
          </button>
        </>}
      </div>
    </div>
  </Modal>
}