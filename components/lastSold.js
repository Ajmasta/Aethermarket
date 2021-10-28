import styles from "./styles/lastSold.module.css"
import Image from 'next/image'
import ethLogo from "../public/images/ethLogo.png"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Link from 'next/link'
import { useEffect, useState } from "react";

const LastSold = ({data}) => {
    const [translateLeft,setTranslateLeft] = useState(0)
    useEffect(()=>{
    const salesContainer=document.getElementById("salesContainer")
    console.log(translateLeft)
    salesContainer.scrollLeft = translateLeft
    },[translateLeft])
    const createSimilarListings = (array, numberOfItems) =>{
        array = array.slice(0,numberOfItems)
        return (array.map((result,i)=>{
           console.log(result,i)

           return (
           
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
            </Link>)}
           )
        )
    }
console.log(data)
 
    return(
<div>

<div className={styles.title} ><h3>Last Sold </h3></div>
<div className={styles.container}>
<div className={styles.arrowContainerRight} onClick={(e)=>setTranslateLeft(translateLeft+400)}><ArrowForwardIosIcon height={"100px"}/></div>
<div className={styles.arrowContainerLeft} onClick={(e)=>setTranslateLeft(0)}><ArrowBackIosNewIcon height={"100px"}/></div>
<div className={styles.bottomImagesContainer} id="salesContainer"  >
{createSimilarListings(data.sales,15)}
</div>
</div>
</div>
    )}
  export default LastSold