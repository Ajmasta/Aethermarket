import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';
import { accountAtom, assetsAtom, collectionsAtom, drawerAtom, userBalanceAtom } from "./states/states";
import styles from "./styles/collectionRankings.module.css"
import Link from 'next/link'

import orderData from "./functions/orderData.json"
import { useState } from 'react';
import ethLogo from "../public/images/ethLogo.png"
import Image from 'next/image'
const CollectionRankings = () => {
    const [collections,setCollections] = useRecoilState(collectionsAtom)
    const [activeTab,setActiveTab] = useState("day")
    const turnObjectintoArray = (object) => {
        let array= []
            for(let element in object){
                if (collections&&collections.length>0){
                const collection = collections? collections.filter(collection=> collection.name===element):""
                array.push([element,object[element],collection[0].collection_image_url,collection[0].address,collection[0].icon_url])
            console.log(collection[0].collection_image_url)
            }}
            array.sort((a,b)=>b[1]-a[1])
           console.log(array)
            return array
    }
    const dayArray = turnObjectintoArray(orderData.day)
    const weekArray =   turnObjectintoArray(orderData.week)
    const allArray = turnObjectintoArray(orderData.all)
    console.log(dayArray)
   
    const createRankingsTable = (array) => {

        return(
            <>
    <div className={styles.tableContainer}>
            {array.slice(0,15).map((element,i)=>{
            let changeValue = activeTab==="day"? orderData["changeDay"][element[0]]?.toFixed(2):orderData["changeWeek"][element[0]].toFixed(2)
            
            return (
                
                <Link key={`${i}collec`} className={styles.rowContainer} href={`/collections/${element[3]}`}>
                <a  className={styles.rowContainer} >
              <div className={styles.rankContainer}>
                    <p className={styles.rank}>{i+1}.</p>
                <img src={element[2]!==""?element[2]:element[4]} alt="icon" className={styles.image} />
                </div>
                <p className={styles.collectionName}>{element[0]}</p>
               {activeTab!=="all"?<p className={changeValue>0?styles.volumeChangeP:changeValue<0?styles.volumeChangeN:styles.volumeChange}>{changeValue>0||changeValue<0?changeValue+"%":"-"}</p>:""}
              <div className={styles.volume}>{element[1]?element[1].toFixed(2):''}  
              <Image src={ethLogo} layout="fixed" width={15} height={15} alt="ethLogo" /> 
                </div>



              </a>
            </Link>
            )
            }
            )}


            </div>

            </>
        )


        
    }

return (
    <div className={styles.mainContainer}>
            <div className={styles.titleContainer}>Top Collections Per Volume  </div>
            <div className={styles.tabsContainer}><p onClick={()=>{setActiveTab(""); setTimeout(()=>setActiveTab("day"),200)}} className={activeTab==="day"?`${styles.tab} ${styles.activeTab}`:styles.tab}>Day</p>
            <p onClick={()=>{setActiveTab(""); setTimeout(()=>setActiveTab("week"),200)}} 
            className={activeTab==="week"?`${styles.tab} ${styles.activeTab}`:styles.tab}>Week</p>
               <p onClick={()=>{setActiveTab(""); setTimeout(()=>setActiveTab("all"),200)}} 
            className={activeTab==="all"?`${styles.tab} ${styles.activeTab}`:styles.tab}>All Time</p>
            </div>


{activeTab ==="day"? 
createRankingsTable(dayArray):activeTab==="week"?
createRankingsTable(weekArray):
createRankingsTable(allArray)}

</div>


)
}

export default CollectionRankings