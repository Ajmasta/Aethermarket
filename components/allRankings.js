import { useEffect, useState } from "react"
import collections from "../components/functions/collectionRankings.json"
import { useGetRankings } from "./functions/functions"
import Link from 'next/link'
import styles from "./styles/fullLastListed.module.css"
import { addAOneOrNot } from "./functions/getCollectionsData"
const AllRankings = ({collection}) => {
    const [array,setArray] = useState([])
    const [page,setPage] = useState(0)
    const [loading,setLoading]= useState(false)
    let tokenArray = collections? collections[collection]["ranksArray"].slice(page,page+20):[]
    useEffect(()=>getData(),[page])
    const getData = async ()=>
    {
        const newArray = await Promise.all(tokenArray.map(async token=>{

            const data = await (await fetch(`https://api.x.immutable.com/v1/assets/${collection}/${token}`)).json()
            const order = await (await fetch(`https://api.x.immutable.com/v1/orders?sell_token_id=${token}&sell_token_address=${collection}`)).json()
            if (order.result.length>0) {
            data.status=order.result[0].status
            data.price=order.result[0].buy.data.quantity/10**18
            }
            
            return  data
        }))
        console.log(newArray)
    setArray(newArray)
    }

    const createSimilarListings = (array) =>{
        return (array.map((result,i)=>
        
        <Link  key={i} href={`./${result.token_address}/${result.token_id}`} >
            <a className={styles.similarListingsContainer}>
            <div className={styles.similarImageContainer}>
                <img className={styles.similarImage} src={result.image_url} alt="nft icon" />
            </div>
            <div className={styles.similarDescription}>
                <div className={styles.nameDescription}>
            <span className={styles.collectionName}> 
                {result.collection.name} 
            </span>
                {result.name} 
                
                </div>
    {result.status==="active"||result.status==="filled"?
        <div className={styles.priceDescription}>
            <div className={styles.nameDescription}>
            <span className={styles.priceName}> 
            {result.status==="filled"? <p className={styles.soldLabel}>Sold</p>:<p className={styles.listedLabel}>Listed</p>} 
            </span>
            </div>
        <span className={styles.priceQuantity}>
        {result.price}
        </span>
        
        </div> :""}
        {collections[collection]? <p className={styles.rankContainer}>Rank:{collections[collection]["ranksArray"].indexOf(Number(result.token_id))+1}</p>:""}
                </div>
            </a>
            </Link>
        )
        )

    }

    console.log(array)
        return (<> 
        <div className={styles.bottomImagesContainer} >
        <button onClick={()=>{setPage(page+20); setLoading(true);setTimeout(()=>setLoading(false),1000)}}>Hit</button>

        {!loading?createSimilarListings(array):"Loading"}
        </div>
        
        
        </>)
}



export default AllRankings