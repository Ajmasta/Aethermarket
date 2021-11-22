import Head from 'next/head'
import Image from 'next/image'
import About from '../components/about'
import CollectionList from '../components/collectionList'
import CollectionRankings from '../components/collectionsRankings'
import IntroPanel from '../components/introPanel'
import LastDisplay from '../components/lastDisplay'
import LastListed from '../components/lastListed'
import LastSold from '../components/lastSold'
import NavBar from '../components/navbar'
import styles from '../styles/Home.module.css'
import ReactGA from 'react-ga';
export default function Home({collections}) {

  
  return (
    <div className={styles.container}>
     <Head>
          <link
            rel="preload"
            href="../public/images/Poppins-Regular.ttf"
            as="font"
            crossOrigin=""
          />
         
        </Head>
        <Head> 
    <title>Aethercraft</title>
    <meta name="description" content="Aethercraft builds decentralized platform to realize the full potential of NFTs and Web3 interactions." />
    <link rel="icon" href="/icon.svg" />
   <meta name="theme-color" content="#ffffff" />
   <meta property="og:title" content="Aethercraft" />
   <meta property="og:description" content="Decentralized platforms to build strong NFT communities on IMX" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.aethercraft.io" />
    <meta property="og:image" content="/metaImage.png" />

    <meta name="twitter:title" content="Aethercraft "/>
    <meta name="twitter:description" content="Decentralized platforms to build strong NFT communities on IMX"/>
    <meta name="twitter:image" content="https://www.aethercraft.io/_next/image?url=%2Fimages%2Flogo2.svg&w=64&q=75" />
    <meta name="twitter:card" content="summary"></meta>
</Head>
  <NavBar />
  <IntroPanel />
  <CollectionRankings />

  <CollectionList collections={collections.result}/>
  <LastDisplay />
    <About />

    </div>
  )
}
export async function getStaticProps() {
  
  const collections= await (await fetch("https://api.x.immutable.com/v1/collections")).json()


   return {
     props: {collections}, // will be passed to the page component as props
   }
 }