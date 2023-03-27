import './index.css';
import classNames from 'classnames';
import { ethers } from 'ethers';
import ballotAbi from '../../utils/BallotPortal.json';
import { useState } from 'react';

type CreationModalProps = {
  isCreateOpen: boolean;
  handleClose: () => void;
};

type Ballot = {
  title: string;
  description: string;
};

const initialNewBallot = {
  title: '',
  description: '',
};

export const CreationModal = (props: CreationModalProps) => {
  const { isCreateOpen, handleClose } = props;
  const [newBallot, setNewballot] = useState<Ballot>(initialNewBallot);
  const ballotContractAddress = '0x7aC797B595321924Bc169c4d76148Fe0a2F5c84D';
  const ballotABI = ballotAbi.abi;

  const handleTitleChange = (value: Ballot['title']) => {
    setNewballot({ ...newBallot, title: value });
  };

  const handleDescriptionChange = (value: Ballot['description']) => {
    setNewballot({ ...newBallot, description: value });
  };

  const handleSubmit = () => {
    if (newBallot !== undefined) createBallot(newBallot);
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

        const createBallotTxn = await ballotPortalContract.createBallot(newBallot.title, newBallot.description);
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
        </div>
        {/* <div className="options-container">
          <input placeholder="Opção 1" />
          <input placeholder="Opção 2" />
          <input placeholder="Opção 3" />
          <input placeholder="Opção 4" />
        </div> */}
        <button className="waveButton" onClick={handleSubmit}>
          Criar votação
        </button>
      </div>
    </div>
  );
};
