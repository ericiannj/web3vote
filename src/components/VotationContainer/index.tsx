import { useRef, useState } from 'react';
import './index.css';
import { CreationModal } from '../CreationModal';
import { VotationModal } from '../VotationModal';

export const VotationContainer = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const handleCreateOpen = () => setIsCreateOpen(true);
  const handleCreateClose = () => setIsCreateOpen(false);
  const [isVotationOpen, setIsVotationOpen] = useState(false);
  const handleVotationOpen = () => setIsVotationOpen(true);
  const handleVotationClose = () => setIsVotationOpen(false);

  return (
    <div className="votation-container">
      <div className="votation-header">🗳️ Web3Vote</div>
      <div className="votation-list">
        <div className="chip-container" onClick={handleVotationOpen}>
          <p>Título da Votação</p>
        </div>
      </div>
      <div className="button-container">
        <button className="create-button" onClick={handleCreateOpen}>
          Nova votação
        </button>
      </div>

      <VotationModal isVotationOpen={isVotationOpen} handleClose={handleVotationClose} />
      <CreationModal isCreateOpen={isCreateOpen} handleClose={handleCreateClose} />
    </div>
  );
};
