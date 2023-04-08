import { useState } from 'react';
import { BallotsCleaned } from '../../App';
import './index.css';
import classNames from 'classnames';
import { ethers } from 'ethers';
import ballotAbi from '../../utils/BallotPortal.json';

type VotationModalProps = {
  isVotationOpen: boolean;
  handleClose: () => void;
  selectedBallot?: BallotsCleaned;
  getAllBallots: () => Promise<void>;
};

export const VotationModal = (props: VotationModalProps) => {
  const { isVotationOpen, handleClose, selectedBallot, getAllBallots } = props;
  const [isDisabled, setDisabled] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState('');
  const ballotContractAddress = import.meta.env.VITE_BALLOT_CONTRACT_ADDRESS;
  const ballotABI = ballotAbi.abi;

  const handleProposalChange = (event) => {
    setSelectedProposal(event.target.value);
  };

  const disableCreate = () => {
    setDisabled(!isDisabled);
  };

  const deleteBallot = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ballotPortalContract = new ethers.Contract(ballotContractAddress, ballotABI, signer);
        console.log('selected', selectedBallot);

        // setLoading(true);
        if (selectedBallot?.id !== undefined && selectedBallot?.deleted !== undefined) {
          const deleteBallotTxn = await ballotPortalContract.deleteBallot(
            selectedBallot.id - 1,
            !selectedBallot.deleted,
          );
          console.log('Mining...', deleteBallotTxn.hash);

          await deleteBallotTxn.wait();
          console.log('Mined -- ', deleteBallotTxn.hash);
          // setLoading(false);
          getAllBallots();
        } else {
          console.log('undefined');
        }
      } else {
        console.log('No Ethereum Object!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    console.log('close');
    handleClose();
  };

  return (
    <div className={classNames('votation-modal', [{ show: isVotationOpen === true }])}>
      <div className={'votation-modal-container'}>
        <div className={'votation-header'}>
          <p>{selectedBallot?.title}</p>
          <button onClick={handleClose}>Fechar</button>
        </div>
        <div className={'votation-info-container'}>
          <p>{selectedBallot?.description}</p>
        </div>
        <div className="votation-options-container">
          <div className="votation-options">
            {selectedBallot?.proposals.map((proposal) => (
              <div key={proposal} className="option">
                <label htmlFor={proposal}>{proposal}</label>
                <input
                  type="checkbox"
                  id={proposal}
                  name={proposal}
                  value={proposal}
                  checked={selectedProposal === proposal}
                  onChange={handleProposalChange}
                />
              </div>
            ))}
          </div>
          <button className="voteButton" onClick={handleSubmit} disabled={isDisabled}>
            Criar votação
          </button>
          <button className="disableButton" onClick={disableCreate}>
            Desabilitar votação
          </button>
          <button className="deleteButton" onClick={deleteBallot}>
            Deletar votação
          </button>
        </div>
      </div>
    </div>
  );
};
