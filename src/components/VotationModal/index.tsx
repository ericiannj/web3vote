import { useState } from 'react';
import { BallotsCleaned } from '../../App';
import './index.css';
import classNames from 'classnames';

type VotationModalProps = {
  isVotationOpen: boolean;
  handleClose: () => void;
  selectedBallot?: BallotsCleaned;
};

export const VotationModal = (props: VotationModalProps) => {
  const { isVotationOpen, handleClose, selectedBallot } = props;
  const [isDisabled, setDisabled] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState('');

  const handleProposalChange = (event) => {
    setSelectedProposal(event.target.value);
  };

  const disableCreate = () => {
    setDisabled(!isDisabled);
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
        </div>
      </div>
    </div>
  );
};
