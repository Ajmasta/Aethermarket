import { useRouter } from "next/router"
import { useGetListingInfo } from "../../../components/functions/functions"
import NavBar from '../../../components/navbar'
import SingleListing from "../../../components/singleListing"



const Nfts = () => {
    const router=useRouter()
    const {collection,tokenId} = router.query
    
    console.log(`https://api.x.immutable.com/v1/orders?sell_token_id=${tokenId}&sell_token_address=${collection}`)
    const {data, isLoading,isError} = useGetListingInfo(`https://api.x.immutable.com/v1/orders?sell_token_id=${tokenId}&sell_token_address=${collection}`)
    console.log(data)
    return (<>
            <NavBar />
            {isLoading || isError? "": <SingleListing data={data}/> }   
    </>)

}


export default Nfts

