import React from "react";
import "./Modal.css";

export interface ModalProps {
  isOpen: boolean;
  backdropHides: boolean
  onClose: () => void;
  closeButton?: boolean
  rightTitle?: React.ReactNode;
  children: React.ReactNode;
  leftTitle?: React.ReactNode
  leftChildren?: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ 
  leftTitle, 
  leftChildren, 
  isOpen, 
  onClose, 
  rightTitle, 
  children, 
  backdropHides, 
  closeButton 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => {
      if(backdropHides === true){
        onClose()
      }
    }}>
      {leftChildren && <div
        className="modal-container-info"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          {leftTitle}
        </div>

        <div className="modal-body">{leftChildren}</div>
      </div>}
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          {rightTitle}

          {closeButton === true && <button className="modal-close" onClick={onClose}>
            ✕
          </button>}
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
    
  );
};

export default Modal;