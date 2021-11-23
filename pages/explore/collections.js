

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
       
        <AllCollections />


        </>
    )

}

export default ListCollections
