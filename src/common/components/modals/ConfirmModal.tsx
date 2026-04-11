import Modal from './Modal'

interface ConfirmModalProps {
  showConfirmModal: boolean
  title: string
  message: string
  isYesNo: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmModal(props: ConfirmModalProps) {

  return <Modal
    isOpen={props.showConfirmModal}
    backdropHides={true}
    onClose={props.onClose}
    rightTitle={props.title}
  >
    <div className={props.isYesNo === true ? 'confirm-yes-no' : 'confirm-ok'}>
      <div className='description'>
        {props.message}
      </div>

      {props.isYesNo === true && <div className='flex-wrap gap-1'>
        <button 
          className='button-link'
          onClick={props.onConfirm}
          style={{width: '45%', textAlign: 'center'}}
        >
          Yes
        </button>
        <button 
          className='button-link destructive'
          onClick={props.onClose}
          style={{width: '45%', textAlign: 'center'}}
        >
          No
        </button>
      </div>}
      {props.isYesNo === false && <div>
        <button 
          onClick={props.onClose}
          style={{width: '45%', textAlign: 'center'}}
        >
          OK
        </button>
      </div>}
    </div>
  </Modal>
}