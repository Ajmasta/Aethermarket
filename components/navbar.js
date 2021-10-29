import styles from "./styles/navbar.module.css"
import Image from 'next/image'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link'
import { useState } from "react";
import { getUserAssets, getUserBalances, logout, sellAsset, setupAndLogin } from "./functions/ImxFunctions";
import BigNumber from "bignumber.js";

const NavBar= () =>{
const [exploreMenu,setExploreMenu] = useState(false)
const [mouseOnTop,setMouseOnTop] = useState(false)
const[openDrawer,setOpenDrawer] = useState(false)
const [userBalance,setUserBalance] = useState("")
const [account,setAccount] = useState("")
const [assets,setAssets] = useState({result:[]})
const formatUserBalances = async () => {
    const userBalance = await getUserBalances()
    const account = await ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(account)
    console.log(account)
  let ethBalance = await ethereum.request({ method: 'eth_getBalance', params:[...account,"latest"] });
  ethBalance = new BigNumber(ethBalance)
  console.log(ethBalance/10**18)
  let ethNetwork = await  ethereum.request({ method: 'net_version' });
  console.log(ethNetwork)
    setUserBalance({imx:userBalance.imx,ethBalance:ethNetwork===1?(ethBalance.toFixed()/10**18):"Change your network to Mainnet Ethereum"})
    const assets = await (await fetch(`https://api.x.immutable.com/v1/assets?user=${account}`)).json()  
    setAssets(assets)
    
}
console.log(assets.result[0])

let timeout
console.log(userBalance)
return (
    <>
    <div className={styles.container}>
        <div className={styles.logoContainer}>
            <Image className={styles.logo} alt="logo" src={"/images/logo.svg"} width={72} height={72} />
        </div>
       <div className={styles.inputContainer}>
       <div className={styles.searchIconContainer}>
        <SearchIcon className={styles.searchIcon} />
        </div>
        <input type="text" className={styles.searchBar} placeholder="Search for a collection, an item or an artist" />
        
     
        </div>
        <div className={styles.textContainer}>
        <div className={styles.reference} onMouseEnter={()=>{ setMouseOnTop(true); clearTimeout(timeout)}} onMouseLeave={()=> timeout = setTimeout(()=>setMouseOnTop(false),800)}  >
     
        <Link href="/explore/listings">
            <a className={styles.textElement}>Explore</a>
        </Link>
        <div className={!exploreMenu && !mouseOnTop?styles.hidden:styles.exploreMenu} onMouseEnter={()=>setExploreMenu(true)}onMouseLeave={()=>setExploreMenu(false)} >
        <Link href="/explore/listings"><a> Recent Sales</a></Link>
            <p> Recent Listings </p>
        </div>
        </div>
                <a className={styles.textElement}>Ressources</a>
                <a className={styles.textElement}>Explore</a>
             <a className={styles.textElement}>Ressources</a>
              
        </div>
     
        <div className={styles.accountContainer}>
            <Image onClick={()=>logout()}className={styles.imgElement} alt="profile" src={"/images/profile.png"} width={36} height={36} />
            <AccountBalanceWalletIcon className={styles.iconElement} alt="wallet Icon" src="" onClick={()=>{setupAndLogin(); setOpenDrawer(true);}}/>
        </div>
      

     </div>
     <div className={openDrawer? styles.drawerContainer:styles.hidden}>
         <div className={styles.transparentCover} onClick={()=>setOpenDrawer(false)}></div>
         <div className={styles.drawer}>
            <p className={styles.usernameDrawer}> Imx: {userBalance.imx} Eth:{userBalance.ethBalance} <button onClick={()=>formatUserBalances()}>Get user Balances</button> </p>
         {assets.result.map(asset=> <p key={asset.id} onClick={()=>sellAsset(asset,0.05)}> {asset.token_address}</p>) }
         <div>
         </div>
         
         </div>
     </div>
     </>
)
}

export default NavBar