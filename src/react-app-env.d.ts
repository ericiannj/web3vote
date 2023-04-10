/// <reference types="react-scripts" />
import { ExternalProvider } from '../node_modules/@ethersproject/providers/src.ts/web3-provider';

declare global {
  interface Window {
    ethereum: ExternalProvider;
  }
}
