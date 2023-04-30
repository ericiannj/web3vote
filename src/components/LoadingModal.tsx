import { OperationType } from './VotationContainer';
import loadingGif from '../assets/eth.gif';

type LoadingProps = {
  loading: boolean;
  operationDesc: OperationType;
};

export const LoadingModal = (props: LoadingProps) => {
  const getLoadingDescription = (type: string) => {
    switch (type) {
      case 'delete':
        return 'Aguarde a mineração da exclusão desta votação';
        break;
      case 'create':
        return 'Aguarde a mineração da criação desta votação';
        break;
      case 'disable':
        return 'Aguarde a mineração de mudança de status desta votação';
        break;
      case 'vote':
        return 'Aguarde a mineração do seu voto';
        break;
      default:
        console.log('Ação inválida');
    }
  };

  return (
    <div
      className={`flex justify-center items-center fixed top-0 left-0 w-full h-full bg-strongStone bg-opacity-50  ${
        props.loading ? '' : 'hidden'
      }`}
    >
      <div className="bg-loadingWhite p-12 rounded-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-5">
          {props.loading && `${getLoadingDescription(props.operationDesc ?? '')}`}
        </h1>
        <h3 className="text-lg">O processo pode demorar alguns segundos</h3>
        <div className="mt-4 flex justify-center items-center">
          <img src={loadingGif} alt="loading GIF" className="w-1/5 h-auto" />
        </div>
      </div>
    </div>
  );
};
