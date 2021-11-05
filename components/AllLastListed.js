import Link from 'next/link'
import { useState } from 'react'
import { calculateTime, fetcher, useGetData } from "./functions/functions"
import styles from "./styles/allLastListed.module.css"
import ethLogo from "../public/images/ethLogo.png"
import Image from 'next/image'
const AllLastListed = ({data}) => {
    console.log(data)
    data.listings.sort((result, result2)=> result.updated_timestamp < result2.updated_timestamp ? 1:-1)
    const [dataCut, setDataCut] = useState(data.listings.slice(0,100))
    const createSimilarListings = (array, numberOfItems) =>{
        array = array.slice(0,numberOfItems)
        return (array.map((result,i)=>
           
           
           <Link  key={i} href={`../collections/${result.sell.data.token_address}/${result.sell.data.token_id}`} >
            <a className={styles.similarListingsContainer}>
            <div className={styles.similarImageContainer}>
                <img className={styles.similarImage} src={result.sell.data.properties.image_url} alt="nft icon" />
            </div>
            <div className={styles.similarDescription}>
                <div className={styles.nameDescription}>
               <span className={styles.collectionName}> 
                {result.sell.data.properties.collection.name} 
               </span>
                {result.sell.data.properties.name} 
                
                </div>
    
           <div className={styles.priceDescription}>
              <div className={styles.nameDescription}>
               <span className={styles.collectionName}> 
               Price 
               </span>
               </div>
           {result.buy.data.quantity/(10**18)} <Image alt="ethereum logo" src={ethLogo} width={15} height={15} /></div>  
                   
                </div>
            </a>
            </Link>
           )
        )
    }
  
    return (
        
<div className={styles.allListingsContainer}>
    { dataCut?createSimilarListings(dataCut):""}
    <button onClick={()=>setDataCut(data.listings.slice(0,dataCut.length+100))}>More Results</button>
    </div>)
    


}

export default AllLastListed