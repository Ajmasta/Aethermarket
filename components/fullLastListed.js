import styles from "./styles/fullLastListed.module.css"
import Link from 'next/link'
import useSWR from 'swr'
import { useEffect, useState } from "react"
import { calculateTime } from "./functions/functions"
import ethLogo from "../public/images/ethLogo.png"
import Image from 'next/image'
import { Line } from 'react-chartjs-2';
import collections from "../components/functions/collectionRankings.json"
import queryString from "query-string"
const FullLastListed=({data,setSortBy,sortBy,collection})=>{
    const [extraFilters,setExtraFilters]=useState("")
    const [input,setInput] = useState("")
    
   if (input.length>0 && isNaN(input)) setInput("")
const filteredData = data.listings.filter(item=>{
            //if (item.sell.data.properties.name.includes(input)) return true
            if (item.sell.data.token_id===(input)) return true
    
            return false
        })
      
    sortBy==="&order_by=buy_quantity&direction=asc"?data.listings.sort((a,b)=>a.buy.data.quantity-b.buy.data.quantity) :""
  
    extraFilters==="rankings"? data.listings.sort((a,b)=> collections[collection]["ranksArray"].indexOf(Number(a.sell.data.token_id))-collections[collection]["ranksArray"].indexOf(Number(b.sell.data.token_id))):""
    const [numberOfItems,setNumberOfItems] = useState(15)
    const createSimilarListings = (array, numberOfItems) =>{
        array = array.slice(0,numberOfItems)
        return (array.map((result,i)=>
        
        <>
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
        {collections[collection]? <p className={styles.rankContainer}>Rank:{collections[collection]["ranksArray"].indexOf(Number(result.sell.data.token_id))+1}</p>:""}
                </div>
            </a>
            </Link>
            {numberOfItems<array.length?
            <div onClick={()=>setNumberOfItems(numberOfItems+8)}  
            className={ `${styles.moreButton}`}>
            { "Load More"}
            </div>:""}
            </>
        )
        )
    
    }
    console.log(sortBy)
    return (
        <div className={styles.mainContainer} >
    
    <div className={styles.filterTab}>
    <input className={styles.inputFilter} onChange={(e)=>{setInput(e.target.value)}} type="number" placeholder="Search token ID"></input>
    <select id="filter" value={extraFilters===""?sortBy:extraFilters} name="filter" onChange={(e)=>{if(e.target.value!=="rankings"){
                                                                                                setExtraFilters("")
                                                                                                setSortBy(e.target.value)}
                                                                                                else{
                                                                                                    setExtraFilters("rankings")}}}>
    <option value="&order_by=buy_quantity&direction=asc"  >Lowest Price</option>
    <option value="&order_by=buy_quantity&direction=desc"  >Highest price</option>
    <option value="&order_by=created_at&direction=asc"  >Newly Listed</option>
    <option value="rankings">Rankings</option>
    </select>
    </div>
        <div className={styles.bottomImagesContainer} >
        {input.length===0? createSimilarListings(data.listings, numberOfItems):
        createSimilarListings(filteredData, numberOfItems)}
    
        </div>
        
    </div>
    )
}
export default FullLastListed