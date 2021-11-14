import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useState } from "react"



const fetcher = async url => {
    const listings = []
    const sales = [] 
    let cursor=""
    for(let i =0; i<=10;i++){
        const data = await (await fetch(url+cursor)).json()
            sales.push(...data.result)
            cursor =`&cursor=`+data.cursor
            console.log(data)
            if (!data.cursor) i +=10
    }
    return sales
}


  export const useGetData= url => {
    const {data, error} = useSWR(url,fetcher)
    
    return{
        data,
        isLoading: !error && !data,
        isError:error
    }
}

export const useGetSingleCollection = url => {
    const {data, error} = useSWR(url,fetchSingleCollection)
    console.log(data)
    return{
        collectionData:data,
        isLoadingCollection: !error && !data,
        isErrorCollection:error
    }
}

const fetchSingleCollection= async url=>{
    const data =await (await fetch(url)).json()
    console.log(data)
    return data
}

export const useGetRankings = (url,tokenArray) => {
    const {data, error} = useSWR(url,fetchRanking)
    console.log(data)
    return{
        rankingData:data,
        isLoadingCollection: !error && !data,
        isErrorCollection:error
    }

}

const fetchRanking =async (url,tokenArray)=>{
    const listData = []
    console.log(tokenArray)
  
        return listData
}
export const useGetCollections= url => {
    const {data, error} = useSWR(url,fetchCollections)
    return{
        data,
        isLoading: !error && !data,
        isError:error
    }
}
const fetchCollections= async url=>{
    let data = await (await fetch(url)).json()
    let newData = await checkCollection(data.result)
    
    return newData }


const checkCollection = async collections => {
   let newArray = Promise.all(collections.map( async collection =>{ 
    let object ={...collection}
    const listings = await (await fetch(`https://api.x.immutable.com/v1/orders?sell_token_address=${collection.address}`)).json()
    listings.result.length>0? object.upcoming=false:object.upcoming=true
    return object
   }))
   return newArray
}

const fetchUserData = async userId => {
    const listed = await (await fetch(`https://api.x.immutable.com/v1/orders?user=${userId}&status=active`)).json()
    const sold = await (await fetch(`https://api.x.immutable.com/v1/orders?user=${userId}&status=filled`)).json()
    const user= await (await fetch(`https://api.x.immutable.com/v1/assets?user=${userId}`)).json()

    return {user,sold,listed}
}
export const useGetUserData = userId => {
    const {data,error} = useSWR(userId, fetchUserData)

    return{
        data,
        isLoading: !error && !data,
        isError:error
    }
}

const fetcherListLong = async url => {
    const salesAdd = "&status=filled&sell_token_type=ERC721" 
    const listingsAdd="&status=active"
    const listings = await getAllListings(url+listingsAdd)
    const data = {listings: listings}
    return data
}

const fetcherBoth = async url => {
    const salesAdd = "&status=filled&sell_token_type=ERC721" 
    const listingsAdd="&status=active"

    const listings = await (await fetch(url+listingsAdd)).json()
    const sales = await (await fetch(url+salesAdd)).json()
    const data = {listings: listings.result,sales:sales.result}
    return data
}
const getAllListings = async (url) => {
    let i = 0
    let roll = true
    let cursor=""
    const dataArray = []
        while(roll) {
            const data = cursor? await (await fetch(url+cursor)).json()
            :await (await fetch(url)).json()
            dataArray.push(...data.result)
            cursor="&cursor="+data.cursor
            i++
            if (!data.cursor || i>12) roll=false
        }
        console.log(dataArray)
return dataArray
}
export const useGetListingsLong= url => {
    const {data, error} = useSWR(url,fetcherListLong)
    console.log(data)
    return{
        data,
        isLoading: !error && !data,
        isError:error
    }
}
export const useGetBothData = url => {
    const {data, error} = useSWR(url,fetcherBoth)
    console.log(data)
    return{
        data,
        isLoading: !error && !data,
        isError:error
    }
}
export const getLongListData = async (url) => {
    const data = await (await fetch(url) ).json()
   let timestamp= "&max_timestamp=" + data.result[data.result.length-1].timestamp
   for (let i=0;i<=5;i++){
       const newData = await (await fetch(url+timestamp)).json()
       timestamp = "&max_timestamp=" + newData.result[newData.result.length-1].timestamp
        data.result.push(...newData.result)
   }
   console.log(data)
   return data
}

export const getVolume = data =>{
    const amountArray = data.map(order => order.amount_sold)
    const total = amountArray.reduce((a,b)=> Number(a)+Number(b))
    return total /(10**18)
}
function msToTime(duration) {
    let milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
       days = Math.floor((duration / (1000 * 60 * 60*24)) % 365);
  
  const answerString = days>1? days + "days ago" :days===1? days + " day ago":
   hours >1 ? hours + " hours ago" :hours===1? hours + " hour ago": minutes > 1? minutes + " minutes ago":minutes===1? minutes + "minute ago":
    seconds >1 ? seconds + " seconds ago" : seconds + "second ago"
    return answerString
  }
export const calculateTime = (timestamp) => {
    const date = new Date()
    const dateT= new Date(timestamp)
    const timeDiff = (date.getTime()-dateT.getTime())

    return msToTime(timeDiff)
}
export const calculateWeek = (timestamp) => {
    const date = new Date()
    const dateT= new Date(timestamp)
    const timeDiff = (date.getTime()-dateT.getTime())
   
    return timeDiff <604800000 ? true:false

}
export const calculateDay = (timestamp) => {
    const date = new Date()
    const dateT= new Date(timestamp)
    const timeDiff = (date.getTime()-dateT.getTime())
   
    return timeDiff <86400000 ? true:false

}
 export const getListingInfo = async (url,url2) => {
  
    let data = await(await fetch(url)).json()

    let tokenAddress
    let tokenId
    let name
    if (data.result.length===0){ 
        data = await(await fetch(url2)).json()
        tokenAddress=data.token_address
        tokenId =  data.token_id
        name = data.name
    }else{
        tokenId =  data.result[0].sell.data.token_id
        tokenAddress=data.result[0].sell.data.token_address
        name=data.result[0].sell.data.properties.name
    }
    console.log(data)

    let soldResults = await getSoldListings(tokenAddress,tokenId,name)
    let soldListings = soldResults[0]
    console.log(soldListings)
    let soldCollectionListings = soldResults[1]

    let similarResults = await getSimilarListings(tokenAddress,tokenId)
   let similarListings = similarResults[0]
   let similarCollection= similarResults[1]
   console.log(similarCollection)
  const results ={data, similarListings,similarCollection, soldListings , soldCollectionListings} 
  console.log(results)
  return results

}

export const useGetListingInfo =  (url,url2) => {
    const {data, error} = useSWR([url,url2], getListingInfo)
 
    return{
        data,
        isLoading: !error && !data,
        isError:error
    }
}


const getSimilarListings= async (tokenAddress,tokenId,name)=>{
 let similarListings={result:[]}
    try{
     similarListings = await (await fetch(`https://api.x.immutable.com/v1/orders?status=active&sell_token_name=${name}&sell_token_address=${tokenAddress}`)).json() 
    }catch(err){console.log(err)}
    similarListings.result=similarListings.result.filter(item=> item.sell.data.token_address===tokenAddress)
    let collectionListings = await (await fetch(`https://api.x.immutable.com/v1/orders?status=active&sell_token_address=${tokenAddress}`)).json()

    return [similarListings,collectionListings]
}

const getSoldListings = async (tokenAddress,tokenId,name) =>{
   let soldListings={result:[]}
    try{
    let soldListings = await(await fetch(`https://api.x.immutable.com/v1/orders?status=filled&sell_token_name=${name}&sell_token_address=${tokenAddress}`)).json()
   }catch(err){console.log(err)}
    soldListings.result=soldListings.result.filter(item=> item.sell.data.token_address===tokenAddress)
     console.log(soldListings)  
    let collectionSoldListings = await (await fetch(`https://api.x.immutable.com/v1/orders?status=filled&sell_token_address=${tokenAddress}`)).json()

    return [soldListings,collectionSoldListings]


}

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