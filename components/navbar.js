import styles from "./styles/navbar.module.css"
import Image from 'next/image'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link'
import { useState } from "react";
import { getUserAssets, getUserBalances, logout, sellAsset, setupAndLogin } from "./functions/ImxFunctions";
import BigNumber from "bignumber.js";
import ethLogo from "../public/images/ethLogo.png"
import xLogo from "../public/images/xLogo.svg"
import RefreshIcon from '@mui/icons-material/Refresh';
import useSWR from "swr";
import { useGetData } from "./functions/functions";
const NavBar= () =>{
const [exploreMenu,setExploreMenu] = useState(false)
const [mouseOnTop,setMouseOnTop] = useState(false)
const[openDrawer,setOpenDrawer] = useState(false)
const [userBalance,setUserBalance] = useState("")
const [account,setAccount] = useState("")
const [assets,setAssets] = useState({result:[]})
const [searchInput,setSearchInput] = useState("")
const [collections,setCollections] = useState([])
const [researchOpen,setResearchOpen] = useState(false)
const fetch = async url => {
    const data = await (await fetch(url)).json()
    console.log(data)
    return data
} 
const {data,isLoading,isError} = useGetData("https://api.x.immutable.com/v1/collections?page_size=999999999")
console.log(data)

const formatUserBalances = async () => {
    const userBalance = await getUserBalances()
    const account = await ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(account)
  let ethBalance = await ethereum.request({ method: 'eth_getBalance', params:[...account,"latest"] });
  ethBalance = new BigNumber(ethBalance)
  let ethNetwork = await  ethereum.request({ method: 'net_version' });
    
  setUserBalance({imx:userBalance.imx,ethBalance:(ethBalance.toFixed()/10**18)})
   
  const assets = await (await fetch(`https://api.x.immutable.com/v1/assets?user=${account}`)).json()  
    setAssets(assets)
    console.log(assets)
    
}

const filterCollections = async (filter) => {
  const blacklist = ["0x04792367709c5daea4fd781f558cba092695bbc0"]
    let collections2 = data.filter(collection => collection.name.toUpperCase().includes(filter.toUpperCase()))
     collections2 = collections2.filter(collection =>!blacklist.includes(collection.address))
    console.log(collections2)
   setCollections(collections2)
    
}

let timeout
return (
    <>
    <div className={styles.container}>
        <div className={styles.logoContainer}>
            <Link href="/" replace  passHref><a><Image className={styles.logo} alt="logo" src={"/images/logo.svg"} width={72} height={72} /></a></Link>
        </div>
       <div className={styles.inputContainer}>
       <div className={styles.searchIconContainer}>
        <SearchIcon className={styles.searchIcon} />
        </div>
        <input type="text" className={styles.searchBar} onFocus={()=>setResearchOpen(true)} onBlur={()=>setTimeout(()=>setResearchOpen(false),300)} 
        onChange={e=>{setSearchInput(e.target.value); filterCollections(e.target.value)}} placeholder="Search for a collection, an item or an artist" />
        {researchOpen && searchInput.length >1?
            <div className={styles.resultContainer} onFocus={()=>setResearchOpen(true)} >
             <div className={styles.searchCollectionSectionTitle}>Collections</div>
                {collections.length>0?collections.map((collection,i)=><><Link  key={`${i}collec`} href={`/collections/${collection.address}`}><a>{collection.name}</a></Link></>):"No results"}
            </div>
        :""}
     
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
            <AccountBalanceWalletIcon className={styles.iconElement} alt="wallet Icon" src="" onClick={()=>{setupAndLogin(); setOpenDrawer(true);formatUserBalances()}}/>
        </div>
      

     </div>
     <div className={openDrawer? styles.drawerContainer:styles.hidden}>
         <div className={styles.transparentCover} onClick={()=>setOpenDrawer(false)}></div>
         <div className={styles.drawer}>
         {account? <button onClick={()=>{logout();setAccount("");setAssets("");setUserBalance("")}}> Logout </button>:
         <button onClick={()=>{setupAndLogin();formatUserBalances()}}> Login </button>}
         <h3 className={styles.drawerTitle}> Current Balance</h3>
            <p className={styles.currencyDrawer}> 
           <RefreshIcon onClick={()=>formatUserBalances()} />
            <span className={styles.currencyInfo}>  {userBalance.ethBalance} <Image src={ethLogo} width={30} height={30} alt="ethereum logo" /></span>
            <span className={styles.currencyInfo}> {userBalance.imx} <Image src={xLogo} width={30} height={30} alt="IMX logo"/> </span>
              </p>
            <div className={styles.assetDrawer}>
            <h3 className={styles.drawerTitle}> Current Assets</h3>

            {assets.result?.slice(0,3).map(asset=> <img key={asset.id} className={styles.assetImage} src={asset.image_url} />) }
            </div>
             
        
         <div>
         </div>
         
         </div>
     </div>
     </>
)
}

export default NavBar


