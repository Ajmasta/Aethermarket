import { useRouter } from "next/router"
import { useState } from "react"
import { useGetListingInfo } from "../../../components/functions/functions"
import NavBar from '../../../components/navbar'
import SingleAsset from "../../../components/singleAsset"
import SingleListing from "../../../components/singleListing"
import Head from 'next/head'



const Nfts = () => {
    const router=useRouter()
    const {collection,tokenId} = router.query
    const [asset,setAsset] = useState(false)
    
    console.log(`https://api.x.immutable.com/v1/orders?sell_token_id=${tokenId}&sell_token_address=${collection}`)
    const {data, isLoading,isError} = useGetListingInfo(`https://api.x.immutable.com/v1/orders?sell_token_id=${tokenId}&include_fees=true&sell_token_address=${collection}`,`https://api.x.immutable.com/v1/assets/${collection}/${tokenId}`)
    
    if(!asset && data) data.data.result? "": setAsset(true)
    return (<>
          <Head> 
    <title>Aethermarket</title>
    <meta name="description" content="Aethermarket is a decentralized  NFT marketplace on IMX.Buy, create and participate in a decentralized marketplace that rewards its community." />
    <link rel="icon" href="/icon.svg" />
   <meta name="theme-color" content="#ffffff" />
   <meta property="og:title" content="Aethermarket" />
   <meta property="og:description" content="Aethermarket is a decentralized  NFT marketplace on IMX.Buy, create and participate in a decentralized marketplace that rewards its community." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.aethermarket.io" />
    <meta property="og:image" content="/metaImage.png" />

    <meta name="twitter:title" content="Aethermarket "/>
    <meta name="twitter:description" content="Aethermarket is a decentralized  NFT marketplace on IMX.Buy, create and participate in a decentralized marketplace that rewards its community."/>
    <meta name="twitter:image" content="https://www.aethercraft.io/_next/image?url=%2Fimages%2Flogo2.svg&w=64&q=75" />
    <meta name="twitter:card" content="summary"></meta>
</Head>
            <NavBar />
            {isLoading || isError? <div style={{width:"100%",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>No listing</div> :asset? <SingleAsset data={data} />:<SingleListing data={data}/> }   
    </>)

}


export default Nfts

