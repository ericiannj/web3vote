import { BigNumber } from 'ethers';

export type BallotsSmartContract = {
  id: BigNumber;
  author: string;
  timestamp: number;
  title: string;
  description: string;
  proposals: ProposalSmartContract[];
  disabled: boolean;
  deleted: boolean;
};

export type ProposalSmartContract = {
  id: BigNumber;
  text: string;
  votes: BigNumber;
};
