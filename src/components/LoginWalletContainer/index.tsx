import '../../App.css';

type LoginWalletContainerProps = {
  connectWallet: () => Promise<void>;
};

export const LoginWalletContainer = (props: LoginWalletContainerProps) => {
  return (
    <div className="dataContainer">
      <div className="header">🗳️ Web3Vote</div>
      <div className="bio">Bem-vindo a sua Plataforma de Votação Descentralizada</div>
      <button className="waveButton" onClick={props.connectWallet}>
        Conectar carteira
      </button>
    </div>
  );
};
