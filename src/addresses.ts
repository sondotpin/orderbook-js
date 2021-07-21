import rinkebyAddresses from '@orderbook-solidity/core/dist/deployed-info/4.json';

interface AddressBook {
  [key: string]: {
    [key: string]: string
  }
};

export const addresses: AddressBook = {
  rinkeby: rinkebyAddresses,
};
