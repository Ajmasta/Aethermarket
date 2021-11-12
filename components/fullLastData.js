//component should be url agnostic 
//render in a table
import styles from "./styles/fullLastData.module.css"
import Link from 'next/link'
import useSWR from 'swr'
import { useState } from "react"
import FullLastSold from "./fullLastSold"
import FullLastListed from "./fullLastListed"
import { calculateTime, useGetBothDataLong, useGetData, useGetListingsLong, useGetSingleCollection } from "./functions/functions"
import AppsIcon from '@mui/icons-material/Apps';
import AssessmentIcon from '@mui/icons-material/Assessment';
import collections from "../components/functions/collectionRankings.json"

const FullLastData = ({collection})=>{
    const collectionRanking = collections[collection]
    console.log(collectionRanking)
    const [status, setStatus] = useState("active")
    const [sortBy,setSortBy] = useState("&order_by=buy_quantity&direction=asc")
    const [metadata,setMetadata] = useState()
    const [filtersMetadata,setFiltersMetadata] = useState()
    const [urlMetadata,setUrlMetadata]= useState()
    const [openFilters,setOpenFilters] = useState([])

const {data, isLoading,isError} = useGetListingsLong(`https://api.x.immutable.com/v1/orders?page_size=999999&sell_token_address=${collection}${sortBy}${metadata}`)
console.log(data)

const {collectionData, isLoadingCollection,isErrorCollection}=useGetSingleCollection(` https://api.x.immutable.com/v1/collections/${collection}`)



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

const filterArray = (input,data) =>{
    const filteredData = data.listings.filter(item=>{
        
        //if (item.sell.data.properties.name.includes(input)) return true
        if (item.sell.data.token_id.includes(input)) return true

        return false
    })
    setFilteredData(filteredData)
} 

const createFilters =() => {
    const filters = collections[collection].listOfTraits
    console.log(filters)
   let titles =[]
   let listOf=[]
    for(let object in filters ){
     
         titles.push(object)
         listOf.push(filters[object])
         
    }

    return (<div className={styles.filtersContainer}>
        {titles.map((title,i)=>(
            <div key={`${i}-filterContainer`} className={styles.filterContainer}>
           
            <div className={styles.filterTitle} onClick={()=>{if (openFilters.includes(i)){
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
            <div className={openFilters.includes(i)? styles.filterList:styles.hidden}>{listOf[i].map(element=><>
            
             <div className={styles.traitContainer} onClick={()=>{
                }} key={element}>
                
                <p className={styles.traitName}>{element[0]} </p>
             <p className={styles.traitPercentage}>{element[1]/100}%</p> <input type="checkbox" onChange={(e)=>{
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
    
    <div className={styles.container}>
    <div className={styles.topContainer}>
    {isLoadingCollection || isErrorCollection? "loading":
             <>

        <div className={styles.profileContainer}>
        <img className={styles.profileImage} src={collectionData.collection_image_url}/>
            <p className={styles.collectionName}>{collectionData.name}</p>
        </div>
        <div className={styles.tabs}>
        <button className={status==="rankings"? styles.activeTab:styles.inactiveTab} onClick={()=>setStatus("rankings")}>
            <AppsIcon />{" "} Ranking</button>
            <button className={status==="active"? styles.activeTab:styles.inactiveTab} onClick={()=>setStatus("active")}>
            <AppsIcon />{" "} Listings</button>
            <button className={status==="filled"? styles.activeTab:styles.inactiveTab} onClick={()=>setStatus("filled")}>
             <AssessmentIcon /> {" "}  Sales</button>
        </div>
    </>
    }
    </div>
    {status==="filled"?
    isLoading || isError? "loading":<FullLastSold data={data} collection={collection} calculateTime={calculateTime}  />
     :status==="active"?
     <div className={styles.listingsContainer}>    {collection && collections[collection]? createFilters():""}
      {isLoading || isError? "loading": data.listings.length<1? "No Listings!" :<FullLastListed data={data} collection={collection} setSortBy={setSortBy} sortBy={sortBy}  />}
       </div>
       :
       collectionRanking.ranksArray.map(element=><p key={element}>{element+1}</p>)
    }
</div>

   
   
)
}
//fetch all active listings before result, use swrinfinite for sales
export default FullLastData