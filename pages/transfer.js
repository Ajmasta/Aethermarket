import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "../components/styles/transfer.module.css";
import {
  transferAll,
  transferERC20,
  transferERC721,
  logout,
  setupAndLogin,
} from "../components/functions/ImxFunctions";
import Link from "next/link";

import NavBar from "../components/navbar";
import {
  accountAtom,
  assetsAtom,
  userBalanceAtom,
} from "../components/states/states";
import collectionsList from "../components/functions/collectionsList.json";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { ERC721TokenType, ETHTokenType, ERC20TokenType } from "@imtbl/imx-sdk";
import collections from "../components/functions/collectionRankings.json";
import Image from "next/image";
import useSWRInfinite from "swr/infinite";
import { useInView } from "react-intersection-observer";

const Transfer = () => {
  const [userBalances, setUserBalances] = useState();
  let assets;
  const [filteredAssets, setFilteredAssets] = useState([]);
  const account = useRecoilValue(accountAtom);
  const [filterCollection, setFilterCollection] = useState("");
  const [filterName, setFilterName] = useState("");
  const [transferList, setTransferList] = useState([]);
  const [transferInput, setTransferInput] = useState([]);
  const [transfersConfirmed, setTransfersConfirmed] = useState([]);
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [toAddress, setToAddress] = useState("");
  const { ref, inView, entry } = useInView();

  const [transferContainerVisible, setTransferContainerVisible] =
    useState(false);

  const [collectionFilterName, setCollectionFilterName] = useState("");
  const getUserBalances = async () => {
    //0x822bac563288e76ab0ec2ea05281eba9519d8690
    //account = ["0x822bac563288e76ab0ec2ea05281eba9519d8690"];
    try {
      //baby krows and moody krows, 0.05 eth 0xa106338772931be6b4feb671c2fb1c3c1994c892
      const result = await (
        await fetch(`https://api.x.immutable.com/v2/balances/${account[0]}`)
      ).json();

      setUserBalances(result.result);
      console.log(userBalances);
    } catch (err) {
      console.log(err);
    }
  };

  const getKey = (pageIndex, previousPageData) => {
    //account = ["0xea6093c807f09de83bb2ec9160386e96899fbbc9"];
    //0xea6093c807f09de83bb2ec9160386e96899fbbc9
    // reached the end
    if (previousPageData && previousPageData.result.length === 0) return null;

    // first page, we don't have `previousPageData`
    if (!previousPageData)
      return filterCollection === "" && filterName === ""
        ? `https://api.x.immutable.com/v1/assets?user=${account[0]}`
        : `https://api.x.immutable.com/v1/assets?user=${account[0]}${filterCollection}${filterName}`;

    // add the cursor to the API endpoint
    return filterCollection === "" && filterName === ""
      ? `https://api.x.immutable.com/v1/assets?user=${account[0]}&cursor=${previousPageData.cursor}`
      : `https://api.x.immutable.com/v1/assets?user=${account[0]}&cursor=${previousPageData.cursor}${filterCollection}${filterName}`;
  };
  const fetcher = async (url) => {
    console.log(url);
    const result = await (await fetch(url)).json();

    return result;
  };
  const { data, error, isValidating, mutate, size, setSize } = useSWRInfinite(
    getKey,
    fetcher
  );
  useEffect(() => setSize(size + 1), [inView]);
  const createTransferList = (transferList) => {
    return (
      <div className={styles.transferListContainer}>
        <div className={styles.transferButtonContainer}>
          <button
            onClick={() => transferFunction()}
            className={styles.transferAll}
          >
            Transfer All{" "}
          </button>
          <button
            onClick={() => setTransferList([])}
            className={styles.clearAll}
          >
            Clear All
          </button>
        </div>
        <div className={styles.transferListConfirmedContainer}>
          <div className={styles.transferListHead}>
            <p className={styles.transferListTitle}> Transfer List</p>

            <div className={styles.transferHeadIcons}></div>
          </div>

          <div className={styles.readyTransfers}>
            <div className={styles.transferRowConfirmed}>
              <p className={styles.transferName}>Name</p>
              <p className={styles.transferAmount}>Amount</p>
              <p className={styles.transferAddress}>Address</p>
              <div className={styles.iconsContainer}></div>
            </div>
            {transferList.map((payload, i) => {
              const token = payload.symbol ? true : false;
              console.log("mapped");
              const html = token
                ? createTransferConfirmedToken(payload, i)
                : createTransferConfirmedAsset(payload, i);
              console.log(html);
              return html;
            })}
          </div>
        </div>
      </div>
    );
  };
  const createTransferInput = (transfer) => {
    return (
      <>
        {transferInput.length === 0 ? (
          <>
            <p className={styles.clickText}>
              Click on a token or a NFT to start a new transfer
            </p>
          </>
        ) : (
          <>
            <div className={styles.inputTitle}>New Transfer</div>

            {transferInput.map((transfer, i) => {
              const array = Array.isArray(transfer);
              return (
                <div key={i + "symbol"} className={styles.transferRow}>
                  {array
                    ? createTransferRowAssetInput(transfer)
                    : createTransferRowTokenInput(transfer)}
                </div>
              );
            })}
          </>
        )}
        <button
          className={styles.openDrawer}
          onClick={() => setTransferContainerVisible(!transferContainerVisible)}
        >
          Transfer List
        </button>
      </>
    );
  };
  const createTransferConfirmedAsset = (payload, index) => {
    return (
      <div className={styles.transferRowConfirmed}>
        <div className={styles.nameImageContainer}>
          <div className={styles.transferImage}>
            <img className={styles.balanceImageAsset} src={payload.imageUrl} />
          </div>
          <div className={styles.transferName}>#{payload.tokenId}</div>
        </div>
        <div className={styles.transferAmount}>{payload.amount}</div>
        <div className={styles.transferAddress}>{payload.toAddress}</div>
        <div className={styles.iconsContainer}>
          <CloseIcon
            onClick={() => {
              let newArray = [...transferList];
              newArray.splice(index, 1);
              setTransferList(newArray);
            }}
          />
        </div>
      </div>
    );
  };

  const createTransferConfirmedToken = (payload, index) => {
    const object = tokenObject[payload.symbol];
    return (
      <div className={styles.transferRowConfirmed}>
        <div className={styles.nameImageContainer}>
          <div className={styles.transferImage}>
            <img className={styles.balanceImage} src={object.image_url} />
          </div>
          <div className={styles.transferName}>{object.symbol}</div>
        </div>
        <div className={styles.transferAmount}>{payload.amount}</div>
        <div className={styles.transferAddress}>{payload.toAddress}</div>
        <div className={styles.iconsContainer}>
          <CloseIcon
            onClick={() => {
              let newArray = [...transferList];
              newArray.splice(index, 1);
              setTransferList(newArray);
            }}
          />
        </div>
      </div>
    );
  };

  const createTransferRowAssetInput = (transfer) => {
    const tokenId = transfer[1];
    const collectionAddress = transfer[0];
    const collectionInfo = transfer[2];
    const imageUrl = transfer[3];
    return (
      <>
        <div className={styles.nameImageContainer}>
          <div className={styles.transferImage}>
            <img className={styles.balanceImageAsset} src={imageUrl} />
          </div>
          <div className={styles.transferName}>
            #
            {tokenId.length > 8
              ? "..." + tokenId.slice(tokenId.length - 5, tokenId.length)
              : tokenId}
          </div>
        </div>
        <div className={styles.transferAmount}>1</div>
        <div className={styles.transferAddress}>
          <input
            className={styles.addressInput}
            placeholder={
              transferList.length > 0 ? toAddress : "Recipient Address"
            }
            onChange={(e) => setToAddress(e.target.value)}
          />
        </div>
        <CheckIcon
          onClick={() => {
            createTransferPayloadAsset([
              collectionAddress,
              tokenId,
              toAddress,
              imageUrl,
            ]);
            setTransferInput([]);
            setTransferContainerVisible(true);
          }}
          className={styles.checkIcon}
        />
        <CloseIcon
          className={styles.closeIcon}
          onClick={() => setTransferInput([])}
        />
      </>
    );
  };
  const createTransferRowTokenInput = (transfer) => {
    const object = tokenObject[transfer];
    return (
      <>
        <div className={styles.nameImageContainer}>
          <div className={styles.transferImage}>
            <img className={styles.balanceImage} src={object.image_url} />
          </div>
          <div className={styles.transferName}>{object.symbol}</div>
        </div>
        <div className={styles.transferAmount}>
          <input
            className={styles.amountInput}
            placeholder="Amount to transfer"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className={styles.transferAddress}>
          <input
            className={styles.addressInput}
            placeholder={
              transferList.length > 0 ? toAddress : "Recipient Address"
            }
            onChange={(e) => setToAddress(e.target.value)}
          />
        </div>
        <CheckIcon
          onClick={() => {
            createTransferPayloadToken(object);
            setTransferInput([]);
            setTransferContainerVisible(true);
          }}
          className={styles.checkIcon}
        />
        <CloseIcon
          className={styles.closeIcon}
          onClick={() => setTransferInput([])}
        />
      </>
    );
  };
  const createTransferPayloadAsset = (array) => {
    const type = ERC721TokenType.ERC721;

    const payload = {
      amount: 1,
      tokenId: array[1],
      tokenAddress: array[0],
      toAddress: array[2],
      type,
      imageUrl: array[3],
    };
    const newArray = [...transferList];
    newArray.push(payload);
    setTransferList(newArray);
    return payload;
  };
  const createTransferPayloadToken = (token) => {
    const type =
      token.symbol === "ETH" ? ETHTokenType.ETH : ERC20TokenType.ERC20;

    const payload = {
      amount,
      symbol: token.symbol,
      tokenAddress: token.token_address,
      toAddress,
      type,
    };
    const newArray = [...transferList];
    newArray.push(payload);
    setTransferList(newArray);
    return payload;
  };
  const createTokensDisplay = (balances) => {
    return tokenArray.map((token) => {
      let userBalance = balances.filter(
        (element) => element.symbol === token.symbol
      );
      userBalance = userBalance[0]?.balance;
      return (
        <div
          key={token.symbol}
          className={`${styles.balanceContainer} ${
            userBalance ? styles.active : styles.inactive
          }`}
          onClick={() => {
            if (userBalance) {
              const newArray = [token.symbol];
              setTransferInput(newArray);
            }
          }}
        >
          <img
            className={styles.balanceImage}
            src={tokenObject[token.symbol].image_url}
          />
          <p className={styles.balanceAmount}>
            {userBalance
              ? parseFloat(
                  (
                    Number(userBalance) /
                    10 ** Number(tokenObject[token.symbol].decimals)
                  ).toFixed(6)
                )
              : 0}
          </p>
          <p className={styles.tokenName}>{tokenObject[token.symbol].symbol}</p>
        </div>
      );
    });
  };

  const createCollectionsFilter = () => {
    let liveCollections = collectionsList.filter(
      (element) => !element.upcoming
    );
    let liveCollectionsNo = liveCollections.filter(
      (element) => !element.volume.day
    );
    liveCollections = liveCollections.filter((element) => element.volume.day);

    const upcomingCollections = collectionsList.filter(
      (element) => element.upcoming
    );
    liveCollections.sort((a, b) => b.volume.all - a.volume.all);
    liveCollections.push(...liveCollectionsNo);
    liveCollections.push(...upcomingCollections);
    console.log(collectionsList.length, liveCollections.length);

    if (collectionFilterName.length > 1) {
      liveCollections = liveCollections.filter((element) =>
        element.name.toLowerCase().includes(collectionFilterName.toLowerCase())
      );
    }
    return (
      <div className={styles.collectionFilterInputContainer}>
        <input
          className={styles.collectionNameInput}
          placeholder="Search a collection by name"
          onChange={(e) => setCollectionFilterName(e.target.value)}
        />
        <div className={styles.collectionsFilterContainer}>
          {liveCollections.map((element) => {
            return (
              <div key={element.address} className={styles.collectionFilterRow}>
                <p>{element.name}</p>{" "}
                <input
                  name="collectionFilter"
                  type="radio"
                  onChange={(e) =>
                    e.target.checked
                      ? setFilterCollection(`&collection=${element.address}`)
                      : setFilterCollection(``)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  const transferFunction = () => {
    if (
      account !== "" &&
      account[0] !== localStorage.getItem("WALLET_ADDRESS")
    ) {
      setError(
        <>
          <p className={styles.mainError}>Wrong account logged into IMX</p>
          <p className={styles.secondaryError}>
            Your current account is not linked to IMX. Relog to IMX to continue.
          </p>
        </>
      );
      logout();
      setupAndLogin();
      return "";
    }

    transferAll(transferList);
  };
  const setError = (error) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const checkIfAssetIsSelected = (asset) => {
    const collection = transferInput[0];
    const tokenId = transferInput[1];

    return asset[0] === collection && asset[1] === tokenId ? true : false;
  };
  const createSimilarListings = (assets) => {
    const allAssets = [];
    console.log(assets);
    assets?.map((element) =>
      element.result.map((result) => allAssets.push(result))
    );

    console.log(allAssets);
    return (
      <>
        {allAssets.map((result, i) => {
          const arrayToTransfer = [
            result.token_address,
            result.token_id,
            result.collection,
            result.image_url,
          ];
          console.log(checkIfAssetIsSelected(arrayToTransfer));
          return (
            <div
              onClick={() => {
                const newArray = [arrayToTransfer];
                setTransferInput(newArray);
              }}
              key={`${i}Listing`}
              className={styles.similarListingsContainer}
            >
              <div className={styles.similarImageContainer}>
                <img
                  className={styles.similarImage}
                  src={result.image_url}
                  alt="nft icon"
                />
              </div>
              <div className={styles.similarDescription}>
                <div className={styles.nameDescription}>
                  <span className={styles.collectionName}>
                    {result.collection.name}
                  </span>
                  {result.name}
                </div>

                {collections[result.token_address] ? (
                  <p className={styles.rankContainer}>
                    Rank:
                    {collections[result.token_address]["ranksArray"].indexOf(
                      result.token_id
                    ) + 1}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          );
        })}
        <div ref={ref}></div>
      </>
    );
  };

  const login = async () => {
    const account = await ethereum.request({ method: "eth_requestAccounts" });
    setAccount(account);
  };

  useEffect(() => getUserBalances(), [account]);
  console.log(transferList);
  const tokenObject = {
    ETH: {
      name: "Immutable Eth",
      image_url: "/images/ethImx.svg",
      token_address: "",
      symbol: "ETH",
      decimals: "18",
      quantum: "100000000",
    },
    GODS: {
      name: "Gods Unchained",
      image_url: "/images/godsLogo.svg",
      token_address: "0xccc8cb5229b0ac8069c51fd58367fd1e622afd97",
      symbol: "GODS",
      decimals: "18",
      quantum: "100000000",
    },
    IMX: {
      name: "Immutable X",
      image_url: "/images/imxLogo.svg",
      token_address: "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",
      symbol: "IMX",
      decimals: "18",
      quantum: "100000000",
    },
    USDC: {
      name: "USD Coin",
      image_url: "/images/usdcLogo.svg",
      token_address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      symbol: "USDC",
      decimals: "6",
      quantum: "1",
    },
  };
  const tokenArray = [
    {
      name: "Immutable Eth",
      image_url: "/images/ethImx.svg",
      token_address: "",
      symbol: "ETH",
      decimals: "18",
      quantum: "100000000",
    },
    {
      name: "Gods Unchained",
      image_url: "/images/godsLogo.svg",
      token_address: "0xccc8cb5229b0ac8069c51fd58367fd1e622afd97",
      symbol: "GODS",
      decimals: "18",
      quantum: "100000000",
    },
    {
      name: "Immutable X",
      image_url: "/images/imxLogo.svg",
      token_address: "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",
      symbol: "IMX",
      decimals: "18",
      quantum: "100000000",
    },
    {
      name: "USD Coin",
      image_url: "/images/usdcLogo.svg",
      token_address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      symbol: "USDC",
      decimals: "6",
      quantum: "1",
    },
  ];

  //input for address, input for type of, input for amount, choice of owned assets....
  return (
    <>
      <NavBar />
      {errorMessage !== "" ? (
        <div className={styles.errorContainer}>{errorMessage}</div>
      ) : (
        ""
      )}
      <div className={styles.mainContainer}>
        <div className={styles.tabsContainer}>
          <div className={styles.mainTitleActive}>Transfer</div>
          <Link href={`/user/${account[0]}`}>
            <a>
              <div className={styles.mainTitle}>Inventory</div>
            </a>
          </Link>
        </div>
        <div className={styles.accountHolder}>
          {account[0]?.slice(0, 5) +
            "..." +
            account[0]?.slice(
              account[0].length - 5,
              account[0].length - 1
            )}{" "}
        </div>
        <div className={styles.tokenContainer}>
          <div className={styles.tokenTitle}>Your IMX tokens</div>
          <div className={styles.balancesContainer}>
            {userBalances ? createTokensDisplay(userBalances) : ""}
          </div>
        </div>
        <div className={styles.nftContainer}>
          <div className={styles.tokenTitle}>Your IMX NFTs</div>

          <div className={styles.displayContainer}>
            <div className={styles.filterAndDisplayContainer}>
              {createCollectionsFilter()}

              <div className={styles.assetDisplayContainer}>
                <div className={styles.filterNameContainer}>
                  <input
                    placeholder="Search assets by name"
                    type="text"
                    onChange={(e) => setFilterName(`&name=${e.target.value}`)}
                    className={styles.inputNameFilter}
                  />
                  <button
                    className={styles.clearButton}
                    onClick={() => setFilterCollection("")}
                  >
                    Clear Filters{" "}
                  </button>
                </div>

                {createSimilarListings(data)}
              </div>
            </div>

            <div
              className={
                transferContainerVisible
                  ? styles.transfersContainer
                  : `${styles.transfersContainer} ${styles.noWidth}`
              }
            >
              {createTransferList(transferList)}
            </div>
          </div>
        </div>

        {transferContainerVisible ? (
          <div
            className={styles.clickToClose}
            onClick={() => setTransferContainerVisible(false)}
          ></div>
        ) : (
          ""
        )}

        <div className={styles.transferInputContainer}>
          {account === "" ? (
            <div className={styles.connectWallet}>
              <button onClick={() => login()} className={styles.transferAll}>
                {" "}
                Connect your wallet{" "}
              </button>
            </div>
          ) : (
            <>{createTransferInput(transferInput)}</>
          )}
        </div>
      </div>
    </>
  );
};

export default Transfer;

/*
 <button
        onClick={() =>
          transferERC20(
            "0.000001",
            "ETH",
            "",
            "0x14c7243c8F63b8F8Fbec04D396CA1575Ddacd136"
          )
        }
      >
        Transfer money
      </button>
      <button
        onClick={() =>
          transferERC721(
            {
              id: "10059",
              token_address: "0x41ff943a5a31652a33cb23fb942769abb3dbaf97",
            },
            "0x14c7243c8F63b8F8Fbec04D396CA1575Ddacd136",
            {
              id: "9518",
              token_address: "0x41ff943a5a31652a33cb23fb942769abb3dbaf97",
            },
            "0x14c7243c8F63b8F8Fbec04D396CA1575Ddacd136"
          )
        }
      >
        Transfer NFT
      </button>

{
      type: ERC721TokenType.ERC721,
      tokenId: asset.id,
      tokenAddress: asset.token_address,
      toAddress,
    },
    {
      type: ERC721TokenType.ERC721,
      tokenId: asset2.id,
      tokenAddress: asset2.token_address,
      toAddress: toAddress2,
    },


export async function transferERC721(asset, addressToSendTo) {
  await link.transfer({
      amount:"1",
    type: ERC721TokenType.ERC721,
    tokenId: asset.id,
    tokenAddress: asset.token_address,
    to: addressToSendTo,
  });
}

export async function transferERC20(amount, symbol, tokenAddress, toAddress) {
  try {
    await link.transfer({
      amount,
      symbol,
      type: ERC20TokenType.ERC20,
      tokenAddress,
      toAddress,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function getAndtransferERC721(asset, addressToSendTo) {
  console.log(asset.sell.data.token_address);
  try {
    const transaction = await link.transfer({
      type: ERC721TokenType.ERC721,
      tokenId: asset.sell.data.token_id,
      tokenAddress: asset.sell.data.token_address,
      to: addressToSendTo,
    });
  } catch (err) {
    console.log(err);
  }
  console.log(transaction);
}



*/
