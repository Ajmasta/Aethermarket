import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useState } from "react";
import orderData from "./orderData.json";
import collectionsList from "./collectionsList.json";
import collectionsRankings from "./collectionRankings.json";

export const useGetAllFloorPrices = (url) => {
  const { data, error } = useSWR(url, fetchAllFloor);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

const fetchAllFloor = async () => {
  const collections = collectionsList.filter((element) => !element.upcoming);
  let floorPrices = {};
  let newArray = Promise.all(
    collections.map(async (collection) => {
      const floorPrice = await (
        await fetch(
          `https://api.x.immutable.com/v1/orders?&status=active&buy_token_type=ETH&page_size=1&include_fees=true&sell_token_address=${collection.address}&order_by=buy_quantity&direction=asc`
        )
      ).json();
      floorPrices[collection.address] = floorPrice.result[0]?.buy.data.quantity;

      return [collection.address, floorPrice.result[0]?.buy.data.quantity];
    })
  );

  return newArray;
};

const fetcher = async (url) => {
  const listings = [];
  const sales = [];
  let cursor = "";
  for (let i = 0; i <= 10; i++) {
    const data = await (await fetch(url + cursor)).json();
    sales.push(...data.result);
    cursor = `&cursor=` + data.cursor;
    if (!data.cursor) i += 10;
  }
  return sales;
};

export const useGetData = (url) => {
  const { data, error } = useSWR(url, fetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useGetSingleCollection = (url) => {
  const { data, error } = useSWR(url, fetchSingleCollection);
  return {
    collectionData: data,
    isLoadingCollection: !error && !data,
    isErrorCollection: error,
  };
};

const fetchSingleCollection = async (url) => {
  const data = await (await fetch(url)).json();
  return data;
};

export const useGetRankings = (url, tokenArray) => {
  const { data, error } = useSWR(url, fetchRanking);
  return {
    rankingData: data,
    isLoadingCollection: !error && !data,
    isErrorCollection: error,
  };
};

const fetchRanking = async (url, tokenArray) => {
  const listData = [];

  return listData;
};
export const getEthPrice = async () => {
  const data = await (
    await fetch("https://api.coingecko.com/api/v3/coins/ethereum")
  ).json();

  const currentPrices = data.market_data.current_price;

  return currentPrices;
};
export const useGetCollections = (url) => {
  const { data, error } = useSWR(url, fetchCollections);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
const fetchCollections = async (url) => {
  let data = await (await fetch(url)).json();
  let newData = await checkCollection(data.result);

  return newData;
};

const checkCollection = async (collections) => {
  let newArray = Promise.all(
    collections.map(async (collection) => {
      let object = { ...collection };
      const listings = await (
        await fetch(
          `https://api.x.immutable.com/v1/orders?sell_token_address=${collection.address}`
        )
      ).json();
      listings.result.length > 0
        ? (object.upcoming = false)
        : (object.upcoming = true);
      object.volume = orderData.all[collection.name]
        ? {
            all: orderData.all[collection.name],
            day: orderData.day[collection.name],
            week: orderData.week[collection.name],
            changeDay: orderData.changeDay[collection.name],
            changeWeek: orderData.changeWeek[collection.name],
          }
        : "";
      return object;
    })
  );
  return newArray;
};

const fetchUserData = async (userId) => {
  const listed = await (
    await fetch(
      `https://api.x.immutable.com/v1/orders?user=${userId}&status=active`
    )
  ).json();
  const sold = await (
    await fetch(
      `https://api.x.immutable.com/v1/orders?user=${userId}&status=filled`
    )
  ).json();
  const user = await (
    await fetch(`https://api.x.immutable.com/v1/assets?user=${userId}`)
  ).json();

  return { user, sold, listed };
};
export const useGetUserData = (userId) => {
  const { data, error } = useSWR(userId, fetchUserData);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

const fetcherListLong = async (url) => {
  const salesAdd = "&status=filled&sell_token_type=ERC721";
  const listingsAdd = "&status=active";
  let listings = await getAllListings(url + listingsAdd);
  const data = { listings };
  return data;
};

const fetcherBoth = async (url) => {
  const listings = await (await fetch(url + listingsAdd)).json();
  const data = { listings: listings.result };
  return data;
};

export const useGetFloorPrice = (url) => {
  const { data, error } = useSWR(url, fetchFloorPrice, {
    refreshInterval: 3000,
  });
  return {
    floorPrice: data,
    isLoadingFloor: !error && !data,
    isErrorFloor: error,
  };
};
const fetchFloorPrice = async (url) => {
  const floor = await (await fetch(url)).json();
 
  return floor.result[0].buy.data.quantity;
};
const getAllListings = async (url) => {
  let i = 0;
  let roll = true;
  let cursor = "";
  let dataArray = [];
  while (roll) {
    const data = cursor
      ? await (await fetch(url + cursor)).json()
      : await (await fetch(url)).json();
    dataArray.push(...data.result);
    cursor = "&cursor=" + data.cursor;
    i++;
    if (data.cursor === "" || i > 50) roll = false;
  }

  return dataArray;
};
export const useGetListingsLong = (url, refreshInterval) => {
  const { data, error } = useSWR(url, fetcherListLong, {
    refreshInterval: 3000,
  });
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
export const useGetBothData = (url) => {
  const { data, error } = useSWR(url, fetcherBoth);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
export const getLongListData = async (url) => {
  const data = await (await fetch(url)).json();
  let timestamp =
    "&max_timestamp=" + data.result[data.result.length - 1].timestamp;
  for (let i = 0; i <= 5; i++) {
    const newData = await (await fetch(url + timestamp)).json();
    timestamp =
      "&max_timestamp=" + newData.result[newData.result.length - 1].timestamp;
    data.result.push(...newData.result);
  }
  return data;
};

export const getVolume = (data) => {
  const amountArray = data.map((order) => order.amount_sold);
  const total = amountArray.reduce((a, b) => Number(a) + Number(b));
  return total / 10 ** 18;
};
function msToTime(duration) {
  let milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 365);

  const answerString =
    days > 1
      ? days + " days ago"
      : days === 1
      ? days + " day ago"
      : hours > 1
      ? hours + "h ago"
      : hours === 1
      ? hours + "h ago"
      : minutes > 1
      ? minutes + "mn ago"
      : minutes === 1
      ? minutes + "mn ago"
      : seconds > 1
      ? seconds + "s ago"
      : seconds + "s ago";
  return answerString;
}
export const calculateTime = (timestamp) => {
  const date = new Date();
  const dateT = new Date(timestamp);
  const timeDiff = date.getTime() - dateT.getTime();

  return msToTime(timeDiff);
};
export const calculateWeek = (timestamp) => {
  const date = new Date();
  const dateT = new Date(timestamp);
  const timeDiff = date.getTime() - dateT.getTime();

  return timeDiff < 604800000 ? true : false;
};
export const calculatePreviousWeek = (timestamp) => {
  const date = new Date();
  const dateT = new Date(timestamp);
  const timeDiff = date.getTime() - dateT.getTime();

  return timeDiff >= 604800000
    ? timeDiff <= 604800000 * 2
      ? true
      : false
    : false;
};
export const calculateDay = (timestamp) => {
  const date = new Date();
  const dateT = new Date(timestamp);
  const timeDiff = date.getTime() - dateT.getTime();

  return timeDiff < 86400000 ? true : false;
};
export const calculatePreviousDay = (timestamp) => {
  const date = new Date();
  const dateT = new Date(timestamp);
  const timeDiff = date.getTime() - dateT.getTime();

  return timeDiff >= 86400000
    ? timeDiff <= 86400000 * 2
      ? true
      : false
    : false;
};
export const getListingInfo = async (url, url2) => {
  let data = await (await fetch(url)).json();

  let tokenAddress;
  let tokenId;
  let name;
  let fees;
  if (data.result.length === 0) {
    data = await (await fetch(url2)).json();
    tokenAddress = data.token_address;
    tokenId = data.token_id;
    name = data.name;
    data.asset = true;
  } else {
    tokenId = data.result[0].sell.data.token_id;
    tokenAddress = data.result[0].sell.data.token_address;
    name = data.result[0].sell.data.properties.name;
    data.asset = false;
  }

  let soldResults = await getSoldListings(
    tokenAddress,
    tokenId,
    name,
    data.asset
  );
  let soldListings = soldResults[0];
  let soldCollectionListings = soldResults[1];

  let similarResults = await getSimilarListings(
    tokenAddress,
    tokenId,
    name,
    data.asset
  );
  let similarListings = similarResults[0];
  let similarCollection = similarResults[1];
  const results = {
    data,
    similarListings,
    similarCollection,
    soldListings,
    soldCollectionListings,
  };
  return results;
};

export const useGetListingInfo = (url, url2) => {
  const { data, error } = useSWR([url, url2], getListingInfo);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

const getSimilarListings = async (tokenAddress, tokenId, newName, asset) => {
  let similarListings = { result: [] };
  const addOn = "&include_fees=true";

  let name = newName.split(" ").join("%20");
 
  try {
    similarListings = await (
      await fetch(
        `https://api.x.immutable.com/v1/orders?status=active${addOn}&sell_token_name=${name}&sell_token_address=${tokenAddress}`
      )
    ).json();
  } catch (err) {
    console.log(err);
  }
  similarListings.result = similarListings.result.filter(
    (item) => item.sell.data.token_address === tokenAddress
  );
  let collectionListings = await (
    await fetch(
      `https://api.x.immutable.com/v1/orders?status=active${addOn}&sell_token_address=${tokenAddress}`
    )
  ).json();

  return [similarListings, collectionListings];
};

const getSoldListings = async (tokenAddress, tokenId, newName, asset) => {
  let soldListings = { result: [] };
  const addOn = "&include_fees=true";
  let name = newName.split(" ").join("%20");
  

  
  console.log(
    `https://api.x.immutable.com/v1/orders?status=filled${addOn}&sell_token_name=${name}&sell_token_address=${tokenAddress}`
  );
  try {
    soldListings = await (
      await fetch(
        `https://api.x.immutable.com/v1/orders?status=filled${addOn}&sell_token_name=${name}&sell_token_address=${tokenAddress}`
      )
    ).json();
  } catch (err) {
    console.log(err);
  }
  soldListings.result = soldListings.result.filter(
    (item) => item.sell.data.token_address === tokenAddress
  );
  let collectionSoldListings = await (
    await fetch(
      `https://api.x.immutable.com/v1/orders?status=filled&sell_token_address=${tokenAddress}${addOn}`
    )
  ).json();

  return [soldListings, collectionSoldListings];
};

/*export const get24hVolume = async (url) =>{
    const data = await (await fetch(url) ).json()
    let timestamp= "&max_timestamp=" + data.result[data.result.length-1].timestamp

    while(calculateHours(data.result[data.result.length-1].updated_timestamp) <24){
        const newData = await (await fetch(url+timestamp)).json()
        timestamp = "&max_timestamp=" + newData.result[newData.result.length-1].timestamp
         data.result.push(...newData.result)
    }

   for (let i=0;i<=100;i++){
        const newData = await (await fetch(url+timestamp)).json()
        timestamp = "&max_timestamp=" + newData.result[newData.result.length-1].timestamp
         data.result.push(...newData.result)
    }
    console.log(data)
    return data

}


const calculateHours= time => {
    const date = new Date()
    const dateT= new Date(time)
    const timeDiff = (date.getTime()-dateT.getTime())

    return  Math.floor((timeDiff / (1000 * 60 * 60)))
}
 Use this when making a database, make a server function get 24 hours from database, then make api call and add whats missing 
*/
