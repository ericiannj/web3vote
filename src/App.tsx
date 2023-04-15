import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { LoginWalletContainer } from './components/LoginWalletContainer';
import { VotationContainer } from './components/VotationContainer';
import ballotAbi from './utils/BallotPortal.json';

import './App.css';
import { BallotsSmartContract, HistoricalSmartContract, ProposalSmartContract } from './contract-types';

export type Proposal = {
  id?: number;
  text: string;
  votes: number;
};

export type Historical = {
  id?: number;
  voter?: string;
  timestamp?: Date;
  proposalId?: number;
};

export type BallotsCleaned = {
  id: number;
  address: string;
  timestamp: Date;
  title: string;
  description: string;
  proposals: Proposal[];
  historic: Historical[];
  disabled: boolean;
  deleted: boolean;
};

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [allBallots, setAllBallots] = useState<BallotsCleaned[]>([]);
  const ballotContractAddress = import.meta.env.VITE_BALLOT_CONTRACT_ADDRESS;
  const ballotABI = ballotAbi.abi;

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Garanta que possua a Metamask instalada!');
        return;
      } else {
        console.log('Temos o objeto ethereum', ethereum);
      }

      if (ethereum.request !== undefined) {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Encontrada a conta autorizada:', account);
          setCurrentAccount(account);

          getAllBallots();
        } else {
          console.log('Nenhuma conta autorizada foi encontrada');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllBallots = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ballotPortalContract = new ethers.Contract(ballotContractAddress, ballotABI, signer);
        const ballots = await ballotPortalContract.getAllBallots();

        const ballotsCleaned = ballots.map((ballot: BallotsSmartContract) => {
          const proposalsCleaned = ballot.proposals.map((proposal: ProposalSmartContract) => {
            return {
              id: proposal?.id.toNumber(),
              text: proposal.text,
              votes: proposal.votes.toNumber(),
            };
          });
          const historicCleaned = ballot.historic.map((historic: HistoricalSmartContract) => {
            if (historic.id === undefined || historic.timestamp === undefined || historic.proposalId === undefined) {
              console.log('Valor indefinido em historic: ', historic);
              return;
            }
            return {
              id: historic.id.toNumber(),
              voter: historic.voter,
              timestamp: new Date(historic.timestamp * 1000),
              proposalId: historic.proposalId.toNumber(),
            };
          });

          return {
            id: ballot.id.toNumber(),
            address: ballot.author,
            timestamp: new Date(ballot.timestamp * 1000),
            title: ballot.title,
            description: ballot.description,
            historic: historicCleaned,
            proposals: proposalsCleaned,
            disabled: ballot.disabled,
            deleted: ballot.deleted,
          };
        });

        setAllBallots(ballotsCleaned);
      } else {
        console.log('No Ethereum Object!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('MetaMask não encontrada!');
        return;
      }

      if (ethereum.request !== undefined) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Conectado', accounts[0]);
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mainContainer">
      {!currentAccount ? (
        <LoginWalletContainer connectWallet={connectWallet} />
      ) : (
        <VotationContainer allBallots={allBallots} getAllBallots={getAllBallots} />
      )}
    </div>
  );
}
