import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from './utils/VotePortal.json';
import './App.css';
import { LoginWalletContainer } from './components/LoginWalletContainer';
import { VotationContainer } from './components/VotationContainer';

// import.meta.env.VITE_CONTRACT_ADDRESS

type Vote = {
  voter: string;
  timestamp: number;
  message: string;
};

type VotesCleaned = {
  address: string;
  timestamp: Date;
  message: string;
};

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  /**
   * Cria uma variável para guardar o endereço do contrato após o deploy!
   */
  const [allVotes, setAllVotes] = useState<VotesCleaned[]>([]);
  const contractAddress = '0xB87aA15018cc392F90C177Ee11c33BeFf5669A8f';
  const contractABI = abi.abi;

  /*
   * Método para consultar todos os tchauzinhos do contrato
   */

  const getAllVotes = async () => {
    try {
      const { ethereum } = window as Window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const votePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Chama o método getAllVotes do seu contrato inteligente
         */
        const votes = await votePortalContract.getAllVotes();

        /*
         * Apenas precisamos do endereço, data/horário, e mensagem na nossa tela, então vamos selecioná-los
         */
        const votesCleaned: VotesCleaned[] = [];
        votes.forEach((vote: Vote) => {
          votesCleaned.push({
            address: vote.voter,
            timestamp: new Date(vote.timestamp * 1000),
            message: vote.message,
          });
        });

        /*
         * Armazenando os dados
         */
        setAllVotes(votesCleaned);
      } else {
        console.log('Objeto Ethereum não existe!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Garanta que possua a Metamask instalada!');
        return;
      } else {
        console.log('Temos o objeto ethereum', ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Encontrada a conta autorizada:', account);
        setCurrentAccount(account);
      } else {
        console.log('Nenhuma conta autorizada foi encontrada');
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Implemente aqui o seu método connectWallet
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('MetaMask encontrada!');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      console.log('Conectado', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const vote = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const votePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await votePortalContract.getTotalVotes();
        console.log('Recuperado o número de votos...', count.toNumber());

        /*
         * Executar o voto a partir do contrato inteligente
         */
        const voteTxn = await votePortalContract.vote('esta é uma mensagem');
        console.log('Minerando...', voteTxn.hash);

        await voteTxn.wait();
        console.log('Minerado -- ', voteTxn.hash);

        count = await votePortalContract.getTotalVotes();
        console.log('Total de votos recuperado...', count.toNumber());
      } else {
        console.log('Objeto Ethereum não encontrado!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mainContainer">
      {!currentAccount ? <LoginWalletContainer connectWallet={connectWallet} /> : <VotationContainer />}
      {allVotes.map((vote, index) => {
        return (
          <div key={index} style={{ backgroundColor: 'OldLace', marginTop: '16px', padding: '8px' }}>
            <div>Endereço: {vote.address}</div>
            <div>Data/Horário: {vote.timestamp.toString()}</div>
            <div>Mensagem: {vote.message}</div>
          </div>
        );
      })}
    </div>
  );
}
