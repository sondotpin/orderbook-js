import { JsonRpcProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import { addresses as ProjectAddresses } from '../src/addresses'
import { Blockchain, generatedWallets } from '../utils';
// import { BigNumber, Bytes } from 'ethers';
// import { formatUnits } from 'ethers/lib/utils';
// import { AddressZero } from '@ethersproject/constants';
// import MockAdapter from 'axios-mock-adapter';
// import axios from 'axios';
// import { promises as fs } from 'fs';
import { OrderBook } from '../src/order-book';
import { ConfiguredAddresses, setupOrderBook } from './helpers';

let provider = new JsonRpcProvider()
let blockchain = new Blockchain(provider)
jest.setTimeout(1000000)

describe('OrderBook', () => {
  describe('#constructor', () => {
    it('initializes a OrderBook instance with the checksummed media and market address for the specified chainId', () => {
      const wallet = Wallet.createRandom()
      const rinkebyOrderBookAddress = ProjectAddresses['rinkeby'].orderBook;
      const rinkebyBaseTokenAddress = ProjectAddresses['rinkeby'].baseToken;
      const rinkebyTradeTokenAddress = ProjectAddresses['rinkeby'].tradeToken;
      const orderbook = new OrderBook(wallet, 4);
      expect(orderbook.orderBookAddress).toBe(rinkebyOrderBookAddress);
      expect(orderbook.baseTokenAddress).toBe(rinkebyBaseTokenAddress);
      expect(orderbook.tradeTokenAddress).toBe(rinkebyTradeTokenAddress);
    })
  })

  describe('contract functions', () => {
    let config: ConfiguredAddresses;
    let provider = new JsonRpcProvider();
    let [mainWallet, otherWallet] = generatedWallets(provider);

    beforeEach(async () => {
      await blockchain.resetAsync()
      config = await setupOrderBook(mainWallet, [otherWallet])
    })

    /******************
     * Write Functions
     ******************
     */

    describe('Write Functions', () => {

      beforeEach(() => {
        
      })

      describe('#placeBuyOrder', () => {
        it('throws an error if called on a readOnly Wonzimer instance', async () => {
          const provider = new JsonRpcProvider()

          const orderbook = new OrderBook(provider, 50);
          expect(orderbook.readOnly).toBe(true);
          expect(1).toEqual(true);
          expect(config).toEqual(true);
        })
      })
    })
  })
})
