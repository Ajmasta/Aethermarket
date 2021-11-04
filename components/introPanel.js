
import { useState } from "react"
import styles from "./styles/introPanel.module.css"
import Image from 'next/image'

const IntroPanel = () => {
const [panel,setPanel] = useState("intro")

console.log(panel)


    return (
<div className={styles.container}>
<video className={styles.video}src="/images/space.mp4" autoPlay muted loop/>
    <div className={styles.containerLeft} >
            <div className={styles.titleTextContainer}>
                    <p className={styles.mainTitle}>Collect, support & create amazing NFTs
                    <span className={styles.mainTitleSmall}> <br/>  on the best marketplace for collectors and artists on IMX.</span> </p>
                  <div>  
                  {panel === "intro"?
    <>
        <button className={styles.button} onClick={()=>setPanel("collector")}>Start Browsing</button>
        <button className={styles.button} onClick={()=>setPanel("artist")}>Start Creating</button>
    </>
        :panel === "collector"?
        <>
            <div className={styles.collectorContainer}>Start Browsing</div>
        </>:
        <> 
        <div className={styles.artistContainer}>Start Creating</div>

        </>

    }
                  </div>
            </div>
    </div>
   

    <div className={styles.containerRight}>
        <div className={styles.artFrame}>
    
    
            <div className={styles.pictureFrame}>
                <Image src={"/images/image1.jpg"} width={400} height={400} alt="NFT picture"/>
                <div className={styles.pictureDetails}>
                    <p className={styles.pictureName}>Bored in the District </p>
                    <p className={styles.pictureCollection}> TikTok Moments </p>
                </div>
            </div>
        </div>
    </div>
</div>
    )
}

export default IntroPanel




