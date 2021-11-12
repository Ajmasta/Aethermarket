import styles from "./styles/navbar.module.css"
import Image from 'next/image'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link'
import { useEffect, useState } from "react";
import { getUserAssets, getUserBalances, logout, sellAsset, setupAndLogin } from "./functions/ImxFunctions";
import BigNumber from "bignumber.js";
import ethLogo from "../public/images/ethLogo.png"
import xLogo from "../public/images/xLogo.svg"
import RefreshIcon from '@mui/icons-material/Refresh';
import useSWR from "swr";
import { useGetCollections, useGetData } from "./functions/functions";
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';
import { accountAtom, assetsAtom, collectionsAtom } from "./states/states";

const NavBar= () =>{

const [exploreMenu,setExploreMenu] = useState(false)
const [mouseOnTop,setMouseOnTop] = useState(false)
const[openDrawer,setOpenDrawer] = useState(false)
const [userBalance,setUserBalance] = useState("")
const [account,setAccount] = useRecoilState(accountAtom)
const [assets,setAssets] = useRecoilState(assetsAtom)
const [searchInput,setSearchInput] = useState("")
const [collections,setCollections] = useRecoilState(collectionsAtom)
const [researchOpen,setResearchOpen] = useState(false)

const {data,isLoading,isError} = useGetCollections("https://api.x.immutable.com/v1/collections?page_size=999999999")
useEffect(()=>setCollections(data),[data])
console.log(collections)

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

const filterCollections = async (filter) => {
  const blacklist = ["0x04792367709c5daea4fd781f558cba092695bbc0","0xf797fa8b22218f4a82286e28a2727cd1680f4237"]
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
                {collections.length>0?collections.map((collection,i)=>
                collection.upcoming?
                <p>{collection.name} <span>Upcoming</span></p>
                :
                <><Link  key={`${i}collec`} href={`/collections/${collection.address}`}>
                <a>{collection.name}</a></Link></>):"No results"}
            </div>
        :""}
     
        </div>
        <div className={styles.textContainer}>
        <div className={styles.reference} onMouseEnter={()=>{ setMouseOnTop(true); clearTimeout(timeout)}} onMouseLeave={()=> timeout = setTimeout(()=>setMouseOnTop(false),800)}  >
     
        <Link href="/explore/listings">
            <a className={styles.textElement}>Explore</a>
        </Link>
        <div className={!exploreMenu && !mouseOnTop?styles.hidden:styles.exploreMenu} onMouseEnter={()=>setExploreMenu(true)}onMouseLeave={()=>setExploreMenu(false)} >
        <Link href="../../explore/sales" ><a className={styles.menuLink}>Recent Sales</a></Link>
        <Link href="../../explore/listings"><a  className={styles.menuLink}> Recent Listings </a></Link>
        <Link href="../../explore/collections" ><a className={styles.menuLink}> Collections </a></Link>
        </div>
        </div>
                <a className={styles.textElement}>Ressources</a>
                <a className={styles.textElement}>Explore</a>
             
              
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
            <div className={styles.currencyDrawer}> 
           <RefreshIcon onClick={()=>formatUserBalances()} />
            <div className={styles.currencyInfo}>  {userBalance.ethBalance} <Image src={ethLogo} width={30} height={30} alt="ethereum logo" /></div>
            <div className={styles.currencyInfo}> {userBalance.imx} <Image src={xLogo} width={30} height={30} alt="IMX logo"/> </div>
              </div>
            <div className={styles.assetDrawer}>
            <h3 className={styles.drawerTitle}> Current Assets</h3>

            {assets.result?.slice(0,3).map(asset=> <Link key={asset.id} href={`../../../collections/${asset.token_address}/${asset.token_id}`}>
                                                        <a><img  className={styles.assetImage} src={asset.image_url} /></a></Link> ) }
            </div>
             
        
         <div>
         </div>
         
         </div>
     </div>
     </>
)
}

export default NavBar


