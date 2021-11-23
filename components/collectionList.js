import styles from "./styles/collectionList.module.css"
import Link from 'next/link'
import Image from 'next/image'
import TwitterIcon from '@mui/icons-material/Twitter';
import WebIcon from '@mui/icons-material/Web';
import collections2 from "../components/functions/collectionRankings.json"
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';
import { accountAtom, assetsAtom, collectionsAtom, drawerAtom, userBalanceAtom } from "./states/states";
import { useEffect, useState } from "react";

const CollectionList = () => {
    
    const collectionsFetched = useRecoilValue(collectionsAtom)
    const [collections,setCollections] = useState([])
    
    const getCollections = () => {
        if(collections2&&collectionsFetched){
            let listOfCollections=[]
            console.log(collectionsFetched)
            for(let object in collections2){
                const collection = collectionsFetched.filter(element=>element.address===object)
                if(Number(collections2[object].users)>300) listOfCollections.push(...collection)
            }
            console.log(listOfCollections)
            setCollections(listOfCollections)
        }
    }
   useEffect(()=>{getCollections()},[collections2,collectionsFetched])
   
   const upcomingCollections = [
       {    "name": "Dinos IMX",
            "description": "IMX Dinos is the first Dino community on IMX! No gas fees, Carbon Neutral, we're taking it back to the Jurassic Period!",
            "icon_url": "/images/dinosIcon.gif",
            "collection_image_url": "/images/dinosIcon.jpg",
        "twitter":"https://mobile.twitter.com/imxdinos",
        "website":"",
        "discord":"https://t.co/LE795eI7le?amp=1"},  
             {    "name": "Highrise Creature Club",
            "description": "The creative world where everyone belongs. Highrise Creature Club a collection of 10,000 unique NFT Creatures",
            "icon_url": "/images/highRise.png",
            "collection_image_url":"/images/highriseIcon.jpg",
            "twitter":"https://mobile.twitter.com/HighriseApp",
            "website":"https://apps.apple.com/app/id924589795?mt=8",
            "discord":"https://discord.gg/hcc" },  
             {    "name": "Immutable Kongz",
            "description": "6666 Genetically modified Unique Beasts on a mission to conquer Planet IMX with style and utility",
            "icon_url": "/images/kongz.png",
            "collection_image_url": "/images/kongzIcon.png",
            "twitter":"https://twitter.com/immutablekongz?lang=en",
            "website":"https://t.co/Y3djvdGhvX?amp=1",
            "discord":"https://t.co/AE9PMakKQ5?amp=1"},
            {    "name": "Wild Turtles",
            "description": "There will be 7,000 Wild Turtle NFTs and every NFT represents a living turtle in the wild. Mint a turtle, save a turtle.",
            "icon_url": "/images/vegetaTurtle.jpg",
            "collection_image_url": "/images/turtles.png",
            "twitter":"https://mobile.twitter.com/WildTurtlesNFT",
            "website":"https://www.wildturtlenft.com/",
            "discord":"https://discord.gg/SEJswYvH"}
   ]
const createCollectionWidget =  () => {

return (collections.map((collection,i)=>{
    
  
    return (
        <Link  href={`/collections/${collection.address}`} key={`widget${i}`}>
        <a className={`${styles.collectionContainer} `}>
            <div className={styles.iconContainer}>
                <img className={styles.image} src={
                    collections2[collection.address].collectionIcon? collections2[collection.address].collectionIcon
                    :collection.collection_image_url?collection.collection_image_url
                    :collection.icon_url} />
            </div>
            <div className={styles.descriptionContainer}>
            <span className={styles.name}>{collection.name} </span>
            </div>
        </a> 
        </Link> )})
    )
}
const createUpcomigCollectionWidget =  (collections) => {

    return (collections.map((collection,i)=>{
        
        return (
            
            <div key={`upcollec${i}`} className={`${styles.upcomingCollectionContainer} panel${i}`} >
                <div className={styles.upcomingImageContainer}>
                <img className={styles.upcomingImage} src={collection.icon_url} alt="collection sample" />
                <div className={styles.upcomingIconContainer}>
                <img className={styles.upcomingIcon} src={collection.collection_image_url?collection.collection_image_url:collection.icon_url} alt="collection icon"/>
                </div>
                </div>
                <div className={styles.upcomingDescriptionContainer}>
                    <p className={styles.upcomingName}>{collection.name}</p>
                    <p className={styles.upcomingDescription}>{collection.description}</p>
               
                </div>
                <div className={styles.logoContainer}>
                           {collection.twitter!==""?<a href={collection.twitter}><TwitterIcon /></a>:""}
                           {collection.website !==""?<a href={collection.website}><WebIcon /></a>:""}
                            {collection.discord!==""? <a href={collection.discord}><Image src={"/images/discord.png"} alt="discord Icon" width={24} height={24} /> </a>:""}
                </div>
            </div> 
            )})
        )
    }
    return(
        <div className={styles.mainContainer}  id="collectionContainer">
            <div className={styles.upcomingCollection}>        
        <div className={styles.title2}>Top Upcoming Collections</div>                       
            <div className={styles.upcomingCollectionsContainer} >
            {createUpcomigCollectionWidget(upcomingCollections)}
            </div>      
                                    </div>
          <div className={styles.container}>
                <div className={styles.title}>Our Curated Collections</div>
                      
                        <div className={styles.collectionsContainer}>
                    
                        {createCollectionWidget(collections)}
                        </div>
                </div>
          
          
          
      
            
            </div>
      

      

    )
}

export default CollectionList


