import styles from "./styles/lastSold.module.css"
import Image from 'next/image'
import useSWR from 'swr'
import LastListed from "./lastListed"
import LastSold from "./lastSold"
import { useGetBothData, useGetData } from "./functions/functions"

const LastDisplay = ({finalData}) => {
    
const {data, isLoading,isError} = useGetBothData("https://api.x.immutable.com/v1/orders?page_size=15&sell_token_type=ERC721")
console.log(data)
    return(
        <>
        {data?<>
        <LastSold data={data}/>
        <LastListed data={data}/>
    
        </>:""}
        </>
    )
}
//use token address to make links to collection or item


  export default LastDisplay

  /*

      const fetcher = async url => {
        const listings = []
        const sales = [] 
        console.log("called")
        const data = await (await fetch(url)).json()
        data.result.filter(order=> {
            order.status==="active"? listings.push(order):order.amount_sold? sales.push(order):""
        })
        
        const finalData = {listings,sales}
        return finalData
    }

const useGetData= url => {
    const {data, error} = useSWR(url,fetcher)
    return{
        data,
        isLoading: !error && !data,
        isError:error
    }
} 

*/