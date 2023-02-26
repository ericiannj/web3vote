import './index.css';
import classNames from 'classnames';

type CreationModalProps = {
  isCreateOpen: boolean;
  handleClose: () => void;
};

export const CreationModal = (props: CreationModalProps) => {
  const { isCreateOpen, handleClose } = props;
  console.log(isCreateOpen);

  return (
    <div className={classNames('modal', [{ show: isCreateOpen === true }])}>
      <div className={'modal-container'}>
        <div className={'header'}>
          <p>Nova votação</p>
          <button onClick={handleClose}>Fechar</button>
        </div>
        <div className={'info-container'}>
          <input placeholder="Título" />
          <br />
          <input placeholder="Descrição" />
        </div>
        <div className="options-container">
          <input placeholder="Opção 1" />
          <input placeholder="Opção 2" />
          <input placeholder="Opção 3" />
          <input placeholder="Opção 4" />
        </div>
      </div>
    </div>
  );
};
