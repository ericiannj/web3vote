import { useState } from 'react';

import { CreationModal } from './CreationModal';
import { VotationModal } from './VotationModal';

import { LoadingModal } from './LoadingModal';
import { truncateText } from '../utils';
import { BallotsCleaned } from '../contract-types';

type VotationContainerProps = {
  currentAccount: string;
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
    <div className="flex flex-col p-6 bg-lightSky rounded-lg h-3/5 min-w-[960px] w-3/4">
      <div className="flex justify-center text-2xl text-strongStone font-bold mb-6 ">🗳️ Web3Vote</div>
      <div className="h-4/5 overflow-auto">
        <div className="flex flex-row flex-wrap justify-between">
          {availableBallots.map((ballot, index) => {
            return (
              <div
                key={index}
                className="w-[28%] h-10 p-3 border-2 my-2 border-strongStone rounded-lg cursor-pointer 
             hover:border-strongPurple hover:text-strongPurple"
                onClick={() => handleVotationOpen(ballot)}
              >
                <div className="flex items-center h-full shrink-0">
                  <p className="text-center w-full text-sm">{truncateText(ballot.title, 35)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center mt-3">
        <button
          className="cursor-pointer mt-2 px-4 py-2 rounded-md bg-strongPurple text-lightSky max-w-max hover:bg-hoverPurple"
          onClick={handleCreateOpen}
        >
          Nova votação
        </button>
      </div>
      <VotationModal
        currentAccount={props.currentAccount}
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
