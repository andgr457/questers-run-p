import React from "react";
import styles from "./GameModalFull.module.css";

export interface ModalProps {
  isOpen: boolean;
  backdropHides: boolean
  onClose: () => void;
  closeButton?: boolean
  title?: React.ReactNode;
  children: React.ReactNode;
}

const GameModalFull: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  backdropHides, 
  closeButton,
  title = '',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={styles.gameModalBackdrop}
      onClick={() => {
        if (backdropHides === true) {
          onClose()
        }
      }}
    >
      <div
        className={styles.gameModalLayout}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.gameModalContainer}>
          <div className={styles.gameModalHeader}>
            {title}

            {closeButton === true && (
              <button className={styles.gameModalClose} 
                onClick={onClose}>
                ✕
              </button>
            )}
          </div>

          <div className={styles.gameModalBody}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
};

export default GameModalFull;