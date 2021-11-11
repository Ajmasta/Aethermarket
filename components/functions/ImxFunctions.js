//ImmutableXConnection.js
//Sample Immutable X functions for collection interaction

import { ImmutableXClient, Link, ERC721TokenType, ETHTokenType } from '@imtbl/imx-sdk';

const linkAddress = 'https://link.x.immutable.com';
const apiAddress = 'https://api.x.immutable.com/v1';
// Ropsten Testnet
//const linkAddress = 'https://link.ropsten.x.immutable.com';
//const apiAddress = 'https://api.ropsten.x.immutable.com/v1';

//The token address for the collection to be monitored. Currently set to Gods Unchained
const COLLECTION_ADDRESS = '0x0e3a2a1f2146d86a604adc220b4967a898d7fe07';

const link = new Link(linkAddress);
let client = "" 
const getClient = async () => {
    client = await ImmutableXClient.build({ publicApiUrl: apiAddress });
    return client
}
const WALLET_ADDRESS = 'WALLET_ADDRESS';
const STARK_PUBLIC_KEY = 'STARK_PUBLIC_KEY';

//////////////////////////////////////////////////////////////////////////////
//////////////////////// User Account Management /////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//Creates or logs a user into their Immutable X account via web3 wallet
export async function setupAndLogin() {
   if(localStorage.getItem(WALLET_ADDRESS)){
       return ""
   }
   else{
    const { address, starkPublicKey } = await link.setup({});
    getClient()
   localStorage.setItem(WALLET_ADDRESS, address);
   localStorage.setItem(STARK_PUBLIC_KEY, starkPublicKey);
   }
}

//Remove the local storage wallet address
export function logout() {
    console.log("test")
   localStorage.removeItem('WALLET_ADDRESS');
}

//Get the user balances
export async function getUserBalances() {
   const address = localStorage.getItem('WALLET_ADDRESS');
  const balances = await (await fetch(`https://api.x.immutable.com/v1/balances/${address}`)).json()
   return balances
}
//Deposits ETH into Immutable X
export async function depositEth(amountInEth) {
   await link.deposit({
      type: ETHTokenType.ETH,
      amount: amountInEth
   });
}

//Starts the withdrawal process from Immutable X
export async function prepareWithdrawal(amountInEth) {
   await link.prepareWithdrawal({
      type: ETHTokenType.ETH,
      amount: amountInEth
   });
}

//Finishes the withdrawal process from Immutable X
//Must wait for user balance to have ETH in the withdrawable state 
export async function completeWithdrawal() {
   await link.prepareWithdrawal({
      type: ETHTokenType.ETH
   });
}

//Show user history
export async function showUserHistory() {
   link.history({});
}

//////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Asset Management /////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/**
 * Get the user's assets
 * @param {string} assetCursor - optional cursor parameter 
 * @returns Object containing the assets and a cursor if more assets remain to be retrieved
 */
export async function getUserAssets(assetCursor) {
   const address = localStorage.getItem('WALLET_ADDRESS');
   const client =  await getClient()
   const assetsRequest = await client.getAssets({ user: address, cursor: assetCursor, status: 'imx', collection: COLLECTION_ADDRESS });
   return { assets: assetsRequest.result, cursor: assetsRequest.cursor };
}
export async function cancelOrder(order){
   try{
      link.cancel({orderId:order.order_id})
   }catch(err){
      console.log(err)
   }
}
//Opens the Link SDK popup to sell an asset as the specified price
export async function sellAsset(asset, priceInEth) {
   setupAndLogin()
   let sellParams = { amount: priceInEth, tokenId: asset.id, tokenAddress: asset.token_address };
   //Throws an error if not successful
   try{
   await link.sell(sellParams);
   }catch(err){
      console.log(err)
   }
}
export async function getAndSellAsset(order, priceInEth) {
   setupAndLogin()

   let sellParams = { amount: priceInEth, tokenId: order.sell.data.token_id, tokenAddress: order.sell.data.token_address };
   //Throws an error if not successful
   try{
   await link.sell(sellParams);
   }catch(err){
      console.log(err)
   }
}
//Transfers an asset to another address
export async function transferERC721(asset, addressToSendTo) {
   await link.transfer({
      type: ERC721TokenType.ERC721,
      tokenId: asset.id,
      tokenAddress: asset.token_address,
      to: addressToSendTo
   });
}
export async function getAndtransferERC721(asset, addressToSendTo) {
   console.log(asset.sell.data.token_address)
   try{
   const transaction = await link.transfer({
      type: ERC721TokenType.ERC721,
      tokenId: asset.sell.data.token_id,
      tokenAddress: asset.sell.data.token_address,
      to: addressToSendTo
   });}catch(err){
      console.log(err)
   }
   console.log(transaction)
}

//////////////////////////////////////////////////////////////////////////////
///////////////////////// Marketplace Management /////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/**
 * Get the cheapest active orders for the collection
 * @param {*} ordersCursor - optional cursor parameter 
 * @param {*} tokenName - optional token name to filter on 
 * @param {*} metadata - optional JSON string metadata to filter on 
 * @returns Object containing the cheapest orders and a cursor if more orders remain
 */
export async function getCheapestSellOrders(ordersCursor, tokenName, metadata) {
   const ordersRequest = await client.getOrders({
      cursor: ordersCursor,
      status: 'active',
      sell_token_address: COLLECTION_ADDRESS,
      name: tokenName,
      sell_metadata: metadata,
      order_by: 'buy_quantity',
      direction: 'asc'
   });
   return { orders: ordersRequest.result, cursor: ordersRequest.cursor };
}

//Opens the Link SDK popup to complete an order
   export async function fillOrder(order) {
   setupAndLogin()

      try{
      await link.buy({orderIds: order.order_id});
      }
      catch(err){
         console.log(err)
      }
   }
