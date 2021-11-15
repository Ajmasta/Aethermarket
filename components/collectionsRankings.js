import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';
import { accountAtom, assetsAtom, collectionsAtom, drawerAtom, userBalanceAtom } from "./states/states";
import styles from "./styles/collectionRankings.module.css"

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
                array.push([element,object[element],collection[0].collection_image_url,collection[0].address])
            }}
            array.sort((a,b)=>b[1]-a[1])
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
            {array.slice(0,15).map((element,i)=>(
                <div key={`${i}collec`} className={styles.rowContainer}>
                <p className={styles.rank}>{i+1}.</p>
                <img src={element[2]} alt="icon" className={styles.image} />
                <p className={styles.collectionName}>{element[0]}</p>
              <p className={styles.volume}>{element[1].toFixed(2)}  
              <Image src={ethLogo} layout="fixed" width={15} height={15} alt="ethLogo" /> 
                </p>



              </div>

            ))}


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