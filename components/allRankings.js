import { useCallback, useEffect, useState } from "react";
import collections from "../components/functions/collectionRankings.json";
import { useGetRankings } from "./functions/functions";
import Link from "next/link";
import styles from "./styles/allRankings.module.css";
import ethLogo from "../public/images/ethLogo.png";
import Image from "next/image";
import { ethPriceAtom } from "./states/states";
import { useRecoilValue } from "recoil";
import Loading from "./loading";
import debounce from "lodash.debounce";

const AllRankings = ({ collection }) => {
  const [array, setArray] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const ethPrice = useRecoilValue(ethPriceAtom);
  let tokenArray = collections
    ? collections[collection]["ranksArray"].slice((page - 1) * 20, page * 20)
    : [];
  const getData = async (filter) => {
    setSearch(false);
    if (filter === "") {
      setArray([]);
      const newArray = await Promise.all(
        tokenArray.map(async (token) => {
          const data = await (
            await fetch(
              `https://api.x.immutable.com/v1/assets/${collection}/${token}`
            )
          ).json();
          const order = await (
            await fetch(
              `https://api.x.immutable.com/v1/orders?sell_token_id=${token}&sell_token_address=${collection}`
            )
          ).json();
          if (order.result.length > 0) {
            data.status = order.result[0].status;
            data.price = order.result[0].buy.data.quantity / 10 ** 18;
          }

          return data;
        })
      );
      setArray(newArray);
    } else {
   
      let data = await (
        await fetch(
          `https://api.x.immutable.com/v1/assets/${collection}/${filter}`
        )
      ).json();
      const order = await (
        await fetch(
          `https://api.x.immutable.com/v1/orders?sell_token_id=${filter}&sell_token_address=${collection}`
        )
      ).json();
      if (order.result.length > 0) {
        data.status = order.result[0].status;
        data.price = order.result[0].buy.data.quantity / 10 ** 18;
      }
      if (data.name) {
        setArray([]);
        setArray([data]);
      } else {
      
        let data2;
        data2 = await (
          await fetch(
            `https://api.x.immutable.com/v1/assets?collection=${collection}&name=${filter}`
          )
        ).json();
  

        setArray([]);

        setArray(data2.result);
      }
    }
  };
  useEffect(() => getData(filter), []);
  useEffect(
    () => (filter === "" && search ? getData(filter) : ""),
    [filter, page]
  );

  const createPageList = () => {
    const maxPage = Math.ceil(
      collections[collection]["ranksArray"].length / 20
    );
    return (
      <div className={styles.pageListContainer}>
        {page === 1 ? (
          <>
            <p className={styles.pageActive}> {page} </p>
            <p
              className={styles.page}
              onClick={() => {
                setPage(page + 1);
                setLoading(true);
                setTimeout(() => setLoading(false), 200);
              }}
            >
              {" "}
              {page + 1}{" "}
            </p>
            <p
              className={styles.page}
              onClick={() => {
                setPage(page + 2);
                setLoading(true);
                setTimeout(() => setLoading(false), 200);
              }}
            >
              {" "}
              {page + 2}{" "}
            </p>
            <p
              className={styles.page}
              onClick={() => {
                setPage(page + 3);
                setLoading(true);
                setTimeout(() => setLoading(false), 200);
              }}
            >
              {" "}
              {page + 3}{" "}
            </p>
            <p className={styles.pageDots}>...</p>
            <p
              className={styles.page}
              onClick={() => {
                setPage(maxPage);
                setLoading(true);
                setTimeout(() => setLoading(false), 200);
              }}
            >
              {" "}
              {maxPage}{" "}
            </p>
          </>
        ) : !(page >= maxPage) ? (
          <>
            <p
              className={styles.page}
              onClick={() => {
                setPage(page - 1);
                setLoading(true);
                setTimeout(() => setLoading(false), 200);
              }}
            >
              {" "}
              {page - 1}{" "}
            </p>
            <p className={styles.pageActive}> {page} </p>
            <p
              className={styles.page}
              onClick={() => {
                setPage(page + 1);
                setLoading(true);
                setTimeout(() => setLoading(false), 200);
              }}
            >
              {" "}
              {page + 1}{" "}
            </p>

            <p
              className={styles.page}
              onClick={() => {
                setPage(page + 2);
                setLoading(true);
                setTimeout(() => setLoading(false), 200);
              }}
            >
              {" "}
              {page + 2}{" "}
            </p>
            <p className={styles.pageDots}>...</p>
            <p
              className={styles.page}
              onClick={() => {
                setPage(maxPage);
                setLoading(true);
                setTimeout(() => setLoading(false), 200);
              }}
            >
              {" "}
              {maxPage}{" "}
            </p>
          </>
        ) : (
          <>
            <p
              className={styles.page}
              onClick={() => {
                setPage(1);
                setLoading(true);
                setTimeout(() => setLoading(false), 200);
              }}
            >
              {" "}
              1{" "}
            </p>
            <p
              className={styles.page}
              onClick={() => {
                setPage(2);
                setLoading(true);
                setTimeout(() => setLoading(false), 200);
              }}
            >
              {" "}
              2{" "}
            </p>
            <p
              className={styles.page}
              onClick={() => {
                setPage(3);
                setLoading(true);
                setTimeout(() => setLoading(false), 200);
              }}
            >
              {" "}
              3{" "}
            </p>
            <p
              className={styles.page}
              onClick={() => {
                setPage(4);
                setLoading(true);
                setTimeout(() => setLoading(false), 200);
              }}
            >
              {" "}
              4{" "}
            </p>
            <p className={styles.pageDots}>...</p>
            <p className={styles.pageActive}> {page} </p>
          </>
        )}
      </div>
    );
  };
  const createSimilarListings = (array) => {
    return array.map((result, i) => (
      <Link key={i} href={`./${result.token_address}/${result.token_id}`}>
        <a className={styles.similarListingsContainer}>
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
            {result.status === "active" || result.status === "filled" ? (
              <div className={styles.priceDescription}>
                <div className={styles.nameDescription}>
                  <span className={styles.priceName}>
                    {result.status === "filled" ? (
                      <p className={styles.soldLabel}>Sold</p>
                    ) : (
                      <p className={styles.listedLabel}>Listed</p>
                    )}
                  </span>
                </div>
                <span className={styles.priceQuantity}>
                  {result.price}{" "}
                  <Image src={ethLogo} width={15} height={15} alt="ethlogo" />
                </span>
                <span className={styles.currencyQuantity}>
                  {parseFloat((result.price * ethPrice).toFixed(2))} $
                </span>
              </div>
            ) : (
              ""
            )}
            {collections[collection] ? (
              <p className={styles.rankContainer}>
                Rank:
                {collections[collection]["ranksArray"].indexOf(
                  result.token_id
                ) +
                  1 ===
                0
                  ? "N/A"
                  : collections[collection]["ranksArray"].indexOf(
                      result.token_id
                    ) + 1}
              </p>
            ) : (
              ""
            )}
          </div>
        </a>
      </Link>
    ));
  };

  return (
    <div className={styles.mainContainer}>
      {collections[collection]["ranksArray"].length > 0 ? (
        <>
          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.inputFilter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by ID"
            />
            <button
              className={styles.searchButton}
              onClick={() => {
                getData(filter);
                setSearch(true);
              }}
            >
              Search
            </button>
          </div>
          <div className={styles.bottomImagesContainer}>
            {array !== [] ? createSimilarListings(array) : <Loading />}
          </div>
          {collections && filter === ""
            ? array === []
              ? ""
              : createPageList()
            : ""}
        </>
      ) : (
        "No rankings yet! Come back after reveal."
      )}
    </div>
  );
};

export default AllRankings;
