import { OperationType } from '../VotationContainer';
import './index.css';
import classNames from 'classnames';

type LoadingProps = {
  loading: boolean;
  operationDesc: OperationType;
};

export const LoadingDialog = (props: LoadingProps) => {
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
    <div className={classNames('votation-modal', [{ show: props.loading === true }])}>
      <div className="loadingContainer">
        <h1>{props.loading && `${getLoadingDescription(props.operationDesc ?? '')}`}</h1>
        <h3>O processo pode demorar alguns segundos</h3>
      </div>
    </div>
  );
};
