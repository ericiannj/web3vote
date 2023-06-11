import { useState } from 'react';

import { CreationModal } from './CreationModal';
import { VotationModal } from './VotationModal';
import { BallotsCleaned } from '../App';
import { LoadingModal } from './LoadingModal';

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
    <div className="flex flex-col p-10 bg-lightSky rounded-lg w-3/4 h-3/5">
      <div className="flex justify-center text-2xl text-strongStone font-bold mb-6 ">🗳️ Web3Vote</div>
      <div className="flex flex-row flex-wrap justify-start mt-4 h-4/5 overflow-auto">
        {availableBallots.map((ballot, index) => {
          return (
            <div
              key={index}
              className="flex justify-center p-3 border-2 mr-12 border-strongStone w-1/5 h-1/6 rounded-lg cursor-pointer 
               hover:border-strongPurple hover:text-strongPurple"
              onClick={() => handleVotationOpen(ballot)}
            >
              <p>{ballot.title}</p>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="cursor-pointer mt-4 px-4 py-2 rounded-md bg-strongPurple text-lightSky max-w-max hover:bg-hoverPurple"
          onClick={handleCreateOpen}
        >
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
      <LoadingModal loading={loading} operationDesc={operation} />
    </div>
  );
};
