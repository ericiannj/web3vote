import { useState } from 'react';
import { BallotsCleaned, Proposal } from '../../App';
import './index.css';
import classNames from 'classnames';
import { ethers } from 'ethers';
import ballotAbi from '../../utils/BallotPortal.json';
import { OperationType } from '../VotationContainer';

type VotationModalProps = {
  isVotationOpen: boolean;
  handleClose: () => void;
  selectedBallot?: BallotsCleaned;
  getAllBallots: () => Promise<void>;
  setLoading: (bool: boolean) => void;
  setOperation: (op: OperationType) => void;
};

const initialProposal = {
  id: undefined,
  text: '',
  votes: 0,
};

const convertTimestamp = (dateString: Date) => {
  const date = new Date(dateString);

  const formattedTime = date.toLocaleTimeString('pt-BR', { timeStyle: 'medium' });
  const formattedWeekday = date.toLocaleDateString('pt-BR', { weekday: 'long' });
  const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const brazilianFormat = `${formattedTime}, ${formattedWeekday}, ${formattedDate}`;
  return brazilianFormat;
};

export const VotationModal = (props: VotationModalProps) => {
  const { isVotationOpen, handleClose, selectedBallot, getAllBallots, setLoading, setOperation } = props;
  const [selectedProposal, setSelectedProposal] = useState<Proposal>(initialProposal);
  const [showHistory, setShowHistory] = useState(false);
  const ballotContractAddress = import.meta.env.VITE_BALLOT_CONTRACT_ADDRESS;
  const ballotABI = ballotAbi.abi;

  const handleProposalChange = (proposal: Proposal) => {
    setSelectedProposal({ ...proposal });
  };

  const disableVotation = () => {
    disableBallot();
    handleClose();
  };

  const deleteVotation = () => {
    deleteBallot();
    handleClose();
  };

  const handleHistory = () => {
    setShowHistory(!showHistory);
  };

  const disableBallot = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ballotPortalContract = new ethers.Contract(ballotContractAddress, ballotABI, signer);
        setLoading(true);
        setOperation('disable');
        if (selectedBallot?.id !== undefined && selectedBallot?.disabled !== undefined) {
          const disableBallotTxn = await ballotPortalContract.disableBallot(
            selectedBallot.id,
            !selectedBallot.disabled,
          );
          console.log('Mining...', disableBallotTxn.hash);

          await disableBallotTxn.wait();
          console.log('Mined -- ', disableBallotTxn.hash);
          setLoading(false);
          getAllBallots();
          setSelectedProposal(initialProposal);
          handleClose();
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

  const deleteBallot = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ballotPortalContract = new ethers.Contract(ballotContractAddress, ballotABI, signer);
        setLoading(true);
        setOperation('delete');
        if (selectedBallot?.id !== undefined && selectedBallot?.deleted !== undefined) {
          const deleteBallotTxn = await ballotPortalContract.deleteBallot(selectedBallot.id, !selectedBallot.deleted);
          console.log('Mining...', deleteBallotTxn.hash);

          await deleteBallotTxn.wait();
          console.log('Mined -- ', deleteBallotTxn.hash);
          setLoading(false);
          getAllBallots();
          setSelectedProposal(initialProposal);
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

  const vote = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ballotPortalContract = new ethers.Contract(ballotContractAddress, ballotABI, signer);

        setLoading(true);
        setOperation('vote');
        const voteTxn = await ballotPortalContract.vote(selectedBallot?.id, selectedProposal?.id);
        console.log('Mining...', voteTxn.hash);

        await voteTxn.wait();
        console.log('Mined -- ', voteTxn.hash);
        setLoading(false);
        getAllBallots();
        setSelectedProposal(initialProposal);
      } else {
        console.log('No Ethereum Object!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    vote();
    handleClose();
  };

  const availableHistoric = selectedBallot?.historic.filter((historic) => historic.id !== 0);

  return (
    <div className={classNames('votation-modal', [{ show: isVotationOpen === true }])}>
      <div className={'votation-modal-container'}>
        <div className={'votation-header'}>
          <p>{selectedBallot?.title}</p>
          <button onClick={handleClose}>Fechar</button>
          {showHistory ? (
            <button onClick={handleHistory}>Mostrar Propostas</button>
          ) : (
            <button onClick={handleHistory}>Mostrar Histórico</button>
          )}
        </div>
        <div className={'votation-info-container'}>
          <p>{selectedBallot?.description}</p>
        </div>
        {showHistory ? (
          <div className="history-container">
            {availableHistoric?.map((vote) => {
              if (vote.timestamp !== undefined) {
                const formatedDate = convertTimestamp(vote.timestamp);
                const votedProposal = selectedBallot?.proposals.find((proposal) => proposal.id === vote.proposalId);
                return (
                  <div key={vote.id} className="historic-container">
                    <div>
                      <div className="voter-container">
                        <p>{vote.voter}</p>
                      </div>
                      <div className="proposal-container">
                        <p>{votedProposal?.text}</p>
                      </div>
                    </div>

                    <div className="date-container">
                      <p>{formatedDate}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <div className="votation-options-container">
            <div className="votation-options">
              {selectedBallot?.proposals.map((proposal) => {
                return (
                  <div key={proposal.id} className="option">
                    <label htmlFor={proposal.text}>{proposal.text}</label>
                    <input
                      type="checkbox"
                      id={proposal.text}
                      name={proposal.text}
                      value={proposal.text}
                      checked={selectedProposal?.id === proposal.id}
                      onChange={() => handleProposalChange(proposal)}
                    />
                    <h4>Votes: {proposal.votes}</h4>
                  </div>
                );
              })}
            </div>
            <button className="voteButton" onClick={handleSubmit} disabled={selectedBallot?.disabled === true}>
              Votar
            </button>
            <button className="disableButton" onClick={disableVotation}>
              {!selectedBallot?.disabled ? 'Desabilitar votação' : 'Desbloquear Votação'}
            </button>
            <button className="deleteButton" onClick={deleteVotation}>
              Deletar votação
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
