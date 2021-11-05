import { useState } from "react"
import styles from "./styles/userAccount.module.css"
import AppsIcon from '@mui/icons-material/Apps';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import Link from 'next/link'


const UserAccount = ({userId, data}) => {
    const [status,setStatus] = useState("collection")
    
    
    const createCollection = (array) =>{
        array = data.user.result
        console.log(array)
        return (array.map((result,i)=>
           <Link  key={i} href={`../collections/${result.token_address}/${result.token_id}`} >
            <a className={styles.similarListingsContainer}>
            <div className={styles.similarImageContainer}>
                <img className={styles.similarImage} src={result.image_url} alt="nft icon" />
            </div>
            <div className={styles.similarDescription}>
                <div className={styles.nameDescription}>
               <span className={styles.collectionName}> 
                {result.collection.name} 
               </span>
                {result.token_id} 
                
                </div>
                   
                </div>
            </a>
            </Link>
           )
        )
   
        
        

    }

return (

<div className={styles.mainContainer}> 
    <div className={styles.usernameContainer}>
        <p className={styles.userId}>{userId}</p>
    </div>
<div className={styles.assetContainer}>
    <div className={styles.tabsContainer}>
            <button className={status==="collection"? styles.activeTab:styles.inactiveTab} onClick={()=>setStatus("collection")}>
            <AppsIcon />{" "} Collection</button>
            <button className={status==="listings"? styles.activeTab:styles.inactiveTab} onClick={()=>setStatus("listings")}>
            <LoyaltyIcon />{" "} Listings</button>
            <button className={status==="sales"? styles.activeTab:styles.inactiveTab} onClick={()=>setStatus("sales")}>
             <AssessmentIcon /> {" "}  Sales</button>
        </div>
    </div>
    <div className={styles.assetDisplayContainer}>
    {status==="collection"? createCollection(data):""}
        
    </div>
</div>
)

}



export default UserAccount