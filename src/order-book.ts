import { BigNumberish } from '@ethersproject/bignumber';
import { ContractTransaction } from '@ethersproject/contracts';
import { JsonRpcProvider, JsonRpcSigner, Provider } from '@ethersproject/providers';
import { MaxUint256 } from "@ethersproject/constants";
import { Signer } from '@ethersproject/abstract-signer';
import {
  OrderBook as OrderBookType,
  OrderBookFactory,
  Erc20,
  Erc20Factory,
} from '@orderbook-solidity/core/dist/typechain';
import { addresses } from './addresses';
import {
  chainIdToNetworkName,
  validateAndParseAddress,
} from './utils';

export class OrderBook {
  public chainId: number;
  public orderBookAddress: string;
  public baseTokenAddress: string;
  public tradeTokenAddress: string;
  public signerOrProvider: Signer | Provider | JsonRpcProvider | JsonRpcSigner;
  public baseToken: Erc20;
  public tradeToken: Erc20;
  public orderBook: OrderBookType;
  public readOnly: boolean

  constructor(
    signerOrProvider: Signer | Provider| JsonRpcSigner | JsonRpcProvider,
    chainId: number,
    orderBookAddress?: string,
    baseTokenAddress?: string,
    tradeTokenAddress?: string,
  ) {
    if (Signer.isSigner(signerOrProvider)) {
      this.readOnly = false;
    } else {
      this.readOnly = true;
    }

    this.signerOrProvider = signerOrProvider;
    this.chainId = chainId;

    if (orderBookAddress && baseTokenAddress && tradeTokenAddress) {
      const parsedBaseTokenAddress = validateAndParseAddress(baseTokenAddress);
      const parsedTradeTokenAddress = validateAndParseAddress(tradeTokenAddress);
      const parsedOrderBookAddress = validateAndParseAddress(orderBookAddress);
      this.baseTokenAddress = parsedBaseTokenAddress;
      this.tradeTokenAddress = parsedTradeTokenAddress;
      this.orderBookAddress = parsedOrderBookAddress;
    } else {
      const network = chainIdToNetworkName(chainId);
      this.baseTokenAddress = addresses[network].baseToken;
      this.tradeTokenAddress = addresses[network].tradeToken;
      this.orderBookAddress = addresses[network].orderBook;
    }

    this.baseToken = Erc20Factory.connect(this.baseTokenAddress, signerOrProvider);
    this.tradeToken = Erc20Factory.connect(this.tradeTokenAddress, signerOrProvider);
    this.orderBook = OrderBookFactory.connect(this.orderBookAddress, signerOrProvider);
  }

  /**
   * Place buy Order
   * @param price
   * @param amountOfBaseToken
   */
  public async placeBuyOrder(price: BigNumberish, amountOfBaseToken: BigNumberish): Promise<ContractTransaction> {
    return this.orderBook.placeBuyOrder(price, amountOfBaseToken);
  }

  /**
   * Place sell Order
   * @param price
   * @param amountOfTradeToken
   */
  public async placeSellOrder(price: BigNumberish, amountOfTradeToken: BigNumberish): Promise<ContractTransaction> {
    return this.orderBook.placeSellOrder(price, amountOfTradeToken);
  }

  /**
   * approve infinity trade token
   */
  public async approveTradeToken(): Promise<ContractTransaction> {
    return this.tradeToken.approve(this.orderBookAddress, MaxUint256);
  }

  /**
   * approve infinity base token
   */
  public async approveBaseToken(): Promise<ContractTransaction> {
    return this.baseToken.approve(this.orderBookAddress, MaxUint256);
  }
}
