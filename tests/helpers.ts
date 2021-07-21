import {
  Erc20TestFactory,
  OrderBookFactory,
} from '@orderbook-solidity/core/dist/typechain';
import { Wallet } from '@ethersproject/wallet';
import { BigNumber } from '@ethersproject/bignumber';
import { MaxUint256 } from "@ethersproject/constants";
import { ContractTransaction } from 'ethers';

export type ConfiguredAddresses = {
  baseTokenAddress: string
  tradeTokenAddress: string
  orderBookAddress: string
}

export async function setupOrderBook(
  wallet: Wallet,
  testWallets: Array<Wallet>
): Promise<ConfiguredAddresses> {
  const tradeToken = await (await new Erc20TestFactory(wallet).deploy('Trade', 'Trade')).deployed();
  const tradeTokenAddress = tradeToken.address;

  const baseToken = await (await new Erc20TestFactory(wallet).deploy('Base', 'Base')).deployed();
  const baseTokenAddress = baseToken.address;

  const orderBook = await (await new OrderBookFactory(wallet).deploy(tradeTokenAddress, baseTokenAddress)).deployed();
  const orderBookAddress = orderBook.address;

  for (const toWallet of testWallets) {
    await transfer(
      baseTokenAddress,
      wallet,
      toWallet,
    )

    await transfer(
      tradeTokenAddress,
      wallet,
      toWallet,
    )

    await approve(tradeTokenAddress, toWallet, orderBookAddress);
  }

  return {
    baseTokenAddress,
    tradeTokenAddress,
    orderBookAddress,
  };
}

export async function transfer(
  erc20Address: string,
  wallet: Wallet,
  toWallet: Wallet
): Promise<ContractTransaction> {
  const token = Erc20TestFactory.connect(erc20Address, wallet);
  return await token.transfer(toWallet.address, BigNumber.from(1000).mul(BigNumber.from(10).pow(18)));
}

export async function approve(
  erc20Address: string,
  wallet: Wallet,
  spender: string,
): Promise<ContractTransaction> {
  const token = Erc20TestFactory.connect(erc20Address, wallet);
  return await token.approve(spender, MaxUint256);
}