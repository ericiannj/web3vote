import { useState } from 'react';

import './index.css';
import { CreationModal } from '../CreationModal';
import { VotationModal } from '../VotationModal';
import { BallotsCleaned } from '../../App';
import { LoadingDialog } from '../LoadingDialog';

type VotationContainerProps = {
  allBallots: BallotsCleaned[];
  getAllBallots: () => Promise<void>;
};

export type OperationType = 'delete' | 'disable' | 'vote' | 'create' | undefined;

export const VotationContainer = (props: VotationContainerProps) => {
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState<OperationType>();
  const [selectedBallot, setSelectedBallot] = useState<BallotsCleaned>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const handleCreateOpen = () => setIsCreateOpen(true);
  const handleCreateClose = () => setIsCreateOpen(false);
  const [isVotationOpen, setIsVotationOpen] = useState(false);
  const handleVotationOpen = (ballot: BallotsCleaned | undefined) => {
    setIsVotationOpen(true);
    setSelectedBallot(ballot);
  };
  const handleVotationClose = () => {
    setIsVotationOpen(false);
    setSelectedBallot(undefined);
  };
  const availableBallots = props.allBallots.filter((ballot) => ballot.deleted === false);

  return (
    <div className="votation-container">
      <div className="votation-header">🗳️ Web3Vote</div>
      <div className="votation-list">
        {availableBallots.map((ballot, index) => {
          return (
            <div key={index} className="chip-container" onClick={() => handleVotationOpen(ballot)}>
              <p>{ballot.title}</p>
            </div>
          );
        })}
      </div>
      <div className="button-container">
        <button className="create-button" onClick={handleCreateOpen}>
          Nova votação
        </button>
      </div>
      <VotationModal
        isVotationOpen={isVotationOpen}
        handleClose={handleVotationClose}
        selectedBallot={selectedBallot}
        getAllBallots={props.getAllBallots}
        setLoading={setLoading}
        setOperation={setOperation}
      />
      <CreationModal
        isCreateOpen={isCreateOpen}
        handleClose={handleCreateClose}
        getAllBallots={props.getAllBallots}
        setLoading={setLoading}
        setOperation={setOperation}
      />
      <LoadingDialog loading={loading} operationDesc={operation} />
    </div>
  );
};
