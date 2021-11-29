import { useRouter } from "next/router";
import FullLastData from "../../components/fullLastData.js";
import NavBar from "../../components/navbar";
import Head from "next/head";
import collections from "../../components/functions/collectionRankings.json";
import FullLastDataInfinite from "../../components/fullLastDataInfinite.js";

const Collection = ({ activeListings }) => {
  const router = useRouter();
  const { collection } = router.query;
  console.log(collection);
  return (
    <>
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
        <meta property="og:image" content="/metaImage.png" />

        <meta name="twitter:title" content="Aethermarket " />
        <meta
          name="twitter:description"
          content="Aethermarket is a decentralized  NFT marketplace on IMX.Buy, create and participate in a decentralized marketplace that rewards its community."
        />
        <meta
          name="twitter:image"
          content="https://www.aethercraft.io/_next/image?url=%2Fimages%2Flogo2.svg&w=64&q=75"
        />
        <meta name="twitter:card" content="summary"></meta>
      </Head>
      <NavBar />

      <FullLastData collection={collection} />
    </>
  );
};

export default Collection;
/*{collections[collection]?.ranksArray ? (
    <FullLastData collection={collection} />

    ) : (
        <FullLastDataInfinite collection={collection} />
      )}*/
