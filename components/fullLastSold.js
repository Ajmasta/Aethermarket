import styles from "./styles/fullLastSold.module.css"
import Link from 'next/link'
import useSWR from 'swr'
import { useState } from "react"
import { calculateTime, get24hVolume, useGetData } from "./functions/functions"
import { Scatter } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import collections from "../components/functions/collectionRankings.json"
import ethLogo from "../public/images/ethLogo.png"
import Image from 'next/image'

const FullLastSold=({collection})=>{
    const [numberOfItems,setNumberOfItems] = useState(20)
    const [activeTab, setActiveTab] = useState("list")
    const [orderBy,setOrderBy] = useState("created_at")
    const [orderingDirection,setOrderingDirection] = useState("asc")
 console.log(collection)
    const {data, isLoading,isError} = useGetData(`https://api.x.immutable.com/v1/orders?status=filled&sell_token_type=ERC721&sell_token_address=${collection}`)
  console.log(data)
    if (!data) return ""
    const getAnalyticsData = (data) => {
        const dataPrice = data.map(item=>(item.buy.data.quantity/10**18))
        const volume = (dataPrice.reduce((a,b)=>a+b))
        const timestamp = data[data.length-1].updated_timestamp
        const average = volume/dataPrice.length
        const time=calculateTime(timestamp)
        const results = data.length
        return {volume,time, average,results}
    }
    
    
    const getPriceHistoryChart = (data) =>{
        console.log(data)
        const chartData = {
            datasets:[
    
                {
                    label:"Price of last 10 sales",
                    data:[
                    ],backgroundColor:  'rgba(255, 99, 132, 1)',pointRadius:6
                }, {
                    label:"Price of older sales",
                    hidden:true,
                    data:[
                    ],backgroundColor:  'rgba(255, 199, 22, 1)',hidden:true,pointRadius:6
                    
                }
               
            ]
        }
        const options= {
            plugins: {
                title: {
                    display: true,
                    text: 'Past sale history of items in similar collection'
                }
            }
        }
        
        const soldPrice = data.map((result,i)=>{
            i<= 10? chartData.datasets[0].data.push({x:i+1,y:result.buy.data.quantity/(10**18)}):
            chartData.datasets[1].data.push({x:i+1,y:result.buy.data.quantity/(10**18)})
            return result.buy.data.quantity/(10**18)
            })
         
        
    
        return <Scatter className={styles.chart} data={chartData} options={options}></Scatter>
    }
    const createSalesTable = (sold,numberOfItems) =>{
        const arrayLength = sold.length
        sold.sort((result, result2)=> result.updated_timestamp < result2.updated_timestamp ? 1:-1)
        sold = sold.slice(0,numberOfItems)
 
    
    return (
        
        <div className={styles.tableContainer}>
        <div className={`${styles.tableRow} ${styles.tableFirstRow}`}>
            <p className={styles.tableCell}>Item</p>
            <p className={styles.tableCell}>Price</p>
            {collections[collection]?<p className={`${styles.tableCell} ${styles.quantityCell}`}>Ranking</p>:""}
            <p className={styles.tableCell}>To</p>
            <p className={styles.tableCell}>Time</p>
        </div>
        {sold.map((item,i)=>
        <div key={"tableRow"+i} className={styles.tableRow}>
        <Link className={styles.tableCell} href={`./${item.sell.data.token_address}/${item.sell.data.token_id}`}>
            <a className={`${styles.tableCell} ${styles.nameCell}`}>
            <img className={styles.tableImage} src={item.sell.data.properties.image_url} /> 
             {item.sell.data.properties.name}
            </a>
        </Link>
            <p className={styles.tableCell}>{item.buy.data.quantity/(10**18)} <Image src={ethLogo} width={15} height={15} alt="eth logo"/></p>
            {collections[item.sell.data.token_address]?<p className={`${styles.tableCell} ${styles.quantityCell}`}>#{collections[collection]["ranksArray"].indexOf(Number(item.sell.data.token_id))}</p>:""}
            <p className={styles.tableCell}>{item.user.slice(0,5)+"..." + item.user.slice(item.user.length-5,item.user.length-1)}</p>
            <p className={styles.tableCell}>{calculateTime(item.updated_timestamp)}</p>
        </div>
        )}
        <div onClick={()=>setNumberOfItems(numberOfItems+20)} 
        className={numberOfItems < arrayLength? `${styles.tableRow} ${styles.tableSeeMore}`:styles.tableRow}>
        {numberOfItems < arrayLength? "See More Results":""}
        </div>
    </div>
    
    )
    }
return (
    <>
    {data?
<div className={styles.mainContainer}>
Recent Volume: {getAnalyticsData(data).volume.toFixed(4)} Average: {getAnalyticsData(data).average.toFixed(4)} Sales:{getAnalyticsData(data).results}
<div className={styles.tabs}>
        <div onClick={()=>setActiveTab("list")} className={activeTab==="list"? styles.activeTab:styles.inactiveTab}>Grid</div>
        <div onClick={()=>setActiveTab("charts")} className={activeTab==="charts"? styles.activeTab:styles.inactiveTab}>Charts</div>
    </div>
    {activeTab==="list"?createSalesTable(data,numberOfItems):
    <>
    <div className={styles.chartContainer}>
    {getPriceHistoryChart(data)}
    </div>
    </>
    }
    </div>:""}</>
)
}

export default FullLastSold