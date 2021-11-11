import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';
import { accountAtom, assetsAtom, collectionsAtom } from "./states/states";
  import styles from "./styles/AllCollections.module.css"
  import Link from 'next/link'
import { useState } from 'react';
import AppsIcon from '@mui/icons-material/Apps';
import AssessmentIcon from '@mui/icons-material/Assessment';


  const AllCollections = () =>{
    const [status, setStatus] = useState("current")

    const [collections,setCollections] = useRecoilState(collectionsAtom)
    const [numberOfItems,setNumberOfItems] = useState(15)
    console.log(collections)
    


    const createCurrentCollectionWidget =  () => {
        const currentCollections = collections.filter(collection=>!collection.upcoming)

        return (
            <>
            {currentCollections.slice(0,numberOfItems).map((collection,i)=>{
            
          
            return (
                <Link  href={`../collections/${collection.address}`} key={`widget${i}`}>
                <a className={`${styles.collectionContainer}`}>
                    <div className={styles.iconContainer}>
                        <img className={styles.image} src={collection.icon_url} />
                    </div>
                    <div className={styles.descriptionContainer}>
                    <span className={styles.name}>{collection.name} </span>
                    </div>
                </a> 
                </Link> )})}
                <button onClick={()=>setNumberOfItems(numberOfItems+10)}>See more</button>
                </>
            )
        }
        const createUpcomingtCollectionWidget =  () => {
            const upcomingCollection = collections.filter(collection=>collection.upcoming)
    
            return (
                
                upcomingCollection.map((collection,i)=>{
                
              
                return (
                    <>
                    <div className={`${styles.collectionContainer} `}>
                        <div className={styles.iconContainer}>
                            <img className={styles.image} src={collection.icon_url} />
                        </div>
                        <div className={styles.descriptionContainer}>
                        <span className={styles.name}>{collection.name} </span>
                        </div>
                    </div> 
                    </>
                    )})
                )
            }
    return (
        <div className={styles.mainContainer}>
         <div className={styles.tabs}>
            <button className={status==="current"? styles.activeTab:styles.inactiveTab} onClick={()=>setStatus("current")}>
           {" "} Current Collections</button>
            <button className={status==="current"? styles.inactiveTab:styles.activeTab} onClick={()=>setStatus("upcoming")}>
            {" "}  Upcoming Collections</button>
        </div>
        <div className={styles.collectionsContainer}>
            {collections?status==="current"? createCurrentCollectionWidget(collections):createUpcomingtCollectionWidget(collections):"Loading"}

                </div>

        </div>
    )
  }
  export default AllCollections