import './index.css';
import classNames from 'classnames';

type LoadingProps = {
  loading: boolean;
};

export const LoadingDialog = (props: LoadingProps) => {
  return (
    <div className={classNames('votation-modal', [{ show: props.loading === true }])}>
      <div className="loadingContainer">
        <h1>Aguarde a mineração do sua Votação</h1>
        <h3>O processo pode demorar alguns segundos</h3>
      </div>
    </div>
  );
};
