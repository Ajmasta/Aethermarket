import styles from "./styles/collectionList.module.css"
import Link from 'next/link'
import Image from 'next/image'
import TwitterIcon from '@mui/icons-material/Twitter';
import WebIcon from '@mui/icons-material/Web';
const CollectionList = () => {
    const collections = [
        
        {
            "address": "0x5f32923175e13713242b3ddd632bdee82ab5f509",
            "name": "Moody Krows",
            "description": "Moody Krows is the first randomly generated PFP NFTs collection of 10,000 on Immutable, a Layer 2 solution on the Ethereum blockchain.",
            "icon_url": "https://storage.googleapis.com/wired-glider-326915.appspot.com/Collection%20icon.jpg",
            "collection_image_url": "https://storage.googleapis.com/wired-glider-326915.appspot.com/Collection%20icon.jpg"
        
            
        },    {
            "address": "0x7b7a9ec1978e382983a5e6826e66efb5bda12218",
            "name": "The Painter",
            "description": "You may call me The Painter. I am an AI trained to create modern works of art using a custom deep learning neural network and thousands of modern masterpieces in my training set. I have created a collection of 8192 original pieces that live exclusively on Immutable X. An homage to the past, built for the future.",
            "icon_url": "https://painterai.s3.amazonaws.com/prod/icon.png",
            "collection_image_url": "https://painterai.s3.amazonaws.com/prod/icon.png"
        
            
        }, {
            "address": "0x4ebfb80f9144713a690ec5a6485d0d4ed65194cd",
            "name": "Bad Grandma",
            "description": "Bad Grandma is a collection of 10,000 randomly generated & unique collectibles living on ImmutableX and carefully chosen by some of the greatest grandsons who love their grandmas. https://badgrandmanft.com",
            "icon_url": "https://badgrandmanft.com/img/imx.png",
            "collection_image_url": "https://badgrandmanft.com/img/imx.png"
        
            
        },   {
            "address": "0x5f32923175e13713242b3ddd632bdee82ab5f509",
            "name": "Moody Krows",
            "description": "Moody Krows is the first randomly generated PFP NFTs collection of 10,000 on Immutable, a Layer 2 solution on the Ethereum blockchain.",
            "icon_url": "https://storage.googleapis.com/wired-glider-326915.appspot.com/Collection%20icon.jpg",
            "collection_image_url": "https://storage.googleapis.com/wired-glider-326915.appspot.com/Collection%20icon.jpg"
        
            
        },    {
            "address": "0x7b7a9ec1978e382983a5e6826e66efb5bda12218",
            "name": "The Painter",
            "description": "You may call me The Painter. I am an AI trained to create modern works of art using a custom deep learning neural network and thousands of modern masterpieces in my training set. I have created a collection of 8192 original pieces that live exclusively on Immutable X. An homage to the past, built for the future.",
            "icon_url": "https://painterai.s3.amazonaws.com/prod/icon.png",
            "collection_image_url": "https://painterai.s3.amazonaws.com/prod/icon.png"
        
            
        }, {
            "address": "0x4ebfb80f9144713a690ec5a6485d0d4ed65194cd",
            "name": "Bad Grandma",
            "description": "Bad Grandma is a collection of 10,000 randomly generated & unique collectibles living on ImmutableX and carefully chosen by some of the greatest grandsons who love their grandmas. https://badgrandmanft.com",
            "icon_url": "https://badgrandmanft.com/img/imx.png",
            "collection_image_url": "https://badgrandmanft.com/img/imx.png"
        
            
        }
    
   ]

   const upcomingCollections = [
       {    "name": "Dinos IMX",
            "description": "Bad Grandma is a collection of 10,000 randomly generated & unique collectibles living on ImmutableX and carefully chosen by some of the greatest grandsons who love their grandmas. https://badgrandmanft.com",
            "icon_url": "/images/dinosImage.png",
            "collection_image_url": "/images/dinosIcon.jpg"},  
             {    "name": "Dinos IMX",
            "description": "Bad Grandma is a collection of 10,000 randomly generated & unique collectibles living on ImmutableX and carefully chosen by some of the greatest grandsons who love their grandmas. https://badgrandmanft.com",
            "icon_url": "/images/dinosImage.png",
            "collection_image_url": "/images/dinosIcon.jpg"},  
             {    "name": "Dinos IMX",
            "description": "Bad Grandma is a collection of 10,000 randomly generated & unique collectibles living on ImmutableX and carefully chosen by some of the greatest grandsons who love their grandmas. https://badgrandmanft.com",
            "icon_url": "/images/dinosImage.png",
            "collection_image_url": "/images/dinosIcon.jpg"}
   ]
const createCollectionWidget =  () => {

return (collections.map((collection,i)=>{
    
  
    return (
        <Link  href={`/collections/${collection.address}`} key={`widget${i}`}>
        <a className={`${styles.collectionContainer} panel${i}`}>
            <div className={styles.iconContainer}>
                <img className={styles.image} src={collection.icon_url} />
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
                <img className={styles.upcomingIcon} src={collection.collection_image_url} alt="collection icon"/>
                </div>
                </div>
                <div className={styles.upcomingDescriptionContainer}>
                    <p className={styles.upcomingName}>{collection.name}</p>
                    <p className={styles.upcomingDescription}>{collection.description}</p>
               
                </div>
                <div className={styles.logoContainer}>
                            <TwitterIcon />
                            <WebIcon />
                            <Image src={"/images/discord.png"} alt="discord Icon" width={24} height={24} />
                </div>
            </div> 
            )})
        )
    }
    return(
        <div className={styles.mainContainer}>
          <div className={styles.upcomingCollection}>        
        <div className={styles.title2}>Top Upcoming Collections</div>                       
            <div className={styles.upcomingCollectionsContainer} >
            {createUpcomigCollectionWidget(upcomingCollections)}
            </div>      
                                    </div>
            <div className={styles.container}>
                <div className={styles.title}>Our Curated Collections</div>
                    <div className={styles.imagesContainer}>
                        <div className={styles.bigCollection}>
                        <Image src={"/images/299.png"} height={566} width={566} className={styles.bigImage}/>
                        </div>
                        <div className={styles.collectionsContainer}>
                    
                        {createCollectionWidget(collections)}
                        </div>
                </div>
            </div>
      

        </div>

    )
}

export default CollectionList


