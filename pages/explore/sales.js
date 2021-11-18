import Head from 'next/head'
import Image from 'next/image'
import { calculateTime, getLongListData, getVolume } from '../../components/functions/functions'

import NavBar from "../../components/navbar"
import AllLastData from '../../components/AllLastData'
import AllLastSold from '../../components/AllLastSold'

const Explore = ({listingData}) => {
console.log(listingData)
const date = new Date()
const lastDate = listingData.result[listingData.result.length-1].updated_timestamp
   return (
        <>
        <NavBar />
      
        {!listingData? "loading":<AllLastSold data={listingData} /> }
        


        </>
    )

}

export default Explore

export async function getStaticProps() {

  
    const listingData= await getLongListData(`https://api.x.immutable.com/v1/orders?page_size=99999&status=filled&sell_token_type=ERC721`)
    

  
     return {
       props: {listingData}, // will be passed to the page component as props
     }
   }