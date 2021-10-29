import styles from "./styles/lastSold.module.css"
import Image from 'next/image'
import useSWR from 'swr'
import Link from 'next/link'
import ethLogo from "../public/images/ethLogo.png"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useEffect, useState } from "react";
const LastListed = ({data}) => {
    const [translateLeft,setTranslateLeft] = useState(0)
    useEffect(()=>{
    const listingContainer=document.getElementById("listingContainer")
    console.log(translateLeft)
    listingContainer.scrollLeft = translateLeft
    },[translateLeft])
    const createSimilarListings = (array, numberOfItems) =>{
        array = array.slice(0,numberOfItems)
        return (array.map((result,i)=>
           
           
           <Link  key={i} href={`./collections/${result.sell.data.token_address}/${result.sell.data.token_id}`} >
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
  
 return(
<div className={styles.mainContainer}>

<div className={styles.title} ><h3>Last Listed </h3></div>
<div className={styles.container}>
<div className={styles.arrowContainerRight} onClick={(e)=>setTranslateLeft(translateLeft+400)}><ArrowForwardIosIcon height={"100px"}/></div>
<div className={styles.arrowContainerLeft} onClick={(e)=>setTranslateLeft(0)}><ArrowBackIosNewIcon height={"100px"}/></div>
<div className={styles.bottomImagesContainer} id="listingContainer"  >
{createSimilarListings(data.listings,15)}
</div>
</div>
</div>
    )
}
//use token address to make links to collection or item


  export default LastListed