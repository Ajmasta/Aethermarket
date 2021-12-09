import Head from "next/head";
import Script from "next/script";

import Image from "next/image";
import About from "../components/about";
import CollectionList from "../components/collectionList";
import CollectionRankings from "../components/collectionsRankings";
import IntroPanel from "../components/introPanel";
import LastDisplay from "../components/lastDisplay";
import LastListed from "../components/lastListed";
import LastSold from "../components/lastSold";
import NavBar from "../components/navbar";
import styles from "../styles/Home.module.css";
import ReactGA from "react-ga";
import LazyLoad from "react-lazyload";
import FullAnalytics from "../components/fullAnalytics";

export default function Home({}) {
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
        <title>Aethermarket</title>
        <meta
          name="description"
          content="Aethermarket is a decentralized  NFT marketplace on IMX.Buy, create and participate in a decentralized marketplace that rewards its community."
        />
        <link rel="icon" href="/icon.svg" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:title" content="Aethermarket" />
        <meta
          property="og:description"
          content="Aethermarket is a decentralized  NFT marketplace on IMX.Buy, create and participate in a decentralized marketplace that rewards its community."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.aethermarket.io" />
        <meta property="og:image" content="/metaImage.svg" />

        <meta name="twitter:title" content="Aethermarket " />
        <meta
          name="twitter:description"
          content="Aethermarket is a decentralized  NFT marketplace on IMX.Buy, create and participate in a decentralized marketplace that rewards its community."
        />
        <meta name="twitter:image" content="/metaImage.svg" />
        <meta name="twitter:card" content="summary"></meta>
      </Head>
      <NavBar />
      <IntroPanel />
      <CollectionRankings />

      <LazyLoad height={1568} offset={300} once>
        <CollectionList />
      </LazyLoad>

      <About />
    </div>
  );
}
