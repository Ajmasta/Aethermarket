import Head from 'next/head'
import Image from 'next/image'
import { getLongListData, useGetListingsLong } from '../../components/functions/functions'

import NavBar from "../../components/navbar"
import AllLastData from '../../components/AllLastData'
import AllLastListed from '../../components/AllLastListed'

const Explore = () => {

  const {data}= useGetListingsLong(`https://api.x.immutable.com/v1/orders?page_size=99999&status=active`)


   return (
        <>
        <NavBar />
        {!data? "loading":<AllLastListed data={data} /> }
  


        </>
    )

}

export default Explore
