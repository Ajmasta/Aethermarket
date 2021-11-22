//component should be url agnostic 
//render in a table
import styles from "./styles/fullLastData.module.css"
import Link from 'next/link'
import useSWR from 'swr'
import { useEffect, useState } from "react"
import FullLastSold from "./fullLastSold"
import FullLastListed from "./fullLastListed"
import { calculateTime, useGetBothDataLong, useGetData, useGetListingsLong, useGetSingleCollection } from "./functions/functions"
import AppsIcon from '@mui/icons-material/Apps';
import AssessmentIcon from '@mui/icons-material/Assessment';
import collections from "../components/functions/collectionRankings.json"
import AllRankings from "./allRankings"
import orderData from "./functions/orderData.json"

const FullLastData = ({collection})=>{
    const collectionRanking = collections[collection]
    
    const [status, setStatus] = useState("active")
    const [sortBy,setSortBy] = useState("&order_by=buy_quantity&direction=asc")
    const [metadata,setMetadata] = useState("")
    const [filtersMetadata,setFiltersMetadata] = useState()
    const [urlMetadata,setUrlMetadata]= useState()
    const [openFilters,setOpenFilters] = useState([])
    const [floorPrice,setFloorPrice]= useState()
const {data, isLoading,isError} = useGetListingsLong(`https://api.x.immutable.com/v1/orders?page_size=999999&include_fees=true&sell_token_address=${collection}${sortBy}${metadata}`)

const {collectionData, isLoadingCollection,isErrorCollection}=useGetSingleCollection(` https://api.x.immutable.com/v1/collections/${collection}`)

const getFloorPrice = async () => {
    const floor = await (await fetch(`https://api.x.immutable.com/v1/orders?&status=active&page_size=1&include_fees=true&sell_token_address=${collection}&order_by=buy_quantity&direction=asc`)).json()
    console.log(floor)
    console.log(`https://api.x.immutable.com/v1/orders?&status=active&page_size=1&include_fees=true&sell_token_address=${collection}&order_by=buy_quantity&direction=asc`)
    if(collection) setFloorPrice(floor.result[0].buy.data.quantity)
}
useEffect(()=>getFloorPrice(),[collection])
const setMetadataForUrl=() =>{

    const filteredObject = {...filtersMetadata}

    for( let object in filteredObject){
        if(filteredObject[object].length===0){
            delete filteredObject[object]
        }


    }
    console.log(filteredObject)

    const stringedObject= encodeURI(JSON.stringify(filteredObject))
    stringedObject.replace(":","%3A")
    stringedObject==="%7B%7D"?setMetadata(""):setMetadata(`&sell_metadata=${stringedObject}`)
    
}



const createFilters =() => {
    const filters = collections[collection].listOfTraits
    const numberItems = collections[collection]?.ranksArray?collections[collection].ranksArray.length:""
    console.log(filters)
   let titles =[]
   let listOf=[]
    for(let object in filters ){
     
         titles.push(object)
         listOf.push(filters[object])
         
    }

    return (
    
    <div className={styles.filtersContainer}>
        {titles.map((title,i)=>(
            <div key={`${i}-filterContainer`} className={styles.filterContainer}>
           
            <div className={styles.filtersTitle} onClick={()=>{if (openFilters.includes(i)){
                let newArray = [...openFilters]
                newArray.splice(openFilters.indexOf(i),1)
                
            setOpenFilters(newArray)}
            else{
            const newArray = [...openFilters]
            newArray.push(i)
            setOpenFilters(newArray)}
            let object = {...filtersMetadata}
            if (object[title]){
            }else{
            object[title]= []
            }
            setFiltersMetadata(object)
            
            } }>
                {title}
            </div>
            <div className={openFilters.includes(i)? styles.filtersList:styles.hidden}>{listOf[i].map(element=><>
            
             <div className={styles.traitContainer} onClick={()=>{
                }} key={element+i}>
                
                <p className={styles.traitName}>{element[0]} </p>
             {numberItems!==""?<p className={styles.traitPercentage}>{(element[1]/numberItems*100).toFixed(2)}%</p>:""}
             <input type="checkbox" onChange={(e)=>{
                    let object = {...filtersMetadata}
                    console.log(e.target.checked,element)
                    if (e.target.checked){
                    object[title].push(element[0])
                    }else{
                        object[title].splice(object[title].indexOf(element[0]),1)
                        console.log(object)
                    }
                    setFiltersMetadata(object)
                    setMetadataForUrl()
             }} />
             </div>
             </>
             )}</div>
            </div>

        ))}

    </div>
    )
}





return(
    
    <div className={styles.container} >
    <div className={styles.topContainer}>
    {isLoadingCollection || isErrorCollection? "loading":
             <>

        <div className={styles.profileContainer}>
        <img className={styles.profileImage} src={collectionData.collection_image_url}/>
            <p className={styles.collectionName}>{collectionData.name}</p>
        </div>
        <div className={styles.statsContainer}>
          {collections[collection] && data? 
          <>
          {collections[collection]["ranksArray"]?
          <>
           <div className={styles.statsBox}>
           <p className={styles.statsNumber}> {collections[collection]["ranksArray"].length} </p>
           <p className={styles.statsText}> Items </p>
           </div>
           <div className={styles.statsBox}>
           <p className={styles.statsNumber}> {collections? collections[collection]["users"]:""}</p>
           <p className={styles.statsText}>  Owners </p>
           </div>
           </>
           :""
          }
           <div className={styles.statsBox}>
           <p className={styles.statsNumber}> {floorPrice/10**18} </p>
           <p className={styles.statsText}> Floor Price </p>
           </div>
           {collections[collection]["ranksArray"]?
           <div className={styles.statsBox}>
           <p className={styles.statsNumber}> {(data.listings.length/collections[collection]["ranksArray"].length*100).toFixed(2)}%</p>
           <p className={styles.statsText}> listed </p>
           </div>:""}
           <div className={styles.statsBox}>
           <p className={styles.statsNumber}> {orderData? (orderData["all"][collectionData.name]/1000).toFixed(2):""}K</p>
           <p className={styles.statsText}>  Volume </p>
           </div>
      
         </>
            
            :""}
        </div>
        <div className={styles.tabs}>
        {collections[collection]?.ranksArray?
        <button className={status==="rankings"? styles.activeTab:styles.inactiveTab} onClick={()=>setStatus("rankings")}>
            <AppsIcon />{" "} Rankings</button>:""}
            <button className={status==="active"? styles.activeTab:styles.inactiveTab} onClick={()=>setStatus("active")}>
            <AppsIcon />{" "} Listings</button>
            <button className={status==="filled"? styles.activeTab:styles.inactiveTab} onClick={()=>setStatus("filled")}>
             <AssessmentIcon /> {" "}  Sales</button>
        </div>
    </>
    }
    </div>
    {status==="filled"?
    isLoading || isError? "loading":data.listings.length<1?"No sales!":<FullLastSold name={collectionData.name} data={data} collection={collection} calculateTime={calculateTime}  />
     :status==="active"?
     <div className={styles.listingsContainer}>   
      {collection && collections[collection]? createFilters():""}
      {isLoading || isError? "": data.listings.length<1? "No Listings!" :<FullLastListed data={data} collection={collection} setSortBy={setSortBy} sortBy={sortBy}  />}
       </div>
       :
       collections[collection]? 
       isLoading || isError? "loading":
       <AllRankings data={data} collection={collection} />
       :"No Ranking data for this collection"
    }
</div>

   
   
)
}
//fetch all active listings before result, use swrinfinite for sales
export default FullLastData