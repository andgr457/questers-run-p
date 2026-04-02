import React from "react";
import "./Modal.css";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  backdropHides: boolean
  children: React.ReactNode;
  closeButton?: boolean
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, backdropHides, closeButton }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => {
      if(backdropHides === true){
        onClose()
      }
    }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          {title}

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