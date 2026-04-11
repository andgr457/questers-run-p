import { createContext, useContext, useState, type ReactNode } from "react";
import ConfirmModal from '../common/components/modals/ConfirmModal';

interface ShowConfirmProps {
  message: string
  title: string
  isYesNo: boolean
}

interface ConfirmContextType {
  showConfirm: (props: ShowConfirmProps) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{
    isOpen: boolean;
    message: string;
    title: string;
    isYesNo: boolean
    resolve?: (value: boolean) => void;
  }>({ isOpen: false, message: "", title: "", isYesNo: true });

  const showConfirm = (props: ShowConfirmProps): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ isOpen: true, message: props.message, title: props.title, isYesNo: props.isYesNo,  resolve });
    });
  };

  const handleConfirm = () => {
    state.resolve?.(true);
    setState({ ...state, isOpen: false });
  };

  const handleClose = () => {
    state.resolve?.(false);
    setState({ ...state, isOpen: false });
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      <ConfirmModal
        showConfirmModal={state.isOpen}
        title={state.title}
        message={state.message}
        onConfirm={handleConfirm}
        onClose={handleClose}
        isYesNo={state.isYesNo ?? true}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used inside ConfirmProvider");
  return context;
};

export const CONFIRM_BUTTON_VARIANTS = {
  YES_NO: true,
  OK: false
}