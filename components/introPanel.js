
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
import Link from 'next/link'
import TwitterIcon from '@mui/icons-material/Twitter';
import { useMediaQuery } from "@mui/material"
const IntroPanel = () => {
    let mobile=true
     mobile = useMediaQuery("(max-width:600px)")
    const router = useRouter()
const[openDrawer,setOpenDrawer] = useRecoilState(drawerAtom)
    const [panel,setPanel] = useState("intro")
    const [userBalance,setUserBalance] = useRecoilState(userBalanceAtom)
    const [account,setAccount] = useRecoilState(accountAtom)
    const [assets,setAssets] = useRecoilState(assetsAtom)
    const [collections,setCollections] = useRecoilState(collectionsAtom)
const formatUserBalances = async () => {
    const account = await ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(account)
    const userBalance = await getUserBalances(account)

  let ethBalance = await ethereum.request({ method: 'eth_getBalance', params:[...account,"latest"] });
  ethBalance = new BigNumber(ethBalance)
    
  setUserBalance({imx:userBalance.imx,ethBalance:(ethBalance.toFixed()/10**18)})
   
  const assets = await (await fetch(`https://api.x.immutable.com/v1/assets?user=${account}`)).json()  
    setAssets(assets)
    console.log(assets)
    
}


    return (
<div className={styles.container}>
    <div className={styles.containerLeft} >
            <div className={styles.titleTextContainer}>
                    <p className={styles.mainTitle}>Collect, exchange and create amazing NFTs
                    <span className={styles.mainTitleSmall}> <br/>  on the best decentralized IMX marketplace that gives back to the community.</span> </p>
                
                 
    <div className={styles.buttonContainer}>
        <a href="#collectionContainer"><button className={styles.button}>Start Browsing</button></a>
        
        
        {mobile?"":<button className={styles.button} onClick={()=>{
            setupAndLogin();
            formatUserBalances(); 
            
            if(account) router.push(`/user/${account[0]}`)
            
            }}>{account?"Start Listing":"Connect your Wallet"}</button>}
    
        
                  </div>
                  <div className={styles.twitterLogo}>
                  <Link href="https://twitter.com/aethercraftIMX"><a><TwitterIcon /></a></Link>
                  </div>
            </div>
    </div>
   

    <div className={styles.containerRight}>
   
        <div className={styles.artFrame}>
    
        <Link href="/collections/0x7b7a9ec1978e382983a5e6826e66efb5bda12218/594"  >
            <a className={styles.pictureFrame}>
                <img className={styles.picture} src={"/images/594.jpg"} width={400} height={400} alt="NFT picture" priority={true}/>
                <div className={styles.pictureDetails}>

                    <p className={styles.pictureCollection}> The Painter </p>
        
        </div>
        </a>
                </Link>
        </div>
       
    </div>
</div>
    )
}

export default IntroPanel




