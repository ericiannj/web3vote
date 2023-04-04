/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BALLOT_CONTRACT_ADDRESS: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
