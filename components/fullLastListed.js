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
import { useRecoilValue } from "recoil";
import { ethPriceAtom } from "./states/states";

const FullLastListed = ({ data, setSortBy, sortBy, collection }) => {
  const [extraFilters, setExtraFilters] = useState("");
  const [input, setInput] = useState("");
  const { ref, inView, entry } = useInView();
  const ethPrice = useRecoilValue(ethPriceAtom);
  if (input.length > 0 && isNaN(input)) setInput("");
  const filteredData = data.listings.filter((item) => {
    //if (item.sell.data.properties.name.includes(input)) return true
    if (item.sell.data.token_id === input) return true;

    return false;
  });

  sortBy === "&order_by=buy_quantity&direction=asc"
    ? data.listings.sort((a, b) => a.buy.data.quantity - b.buy.data.quantity)
    : "";

  extraFilters === "rankings"
    ? data.listings.sort(
        (a, b) =>
          collections[collection]["ranksArray"].indexOf(
            Number(a.sell.data.token_id)
          ) -
          collections[collection]["ranksArray"].indexOf(
            Number(b.sell.data.token_id)
          )
      )
    : "";
  const [numberOfItems, setNumberOfItems] = useState(10);
  useEffect(() => setNumberOfItems(numberOfItems + 10), [inView]);

  const createSimilarListings = (array, numberOfItems) => {
    array = array.slice(0, numberOfItems);
    return array.map((result, i) => (
      <>
        <Link
          key={i}
          href={`./${result.sell.data.token_address}/${result.sell.data.token_id}`}
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
                  {parseFloat((result.buy.data.quantity / 10 ** 18).toFixed(5))}{" "}
                  <Image
                    alt="ethereum logo"
                    src={ethLogo}
                    width={15}
                    height={15}
                  />
                </span>
                <span className={styles.currencyQuantity}>
                  {parseFloat(
                    ((result.buy.data.quantity / 10 ** 18) * ethPrice).toFixed(
                      2
                    )
                  )}{" "}
                  $
                </span>
              </div>
              {collections[collection]?.ranksArray ? (
                <p key={`{i}rank`} className={styles.rankContainer}>
                  Rank:
                  {collections[collection]["ranksArray"].indexOf(
                    Number(result.sell.data.token_id)
                  ) === -1
                    ? "N/A"
                    : collections[collection]["ranksArray"].indexOf(
                        Number(result.sell.data.token_id)
                      ) + 1}
                </p>
              ) : (
                ""
              )}
            </div>
          </a>
        </Link>
        <div ref={ref}></div>
      </>
    ));
  };
  return (
    <div className={styles.mainContainer}>
      <div className={styles.filterTab}>
        <input
          className={styles.inputFilter}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          type="number"
          placeholder="Search token ID"
        ></input>
        <select
          id="filter"
          value={extraFilters === "" ? sortBy : extraFilters}
          name="filter"
          onChange={(e) => {
            if (e.target.value !== "rankings") {
              setExtraFilters("");
              setSortBy(e.target.value);
            } else {
              setExtraFilters("rankings");
            }
          }}
        >
          <option value="&order_by=buy_quantity&direction=asc">
            Lowest Price
          </option>
          <option value="&order_by=buy_quantity&direction=desc">
            Highest price
          </option>
          <option value="&order_by=created_at&direction=asc">
            Newly Listed
          </option>
          {collections && collections[collection]?.ranksArray ? (
            <option value="rankings">Rankings</option>
          ) : (
            ""
          )}
        </select>
      </div>
      <div className={styles.bottomImagesContainer}>
        {input.length === 0
          ? createSimilarListings(data.listings, numberOfItems)
          : createSimilarListings(filteredData, numberOfItems)}
      </div>
    </div>
  );
};
export default FullLastListed;
