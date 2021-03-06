import styles from "./styles/navbar.module.css";
import Image from "next/image";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  depositEth,
  getUserAssets,
  getUserBalances,
  logout,
  sellAsset,
  setupAndLogin,
} from "./functions/ImxFunctions";
import BigNumber from "bignumber.js";
import ethLogo from "../public/images/ethLogo.png";
import xLogo from "../public/images/xLogo.svg";
import RefreshIcon from "@mui/icons-material/Refresh";
import useSWR from "swr";
import {
  getEthPrice,
  useGetCollections,
  useGetData,
} from "./functions/functions";
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
  currencyAtom,
  drawerAtom,
  ethPriceAtom,
  userBalanceAtom,
} from "./states/states";
import useMediaQuery from "@mui/material/useMediaQuery";
import TwitterIcon from "@mui/icons-material/Twitter";
import collections from "./functions/collectionsList.json";
import imagePath from "./functions/imagePath.json";
import Cart from "./cart";
const NavBar = () => {
  const matches = useMediaQuery("(min-width:1000px)");
  const mobile = useMediaQuery("(max-width:600px)");
  const [exploreMenu, setExploreMenu] = useState(false);
  const [inventoryMenu, setInventoryMenu] = useState(false);
  const [mouseOnTop, setMouseOnTop] = useState(false);
  const [openDrawer, setOpenDrawer] = useRecoilState(drawerAtom);
  const [userBalance, setUserBalance] = useRecoilState(userBalanceAtom);
  const [account, setAccount] = useRecoilState(accountAtom);
  const [assets, setAssets] = useRecoilState(assetsAtom);
  const [searchInput, setSearchInput] = useState("");
  const [mouseOnTopInventory, setMouseOnTopInventory] = useState(false);

  const [collectionsNavBar, setCollectionsNavBar] = useState();
  const [researchOpen, setResearchOpen] = useState(false);
  const [amountDeposit, setAmountDeposit] = useState(0);
  const [transfer, setTransfer] = useState(false);
  const [ethPrice, setEthPrice] = useRecoilState(ethPriceAtom);
  const [currency, setCurrency] = useRecoilState(currencyAtom);
  useEffect(() => {
    const getData = async () => {
      const data = await getEthPrice();
      setEthPrice(data[currency]);

      
    };
    getData();
  }, [currency, ethPrice, setEthPrice]);

  const login = async () => {
    const account = await ethereum.request({ method: "eth_requestAccounts" });
    setAccount(account);
  };
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
  useEffect(() => login(), []);

  const filterCollections = async (filter) => {
    const blacklist = [
      "0x04792367709c5daea4fd781f558cba092695bbc0",
      "0x5084e56a8c987c651f2aa6cc515aeb4518beee9a",
      "0x41ff943a5a31652a33cb23fb942769abb3dbaf97",
    ];
    let collections2 = collections.filter((collection) =>
      collection.name.toUpperCase().includes(filter.toUpperCase())
    );

    collections2 = collections2.filter(
      (collection) => !blacklist.includes(collection.address)
    );
    setCollectionsNavBar(collections2);
  };

  let timeout;
  let timeoutInventory;
  return (
    <>
      {mobile ? (
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <Link href="/" replace passHref>
              <a>
                <img
                  className={styles.logo}
                  alt="logo"
                  src={"/images/logo.svg"}
                  width={36}
                  height={36}
                />
              </a>
            </Link>
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.searchIconContainer}>
              <SearchIcon className={styles.searchIcon} />
            </div>
            <input
              type="text"
              className={styles.searchBar}
              onFocus={() => setResearchOpen(true)}
              onBlur={() => setTimeout(() => setResearchOpen(false), 300)}
              onChange={(e) => {
                setSearchInput(e.target.value);
                filterCollections(e.target.value);
              }}
              placeholder="Search for a collection, an item or an artist"
            />
            {researchOpen && searchInput.length > 1 ? (
              <div
                className={styles.resultContainer}
                onFocus={() => setResearchOpen(true)}
              >
                <div className={styles.searchCollectionSectionTitle}>
                  Collections
                </div>
                {collectionsNavBar.length > 0
                  ? collectionsNavBar.map((collection, i) =>
                      collection.upcoming ? (
                        <Link
                          key={`${i}collec`}
                          href={`/collections/${collection.address}`}
                        >
                          <a className={styles.searchResult}>
                            <img
                              src={
                                imagePath[collection.address]
                                  ? imagePath[collection.address]
                                  : collection.collection_image_url
                              }
                              className={styles.searchImage}
                              alt="logo"
                            />
                            <p className={styles.searchResultText}>
                              {" "}
                              {collection.name}{" "}
                              <span className={styles.upcomingLabel}>
                                Upcoming
                              </span>
                            </p>
                          </a>
                        </Link>
                      ) : (
                        <Link
                          key={`${i}collec`}
                          href={`/collections/${collection.address}`}
                        >
                          <a className={styles.searchResult}>
                            <div className={styles.searchResultContent}>
                              <img
                                src={
                                  imagePath[collection.address]
                                    ? imagePath[collection.address]
                                    : collection.collection_image_url
                                }
                                className={styles.searchImage}
                                alt="logo"
                              />
                              <p className={styles.searchResultText}>
                                {collection.name}
                              </p>
                            </div>
                          </a>
                        </Link>
                      )
                    )
                  : "No results"}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <>
          <div className={styles.container}>
            <div className={styles.logoContainer}>
              <Link href="/" replace passHref>
                <a>
                  <Image
                    className={styles.logo}
                    alt="logo, partially made by Eliricon"
                    src={"/images/logo.svg"}
                    width={72}
                    height={72}
                  />
                </a>
              </Link>
            </div>
            <Link href="/#about">
              <a>
                <div className={styles.betaLabel}>BETA</div>
              </a>
            </Link>
            <Link href="https://twitter.com/aethercraftIMX">
              <a className={styles.twitterIcon}>
                <TwitterIcon />
              </a>
            </Link>
            <div className={styles.inputContainer}>
              <div className={styles.searchIconContainer}>
                <SearchIcon className={styles.searchIcon} />
              </div>
              <input
                type="text"
                className={styles.searchBar}
                onFocus={() => setResearchOpen(true)}
                onBlur={() => setTimeout(() => setResearchOpen(false), 300)}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  filterCollections(e.target.value);
                }}
                placeholder="Search for a collection, an item or an artist"
              />
              {researchOpen && searchInput.length > 1 ? (
                <div
                  className={styles.resultContainer}
                  onFocus={() => setResearchOpen(true)}
                >
                  <div className={styles.searchCollectionSectionTitle}>
                    Collections
                  </div>
                  {collectionsNavBar.length > 0
                    ? collectionsNavBar.map((collection, i) =>
                        collection.upcoming ? (
                          <Link
                            key={`${i}collec`}
                            href={`/collections/${collection.address}`}
                          >
                            <a className={styles.searchResult}>
                              <img
                                src={
                                  imagePath[collection.address]
                                    ? imagePath[collection.address]
                                    : collection.collection_image_url
                                }
                                className={styles.searchImage}
                                alt="logo"
                              />
                              <p className={styles.searchResultText}>
                                {" "}
                                {collection.name}{" "}
                                <span className={styles.upcomingLabel}>
                                  Upcoming
                                </span>
                              </p>
                            </a>
                          </Link>
                        ) : (
                          <Link
                            key={`${i}collec`}
                            href={`/collections/${collection.address}`}
                          >
                            <a className={styles.searchResult}>
                              <div className={styles.searchResultContent}>
                                <img
                                  src={
                                    imagePath[collection.address]
                                      ? imagePath[collection.address]
                                      : collection.collection_image_url
                                  }
                                  className={styles.searchImage}
                                  alt="logo"
                                />
                                <p className={styles.searchResultText}>
                                  {collection.name}
                                </p>
                              </div>
                            </a>
                          </Link>
                        )
                      )
                    : "No results"}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className={styles.textContainer}>
              <div
                className={styles.reference}
                onMouseEnter={() => {
                  setMouseOnTop(true);
                  clearTimeout(timeout);
                }}
                onMouseLeave={() =>
                  (timeout = setTimeout(() => setMouseOnTop(false), 300))
                }
              >
                <Link href="/explore/listings">
                  <a className={styles.textElement}>Explore</a>
                </Link>
                <div
                  className={
                    !exploreMenu && !mouseOnTop
                      ? styles.hidden
                      : styles.exploreMenu
                  }
                  onMouseEnter={() => setExploreMenu(true)}
                  onMouseLeave={() => setExploreMenu(false)}
                >
                  <Link href="/explore/collections">
                    <a className={styles.menuLink}> Collections </a>
                  </Link>
                  <Link href="/explore/sales">
                    <a className={styles.menuLink}>Recent Sales</a>
                  </Link>
                  <Link href="/explore/listings">
                    <a className={styles.menuLink}> Recent Listings </a>
                  </Link>
                </div>
              </div>
              <Link href="/#about">
                <a className={styles.reference}>About</a>
              </Link>
              <div
                className={styles.reference}
                onMouseEnter={() => {
                  setMouseOnTopInventory(true);
                  clearTimeout(timeoutInventory);
                }}
                onMouseLeave={() =>
                  (timeoutInventory = setTimeout(
                    () => setMouseOnTopInventory(false),
                    200
                  ))
                }
              >
                {account ? (
                  <Link href={`/user/${account}`}>
                    <a className={styles.textElement}>Inventory</a>
                  </Link>
                ) : (
                  <p
                    onClick={() => {
                      setupAndLogin();

                      formatUserBalances();
                    }}
                    className={styles.textElement}
                  >
                    Connect your Wallet
                  </p>
                )}
                <div
                  className={
                    !inventoryMenu && !mouseOnTopInventory
                      ? styles.hidden
                      : styles.exploreMenu
                  }
                  onMouseEnter={() => setInventoryMenu(true)}
                  onMouseLeave={() => setInventoryMenu(false)}
                >
                  <Link href="/transfer">
                    <a className={styles.menuLink}> Transfer </a>
                  </Link>
                </div>
              </div>

              <AccountBalanceWalletIcon
                className={styles.iconElement}
                alt="wallet Icon"
                src=""
                onClick={() => {
                  setupAndLogin();
                  setOpenDrawer(true);
                  formatUserBalances();
                }}
              />
            </div>
          </div>
          <div className={openDrawer ? styles.drawerContainer : styles.hidden}>
            <div
              className={styles.transparentCover}
              onClick={() => setOpenDrawer(false)}
            ></div>
            <div className={styles.drawer}>
              <div className={styles.topDrawerContainer}>
                <Link href={`/user/${account[0]}`}>
                  <a className={styles.drawerUser}>
                    {account ? account[0].slice(0, 7) + "..." : ""}
                  </a>
                </Link>

                <div className={styles.drawerButtons}>
                  <RefreshIcon
                    className={styles.refreshIcon}
                    onClick={() => formatUserBalances()}
                  />

                  {account ? (
                    <button
                      className={styles.logoutButton}
                      onClick={() => {
                        logout();
                        setAccount("");
                        setAssets("");
                        setUserBalance("");
                      }}
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      className={styles.logoutButton}
                      onClick={() => {
                        setupAndLogin();
                        formatUserBalances();
                      }}
                    >
                      {" "}
                      Login{" "}
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.currencyDrawer}>
                <p className={styles.drawerTitle}> Current Balances</p>

                <div className={styles.currencyInfo}>
                  {" "}
                  {userBalance.ethBalance}{" "}
                  <Image
                    src={ethLogo}
                    width={30}
                    height={30}
                    alt="ethereum logo"
                  />
                </div>
                <div className={styles.currencyInfo}>
                  {" "}
                  {userBalance.imx / 10 ** 18}{" "}
                  <Image src={xLogo} width={30} height={30} alt="IMX logo" />{" "}
                </div>
              </div>
              <button
                className={styles.transferButton}
                onClick={() => setTransfer(!transfer)}
              >
                Deposit Funds to IMX{" "}
              </button>
              {transfer ? (
                <div className={styles.transferContainer}>
                  <input
                    type="number"
                    className={styles.inputTransfer}
                    placeholder="Enter the amount to deposit"
                    onChange={(e) => setAmountDeposit(e.target.value)}
                  />
                  <button
                    onClick={() => depositEth(amountDeposit)}
                    className={styles.depositButton}
                  >
                    Deposit
                  </button>
                </div>
              ) : (
                ""
              )}
              <div className={styles.assetDrawer}>
                <p className={styles.drawerTitle}> Current Assets</p>

                {assets.result?.slice(0, 3).map((asset) => (
                  <Link
                    key={asset.id}
                    href={`../../../collections/${asset.token_address}/${asset.token_id}`}
                  >
                    <a>
                      <img
                        className={styles.assetImage}
                        src={asset.image_url}
                      />
                    </a>
                  </Link>
                ))}
              </div>
              <Link href={`/user/${account[0]}`}>
                <a>
                  <button className={styles.transferButton}>
                    Check Complete Collection
                  </button>
                </a>
              </Link>

              <div></div>
            </div>
          </div>
        </>
      )}
      <Cart />
    </>
  );
};

export default NavBar;
