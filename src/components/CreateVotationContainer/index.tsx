import { useState } from 'react';
import '../../App.css';
import { CreationModal } from '../CreationModal';

export const CreateVotationContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="dataContainer">
      <div className="header">🗳️ Web3Vote</div>
      <button className="waveButton" onClick={handleOpen}>
        Nova votação
      </button>
      <CreationModal isCreateOpen={isOpen} handleClose={handleClose} />
    </div>
  );
};
