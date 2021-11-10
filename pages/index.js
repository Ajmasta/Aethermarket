import Head from 'next/head'
import Image from 'next/image'
import CollectionList from '../components/collectionList'
import IntroPanel from '../components/introPanel'
import LastDisplay from '../components/lastDisplay'
import LastListed from '../components/lastListed'
import LastSold from '../components/lastSold'
import NavBar from '../components/navbar'
import styles from '../styles/Home.module.css'

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
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
  <NavBar />
  <IntroPanel />
  <CollectionList collections={collections.result}/>
  <LastDisplay />



    </div>
  )
}
export async function getStaticProps() {
  
  const collections= await (await fetch("https://api.x.immutable.com/v1/collections")).json()


   return {
     props: {collections}, // will be passed to the page component as props
   }
 }