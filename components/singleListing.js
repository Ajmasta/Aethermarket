import { useEffect, useState } from "react";
import {
  calculateTime,
  getListingInfo,
  useGetFloorPrice,
  useGetListingInfo,
} from "./functions/functions";
import styles from "./styles/singleListing.module.css";
import { Scatter } from "react-chartjs-2";
import ethLogo from "../public/images/ethLogo.png";
import Image from "next/image";
import Link from "next/link";
import { style } from "@mui/system";
import PersonIcon from "@mui/icons-material/Person";
import {
  cancelOrder,
  fillOrder,
  getAndSellAsset,
  getAndtransferERC721,
  getUserBalances,
  logout,
  sellAsset,
  setupAndLogin,
  transferERC721,
} from "./functions/ImxFunctions";
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
  userBalanceAtom,
  ethPriceAtom,
} from "./states/states";
import collections from "../components/functions/collectionRankings.json";
import BigNumber from "bignumber.js";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
const SingleListing = ({ dataListing, assetData }) => {
  const [sell, setSell] = useState(false);
  const [thisAsset, setThisAsset] = useState();
  let [
    listingData,
    collection,
    name,
    imageUrl,
    tokenId,
    status,
    userL,
    price,
    data,
    collectionIcon,
    collectionName,
  ] = "";
  if (dataListing) {
    data = dataListing;
    listingData = data.data.result[0];
    collection = listingData.sell.data.token_address;

    name = listingData.sell.data.properties.name;

    imageUrl = listingData.sell.data.properties.image_url;

    tokenId = listingData.sell.data.token_id;

    status = listingData.status;
    userL = listingData.user;
    price = listingData.buy.data.quantity;
    collectionIcon = listingData.sell.data.properties.collection.icon_url;
    collectionName = listingData.sell.data.properties.collection.name;
  }
  if (assetData) {
    data = assetData;
    listingData = assetData.data;
    collection = listingData.token_address;

    name = listingData.name;

    imageUrl = listingData.image_url;
    tokenId = listingData.token_id;
    status = "asset";
    userL = listingData.user;
    price = 0;
    collectionIcon = listingData.collection.icon_url;
    collectionName = listingData.collection.name;
  }
  console.log(data);
  const [ethPrice, setEthPrice] = useRecoilState(ethPriceAtom);
  const [royaltyHelp, setRoyaltyHelp] = useState(false);

  const { floorPrice, isLoadingFloor, errorFloor } = useGetFloorPrice(
    `https://api.x.immutable.com/v1/orders?&status=active&page_size=1&include_fees=true&sell_token_address=${collection}&order_by=buy_quantity&direction=asc`
  );
  const rank =
    collections[collection] && collections[collection]["ranksArray"]
      ? collections[collection]["ranksArray"].indexOf(tokenId)
      : undefined;
  const [assets, setAssets] = useRecoilState(assetsAtom);
  const user = localStorage.getItem("WALLET_ADDRESS");
  if (
    data.similarListings.result.length > 0 &&
    data.similarListings.result.length <= 99
  )
    data.similarListings.result.push(
      ...data.similarCollection.result.slice(
        0,
        100 - data.similarListings.result.length
      )
    );
  if (
    data.soldListings.result.length > 0 &&
    data.soldListings.result.length <= 99
  )
    data.soldListings.result.push(
      ...data.soldListings.result.slice(
        0,
        100 - data.soldListings.result.length
      )
    );
  const isSimilarListing =
    data.similarListings.result.length > 0 ? true : false;
  const isSimilarSold = data.soldListings.result.length > 0 ? true : false;
  const [numberOfItems, setNumberOfItems] = useState(5);
  const [shownTab, setShownTab] = useState("sales");
  const [shownTabAsset, setShownTabAsset] = useState("price");
  const [errorMessage, setErrorMessage] = useState("");
  const [userBalance, setUserBalance] = useRecoilState(userBalanceAtom);
  const [account, setAccount] = useRecoilState(accountAtom);
  const [fees, setFees] = useState([]);

  const checkOwnerShip = () => {
    console.log(userL);
    return thisAsset?.user === account[0] ? true : false;
  };

  useEffect(() => {
    getAsset(), getFees();
  }, [collection]);

  const getAsset = async () => {
    const data = await (
      await fetch(
        `https://api.x.immutable.com/v1/assets/${collection}/${tokenId}`
      )
    ).json();

    setThisAsset(data);
  };
  const getFees = async () => {
    const data = await (
      await fetch(
        `https://api.x.immutable.com/v1/assets?page_size=1&include_fees=true&collection=${collection}`
      )
    ).json();

    setFees(data.result[0] ? data.result[0].fees : []);
  };
  console.log(fees);
  const createTraitsTabGodsUnchained = () => {
    return (
      <div className={styles.traitsContainer}>
        <div className={styles.traitContainer}>
          <p className={styles.traitName}>{"Set"}</p>
          <p className={styles.traitValue}>{thisAsset.metadata.set}</p>
        </div>
        <div className={styles.traitContainer}>
          <p className={styles.traitName}>{"Quality"}</p>
          <p className={styles.traitValue}>{thisAsset.metadata.quality}</p>
        </div>
        <div className={styles.traitContainer}>
          <p className={styles.traitName}>{"Rarity"}</p>
          <p className={styles.traitValue}>{thisAsset.metadata.rarity}</p>
        </div>
      </div>
    );
  };
  const createTraitsTab = () => {
    const listOfTraits = [];

    for (let object in collections[collection]["listOfTraits"]) {
      let rarity;
      if (thisAsset.metadata[object]) {
        rarity = collections[collection]["listOfTraits"][object].filter(
          (trait) => trait[0] === String(thisAsset.metadata[object])
        );
        if (rarity.length > 0) {
          rarity = rarity[0][1];
        } else {
          rarity = "";
        }

        listOfTraits.push([object, thisAsset.metadata[object], rarity]);
      }
    }
    return (
      <div className={styles.traitsContainer}>
        {listOfTraits.map((trait, i) => (
          <div key={`${i}Traits`} className={styles.traitContainer}>
            <p className={styles.traitName}>{trait[0]}</p>
            <p className={styles.traitValue}>{trait[1]}</p>
            {collections[collection].ranksArray ? (
              <p className={styles.traitRarity}>
                {parseFloat(
                  (
                    (trait[2] / collections[collection].ranksArray.length) *
                    100
                  ).toFixed(3)
                )}
                %
              </p>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    );
  };

  const getItemPriceHistoryChart = (data) => {
    const dataFiltered = data.filter((data) =>
      data.status === "cancelled" ? false : true
    );
    if (dataFiltered.length <= 1) return "No sale history for this item";

    const chartData = {
      datasets: [
        {
          label: "Current Price",
          data: [{ x: 0, y: price / 10 ** 18 }],
          backgroundColor: "rgba(0, 255, 0, 1)",
          pointRadius: 7,
        },
        {
          label: "Past 10 prices",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 1)",
        },
        {
          label: "Older prices",
          hidden: true,
          data: [],
          backgroundColor: "rgba(255, 199, 22, 1)",
          hidden: true,
        },
      ],
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: "Past sale history",
        },
      },
    };
    const priceData = dataFiltered.map((data, i) => {
      i <= 10
        ? chartData.datasets[1].data.push({
            x: i + 1,
            y: data.buy.data.quantity / 10 ** 18,
          })
        : chartData.datasets[2].data.push({
            x: i + 1,
            y: data.buy.data.quantity / 10 ** 18,
          });
      return data.buy.data.quantity / 10 ** 18;
    });
    return (
      <Scatter
        className={styles.chart}
        data={chartData}
        options={options}
      ></Scatter>
    );
  };
  const getPriceHistoryChart = (data) => {
    const sold = isSimilarSold
      ? data.soldListings.result
      : data.soldCollectionListings.result;
    const chartData = {
      datasets: [
        {
          label: "This NFT",
          data: [],
          backgroundColor: "rgba(0, 255, 0, 1)",
          pointRadius: 7,
        },
        {
          label: "Last 10 sales",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 1)",
        },
        {
          label: "Older sales",
          hidden: true,
          data: [],
          backgroundColor: "rgba(255, 199, 22, 1)",
          hidden: true,
        },
      ],
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: "Past sale history of similar items",
        },
      },
    };

    const soldPrice = sold.map((result, i) => {
      result.sell.data.token_id === tokenId
        ? chartData.datasets[0].data.push({
            x: i + 1,
            y: result.buy.data.quantity / 10 ** 18,
          })
        : i <= 10
        ? chartData.datasets[1].data.push({
            x: i + 1,
            y: result.buy.data.quantity / 10 ** 18,
          })
        : chartData.datasets[2].data.push({
            x: i + 1,
            y: result.buy.data.quantity / 10 ** 18,
          });
      return result.buy.data.quantity / 10 ** 18;
    });

    return (
      <Scatter
        className={styles.chart}
        data={chartData}
        options={options}
      ></Scatter>
    );
  };
  const getCurrentPricesChart = (data) => {
    const selling = isSimilarSold
      ? data.similarListings.result
      : data.similarCollection.result;
    const chartData = {
      datasets: [
        {
          label: "This NFT",
          data: [],
          backgroundColor: "rgba(0, 255, 0, 1)",
          pointRadius: 7,
        },
        {
          label: "10 Cheapest listings",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 1)",
        },
        {
          label: "Other Listings",
          data: [],
          backgroundColor: "rgba(255, 199, 22, 1)",
          hidden: true,
        },
      ],
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: "Current average listing price",
        },
      },
    };
    const sellingPrice = selling.map((result, i) => {
      result.sell.data.token_id === tokenId
        ? chartData.datasets[0].data.push({
            x: i + 1,
            y: result.buy.data.quantity / 10 ** 18,
          })
        : i <= 10
        ? chartData.datasets[1].data.push({
            x: i + 1,
            y: result.buy.data.quantity / 10 ** 18,
          })
        : chartData.datasets[2].data.push({
            x: i + 1,
            y: result.buy.data.quantity / 10 ** 18,
          });
      return result.buy.data.quantity / 10 ** 18;
    });
    const medianPrice = sellingPrice[Math.abs(sellingPrice.length / 2)];

    return (
      <Scatter
        className={styles.chart}
        data={chartData}
        options={options}
      ></Scatter>
    );
  };
  const createSimilarListings = (array) => {
    return array.map((result, i) => (
      <Link
        key={i}
        href={`../${result.sell.data.token_address}/${result.sell.data.token_id}`}
      >
        <a className={styles.similarListingsContainer}>
          <div className={styles.similarImageContainer}>
            <img
              className={styles.similarImage}
              src={result.sell.data.properties.image_url}
              alt="nft icon"
            />
          </div>
          <div className={styles.similarDescription}>
            <div className={styles.nameDescription}>
              <span className={styles.collectionName}>
                {result.sell.data.properties.collection.name}
              </span>
              {result.sell.data.properties.name}
            </div>

            <div className={styles.priceDescription}>
              <div className={styles.nameDescription}>
                <span className={styles.priceName}>Price</span>
              </div>
              <span className={styles.priceQuantity}>
                {result.buy.data.quantity / 10 ** 18}{" "}
                <Image
                  alt="ethereum logo"
                  src={ethLogo}
                  width={18}
                  height={18}
                />
              </span>
              <span className={styles.currencyQuantity}>
                {parseFloat(
                  ((result.buy.data.quantity / 10 ** 18) * ethPrice).toFixed(2)
                )}{" "}
                $
              </span>
            </div>
          </div>
        </a>
      </Link>
    ));
  };

  const createSalesTable = (array, numberOfItems) => {
    let sold = isSimilarSold
      ? array.soldListings.result
      : array.soldCollectionListings.result;
    const arrayLength = sold.length;
    sold.sort((result, result2) =>
      result.updated_timestamp < result2.updated_timestamp ? 1 : -1
    );
    sold = sold.slice(0, numberOfItems);

    return (
      <div className={styles.tableContainer}>
        <div className={styles.tableRow}>
          <p className={styles.tableCell}>Item</p>
          <p className={styles.tableCell}>Price</p>
          {collections[collection] ? (
            <p className={`${styles.tableCell} ${styles.quantityCell}`}>
              Ranking
            </p>
          ) : (
            ""
          )}
          <p className={styles.tableCell}>To</p>
          <p className={styles.tableCell}>Time</p>
        </div>
        {sold.map((item, i) => {
          return (
            <div key={"tableRow" + i} className={styles.tableRow}>
              <Link
                className={styles.tableCell}
                href={`../${item.sell.data.token_address}/${item.sell.data.token_id}`}
              >
                <a className={styles.tableCell}>
                  <img
                    className={styles.tableImage}
                    src={
                      item.buy.type === "ETH"
                        ? item.sell.data.properties.image_url
                        : item.buy.data.properties.image_url
                    }
                  />
                  #{item.sell.data.token_id.slice(0, 6)}
                </a>
              </Link>
              <p className={styles.tableCell}>
                {item.buy.data.quantity / 10 ** 18}
              </p>
              {collections[item.sell.data.token_address] &&
              collections[item.sell.data.token_address]["ranksArray"] ? (
                <p className={`${styles.tableCell} ${styles.quantityCell}`}>
                  {collections[collection]["ranksArray"].indexOf(
                    item.sell.data.token_id
                  ) + 1}
                </p>
              ) : (
                ""
              )}
              <p className={styles.tableCell}>
                {item.user.slice(0, 5) +
                  "..." +
                  item.user.slice(item.user.length - 5, item.user.length - 1)}
              </p>
              <p className={styles.tableCell}>
                {calculateTime(item.updated_timestamp)}
              </p>
            </div>
          );
        })}
        <div
          onClick={() => setNumberOfItems(numberOfItems + 10)}
          className={
            numberOfItems < arrayLength
              ? `${styles.tableRow} ${styles.tableSeeMore}`
              : styles.tableRow
          }
        >
          {numberOfItems < arrayLength ? "See More Results" : ""}
        </div>
      </div>
    );
  };
  const createListingsTable = (array, numberOfItems) => {
    let selling = isSimilarListing
      ? array.similarListings.result
      : array.similarCollection.result;
    const arrayLength = selling.length;
    selling.sort((result, result2) =>
      Number(result.buy.data.quantity) > Number(result2.buy.data.quantity)
        ? 1
        : -1
    );
    selling = selling.slice(0, numberOfItems);

    return (
      <div className={styles.tableContainer}>
        <div className={styles.tableRow}>
          <p className={styles.tableCell}>Item</p>
          <p className={styles.tableCell}>Price</p>
          {collections[collection] ? (
            <p className={`${styles.tableCell} ${styles.quantityCell}`}>
              Ranking
            </p>
          ) : (
            ""
          )}
          <p className={styles.tableCell}>From</p>

          <p className={styles.tableCell}>Time</p>
        </div>
        {selling.map((item, i) => (
          <div key={"tableRow" + i} className={styles.tableRow}>
            <Link
              className={styles.tableCell}
              href={`../${item.sell.data.token_address}/${item.sell.data.token_id}`}
            >
              <a className={styles.tableCell}>
                <img
                  className={styles.tableImage}
                  src={item.sell.data.properties.image_url}
                />
                #{item.sell.data.token_id.slice(0, 6)}
              </a>
            </Link>
            <p className={styles.tableCell}>
              {item.buy.data.quantity / 10 ** 18}
            </p>
            {collections[item.sell.data.token_address] &&
            collections[item.sell.data.token_address]["ranksArray"] ? (
              <p className={`${styles.tableCell} ${styles.quantityCell}`}>
                {collections[collection]["ranksArray"].indexOf(
                  item.sell.data.token_id
                ) + 1}
              </p>
            ) : (
              ""
            )}

            <p className={styles.tableCell}>
              {item.user.slice(0, 5) +
                "..." +
                item.user.slice(item.user.length - 5, item.user.length - 1)}
            </p>

            <p className={styles.tableCell}>
              {calculateTime(item.updated_timestamp)}
            </p>
          </div>
        ))}
        <div
          onClick={() => setNumberOfItems(numberOfItems + 10)}
          className={
            numberOfItems < arrayLength
              ? `${styles.tableRow} ${styles.tableSeeMore}`
              : styles.tableRow
          }
        >
          {numberOfItems < arrayLength ? "See More Results" : ""}
        </div>
      </div>
    );
  };

  const createHistoryTable = (array, numberOfItems) => {
    let dataFiltered = array.filter((data) =>
      data.status === "cancelled" ? false : true
    );
    if (dataFiltered.length <= 1) return "";

    dataFiltered.sort((result, result2) =>
      result.updated_timestamp < result2.updated_timestamp ? 1 : -1
    );
    dataFiltered = dataFiltered.slice(0, numberOfItems);

    return (
      <div className={styles.tableContainer}>
        <div className={styles.tableRow}>
          <p className={styles.tableCell}>Item</p>
          <p className={styles.tableCell}>Price</p>
          <p className={`${styles.tableCell} ${styles.quantityCell}`}>Qty</p>

          <p className={styles.tableCell}>To</p>
          <p className={styles.tableCell}>Time</p>
        </div>
        {dataFiltered.map((item, i) => (
          <div key={"tableRow" + i} className={styles.tableRow}>
            <Link
              className={styles.tableCell}
              href={`../${item.sell.data.token_address}/${item.sell.data.token_id}`}
            >
              <a className={styles.tableCell}>
                <img
                  className={styles.tableImage}
                  src={item.sell.data.properties.image_url}
                />
                #
                {item.sell.data.token_id.length > 8
                  ? "..." +
                    item.sell.data.token_id.slice(
                      item.sell.data.token_id.length - 5,
                      item.sell.data.token_id.length
                    )
                  : item.sell.data.token_id}
              </a>
            </Link>
            <p className={styles.tableCell}>
              {item.buy.data.quantity / 10 ** 18}
            </p>
            <p className={`${styles.tableCell} ${styles.quantityCell}`}>
              {item.sell.data.quantity}
            </p>

            <p className={styles.tableCell}>
              {item.user.slice(0, 5) +
                "..." +
                item.user.slice(item.user.length - 5, item.user.length - 1)}
            </p>
            <p className={styles.tableCell}>
              {calculateTime(item.updated_timestamp)}
            </p>
          </div>
        ))}
        <div
          onClick={() => setNumberOfItems(numberOfItems + 10)}
          className={
            numberOfItems < dataFiltered.length
              ? `${styles.tableRow}${styles.tableSeeMore}`
              : styles.tableRow
          }
        >
          {numberOfItems < dataFiltered.length ? "See More Results" : ""}
        </div>
      </div>
    );
  };

  data.similarListings.result.sort((a, b) =>
    Number(a.buy.data.quantity / 10 ** 18) >
    Number(b.buy.data.quantity / 10 ** 18)
      ? 1
      : -1
  );
  const reducedSimilarListings = data.similarListings.result.slice(0, 6);
  data.similarCollection.result.sort((a, b) =>
    Number(a.buy.data.quantity / 10 ** 18) >
    Number(b.buy.data.quantity / 10 ** 18)
      ? 1
      : -1
  );
  const reducedSimilarCollection = data.similarCollection.result.slice(0, 6);

  const setError = (error) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const buyFunction = (order) => {
    if (account === "") {
      formatUserBalances();
    }
    if (account[0] !== localStorage.getItem("WALLET_ADDRESS")) {
      setError(
        <>
          <p className={styles.mainError}>Not logged into IMX</p>
          <p className={styles.secondaryError}>
            Your current account is not linked to IMX. Log into IMX to continue.
          </p>
        </>
      );
      logout();
      setupAndLogin();
      return "";
    }
    console.log(Number(userBalance.imx) < Number(order.buy.data.quantity));
    if (Number(userBalance.imx) < Number(order.buy.data.quantity)) {
      setError(
        <>
          <p className={styles.mainError}>Not enough funds!</p>
          <p className={styles.secondaryError}>
            Transfer funds to IMX by clicking on the wallet in the top-right.
          </p>
        </>
      );
      return "";
    }

    fillOrder(order);
  };

  const sellFunction = () => {
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

    assetData
      ? sellAsset(listingData, sell)
      : getAndSellAsset(listingData, sell);
  };
  const calculatePriceWithFees = (price) => {
    let newPrice = Number(price);
    console.log(fees);
    fees?.map((element) => {
      newPrice = newPrice + (newPrice * Number(element["percentage"])) / 100;
    });
    return newPrice;
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
  };
  console.log(sell, "sell");
  return (
    <>
      <div className={styles.mainContainer}>
        {errorMessage !== "" ? (
          <div className={styles.errorContainer}>{errorMessage}</div>
        ) : (
          ""
        )}
        <div className={styles.topContainer}>
          <div className={styles.leftContainer}>
            <div className={styles.rankIdContainer}>
              <p className={styles.elementID}> {name}</p>
              {rank ? (
                <p className={styles.elementRank}> Rank: {rank + 1} </p>
              ) : (
                ""
              )}
            </div>
            <div className={styles.photoContainer}>
              <img className={styles.image} src={imageUrl} alt="nft icon" />
            </div>

            <div className={styles.statsContainer}>
              <div className={styles.priceContainer}>
                {" "}
                {status === "active" ? (
                  <>
                    {" "}
                    {price / 10 ** 18}
                    <Image
                      alt="ethereum logo"
                      src={ethLogo}
                      width={30}
                      height={30}
                    />
                    <div className={styles.currencyQuantityBig}>
                      {parseFloat(((price / 10 ** 18) * ethPrice).toFixed(2))}$
                    </div>
                  </>
                ) : (
                  ""
                )}{" "}
              </div>
              {status === "active" ? (
                checkOwnerShip() ? (
                  <>
                    <button
                      className={styles.buyButton}
                      onClick={() => cancelOrder(listingData)}
                    >
                      Cancel Listing
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => buyFunction(listingData)}
                    className={styles.buyButton}
                  >
                    Buy{" "}
                  </button>
                )
              ) : checkOwnerShip() ? (
                <>
                  {" "}
                  <div className={styles.inputRef}>
                    <input
                      type="tel"
                      pattern="[0-9]*"
                      placeholder={sell ? sell : "Enter listing price in ETH"}
                      value={sell ? sell : ""}
                      onChange={(e) => setSell(e.target.value)}
                      className={styles.sellInput}
                    ></input>
                    <button
                      className={styles.setFloorPrice}
                      onClick={() =>
                        setSell(floorPrice / (1 + 5 / 100) / 10 ** 18)
                      }
                    >
                      Floor
                    </button>
                    <button
                      className={styles.setTenPercent}
                      onClick={() =>
                        setSell(
                          parseFloat((Number(sell) + sell * 0.1).toFixed(8))
                        )
                      }
                    >
                      +10%
                    </button>
                    <button
                      className={styles.setOnePercent}
                      onClick={() =>
                        setSell(
                          parseFloat((Number(sell) - sell * 0.01).toFixed(8))
                        )
                      }
                    >
                      -1%
                    </button>
                  </div>
                  <span className={styles.floorPrice}>
                    Floor Price: {floorPrice / 10 ** 18}
                    <Image
                      width={18}
                      height={18}
                      src={ethLogo}
                      alt="ethereum logo"
                    />
                  </span>{" "}
                  <span className={styles.floorPriceInfo}>
                    The floor price is updated in real time. No need to refresh.
                    It includes all fees.
                  </span>{" "}
                  <button
                    onClick={() => {
                      sellFunction();
                    }}
                    className={
                      sell > 0 ? styles.buyButton : styles.disabledButton
                    }
                    disabled={sell > 0 ? false : true}
                  >
                    Sell{" "}
                  </button>
                  {sell > 0 ? (
                    <div className={styles.tableSellPrices}>
                      <div className={styles.feesInfo}>
                        <div className={styles.tableSellPricesRow}>
                          <span className={styles.tableSellPricesCellText}>
                            {" "}
                            Amount you receive{" "}
                          </span>
                          <div className={styles.quantityContainer}>
                            <div className={styles.tableSellPricesCellEth}>
                              {parseFloat(
                                calculatePriceWithFees(
                                  sell / (5 / 100 + 1)
                                ).toFixed(5)
                              )}{" "}
                              <Image
                                width={24}
                                height={24}
                                src={ethLogo}
                                alt="ethereum logo"
                              />
                            </div>

                            <div className={styles.tableSellPricesRowUSD}>
                              <span className={styles.tableSellPricesCellUSD}>
                                {parseFloat((sell * ethPrice).toFixed(2))}$
                              </span>
                            </div>
                          </div>
                        </div>
                        {fees?.length > 0 && sell > 0 ? (
                          <div className={styles.feesContainer}>
                            <div className={styles.tableSellPricesRow}>
                              <HelpOutlineOutlinedIcon
                                className={styles.helpIcon}
                                onMouseEnter={() => setRoyaltyHelp(true)}
                                onMouseLeave={() => setRoyaltyHelp(false)}
                              />
                              <span className={styles.tableSellPricesCellText}>
                                IMX listing price (incl. fees):{" "}
                              </span>
                              <div>
                                <div className={styles.tableSellPricesCellEth}>
                                  {parseFloat(
                                    calculatePriceWithFees(sell).toFixed(6)
                                  )}
                                  <Image
                                    width={24}
                                    height={24}
                                    src={ethLogo}
                                    alt="ethereum logo"
                                  />
                                </div>
                                <div className={styles.tableSellPricesRowUSD}>
                                  <span
                                    className={styles.tableSellPricesCellUSD}
                                  >
                                    {parseFloat(
                                      (
                                        calculatePriceWithFees(sell) * ethPrice
                                      ).toFixed(2)
                                    )}
                                    $
                                  </span>
                                </div>
                              </div>
                              {royaltyHelp ? (
                                <span className={styles.royaltiesInfo}>
                                  IMX adds fees when you list an item with them.
                                  We show you what fees will be added so you
                                  know exactly how much you will get. <br />
                                  Royalties are fees paid to the creator of the
                                  collection.
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                            <p className={styles.tableSellPricesRowSmall}>
                              Fees{" "}
                            </p>
                            {fees.map((element) => (
                              <>
                                <div
                                  key={element}
                                  className={styles.tableSellPricesRowSmall}
                                >
                                  <span
                                    className={styles.tableSellPricesCellSmall}
                                  >
                                    {" "}
                                    {element.type === "royalty"
                                      ? "Royalty set by the artist " +
                                        "(" +
                                        element.percentage +
                                        "%)"
                                      : ""}
                                  </span>{" "}
                                  <span
                                    className={styles.tableSellPricesCellSmall}
                                  >
                                    {parseFloat(
                                      (
                                        (sell * element.percentage) /
                                        100
                                      ).toFixed(6)
                                    )}
                                    <Image
                                      width={18}
                                      height={18}
                                      src={ethLogo}
                                      alt="ethereum logo"
                                    />
                                  </span>
                                </div>
                                <div className={styles.tableSellPricesRowUSD}>
                                  <span
                                    className={styles.tableSellPricesCellUSD}
                                  >
                                    {parseFloat(
                                      (
                                        (sell * element.percentage * ethPrice) /
                                        100
                                      ).toFixed(6)
                                    )}
                                    $
                                  </span>
                                </div>
                              </>
                            ))}
                          </div>
                        ) : (
                          <>
                            <p className={styles.tableSellPricesRowSmall}>
                              Fees{" "}
                            </p>
                            <div className={styles.tableSellPricesRowSmall}>
                              <span className={styles.tableSellPricesCellSmall}>
                                No Fees
                              </span>{" "}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}{" "}
                </>
              ) : (
                <div className={styles.notListedContainer}>
                  <p className={styles.notListedText}>Not currently listed </p>
                  Last listed price: {price / 10 ** 18}
                  <Image
                    width={20}
                    height={20}
                    src={ethLogo}
                    alt="ethereum logo"
                  />
                </div>
              )}

              <Link href={`/user/${thisAsset ? thisAsset.user : userL}`}>
                <a className={styles.linkToUser}>
                  <PersonIcon />
                  {thisAsset
                    ? thisAsset.user.slice(0, 5) +
                      "..." +
                      thisAsset.user.slice(
                        thisAsset.user.length - 5,
                        thisAsset.user.length - 1
                      )
                    : userL.slice(0, 5) +
                      "..." +
                      userL.slice(userL.length - 5, userL.length - 1)}
                </a>
              </Link>
              <Link href={`../${collection}`}>
                <a className={styles.linkToUser}>
                  <img
                    width="25px"
                    src={collectionIcon}
                    alt="collection icon"
                  />
                  {collectionName}
                </a>
              </Link>

              <div className={styles.tabContainerAsset}>
                <div className={styles.tabRow}>
                  <p
                    onClick={() => setShownTabAsset("price")}
                    className={
                      shownTabAsset === "price"
                        ? styles.activeTab
                        : styles.inactiveTab
                    }
                  >
                    Price History
                  </p>
                  <p
                    onClick={() => setShownTabAsset("traits")}
                    className={
                      shownTabAsset === "price"
                        ? styles.inactiveTab
                        : styles.activeTab
                    }
                  >
                    Traits
                  </p>
                </div>
                <div className={styles.tabContent}>
                  <div
                    className={
                      shownTabAsset === "traits"
                        ? styles.hidden
                        : styles.currentPricesTab
                    }
                  >
                    <div className={styles.historyContainer}>
                      <p className={styles.tableTitle}>Price History</p>
                      {data.data.asset ? (
                        ""
                      ) : (
                        <>
                          {createHistoryTable(data.data.result, numberOfItems)}
                          {getItemPriceHistoryChart(data.data.result)}
                        </>
                      )}
                    </div>
                  </div>
                  <div
                    className={
                      shownTabAsset === "traits"
                        ? styles.pastSalesTab
                        : styles.hidden
                    }
                  >
                    <p className={styles.tableTitle}>Traits</p>
                    {thisAsset &&
                    collection === "0xacb3c6a43d15b907e8433077b6d38ae40936fe2c"
                      ? createTraitsTabGodsUnchained()
                      : collections[collection] && thisAsset
                      ? createTraitsTab()
                      : "No traits data available"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.infoContainer}>
            <p className={styles.infoContainerTitle}></p>
            <div className={styles.tabContainer}>
              <div className={styles.tabRow}>
                <p
                  onClick={() => setShownTab("sales")}
                  className={
                    shownTab === "sales" ? styles.activeTab : styles.inactiveTab
                  }
                >
                  Similar NFTs Sales
                </p>
                <p
                  onClick={() => setShownTab("current")}
                  className={
                    shownTab === "sales" ? styles.inactiveTab : styles.activeTab
                  }
                >
                  Similar Listings
                </p>
              </div>
              <div className={styles.tabContent}>
                <div
                  className={
                    shownTab === "sales"
                      ? styles.hidden
                      : styles.currentPricesTab
                  }
                >
                  {getCurrentPricesChart(data)}
                  <p className={styles.tableTitle}>Current Similar Listings</p>
                  {createListingsTable(data, numberOfItems)}
                </div>

                <div
                  className={
                    shownTab === "sales" ? styles.pastSalesTab : styles.hidden
                  }
                >
                  {getPriceHistoryChart(data)}
                  <p className={styles.tableTitle}>Similar Past Sales</p>
                  {createSalesTable(data, numberOfItems)}
                </div>
              </div>
            </div>
            <div className={styles.priceHistory}></div>
          </div>
        </div>

        <div className={styles.bottomContainer}>
          <p className={styles.bottomContainerTitle}> Similar items for sale</p>
          <div className={styles.bottomImagesContainer}>
            {isSimilarListing
              ? createSimilarListings(reducedSimilarListings)
              : createSimilarListings(reducedSimilarCollection)}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleListing;
