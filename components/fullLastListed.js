import styles from "./styles/fullLastListed.module.css"
import Link from 'next/link'
import useSWR from 'swr'
import { useEffect, useState } from "react"
import { calculateTime } from "./functions/functions"
import ethLogo from "../public/images/ethLogo.png"
import Image from 'next/image'
import { Line } from 'react-chartjs-2';

const FullLastListed=({data,setSortBy,sortBy})=>{
const [filteredData,setFilteredData] = useState([])
const filterArray = (input,data) =>{
    const filteredData = data.listings.filter(item=>{
        
        //if (item.sell.data.properties.name.includes(input)) return true
        if (item.sell.data.token_id.includes(input)) return true

        return false
    })
    setFilteredData(filteredData)
} 
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
           <span className={styles.priceName}> 
           Price 
           </span>
           </div>
       <span className={styles.priceQuantity}>
       {result.buy.data.quantity/(10**18)} <Image alt="ethereum logo" src={ethLogo} width={15} height={15} />
       </span>
       </div>  
               
            </div>
        </a>
        </Link>
       )
    )
   
}
console.log(sortBy)
return (
    <div className={styles.mainContainer} >
  <div className={styles.filterTab}>

 
  <input className={styles.inputFilter} onChange={(e)=>{e.target.value.length>2? filterArray(e.target.value,data):""}}type="text" placeholder="Search name or token ID"></input>
  <select id="filter" name="filter" onChange={(e)=>setSortBy(e.target.value)}>
  <option value="&order_by=buy_quantity&direction=asc" selected={sortBy==="&order_by=buy_quantity&direction=asc"? true:false} >Lowest Price</option>
  <option value="&order_by=buy_quantity&direction=desc"  selected={sortBy==="&order_by=buy_quantity&direction=desc"? true:false}>Highest price</option>
  <option value="&order_by=created_at&direction=asc" selected={sortBy==="&order_by=created_at&direction=asc"? true:false} >Newly Listed</option>
</select>
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