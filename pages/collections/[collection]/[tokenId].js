import { useRouter } from "next/router"
import { useState } from "react"
import { useGetListingInfo } from "../../../components/functions/functions"
import NavBar from '../../../components/navbar'
import SingleAsset from "../../../components/singleAsset"
import SingleListing from "../../../components/singleListing"



const Nfts = () => {
    const router=useRouter()
    const {collection,tokenId} = router.query
    const [asset,setAsset] = useState(false)
    
    console.log(`https://api.x.immutable.com/v1/orders?sell_token_id=${tokenId}&sell_token_address=${collection}`)
    const {data, isLoading,isError} = useGetListingInfo(`https://api.x.immutable.com/v1/orders?sell_token_id=${tokenId}&sell_token_address=${collection}`,`https://api.x.immutable.com/v1/assets/${collection}/${tokenId}`)
    
    if(!asset && data) data.data.result? "": setAsset(true)
    return (<>
            <NavBar />
            {isLoading || isError? <div style={{width:"100%",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>No listing</div> :asset? <SingleAsset data={data} />:<SingleListing data={data}/> }   
    </>)

}


export default Nfts

