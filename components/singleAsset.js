import { useState } from "react"
import { calculateTime, getListingInfo, useGetListingInfo } from "./functions/functions"
import styles from "./styles/singleListing.module.css"
import { Scatter } from 'react-chartjs-2';
import ethLogo from "../public/images/ethLogo.png"
import Image from 'next/image'
import Link from 'next/link'
import PersonIcon from '@mui/icons-material/Person';
import { fillOrder, sellAsset } from "./functions/ImxFunctions";
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';
  import { accountAtom, assetsAtom } from "./states/states";
  import collections from "../components/functions/collectionRankings.json"


const SingleAsset = ({data}) => {

    const listingData= data.data
    const thisAsset = data.data
    const collection = data.data.token_address
    const account= useRecoilValue(accountAtom)
    const [assets,setAssets] = useRecoilState(assetsAtom)
    const [sell,setSell]=useState("")
    const user = localStorage.getItem("WALLET_ADDRESS")
    if (data.similarListings.result.length > 0 && data.similarListings.result.length <=99)  
        data.similarListings.result.push(...data.similarCollection.result.slice(0,100-data.similarListings.result.length))
    if (data.soldListings.result.length > 0 && data.soldListings.result.length <=99)  
        data.soldListings.result.push(...data.soldListings.result.slice(0,100-data.soldListings.result.length))
    const isSimilarListing = data.similarListings.result.length > 0? true:false
    const isSimilarSold = data.soldListings.result.length > 0? true:false
    const [numberOfItems, setNumberOfItems] = useState(5)
    const [shownTab,setShownTab] = useState("sales")
    const [shownTabAsset,setShownTabAsset] = useState("price")

console.log(data)
    const checkOwnerShip = () =>{
        const filteredAssets = assets.result? assets.result.filter(asset=>
            (asset.token_address === listingData.token_address && asset.token_id === listingData.token_id)):[]

        return filteredAssets.length>0? true:false

    }
    const createTraitsTabGodsUnchained = () =>{


        return (<div className={styles.traitsContainer}>
            
            <div className={styles.traitContainer}>
                <p className={styles.traitName}>{"Set"}</p>
                <p className={styles.traitValue}>{thisAsset.metadata.set}</p>
            </div>
            <div className={styles.traitContainer}>
                <p className={styles.traitName}>{"Quality"}</p>
                <p className={styles.traitValue}>{thisAsset.metadata.quality}</p>
            </div>
            <div className={styles.traitContainer}>
                <p className={styles.traitName}>{"Rarity"}</p>
                <p className={styles.traitValue}>{thisAsset.metadata.rarity}</p>
            </div>
            </div>
        )
    
    }
        const createTraitsTab= () =>{
           const listOfTraits = []
     
           for(let object in collections[collection]["listOfTraits"]){
               let rarity
            if(thisAsset.metadata[object]){
              rarity = collections[collection]["listOfTraits"][object].filter(trait=> trait[0]===thisAsset.metadata[object])
                rarity=rarity[0][1]
            listOfTraits.push([object,thisAsset.metadata[object],rarity])
            }
           }
           console.log(listOfTraits.map(traits=><p>{traits[2]}</p>))
           return (<div className={styles.traitsContainer}>
            {listOfTraits.map((trait,i)=>
    
                <div key={`${i}Traits`} className={styles.traitContainer}>
                    <p className={styles.traitName}>{trait[0]}</p>
                    <p className={styles.traitValue}>{trait[1]}</p>
                    <p className={styles.traitRarity}>{trait[2]/100}%</p>
                </div>
    
    
            )}
    
    </div>)
         
        
        }
    
    const getPriceHistoryChart = (data) =>{
        const sold = isSimilarSold? data.soldListings.result:data.soldCollectionListings.result
        const chartData = {
            datasets:[
               
                {
                    label:"Last 10 sales",
                    data:[
                    ],backgroundColor:  'rgba(255, 99, 132, 1)',
                }, {
                    label:"Older sales",
                    hidden:true,
                    data:[
                    ],backgroundColor:  'rgba(255, 199, 22, 1)',hidden:true
                    
                }
            
            ]
        }
        const options= {
            plugins: {
                title: {
                    display: true,
                    text: 'Past sale history of similar items'
                }
            }
        }
        
        const soldPrice = sold.map((result,i)=>{
            i<= 10? chartData.datasets[0].data.push({x:i+1,y:result.buy.data.quantity/(10**18)}):
            chartData.datasets[1].data.push({x:i+1,y:result.buy.data.quantity/(10**18)})
            return result.buy.data.quantity/(10**18)
            })
        
        
        const averagePrice = soldPrice.reduce((a,b)=>a+b)/soldPrice.length

        return <Scatter className={styles.chart} data={chartData} options={options}></Scatter>
    }
    const getCurrentPricesChart = (data) =>{
        const selling = isSimilarSold? data.similarListings.result : data.similarCollection.result
        const chartData = {
            datasets:[
                {
                    label:"10 Cheapest listings",
                    data:[
                    ],backgroundColor:  'rgba(255, 99, 132, 1)',
                }, {
                    label:"Other Listings",
                    data:[
                    ],backgroundColor:  'rgba(255, 199, 22, 1)',hidden:true
                }
            
            ]
        }
        const options= {
            plugins: {
                title: {
                    display: true,
                    text: 'Current average listing price'
                }
            }
        }
        const sellingPrice = selling.map((result,i)=>{
            i<= 10? chartData.datasets[0].data.push({x:i+1,y:result.buy.data.quantity/(10**18)}):
            chartData.datasets[1].data.push({x:i+1,y:result.buy.data.quantity/(10**18)})
            return result.buy.data.quantity/(10**18)
            })
        const medianPrice = sellingPrice[Math.abs(sellingPrice.length/2)]

    
        return <Scatter className={styles.chart} data={chartData} options={options}></Scatter>
    }
    const createSimilarListings = (array) =>{
        return (array.map((result,i)=>
            <Link  key={i} href={`../${result.sell.data.token_address}/${result.sell.data.token_id}`} >
            <a className={styles.similarListingsContainer}>
            <div className={styles.similarImageContainer}>
                <img className={styles.similarImage} src={result.sell.data.properties.image_url} alt="nft icon" />
            </div>
            <div className={styles.similarDescription}>
                    <span>{result.sell.data.properties.name}</span>
                    <span> {result.buy.data.quantity/(10**18)} <Image alt="ethereum logo" src={ethLogo} width={30} height={30} /> </span>
                </div>
            </a>
            </Link>
        )
        )
    }

    const createSalesTable = (array,numberOfItems) =>{
        let sold = isSimilarSold? array.soldListings.result:array.soldCollectionListings.result
        const arrayLength = sold.length
        sold.sort((result, result2)=> result.updated_timestamp < result2.updated_timestamp ? 1:-1)
        sold = sold.slice(0,numberOfItems)


    return (
        
        <div className={styles.tableContainer}>
        <div className={styles.tableRow}>
            <p className={styles.tableCell}>Item</p>
            <p className={styles.tableCell}>Price</p>
            {collections[collection]?<p className={`${styles.tableCell} ${styles.quantityCell}`}>Ranking</p>:""}
            <p className={styles.tableCell}>To</p>
            <p className={styles.tableCell}>Time</p>
        </div>
        {sold.map((item,i)=>{
            return (
        <div key={"tableRow"+i}className={styles.tableRow}>
        <Link className={styles.tableCell} href={`../${item.sell.data.token_address}/${item.sell.data.token_id}`}>
            <a className={styles.tableCell}>
            <img className={styles.tableImage} src={item.buy.type==="ETH"? item.sell.data.properties.image_url:item.buy.data.properties.image_url} /> 
            #{item.sell.data.token_id.slice(0,6)}
            </a>
        </Link>
            <p className={styles.tableCell}>{item.buy.data.quantity/(10**18)}</p>
            {collections[item.sell.data.token_address]?<p className={`${styles.tableCell} ${styles.quantityCell}`}>{collections[collection]["ranksArray"].indexOf(Number(item.sell.data.token_id))}</p>:""}
            <p className={styles.tableCell}>{item.user.slice(0,5)+"..." + item.user.slice(item.user.length-5,item.user.length-1)}</p>
            <p className={styles.tableCell}>{calculateTime(item.updated_timestamp)}</p>
        </div>
            )}
        )}
        <div onClick={()=>setNumberOfItems(numberOfItems+10)} 
        className={numberOfItems < arrayLength? `${styles.tableRow} ${styles.tableSeeMore}`:styles.tableRow}>
        {numberOfItems < arrayLength? "See More Results":""}
        </div>
    </div>



    )
    }
    const createListingsTable = (array,numberOfItems) =>{
        let selling = isSimilarListing? array.similarListings.result : array.similarCollection.result
        console.log(selling)
        const arrayLength = selling.length
        selling.sort((result, result2)=> Number(result.buy.data.quantity) > Number(result2.buy.data.quantity) ? 1:-1)
        selling = selling.slice(0,numberOfItems)


    return (
        
        <div className={styles.tableContainer}>
        <div className={styles.tableRow}>
            <p className={styles.tableCell}>Item</p>
            <p className={styles.tableCell}>Price</p>
            {collections[collection]?<p className={`${styles.tableCell} ${styles.quantityCell}`}>Ranking</p>:""}
            <p className={styles.tableCell}>From</p>
        
            <p className={styles.tableCell}>Time</p>
        </div>
        {selling.map((item,i)=>
        <div key={"tableRow"+i} className={styles.tableRow}>
            <Link className={styles.tableCell} href={`../${item.sell.data.token_address}/${item.sell.data.token_id}`}>
            <a className={styles.tableCell} ><img className={styles.tableImage} 
            src={item.sell.data.properties.image_url} />
            #{item.sell.data.token_id.slice(0,6)}</a>
            </Link>
            <p className={styles.tableCell}>{item.buy.data.quantity/(10**18)}</p>
            {collections[item.sell.data.token_address]?<p className={`${styles.tableCell} ${styles.quantityCell}`}>{collections[collection]["ranksArray"].indexOf(Number(item.sell.data.token_id))}</p>:""}

            <p className={styles.tableCell}>{item.user.slice(0,5)+"..." + item.user.slice(item.user.length-5,item.user.length-1)}</p>
    
            <p className={styles.tableCell}>{calculateTime(item.updated_timestamp)}</p>
        </div>
        )}
        <div onClick={()=>setNumberOfItems(numberOfItems+10)} 
        className={numberOfItems < arrayLength? `${styles.tableRow} ${styles.tableSeeMore}`:styles.tableRow}>
        {numberOfItems < arrayLength? "See More Results" : ""}
        </div>
    </div>

    )
    }


    const createHistoryTable = (array,numberOfItems) =>{
        let dataFiltered=array.filter(data=> data.status==="cancelled"? false:true);
        if (dataFiltered.length<=1) return ""
        
        dataFiltered.sort((result, result2)=> result.updated_timestamp < result2.updated_timestamp ? 1:-1)
        dataFiltered = dataFiltered.slice(0,numberOfItems)


    return (
        
        <div className={styles.tableContainer}>
        <div className={styles.tableRow}>
            <p className={styles.tableCell}>Item</p>
            <p className={styles.tableCell}>Price</p>
            <p className={`${styles.tableCell} ${styles.quantityCell}`}>Qty</p>
        
            <p className={styles.tableCell}>To</p>
            <p className={styles.tableCell}>Time</p>
        </div>
        {dataFiltered.map((item,i)=>
        <div key={"tableRow"+i} className={styles.tableRow}>
            <Link className={styles.tableCell} href={`../${item.sell.data.token_address}/${item.sell.data.token_id}`}>
            <a className={styles.tableCell} ><img className={styles.tableImage} 
            src={item.sell.data.properties.image_url} />
            #{item.sell.data.token_id}</a>
            </Link>
            <p className={styles.tableCell}>{item.buy.data.quantity/(10**18)}</p>
            <p className={`${styles.tableCell} ${styles.quantityCell}`}>{item.sell.data.quantity}</p>
        
            <p className={styles.tableCell}>{item.user.slice(0,5)+"..." + item.user.slice(item.user.length-5,item.user.length-1)}</p>
            <p className={styles.tableCell}>{calculateTime(item.updated_timestamp)}</p>
        </div>
        )}
        <div onClick={()=>setNumberOfItems(numberOfItems+10)} 
        className={numberOfItems < dataFiltered.length? `${styles.tableRow}${styles.tableSeeMore}`:styles.tableRow}>
        {numberOfItems < dataFiltered.length? "See More Results":""}
        </div>
    </div>

    )
    }

    data.similarListings.result.sort((a,b) =>Number(a.buy.data.quantity/(10**18)) > Number(b.buy.data.quantity/(10**18)) ? 1:-1)
    const reducedSimilarListings = data.similarListings.result.slice(0,6)
    data.similarCollection.result.sort((a,b) =>Number(a.buy.data.quantity/(10**18)) > Number(b.buy.data.quantity/(10**18)) ? 1:-1)
    const reducedSimilarCollection = data.similarCollection.result.slice(0,6)


    return (<>
        <div className={styles.mainContainer}>
            <div className={styles.topContainer}>
            <div className={styles.leftContainer} >
            
                <div className={styles.photoContainer}>
                <img className={styles.image} src={listingData.image_url} alt="nft icon"/>

                </div>

                <div className={styles.statsContainer}>
            
                <div className={styles.priceContainer}>  </div>
                {checkOwnerShip()?
                    <> <input type="number" min="0" placeholder="Enter listing price in ETH" onChange={(e)=>setSell(e.target.value)} className={styles.sellInput}></input>
                    <button onClick={()=>{logout();getAndSellAsset(listingData,sell)}} className={sell.length>0?styles.buyButton:styles.disabledButton} disabled={sell.length>0?false:true}>Sell </button> 
 </>:
                    ""
                }
                <Link href={`../users/${listingData.user}`}>
                    <a className={styles.linkToUser}>
                    <PersonIcon /> 
                    {listingData.user.slice(0,5)+"..."+listingData.user.slice(listingData.user.length-5,listingData.user.length-1)} 
                    </a>
                </Link>
                <Link href={`../${listingData.token_address}`}>
                    <a className={styles.linkToUser}>
                    <img width="25px" src={listingData.collection.icon_url} alt="collection icon" /> 
                    {listingData.collection.name} 
                    </a>
                </Link>      
                <div className={styles.tabContainerAsset}>
                        <div className={styles.tabRow}>
                        <p onClick={()=>setShownTabAsset("price")} className={shownTabAsset==="price"? styles.activeTab:styles.inactiveTab}>
                            Price History</p>
                            <p onClick={()=>setShownTabAsset("traits")} className={shownTabAsset==="price"? styles.inactiveTab:styles.activeTab}>
                            Traits</p>
                            </div>
                            <div className={styles.tabContent}>
                                <div className={shownTabAsset==="traits"? styles.hidden:styles.currentPricesTab} >
                                <div className={styles.historyContainer}>
                                    <p className={styles.tableTitle}>Price History</p>
                                    This item has never been listed for sale.
                                        </div>
                                </div>
                                <div className={shownTabAsset==="traits"?styles.pastSalesTab:styles.hidden} >
                                <p className={styles.tableTitle}>Traits</p>
                                { thisAsset&&collection==="0xacb3c6a43d15b907e8433077b6d38ae40936fe2c"? createTraitsTabGodsUnchained() : collections[collection]&&thisAsset? createTraitsTab():"No traits data available"}

                                </div>
                                </div>
               
                    
                </div>
                    </div>
            </div>
                <div className={styles.infoContainer}>
                <p className={styles.infoContainerTitle}> Comparison Analytics</p>
                    <div className={styles.tabContainer}>
                        <div className={styles.tabRow}>
                        <p onClick={()=>setShownTab("sales")} className={shownTab==="sales"? styles.activeTab:styles.inactiveTab}>
                            Similar NFTs Sales</p>
                            <p onClick={()=>setShownTab("current")} className={shownTab==="sales"? styles.inactiveTab:styles.activeTab}>
                            Similar Listings</p>
                        
                    
                            </div>
                            <div className={styles.tabContent}>
                                <div className={shownTab==="sales"? styles.hidden:styles.currentPricesTab} >
                                    {getCurrentPricesChart(data)}
                                    <p className={styles.tableTitle}>Current Similar Listings</p>
                                    {createListingsTable(data,numberOfItems)}
                                </div>
                                <div className={shownTab==="sales"?styles.pastSalesTab:styles.hidden} >
                                    {getPriceHistoryChart(data)}
                                    <p className={styles.tableTitle}>Similar Past Sales</p>
                                    {createSalesTable(data,numberOfItems)}
                                </div>
                            </div>
                    </div>
                    <div className={styles.priceHistory}>
                
                    

                    </div>
                </div>
            </div>

            
            <div className={styles.bottomContainer}>
            <p className={styles.bottomContainerTitle}> Similar items for sale</p>
                <div className={styles.bottomImagesContainer}>
            {isSimilarListing? createSimilarListings(reducedSimilarListings):createSimilarListings(reducedSimilarCollection)} 
            </div>
            </div> 
        </div>
    
        </>
    )
}

export default SingleAsset