import { useRouter } from "next/router";
import { RecoilValueReadOnly } from "recoil";
import NavBar from "../../components/navbar";
import { accountAtom, assetsAtom } from "../../components/states/states";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { useGetUserData } from "../../components/functions/functions";
import UserAccount from "../../components/UserAccount";
import Head from "next/head";
import Transfer from "../transfer";

const User = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data, isLoading, isError } = useGetUserData(userId);
  console.log(data);

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
      {isLoading || isError ? (
        "No user with this name"
      ) : (
        <UserAccount userId={userId} data={data} />
      )}
    </>
  );
};

export default User;
