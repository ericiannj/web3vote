type LoginWalletContainerProps = {
  connectWallet: () => Promise<void>;
};

export const LoginWalletContainer = (props: LoginWalletContainerProps) => {
  return (
    <div className="flex flex-col justify-center items-center min-w-450 w-2/5 min-h-170 p-20 bg-lightSky rounded-">
      <div className="text-center text-3xl text-strongStone font-semibold mb-5">🗳️ Web3Vote</div>
      <div className="text-center text-strongStone mt-4 mb-8">
        Bem-vindo a sua Plataforma de Votação Descentralizada
      </div>
      <button
        className="cursor-pointer mt-4 px-4 py-2 rounded-md bg-strongPurple text-lightSky max-w-max hover:bg-hoverPurple"
        onClick={props.connectWallet}
      >
        Conectar carteira 🦊
      </button>
    </div>
  );
};
