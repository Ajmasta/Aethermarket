import styles from "./styles/fullLastListed.module.css";
import Link from "next/link";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { calculateTime, getEthPrice } from "./functions/functions";
import ethLogo from "../public/images/ethLogo.png";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import collections from "../components/functions/collectionRankings.json";
import queryString from "query-string";
import { useInView } from "react-intersection-observer";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  accountAtom,
  buyCartAtom,
  ethPriceAtom,
  refreshAtom,
  userBalanceAtom,
} from "./states/states";
import {
  fillAllOrder,
  fillOrder,
  getUserBalances,
  logout,
  setupAndLogin,
} from "./functions/ImxFunctions";
import { HowToVoteRounded } from "@mui/icons-material";
import Loading from "./loading";

const FullLastListed = ({ data, setSortBy, sortBy, collection }) => {
  const [input, setInput] = useState("");
  const { ref, inView, entry } = useInView();
  const ethPrice = useRecoilValue(ethPriceAtom);
  const [hovered, setHovered] = useState([]);
  const [buyCart, setBuyCart] = useRecoilState(buyCartAtom);
  const [errorMessage, setErrorMessage] = useState("");
  const [account, setAccount] = useRecoilState(accountAtom);
  const [userBalance, setUserBalance] = useRecoilState(userBalanceAtom);
  const [extraFilters, setExtraFilters] = useState("");
  const [refreshInterval, setRefreshInterval] = useRecoilState(refreshAtom);
  const [filteredArray, setFilteredArray] = useState([]);
  const [timer, setTimer] = useState(false);
  const [loading, setLoading] = useState(false);
  /* const [priceRange, setPriceRange] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [indexPrice, setIndexPrice] = useState(0);*/
  const setError = (error) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const formatUserBalances = async () => {
    const account = await ethereum.request({ method: "eth_requestAccounts" });
    setAccount(account);
    const userBalance = await getUserBalances(account);

    setUserBalance({ ...userBalance, imx: userBalance.imx });
  };
  useEffect(() => formatUserBalances(), []);
  const buyFunction = (order) => {
    if (account === "") {
      formatUserBalances();
    }
    if (account[0] !== localStorage.getItem("WALLET_ADDRESS")) {
      setError(
        <>
          <p className={styles.mainError}>Not logged into IMX</p>
          <p className={styles.secondaryError}>
            Your current account is not logged into to IMX. Log into IMX to
            continue.
          </p>
        </>
      );
      logout();
      setupAndLogin();
      return "";
    }
    console.log(userBalance.imx);
    if (Number(userBalance.imx) < order.buy.data.quantity) {
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

  console.log(buyCart);
  const dollarFormat = Intl.NumberFormat("en-US");
  if (input.length > 0 && isNaN(input)) setInput("");
  const filteredData = data.listings.filter((item) => {
    //if (item.sell.data.properties.name.includes(input)) return true
    if (item.sell.data.token_id === input) return true;
    if (
      item.sell.data.properties.name?.startsWith(`Highrise Creature #${input}`)
    )
      return true;

    return false;
  });
  const checkDisabled = (result) => {
    console.log(result);
    const filter = buyCart.filter(
      (element) =>
        element.sell.data.token_id === result.sell.data.token_id &&
        element.sell.data.token_address === result.sell.data.token_address
    );
    return filter.length > 0 ? true : false;
  };
  useEffect(() => {
    sortBy === "&order_by=buy_quantity&direction=asc"
      ? data.listings.sort((a, b) => a.buy.data.quantity - b.buy.data.quantity)
      : "";
  }, [sortBy]);
  /* useEffect(() => {
    if (extraFilters === "rankings") {
      const prices = filteredArray.listings?.map((element) =>
        Number(element.buy.data.quantity)
      );
      setMaxPrice(Math.max(prices));
      setPriceRange(prices);
      setIndexPrice(priceRange.length - 1);
    } else {
      const prices = data.listings?.map((element) =>
        Number(element.buy.data.quantity)
      );
      setMaxPrice(Math.max(prices));
      setPriceRange(prices);
      setIndexPrice(priceRange.length - 1);
    }
  }, [data, extraFilters]);
  //useefect to filter

  useEffect(() => {
    const newArray = [...data.listings];
    newArray.splice(indexPrice, data.length - 1 - indexPrice);
    setFilteredArray(newArray);
  }, [indexPrice]);*/
  useEffect(() => {
    if (extraFilters === "rankings" && !timer) {
      setTimer(true);
      setTimeout(() => setTimer(false), 30000);
      setLoading(true);
      setTimeout(() => setLoading(false), 1500);
      setTimeout(
        () =>
          setFilteredArray(
            data.listings.sort(
              (a, b) =>
                collections[collection]["ranksArray"].indexOf(
                  a.sell.data.token_id
                ) -
                collections[collection]["ranksArray"].indexOf(
                  b.sell.data.token_id
                )
            )
          ),
        200
      );
      console.timeEnd("beforeSort");
    }
  }, [extraFilters, timer]);
  const [numberOfItems, setNumberOfItems] = useState(10);
  useEffect(() => setNumberOfItems(numberOfItems + 10), [inView]);

  const createSimilarListings = (array, numberOfItems) => {
    array = array.slice(0, numberOfItems);
    return array.length > 0 ? (
      <>
        {array.map((result, i) => (
          <>
            <div
              key={i}
              className={styles.similarListingsContainer}
              onMouseEnter={() => setHovered([i])}
              onMouseLeave={() => setHovered([])}
            >
              <Link
                href={`./${result.sell.data.token_address}/${result.sell.data.token_id}`}
              >
                <a>
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
                        {parseFloat(
                          (result.buy.data.quantity / 10 ** 18).toFixed(5)
                        )}{" "}
                        <Image
                          alt="ethereum logo"
                          src={ethLogo}
                          width={15}
                          height={15}
                        />
                      </span>
                      <span className={styles.currencyQuantity}>
                        {dollarFormat.format(
                          parseFloat(
                            (
                              (result.buy.data.quantity / 10 ** 18) *
                              ethPrice
                            ).toFixed(2)
                          )
                        )}{" "}
                        $
                      </span>
                    </div>
                    {collections[collection]?.ranksArray ? (
                      <p key={`{i}rank`} className={styles.rankContainer}>
                        Rank:
                        {collections[collection]["ranksArray"].indexOf(
                          result.sell.data.token_id
                        ) === -1
                          ? "N/A"
                          : collections[collection]["ranksArray"].indexOf(
                              result.sell.data.token_id
                            ) + 1}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </a>
              </Link>
              {hovered.includes(i) ? (
                <div className={styles.buyDrawer}>
                  <button
                    className={styles.buyButton}
                    onClick={() => buyFunction(result)}
                  >
                    Buy
                  </button>
                  <button
                    disabled={checkDisabled(result)}
                    className={styles.addCartButton}
                    onClick={() => setBuyCart([...buyCart, result])}
                  >
                    Add to cart
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </>
        ))}
        <div ref={ref}></div>
      </>
    ) : (
      "No listings found!"
    );
  };

  return (
    <div className={styles.mainContainer}>
      {errorMessage !== "" ? (
        <div className={styles.errorContainer}>{errorMessage}</div>
      ) : (
        ""
      )}
      <div className={styles.filterTab}>
        <input
          className={styles.inputFilter}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          type="number"
          placeholder="Search token ID"
        ></input>
        {/*<div>{priceRange[indexPrice] / 10 ** 18}</div>
        <input
          type="range"
          min="0"
          max={priceRange.length - 1}
          step="1"
          onChange={(e) => setIndexPrice(e.target.value)}
        />
        */}
        <select
          id="filter"
          className={styles.selectInput}
          value={extraFilters === "" ? sortBy : extraFilters}
          name="filter"
          onChange={(e) => {
            if (e.target.value !== "rankings") {
              setExtraFilters("");
              setFilteredArray([]);
              setTimer(false);
              setSortBy(e.target.value);
            } else {
              setExtraFilters("rankings");
            }
          }}
        >
          <option
            className={styles.optionInput}
            value="&order_by=buy_quantity&direction=asc"
          >
            Lowest Price
          </option>
          <option
            className={styles.optionInput}
            value="&order_by=buy_quantity&direction=desc"
          >
            Highest price
          </option>
          <option
            className={styles.optionInput}
            value="&order_by=created_at&direction=asc"
          >
            Newly Listed
          </option>
          {collections && collections[collection]?.ranksArray ? (
            <option className={styles.optionInput} value="rankings">
              Rankings
            </option>
          ) : (
            ""
          )}
        </select>
      </div>
      <div className={styles.bottomImagesContainer}>
        {loading ? (
          <Loading />
        ) : input.length === 0 ? (
          createSimilarListings(
            filteredArray.length > 0 ? filteredArray : data.listings,
            numberOfItems
          )
        ) : (
          createSimilarListings(filteredData, numberOfItems)
        )}
      </div>
    </div>
  );
};
export default FullLastListed;
