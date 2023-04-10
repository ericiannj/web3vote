import './index.css';
import classNames from 'classnames';
import { ethers } from 'ethers';
import ballotAbi from '../../utils/BallotPortal.json';
import { useState } from 'react';
import { Proposal } from '../../App';

type CreationModalProps = {
  isCreateOpen: boolean;
  handleClose: () => void;
  getAllBallots: () => Promise<void>;
  setLoading: (loading: boolean) => void;
};

type NewBallot = {
  title: string;
  description: string;
  proposals: Proposal[];
};

const initialNewProposal = {
  id: undefined,
  text: '',
  votes: 0,
};

const initialNewBallot = {
  title: '',
  description: '',
  proposals: [initialNewProposal, initialNewProposal, initialNewProposal, initialNewProposal],
};

export const CreationModal = (props: CreationModalProps) => {
  const { isCreateOpen, handleClose, getAllBallots, setLoading } = props;
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
    const newProposalValues = [...newBallot.proposals];
    newProposalValues[index].text = value;
    newProposalValues[index].id = index;
    setNewballot({ ...newBallot, proposals: newProposalValues });
  };

  const handleCreate = () => {
    try {
      if (newBallot !== undefined) createBallot(newBallot);
    } catch {
      console.log('Falha na criação da Votação');
    } finally {
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
              value={newBallot.proposals[0].text}
              onChange={(ev) => handleProposalsChange(0, ev.target.value)}
            />
            <input
              placeholder="Proposta 2"
              value={newBallot.proposals[1].text}
              onChange={(ev) => handleProposalsChange(1, ev.target.value)}
            />
            <input
              placeholder="Proposta 3"
              value={newBallot.proposals[2].text}
              onChange={(ev) => handleProposalsChange(2, ev.target.value)}
            />
            <input
              placeholder="Proposta 4"
              value={newBallot.proposals[3].text}
              onChange={(ev) => handleProposalsChange(3, ev.target.value)}
            />
          </div>
          <button className="createButton" onClick={handleCreate}>
            Criar votação
          </button>
        </div>
      </div>
    </div>
  );
};
