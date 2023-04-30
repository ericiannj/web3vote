import { ethers } from 'ethers';
import ballotAbi from '../utils/BallotPortal.json';
import { useState } from 'react';
import { OperationType } from './VotationContainer';

type CreationModalProps = {
  isCreateOpen: boolean;
  handleClose: () => void;
  getAllBallots: () => Promise<void>;
  setLoading: (bool: boolean) => void;
  setOperation: (op: OperationType) => void;
};

type NewBallot = {
  title: string;
  description: string;
  proposals: string[];
};

const initialNewBallot = {
  title: '',
  description: '',
  proposals: ['', '', '', ''],
};

export const CreationModal = (props: CreationModalProps) => {
  const { isCreateOpen, handleClose, getAllBallots, setLoading, setOperation } = props;
  const [newBallot, setNewballot] = useState<NewBallot>(initialNewBallot);

  const ballotContractAddress = import.meta.env.VITE_BALLOT_CONTRACT_ADDRESS;
  const ballotABI = ballotAbi.abi;

  const handleTitleChange = (value: NewBallot['title']) => {
    setNewballot({ ...newBallot, title: value });
  };

  const handleDescriptionChange = (value: NewBallot['description']) => {
    setNewballot({ ...newBallot, description: value });
  };

  const handleProposalsChange = (index: number, value: string) => {
    const newProposalValues = newBallot.proposals.map((proposal, i) => {
      if (i === index) {
        return value;
      } else {
        return proposal;
      }
    });
    setNewballot({ ...newBallot, proposals: newProposalValues });
  };

  const handleCreate = () => {
    try {
      if (newBallot !== undefined) {
        createBallot(newBallot);
        handleClose();
      }
    } catch {
      console.log('Falha na criação da Votação');
      handleClose();
    }
  };

  const createBallot = async (newBallot: NewBallot) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ballotPortalContract = new ethers.Contract(ballotContractAddress, ballotABI, signer);

        let countBallots = await ballotPortalContract.getTotalBallots();
        console.log('Recovering the number of ballots...', countBallots.toNumber());

        setLoading(true);
        setOperation('create');
        const createBallotTxn = await ballotPortalContract.createBallot(
          newBallot.title,
          newBallot.description,
          newBallot.proposals,
        );
        console.log('Mining...', createBallotTxn.hash);

        await createBallotTxn.wait();
        console.log('Mined -- ', createBallotTxn.hash);
        setLoading(false);

        countBallots = await ballotPortalContract.getTotalBallots();
        console.log('Total of ballots...', countBallots.toNumber());
        getAllBallots();
        setNewballot(initialNewBallot);
      } else {
        console.log('Ethereum Object not found!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`flex justify-center items-center fixed top-0 left-0 w-full h-full bg-strongStone bg-opacity-50  ${
        isCreateOpen ? '' : 'hidden'
      }`}
    >
      <div className="min-w-2/5 max-w-xl bg-lightSky rounded-lg p-8 mt-32">
        <div className="flex justify-between">
          <p className="text-2xl font-bold mb-4">Nova votação</p>
          <button onClick={handleClose}>Fechar</button>
        </div>
        <div className="mt-3">
          <input
            placeholder="Título"
            className="p-4 border-2 border-strongPurple"
            value={newBallot.title}
            onChange={(ev) => handleTitleChange(ev.target.value)}
          />
          <br />
          <input
            placeholder="Descrição"
            className="p-4 border-2 border-strongPurple"
            value={newBallot.description}
            onChange={(ev) => handleDescriptionChange(ev.target.value)}
          />
          <div className="p-3 bg-strongPurple rounded-r-lg">
            <input
              placeholder="Proposta 1"
              className="p-4 border-2 border-strongPurple"
              value={newBallot.proposals[0]}
              onChange={(ev) => handleProposalsChange(0, ev.target.value)}
            />
            <input
              placeholder="Proposta 2"
              className="p-4 border-2 border-strongPurple"
              value={newBallot.proposals[1]}
              onChange={(ev) => handleProposalsChange(1, ev.target.value)}
            />
            <input
              placeholder="Proposta 3"
              className="p-4 border-2 border-strongPurple"
              value={newBallot.proposals[2]}
              onChange={(ev) => handleProposalsChange(2, ev.target.value)}
            />
            <input
              placeholder="Proposta 4"
              className="p-4 border-2 border-strongPurple"
              value={newBallot.proposals[3]}
              onChange={(ev) => handleProposalsChange(3, ev.target.value)}
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="cursor-pointer px-4 py-2 rounded-md bg-strongPurple text-lightSky max-w-max hover:bg-hoverPurple"
              onClick={handleCreate}
            >
              Criar votação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
