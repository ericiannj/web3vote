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
