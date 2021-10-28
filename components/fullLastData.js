//component should be url agnostic 
//render in a table
import styles from "./styles/fullLastData.module.css"
import Link from 'next/link'
import useSWR from 'swr'
import { useState } from "react"
import FullLastSold from "./fullLastSold"
import FullLastListed from "./fullLastListed"
import { calculateTime, useGetBothDataLong, useGetData, useGetListingsLong } from "./functions/functions"
import AppsIcon from '@mui/icons-material/Apps';
import AssessmentIcon from '@mui/icons-material/Assessment';
const FullLastData = ({collection})=>{
    const [status, setStatus] = useState("active")

const {data, isLoading,isError} = useGetListingsLong(`https://api.x.immutable.com/v1/orders?page_size=999999&sell_token_address=${collection}`)
console.log(data)
/*  What is the issue? Too much of a load, and we dont put all the cards. Ability to load by last listings, and by  */
return(
    
    <div className={styles.container}>
    
    {isLoading || isError? "loading":
             <>

        <div className={styles.profileContainer}>
        <img className={styles.profileImage} src={status==="active"? data.listings[0].sell.data.properties.collection.icon_url:
            data.listings[0].sell.data.properties.collection.icon_url}/>
            <p className={styles.collectionName}>{status==="active"? data.listings[0].sell.data.properties.collection.name:
            data.listings[0].sell.data.properties.collection.name}</p>
        </div>
        <div className={styles.tabs}>
            <button className={status==="active"? styles.activeTab:styles.inactiveTab} onClick={()=>setStatus("active")}>
            <AppsIcon />{" "} Listings</button>
            <button className={status==="active"? styles.inactiveTab:styles.activeTab} onClick={()=>setStatus("filled")}>
             <AssessmentIcon /> {" "}  Sales</button>
        </div>
    </>
    }
    
    {isLoading || isError? "loading":status==="filled"?
       <FullLastSold data={data} collection={collection} calculateTime={calculateTime}  />
     :
       <FullLastListed data={data} calculateTime={calculateTime} />
    }
</div>
   
   
)
}
//fetch all active listings before result, use swrinfinite for sales
export default FullLastData