import styles from "./styles/fullLastListed.module.css";
import Link from "next/link";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { calculateTime, getEthPrice } from "./functions/functions";
import ethLogo from "../public/images/ethLogo.png";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import collections from "./functions/collectionRankings.json";
import queryString from "query-string";
import { useRecoilValue } from "recoil";
import { ethPriceAtom } from "./states/states";
import { useInView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";
import collectionsList from "./functions/collectionsList.json";
import Loading from "./loading";

const FullLastListedInfinite = ({
  setSortBy,
  sortBy,
  collection,
  metadata,
}) => {
  const [extraFilters, setExtraFilters] = useState("");
  const [input, setInput] = useState("");
  const ethPrice = useRecoilValue(ethPriceAtom);
  const { ref, inView, entry } = useInView();

  const getKey = (pageIndex, previousPageData) => {
    // reached the end
    if (previousPageData && !previousPageData.result) return null;

    // first page, we don't have `previousPageData`
    if (!previousPageData)
      return `https://api.x.immutable.com/v1/orders?page_size=20&status=active&include_fees=true&sell_token_address=${collection}${sortBy}${metadata}`;

    // add the cursor to the API endpoint
    return `https://api.x.immutable.com/v1/orders?page_size=40&status=active&include_fees=true&sell_token_address=${collection}${sortBy}${metadata}&cursor=${previousPageData.cursor}`;
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

  useEffect(() => (inView ? setSize(size + 1) : ""), [inView]);

  console.log(inView);
  const filteredData = [];
  if (input.length > 0 && isNaN(input)) setInput("");
  if (input.length > 0) {
    filteredData = data.filter((item) => {
      //if (item.sell.data.properties.name.includes(input)) return true
      if (item.sell.data.token_id === input) return true;

      return false;
    });
  }

  const createSimilarListings = (array) => {
    const allData = [];
    array?.map((element) =>
      element.result.map((result) => allData.push(result))
    );
    return (
      <>
        {allData.map((result, i) => (
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
                    {parseFloat(
                      (
                        (result.buy.data.quantity / 10 ** 18) *
                        ethPrice
                      ).toFixed(2)
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
        ))}
        <div className={styles.inView} ref={ref}>
          <button onClick={() => setSize(size + 1)}>More Results</button>
        </div>
      </>
    );
  };
  return (
    <>
      {data?.result?.length === 0 ? (
        isValidating ? (
          <Loading />
        ) : (
          "No Listings"
        )
      ) : (
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
              ? createSimilarListings(data)
              : createSimilarListings(filteredData)}
          </div>
        </div>
      )}
    </>
  );
};
export default FullLastListedInfinite;
