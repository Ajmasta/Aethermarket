import Head from "next/head";
import Image from "next/image";
import {
  calculateTime,
  getLongListData,
  getVolume,
} from "../../components/functions/functions";

import NavBar from "../../components/navbar";
import AllLastData from "../../components/AllLastData";
import AllLastSold from "../../components/AllLastSold";
import Loading from "../../components/loading";

const Explore = ({ listingData }) => {

  const date = new Date();
  const lastDate =
    listingData.result[listingData.result.length - 1].updated_timestamp;
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

      {!listingData ? <Loading /> : <AllLastSold data={listingData} />}
    </>
  );
};

export default Explore;

export async function getStaticProps() {
  const listingData = await getLongListData(
    `https://api.x.immutable.com/v1/orders?page_size=99999&status=filled&sell_token_type=ERC721`
  );

  return {
    props: { listingData }, // will be passed to the page component as props
  };
}
