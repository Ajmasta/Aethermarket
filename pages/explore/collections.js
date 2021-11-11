

import Head from 'next/head'
import Image from 'next/image'
import { getLongListData, useGetListingsLong } from '../../components/functions/functions'

import NavBar from "../../components/navbar"
import AllLastData from '../../components/AllLastData'
import AllLastListed from '../../components/AllLastListed'
import AllCollections from '../../components/allCollections'

const ListCollections = () => {



   return (
        <>
        <NavBar />
       
        <AllCollections />


        </>
    )

}

export default ListCollections
