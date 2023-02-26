import './index.css';
import classNames from 'classnames';

type VotationModalProps = {
  isVotationOpen: boolean;
  handleClose: () => void;
};

export const VotationModal = (props: VotationModalProps) => {
  const { isVotationOpen, handleClose } = props;

  return (
    <div className={classNames('votation-modal', [{ show: isVotationOpen === true }])}>
      <div className={'votation-modal-container'}>
        <div className={'votation-header'}>
          <p>Título da Votação</p>
          <button onClick={handleClose}>Fechar</button>
        </div>
        <div className={'votation-info-container'}>
          <p>Descrição</p>
        </div>
        <div className="votation-options-container">
          <div>
            <input type="checkbox" id="opt1" name="Option 1" checked />
            <label htmlFor="opt1">Option 1</label>
          </div>
          <div>
            <input type="checkbox" id="opt2" name="Option 2" checked />
            <label htmlFor="opt2">Option 2</label>
          </div>
          <div>
            <input type="checkbox" id="opt3" name="Option 3" checked />
            <label htmlFor="opt3">Option 3</label>
          </div>
          <div>
            <input type="checkbox" id="opt4" name="Option 4" checked />
            <label htmlFor="opt4">Option 4</label>
          </div>
        </div>
      </div>
    </div>
  );
};
