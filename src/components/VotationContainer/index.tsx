import { useState } from 'react';

import './index.css';
import { CreationModal } from '../CreationModal';
import { VotationModal } from '../VotationModal';
import { BallotsCleaned } from '../../App';

type VotationContainerProps = {
  allBallots: BallotsCleaned[];
  getAllBallots: () => Promise<void>;
};

export const VotationContainer = (props: VotationContainerProps) => {
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
        {props.allBallots.map((ballot, index) => {
          return (
            <div key={index} className="chip-container" onClick={handleVotationOpen}>
              <p>{ballot.title}</p>
            </div>
          );
        })}
      </div>
      {/* <div key={index} className="chip-container" onClick={handleVotationOpen}>
              <p>Título da Votação</p>
            </div> */}
      <div className="button-container">
        <button className="create-button" onClick={handleCreateOpen}>
          Nova votação
        </button>
      </div>

      <VotationModal isVotationOpen={isVotationOpen} handleClose={handleVotationClose} />
      <CreationModal isCreateOpen={isCreateOpen} handleClose={handleCreateClose} getAllBallots={props.getAllBallots} />
    </div>
  );
};
