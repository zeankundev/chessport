import React, { useState } from 'react';

interface ModalProps {
  title?: string,
  children: React.ReactNode;
  onClose?: () => void; // Make onClose optional
}

const Modal: React.FC<ModalProps> = ({title, children, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const close = () => {
    setIsModalOpen(false);
    if (onClose) {
      onClose(); // Call onClose if it is provided
    }
  };

  // If the modal is closed, don't render anything
  if (!isModalOpen) {
    return null;
  }

  return (
    <div className='modal'>
        <div className="component-modal">
        <div className="modal-content">
            <h2>{title}</h2>
            {children}
        </div>
        <div className="modal-close" onClick={close}>
            OK
        </div>
        </div>
    </div>
  );
};

export default Modal;
