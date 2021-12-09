import { useEffect, useState } from "react";
import styles from "./styles/introPanel.module.css";
import Image from "next/image";
import { getUserBalances, setupAndLogin } from "./functions/ImxFunctions";
import { drawerAtom, formatUserBalances } from "./states/states";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import {
  accountAtom,
  assetsAtom,
  collectionsAtom,
  userBalanceAtom,
} from "./states/states";
import WebIcon from "@mui/icons-material/Web";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import Link from "next/link";
import TwitterIcon from "@mui/icons-material/Twitter";

const IntroPanel = () => {
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useRecoilState(drawerAtom);
  const [panel, setPanel] = useState("intro");
  const [userBalance, setUserBalance] = useRecoilState(userBalanceAtom);
  const [account, setAccount] = useRecoilState(accountAtom);
  const [assets, setAssets] = useRecoilState(assetsAtom);
  const [collections, setCollections] = useRecoilState(collectionsAtom);
  const [loaded, setLoaded] = useState(false);
  const formatUserBalances = async () => {
    const account = await ethereum.request({ method: "eth_requestAccounts" });
    setAccount(account);
    const userBalance = await getUserBalances(account);

    let ethBalance = await ethereum.request({
      method: "eth_getBalance",
      params: [...account, "latest"],
    });
    ethBalance = new BigNumber(ethBalance);

    setUserBalance({
      imx: userBalance.imx,
      ethBalance: ethBalance.toFixed() / 10 ** 18,
    });

    const assets = await (
      await fetch(`https://api.x.immutable.com/v1/assets?user=${account}`)
    ).json();
    setAssets(assets);
  };
  useEffect(() => setLoaded(true), []);
  return (
    <div className={styles.container}>
      <div className={styles.containerLeft}>
        <div className={styles.titleTextContainer}>
          <p className={styles.mainTitle}>
            Collect, transfer and sell amazing NFTs
            <span className={styles.mainTitleSmall}>
              {" "}
              <br /> on the first IMX marketplace for features and analytics.
            </span>{" "}
          </p>

          <div className={styles.buttonContainer}>
            <a href="#collectionContainer">
              <button className={styles.button}>Browse Collections</button>
            </a>

            <button
              className={`${styles.button} ${styles.desktop}`}
              onClick={() => {
                setupAndLogin();
                formatUserBalances();

                if (account) router.push(`/user/${account[0]}`);
              }}
            >
              {account ? "Start Listing" : "Connect your Wallet"}
            </button>

            <Link href="/transfer">
              <a>
                <button className={styles.button}> Bulk Transfer</button>
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.containerRight}>
        {!loaded ? (
          ""
        ) : (
          <Link href="https://twitter.com/TerraObscuraNFT">
            <a className={styles.pictureFrame}>
              <div className={styles.imageContainer}>
                <img
                  className={styles.picture}
                  src={"/images/terraObscura.jfif"}
                  alt="NFT picture"
                />
              </div>
              <div className={styles.pictureDetails}>
                <p className={styles.pictureCollection}> Terra Obscura </p>
                <p className={styles.pictureLaunchLabel}>
                  {" "}
                  Launch: 11th December{" "}
                </p>
                <div className={styles.pictureSocials}>
                  <a href={"https://twitter.com/TerraObscuraNFT"}>
                    <TwitterIcon />
                  </a>

                  <a href={"https://t.co/Qe1xzgMJ87"}>
                    <WebIcon />
                  </a>

                  <a href={"https://discord.com/invite/terraobscura"}>
                    <Image
                      src={"/images/discord.png"}
                      alt="discord Icon"
                      width={24}
                      height={24}
                    />
                  </a>
                </div>
              </div>
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default IntroPanel;
