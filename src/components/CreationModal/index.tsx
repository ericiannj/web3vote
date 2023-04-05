import './index.css';
import classNames from 'classnames';
import { ethers } from 'ethers';
import ballotAbi from '../../utils/BallotPortal.json';
import { useState } from 'react';

type CreationModalProps = {
  isCreateOpen: boolean;
  handleClose: () => void;
  getAllBallots: () => Promise<void>;
};

type Ballot = {
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
  const { isCreateOpen, handleClose, getAllBallots } = props;
  const [newBallot, setNewballot] = useState<Ballot>(initialNewBallot);
  const ballotContractAddress = import.meta.env.VITE_BALLOT_CONTRACT_ADDRESS;
  const ballotABI = ballotAbi.abi;

  const handleTitleChange = (value: Ballot['title']) => {
    setNewballot({ ...newBallot, title: value });
  };

  const handleDescriptionChange = (value: Ballot['description']) => {
    setNewballot({ ...newBallot, description: value });
  };

  const handleProposalsChange = (index: number, value: string) => {
    const newProposalValues = [...newBallot.proposals];
    newProposalValues[index] = value;
    setNewballot({ ...newBallot, proposals: newProposalValues });
  };

  const handleSubmit = () => {
    try {
      if (newBallot !== undefined) createBallot(newBallot);
    } catch {
      console.log('Falha na criação da Votação');
    } finally {
      handleClose();
      getAllBallots();
    }
  };

  const createBallot = async (newBallot: Ballot) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ballotPortalContract = new ethers.Contract(ballotContractAddress, ballotABI, signer);

        let countBallots = await ballotPortalContract.getTotalBallots();
        console.log('Recovering the number of ballots...', countBallots.toNumber());

        const createBallotTxn = await ballotPortalContract.createBallot(
          newBallot.title,
          newBallot.description,
          newBallot.proposals,
        );
        console.log('Mining...', createBallotTxn.hash);

        await createBallotTxn.wait();
        console.log('Mined -- ', createBallotTxn.hash);

        countBallots = await ballotPortalContract.getTotalBallots();
        console.log('Total of ballots...', countBallots.toNumber());
      } else {
        console.log('Ethereum Object not found!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classNames('modal', [{ show: isCreateOpen === true }])}>
      <div className={'modal-container'}>
        <div className={'header'}>
          <p>Nova votação</p>
          <button onClick={handleClose}>Fechar</button>
        </div>
        <div className={'info-container'}>
          <input placeholder="Título" value={newBallot.title} onChange={(ev) => handleTitleChange(ev.target.value)} />
          <br />
          <input
            placeholder="Descrição"
            value={newBallot.description}
            onChange={(ev) => handleDescriptionChange(ev.target.value)}
          />
          <div className="options-container">
            <input
              placeholder="Proposta 1"
              value={newBallot.proposals[0]}
              onChange={(ev) => handleProposalsChange(0, ev.target.value)}
            />
            <input
              placeholder="Proposta 2"
              value={newBallot.proposals[1]}
              onChange={(ev) => handleProposalsChange(1, ev.target.value)}
            />
            <input
              placeholder="Proposta 3"
              value={newBallot.proposals[2]}
              onChange={(ev) => handleProposalsChange(2, ev.target.value)}
            />
            <input
              placeholder="Proposta 4"
              value={newBallot.proposals[3]}
              onChange={(ev) => handleProposalsChange(3, ev.target.value)}
            />
          </div>
          <button className="createButton" onClick={handleSubmit}>
            Criar votação
          </button>
        </div>
      </div>
    </div>
  );
};
