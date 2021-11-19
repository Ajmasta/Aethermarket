import { useEffect, useState } from "react"
import styles from "./styles/userAccount.module.css"
import AppsIcon from '@mui/icons-material/Apps';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import Link from 'next/link'
import collections from "./functions/collectionRankings.json"
import ethLogo from "../public/images/ethLogo.png"
import Image from 'next/image'
import { calculateTime } from "./functions/functions";
import { useInView } from "react-intersection-observer";
const UserAccount = ({userId, data}) => {
    const [status,setStatus] = useState("collection")
    const [filter,setFilter] = useState("")
    const [array,setArray] = useState([])
    const [numberOfItems,setNumberOfItems] = useState(15)
    const[salesTab,setSalesTab] = useState("sold")
console.log(data)
const { ref, inView, entry } = useInView();

  useEffect(()=>setNumberOfItems(numberOfItems+10),[inView])
  
    const getData = async (array)=>
    {
console.log(array)
        if(filter==="" && array.user.result){
        const newArray = array.user.result.map(element=>{
            
            const listedElement = array.listed.result.filter(listing=>
                                            listing.sell.data.token_address === element.token_address &&
                                            listing.sell.data.token_id === element.token_id &&
                                            listing.status==="active"
                                            )

                if(listedElement.length>0) {

                    element.price = listedElement[0].buy.data.quantity/10**18
                    element.status="active"
                }


                return element
                }  )
                console.log(newArray)
                setArray(newArray)
        }
        else if (data.user.result){
            const filterArray = array.user.result.filter(element=>element.token_id===filter || element.name.includes(filter))
            if (order.result.length>0) {
                data.status=order.result[0].status
                data.price=order.result[0].buy.data.quantity/10**18
                }
                 if(data.name)setArray([data])
        }
   
    }
    useEffect(()=>getData(data),[])

    const createCollection = (array) =>{
        
        return (array.map((result,i)=>
        
        <Link  key={i} href={`/collections/${result.token_address}/${result.token_id}`} >
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
        {result.price} <Image alt="ethereum logo" src={ethLogo} width={15} height={15} />
        </span>
        
        </div> :""}
        {collections[result.token_address]? <p className={styles.rankContainer}>Rank:{collections[result.token_address]["ranksArray"].indexOf(Number(result.token_id))+1}</p>:""}
                </div>
            </a>
            </Link>
        )
        )

    }
    const createSalesTable = (sold,numberOfItems) =>{
        const arrayLength = sold.length

        const boughtArray = sold.filter(element=> element.buy.type==="ERC721")
        const soldArray = sold.filter(element=>element.buy.type==="ETH")
        sold.sort((result, result2)=> result.updated_timestamp < result2.updated_timestamp ? 1:-1)
        sold = sold.slice(0,numberOfItems)
        
        if (sold.length===0) return "No sales yet!"
    
    return (
        
        <div className={styles.tableContainer}>
        <div className={`${styles.tableRow} ${styles.tableFirstRow}`}>
            <p className={styles.tableCell}>Item</p>
            <p className={styles.tableCell}>Price</p>
            <p className={`${styles.tableCell} ${styles.quantityCell}`}>Ranking</p>
            <p className={styles.tableCell}>Time</p>
        </div>
        {soldArray.map((item,i)=>
        <div key={"tableRow"+i} className={styles.tableRow}>
        <Link className={styles.tableCell} href={`/collections/${item.sell.data.token_address}/${item.sell.data.token_id}`}>
            <a className={`${styles.tableCell} ${styles.nameCell}`}>
            <img className={styles.tableImage} src={item.sell.data.properties.image_url} /> 
             {item.sell.data.properties.name}
            </a>
        </Link>
            <div className={styles.tableCell}>{item.buy.data.quantity/(10**18)} <Image src={ethLogo} width={15} height={15} alt="eth logo"/></div>
            {collections[item.sell.data.token_address]&&collections[item.sell.data.token_address]["ranksArray"]?<p className={`${styles.tableCell} ${styles.quantityCell}`}>
                #{collections[item.sell.data.token_address]["ranksArray"].indexOf(Number(item.sell.data.token_id))}
            </p>:""}
            <p className={styles.tableCell}>{calculateTime(item.updated_timestamp)}</p>
        </div>
        )}
        <div ref={ref}> 
        
        </div> 
    </div>
    
    )
    }
  const  createBoughtTable= (sold,numberOfItems) =>{
        const arrayLength = sold.length

        const boughtArray = sold.filter(element=> element.buy.type==="ERC721")
        const soldArray = sold.filter(element=>element.buy.type==="ETH")
        sold.sort((result, result2)=> result.updated_timestamp < result2.updated_timestamp ? 1:-1)
        sold = sold.slice(0,numberOfItems)
        
        if (sold.length===0) return "No sales yet!"
    
    return (
        
        <div className={styles.tableContainer}>
        <div className={`${styles.tableRow} ${styles.tableFirstRow}`}>
            <p className={styles.tableCell}>Item</p>
            <p className={styles.tableCell}>Price</p>
            <p className={`${styles.tableCell} ${styles.quantityCell}`}>Ranking</p>
            <p className={styles.tableCell}>Time</p>
        </div>
        {boughtArray.map((item,i)=>
        <div key={"tableRow"+i} className={styles.tableRow}>
        <Link className={styles.tableCell} href={`/collections/${item.buy.data.token_address}/${item.buy.data.token_id}`}>
            <a className={`${styles.tableCell} ${styles.nameCell}`}>
            <img className={styles.tableImage} src={item.buy.data.properties.image_url} /> 
             {item.buy.data.properties.name}
            </a>
        </Link>
            <div className={styles.tableCell}>{item.sell.data.quantity/(10**18)} <Image src={ethLogo} width={15} height={15} alt="eth logo"/></div>
            {collections[item.buy.data.token_address]&&collections[item.buy.data.token_address]["ranksArray"]?<p className={`${styles.tableCell} ${styles.quantityCell}`}>
                #{collections[item.buy.data.token_address]["ranksArray"].indexOf(Number(item.buy.data.token_id))}
            </p>:""}
            <p className={styles.tableCell}>{calculateTime(item.updated_timestamp)}</p>
        </div>
        )}
        <div ref={ref}> 
        
        </div> 
    </div>
    
    )
    }
    const createListings = (array) =>{
        return (array.map((result,i)=>
        
        <Link  key={i} href={`/collections/${result.token_address}/${result.token_id}`} >
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
    {result.status==="active"||result.status==="filled"?
        <div className={styles.priceDescription}>
            <div className={styles.nameDescription}>
            <span className={styles.price}> 
           <p className={styles.priceLabel}>Price</p> 
            </span>
            </div>
        <span className={styles.priceQuantity}>
        {result.buy.data.quantity/10**18} <Image alt="ethereum logo" src={ethLogo} width={13} height={13} />
        </span>
        
        </div> :""}
        {collections[result.sell.data.token_address]? <p className={styles.rankContainer}>Rank:{collections[result.sell.data.token_address]["ranksArray"].indexOf(Number(result.sell.data.token_id))+1}</p>:""}
                </div>
            </a>
            </Link>
        )
        )

    }


return (

<div className={styles.mainContainer}> 
    <div className={styles.usernameContainer}>
        <p className={styles.userId}>{userId.slice(0,5)+"..."+userId.slice(userId.length-5,userId.length-1)}</p>
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
    {status==="collection"?data.user.result? createCollection(array):"No items in collection":
    
    status==="listings"?
            createListings(data.listed.result)
            :
            <>
            <div className={styles.tabsContainerSales}>
                <p onClick={()=>setSalesTab("sold")} className={salesTab==="sold"?styles.activeTabSales: styles.inactiveTabSales}>Sold</p>
                <p onClick={()=>setSalesTab("bought")} className={salesTab==="bought"?styles.activeTabSales: styles.inactiveTabSales}>Bought</p>
            </div>
            
            {salesTab==="sold"?
            createSalesTable(data.sold.result)
            :
            createBoughtTable(data.sold.result)
            }


            </>
}
        
    </div>
</div>
)

}



export default UserAccount