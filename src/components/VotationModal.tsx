import { useState } from 'react';
import { BallotsCleaned, Proposal, Historical } from '../contract-types';
import { ethers } from 'ethers';
import ballotAbi from '../utils/BallotPortal.json';
import { OperationType } from './VotationContainer';

type VotationModalProps = {
  currentAccount: string;
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
  const { currentAccount, isVotationOpen, handleClose, selectedBallot, getAllBallots, setLoading, setOperation } =
    props;
  const [selectedProposal, setSelectedProposal] = useState<Proposal>(initialProposal);
  const [showHistory, setShowHistory] = useState(false);
  const ballotContractAddress = import.meta.env.VITE_BALLOT_CONTRACT_ADDRESS;
  const ballotABI = ballotAbi.abi;
  const isAuthor = currentAccount == selectedBallot?.address.toLowerCase();

  const handleProposalChange = (proposal: Proposal) => {
    setSelectedProposal({ ...proposal });
  };

  const disableVotation = () => {
    disableBallot();
    handleClosePopper();
  };

  const deleteVotation = () => {
    deleteBallot();
    handleClosePopper();
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
          setLoading(false);
        }
      } else {
        console.log('No Ethereum Object!');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
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
          setLoading(false);
        }
      } else {
        console.log('No Ethereum Object!');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
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
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleClosePopper = () => {
    setSelectedProposal(initialProposal);
    handleClose();
  };

  const handleSubmit = () => {
    vote();
    handleClosePopper();
  };

  const availableHistoric = selectedBallot?.historic.filter((historic: Historical) => historic.id !== 0);

  return (
    <div
      className={`flex justify-center items-center fixed top-0 left-0 w-full h-full bg-strongStone bg-opacity-50  ${
        isVotationOpen ? '' : 'hidden'
      }`}
    >
      <div className="bg-lightSky h-3/5 w-3/5 p-10 rounded-lg">
        <div className="flex justify-between mb-5">
          <p className="text-2xl">{selectedBallot?.title}</p>
          <button
            className="cursor-pointer px-4 py-2 rounded-md border-2 border-strongPurple text-strongPurple max-w-max
             hover:border-hoverPurple hover:text-hoverPurple"
            onClick={handleClosePopper}
          >
            Fechar
          </button>
          {showHistory ? (
            <button
              className="cursor-pointer px-4 py-2 rounded-md bg-strongPurple text-lightSky max-w-max hover:bg-hoverPurple"
              onClick={handleHistory}
            >
              Mostrar Propostas
            </button>
          ) : (
            <button
              className="cursor-pointer px-4 py-2 rounded-md bg-strongPurple text-lightSky max-w-max hover:bg-hoverPurple"
              onClick={handleHistory}
            >
              Mostrar Histórico
            </button>
          )}
        </div>
        <div className="mb-5">
          <p>{selectedBallot?.description}</p>
        </div>
        {showHistory ? (
          <div className="flex flex-col overflow-auto border-2 border-b-strongStone p-4 rounded-lg max-h-80">
            {availableHistoric?.map((vote) => {
              if (vote.timestamp !== undefined) {
                const formatedDate = convertTimestamp(vote.timestamp);
                const votedProposal = selectedBallot?.proposals.find((proposal) => proposal.id === vote.proposalId);
                return (
                  <div
                    key={vote.id}
                    className="w-full h-1/2 flex flex-row border-2 border-strongStone max-w-490 mb-5 max-h-90"
                  >
                    <div>
                      <div className="min-w-3/4 h-1/2 flex justify-center items-center px-5">
                        <p className="text-xs text-center">{vote.voter}</p>
                      </div>
                      <div className="min-w-3/4 h-1/2 flex justify-center items-center ">
                        <p className="text-center text-base">{votedProposal?.text}</p>
                      </div>
                    </div>
                    <div className="w-1/3 h-full border-solid border-l p-1 flex justify-center items-center">
                      <p className="text-center text-xs">{formatedDate}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <div>
            <div className="p-5 bg-strongPurple text-lightSky rounded-lg mt-8">
              {selectedBallot?.proposals.map((proposal) => {
                return (
                  <div key={proposal.id} className="flex flex-row mb-6">
                    <label className="w-2/3" htmlFor={proposal.text}>
                      {proposal.text}
                    </label>
                    <div className="w-1/3">
                      <input
                        type="checkbox"
                        id={proposal.text}
                        name={proposal.text}
                        value={proposal.text}
                        checked={selectedProposal?.id === proposal.id}
                        onChange={() => handleProposalChange(proposal)}
                      />
                    </div>
                    <h4 className="w-1/3">Votos: {proposal.votes}</h4>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center mt-11">
              <button
                className="mr-5 cursor-pointer px-4 py-2 rounded-md bg-strongPurple text-lightSky max-w-max
                 hover:bg-hoverPurple disabled:bg-disabledGrey disabled:cursor-default"
                onClick={handleSubmit}
                disabled={selectedProposal.id === undefined || selectedBallot?.disabled === true}
              >
                Votar
              </button>
              <button
                className="mr-5 cursor-pointer px-4 py-2 rounded-md border-2 border-strongPurple text-strongPurple max-w-max 
                hover:border-hoverPurple hover:text-hoverPurple disabled:border-disabledGrey disabled:text-disabledGrey disabled:cursor-default"
                onClick={disableVotation}
                disabled={!isAuthor}
              >
                {!selectedBallot?.disabled ? 'Desabilitar votação' : 'Desbloquear Votação'}
              </button>
              <button
                className="cursor-pointer px-4 py-2 rounded-md border-2 border-dangerRed text-dangerRed max-w-max
                 hover:border-hoverRed hover:text-hoverRed disabled: disabled:border-disabledGrey disabled:text-disabledGrey disabled:cursor-default"
                onClick={deleteVotation}
                disabled={!isAuthor}
              >
                Deletar votação
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
