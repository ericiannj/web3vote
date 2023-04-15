import { BigNumber } from 'ethers';

export type BallotsSmartContract = {
  id: BigNumber;
  author: string;
  timestamp: number;
  title: string;
  description: string;
  historic: HistoricalSmartContract[];
  proposals: ProposalSmartContract[];
  disabled: boolean;
  deleted: boolean;
};

export type ProposalSmartContract = {
  id: BigNumber;
  text: string;
  votes: BigNumber;
};

export type HistoricalSmartContract = {
  id?: BigNumber;
  voter?: string;
  timestamp?: number;
  proposalId?: BigNumber;
};
