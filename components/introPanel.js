
import { useState } from "react"
import styles from "./styles/introPanel.module.css"
import Image from 'next/image'
import { getUserBalances, setupAndLogin } from "./functions/ImxFunctions"
import { drawerAtom, formatUserBalances } from "./states/states"
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';
import { accountAtom, assetsAtom, collectionsAtom, userBalanceAtom } from "./states/states";
import BigNumber from "bignumber.js";
import { useRouter } from 'next/router'

const IntroPanel = () => {
    const router = useRouter()
const[openDrawer,setOpenDrawer] = useRecoilState(drawerAtom)
    const [panel,setPanel] = useState("intro")
    const [userBalance,setUserBalance] = useRecoilState(userBalanceAtom)
    const [account,setAccount] = useRecoilState(accountAtom)
    const [assets,setAssets] = useRecoilState(assetsAtom)
    const [collections,setCollections] = useRecoilState(collectionsAtom)
const formatUserBalances = async () => {
    const userBalance = await getUserBalances()
    const account = await ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(account)
  let ethBalance = await ethereum.request({ method: 'eth_getBalance', params:[...account,"latest"] });
  ethBalance = new BigNumber(ethBalance)
    
  setUserBalance({imx:userBalance.imx,ethBalance:(ethBalance.toFixed()/10**18)})
   
  const assets = await (await fetch(`https://api.x.immutable.com/v1/assets?user=${account}`)).json()  
    setAssets(assets)
    console.log(assets)
    
}


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
        <a href="#collectionContainer"><button className={styles.button}>Start Browsing</button></a>
        <button className={styles.button} onClick={()=>{
            setupAndLogin();
            formatUserBalances(); 
            if(account) router.push(`/user/${account[0]}`)
            
            }}>Start Listing</button>
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
                <Image className={styles.picture} src={"/images/image1.jpg"} width={400} height={400} alt="NFT picture"/>
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




