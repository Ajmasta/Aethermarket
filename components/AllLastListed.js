import Link from 'next/link'
import { useState } from 'react'
import { calculateTime, fetcher, useGetData } from "./functions/functions"
import styles from "./styles/allLastListed.module.css"

const AllLastListed = ({data}) => {
    console.log(data)
    data.listings.sort((result, result2)=> result.updated_timestamp < result2.updated_timestamp ? 1:-1)
    const [dataCut, setDataCut] = useState(data.listings.slice(0,100))
   
  
    return (
        
<div className={styles.allListingsContainer}>
    { dataCut?dataCut.map((order,i)=> 
    <div className={styles.listingContainer} key={i}>
    <div className={styles.imageContainer}>

    {order.buy.data.properties?.image_url?
        <img className={styles.image} alt="image of the NFT" src={order.buy.data.properties?.image_url}  />
        :
        <img className={styles.image} alt="image of the NFT" src={order.sell.data.properties?.image_url}  />
    
    }
    
    
    </div>
    <div className={styles.listingDescription}>
    Listing Price:
    {
        order.amount_sold >10000000000 ? order.amount_sold/(10**18) : order.buy.data.quantity/(10**18)
        
    } 
    <br/> 
    {
        order.buy.type==="ERC721"? 
        <>
        <Link href={`../collections/${order.buy.data.token_address}`}>
        <a>{order.buy.data.properties.collection.name} </a> 
    
        </Link>
        <br/>{order.buy.data.token_id} <br/> 
        </>
        :
        <>
         <Link href={`../collections/${order.sell.data.token_address}`}>
            <a>{order.sell.data.properties.collection.name}</a>
           
         </Link>
         <br/> {order.sell.data.token_id} <br/> 
         </>
    }
    {calculateTime(order.updated_timestamp)}
    
    </div>
    
    </div>):""}
    <button onClick={()=>setDataCut(data.listings.slice(0,dataCut.length+100))}>More Results</button>
    </div>)
    


}

export default AllLastListed