import styles from "./styles/fullLastListed.module.css"
import Link from 'next/link'
import useSWR from 'swr'
import { useEffect, useState } from "react"
import { calculateTime } from "./functions/functions"
import ethLogo from "../public/images/ethLogo.png"
import Image from 'next/image'
import { Line } from 'react-chartjs-2';

const FullLastListed=({data})=>{
const [filteredData,setFilteredData] = useState([])
const filterArray = (input,data) =>{
    const filteredData = data.listings.filter(item=>{
        
        if (item.sell.data.properties.name.includes(input)) return true
        if (item.sell.data.token_id.includes(input)) return true

        return false
    })
    setFilteredData(filteredData)
} 
data.listings.sort((a,b) =>Number(a.buy.data.quantity/(10**18)) > Number(b.buy.data.quantity/(10**18)) ? 1:-1)
const [numberOfItems,setNumberOfItems] = useState(15)
console.log(data)
const createSimilarListings = (array, numberOfItems) =>{
    array = array.slice(0,numberOfItems)
    return (array.map((result,i)=>
       
       
       <Link  key={i} href={`./${result.sell.data.token_address}/${result.sell.data.token_id}`} >
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
    <div className={styles.mainContainer} >
  <div className={styles.filterTab}>

  <input className={styles.inputFilter} onChange={(e)=>{e.target.value.length>2? filterArray(e.target.value,data):""}}type="text" placeholder="Search name or token ID"></input>
  </div>
    <div className={styles.bottomImagesContainer} >
    {filteredData.length===0? createSimilarListings(data.listings, numberOfItems):
    createSimilarListings(filteredData, numberOfItems)}
  
    </div>
    <div onClick={()=>setNumberOfItems(numberOfItems+8)}  
        className={ `${styles.moreButton}`}>
        { "Load More"}
        </div>
</div>
)
}
export default FullLastListed