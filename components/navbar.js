import styles from "./styles/navbar.module.css"
import Image from 'next/image'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link'
import { useEffect, useState } from "react";
import { depositEth, getUserAssets, getUserBalances, logout, sellAsset, setupAndLogin } from "./functions/ImxFunctions";
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
import { accountAtom, assetsAtom, collectionsAtom, drawerAtom, userBalanceAtom } from "./states/states";
import useMediaQuery from '@mui/material/useMediaQuery';

const NavBar= () =>{
  const matches = useMediaQuery('(min-width:1000px)');
  const mobile = useMediaQuery('(max-width:600px)')
console.log(matches)
const [exploreMenu,setExploreMenu] = useState(false)
const [mouseOnTop,setMouseOnTop] = useState(false)
const[openDrawer,setOpenDrawer] = useRecoilState(drawerAtom)
const [userBalance,setUserBalance] = useRecoilState(userBalanceAtom)
const [account,setAccount] = useRecoilState(accountAtom)
const [assets,setAssets] = useRecoilState(assetsAtom)
const [searchInput,setSearchInput] = useState("")
const [collections,setCollections] = useRecoilState(collectionsAtom)
const [collectionsNavBar,setCollectionsNavBar] = useState()
const [researchOpen,setResearchOpen] = useState(false)
const [amountDeposit,setAmountDeposit] = useState(0)
const [transfer,setTransfer] = useState(false)
useEffect(()=>{
if(matches){
ethereum.on('accountsChanged', function (accounts) {
  logout();
  formatUserBalances();
  setupAndLogin()
console.log("ethStarted")
})}
},[matches])
const {data,isLoading,isError} = useGetCollections("https://api.x.immutable.com/v1/collections?page_size=999999999")
useEffect(()=>setCollections(data),[data])
console.log(collections)

const formatUserBalances = async () => {
    const userBalance = await getUserBalances()
    console.log(userBalance)
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
   setCollectionsNavBar(collections2)
    
}

let timeout
return (
  <>
  {mobile ?
    <div className={styles.container}>
    <div className={styles.logoContainer}>
        <Link href="/" replace  passHref><a><img priority={true} className={styles.logo} alt="logo, partially made by Eliricon" src={"/images/logo.svg"} width={36} height={36} /></a></Link>
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
            {collectionsNavBar.length>0?collectionsNavBar.map((collection,i)=>
            collection.upcoming?
            <div className={styles.searchResult}>
            <img src={collection.collection_image_url} className={styles.searchImage} alt="logo" />
            <p > {collection.name} <span className={styles.upcomingLabel}>Upcoming</span></p>
            </div>
            :
            <div className={styles.searchResult}><Link   key={`${i}collec`} href={`/collections/${collection.address}`}>
                <a className={styles.searchResult}>
                <img src={collection.collection_image_url} className={styles.searchImage} alt="logo" />
                {collection.name}
                </a>
              </Link>
            </div>):"No results"}
        </div>
    :""}
 
    </div>
              </div>
    :
    <>
    <div className={styles.container}>
        <div className={styles.logoContainer}>
            <Link href="/" replace  passHref><a><Image className={styles.logo} alt="logo, partially made by Eliricon" src={"/images/logo.svg"} width={72} height={72} /></a></Link>
        </div>
       <a href="#about"> <div className={styles.betaLabel}>BETA</div> </a>
       <div className={styles.inputContainer}>
       <div className={styles.searchIconContainer}>
        <SearchIcon className={styles.searchIcon} />
        </div>
        <input type="text" className={styles.searchBar} onFocus={()=>setResearchOpen(true)} onBlur={()=>setTimeout(()=>setResearchOpen(false),300)} 
        onChange={e=>{setSearchInput(e.target.value); filterCollections(e.target.value)}} placeholder="Search for a collection, an item or an artist" />
        {researchOpen && searchInput.length >1?
            <div className={styles.resultContainer} onFocus={()=>setResearchOpen(true)} >
             <div className={styles.searchCollectionSectionTitle}>Collections</div>
                {collectionsNavBar.length>0?collectionsNavBar.map((collection,i)=>
                collection.upcoming?
                <div className={styles.searchResult}>
            <img src={collection.collection_image_url} className={styles.searchImage} alt="logo" />
            <p > {collection.name} <span className={styles.upcomingLabel}>Upcoming</span></p>
            </div>
                :
                <div className={styles.searchResult}>
                <Link   key={`${i}collec`} href={`/collections/${collection.address}`}>
                <a >
                <img src={collection.collection_image_url} className={styles.searchImage} alt="logo" />
                {collection.name}
                </a>
              </Link>
            </div>):"No results"}
            </div>
        :""}
     
        </div>
        <div className={styles.textContainer}>
        <div className={styles.reference} onMouseEnter={()=>{ setMouseOnTop(true); clearTimeout(timeout)}} onMouseLeave={()=> timeout = setTimeout(()=>setMouseOnTop(false),800)}  >
     
        <Link href="/explore/listings">
            <a className={styles.textElement}>Explore</a>
        </Link>
        <div className={!exploreMenu && !mouseOnTop?styles.hidden:styles.exploreMenu} onMouseEnter={()=>setExploreMenu(true)}onMouseLeave={()=>setExploreMenu(false)} >
        <Link href="/explore/collections" ><a className={styles.menuLink}> Collections </a></Link>
        <Link href="/explore/sales" ><a className={styles.menuLink}>Recent Sales</a></Link>
        <Link href="/explore/listings"><a  className={styles.menuLink}> Recent Listings </a></Link>
        </div>
        
        </div>
        <a href="#about"className={styles.textElement}>About</a>
        {account? 
        <Link href={`/user/${account}`}>
          <a className={styles.textElement} >
              {account[0].slice(0,5)+"..."+ account[0].slice(account[0].length-5,account[0].length-1)}
          </a>
        </Link>:
        <p onClick={()=>{setupAndLogin(); setOpenDrawer(true);formatUserBalances()}} className={styles.textElement}>
           Connect your Wallet
        </p>
    
    }
            <AccountBalanceWalletIcon className={styles.iconElement} alt="wallet Icon" 
            src="" onClick={()=>{setupAndLogin(); setOpenDrawer(true);formatUserBalances()}}/>     
              
        </div>

     </div>
     <div className={openDrawer? styles.drawerContainer:styles.hidden}>
         <div className={styles.transparentCover} onClick={()=>setOpenDrawer(false)}></div>
         <div className={styles.drawer}>
         <div className={styles.topDrawerContainer}>
         
        <Link href={`/user/${account[0]}`} ><a className={styles.drawerUser}>{account?account[0].slice(0,7)+"...":""}</a></Link>
         
        <div className={styles.drawerButtons}>
        <RefreshIcon className={styles.refreshIcon} onClick={()=>formatUserBalances()} />
            
            {account?
             <button className={styles.logoutButton} onClick={()=>{logout();setAccount("");setAssets("");setUserBalance("")}}>
               Logout 
             </button>:
            <button className={styles.logoutButton} onClick={()=>{setupAndLogin();formatUserBalances()}}> Login </button>}
          </div>
                </div>    
            <div className={styles.currencyDrawer}> 
            <p className={styles.drawerTitle}> Current Balances</p>

            <div className={styles.currencyInfo}>  {userBalance.ethBalance} <Image src={ethLogo} width={30} height={30} alt="ethereum logo" /></div>
            <div className={styles.currencyInfo}> {userBalance.imx} <Image src={xLogo} width={30} height={30} alt="IMX logo"/> </div>
              </div>
              <button className={styles.transferButton} onClick={()=>setTransfer(!transfer)}>Deposit Funds to IMX </button>
              {transfer? 
              <div className={styles.transferContainer}>
              <input type="number" className={styles.inputTransfer} placeholder="Enter the amount to deposit" onChange={e=>setAmountDeposit(e.target.value)} />
              <button onClick={()=>depositEth(amountDeposit)} className={styles.depositButton}>
                Deposit
              </button>
              </div>:""}
            <div className={styles.assetDrawer}>
            <p className={styles.drawerTitle}> Current Assets</p>

            {assets.result?.slice(0,3).map(asset=> <Link key={asset.id} href={`../../../collections/${asset.token_address}/${asset.token_id}`}>
                                                        <a><img  className={styles.assetImage} src={asset.image_url} /></a></Link> ) }
            </div>
            <Link href={`/user/${account[0]}`} ><a><button className={styles.transferButton}>Check Complete Collection</button></a></Link>
             
        
         <div>
         </div>
         
         </div>
     </div>
     </>}
</>)
}

export default NavBar


