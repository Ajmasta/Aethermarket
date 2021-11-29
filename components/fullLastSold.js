import styles from "./styles/fullLastSold.module.css";
import Link from "next/link";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { calculateTime, get24hVolume, useGetData } from "./functions/functions";
import { Scatter } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import collections from "../components/functions/collectionRankings.json";
import ethLogo from "../public/images/ethLogo.png";
import Image from "next/image";
import orderData from "./functions/orderData.json";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "@mui/material";
import useSWRInfinite from "swr/infinite";

const FullLastSold = ({ collection, name }) => {
  const mobile = useMediaQuery("(max-width:600px)");
  const [numberOfItems, setNumberOfItems] = useState(10);
  const [activeTab, setActiveTab] = useState("list");
  const [orderBy, setOrderBy] = useState("created_at");
  const [orderingDirection, setOrderingDirection] = useState("asc");
  const [loaded, setLoaded] = useState([]);

  const getKey = (pageIndex, previousPageData) => {
    // reached the end
    if (previousPageData && !previousPageData.result) return null;

    // first page, we don't have `previousPageData`
    if (!previousPageData)
      return `https://api.x.immutable.com/v1/orders?page_size=20&status=filled&include_fees=true&sell_token_type=ERC721&sell_token_address=${collection}`;

    // add the cursor to the API endpoint
    return `https://api.x.immutable.com/v1/orders?page_size=40&status=filled&include_fees=true&sell_token_type=ERC721&sell_token_address=${collection}&cursor=${previousPageData.cursor}`;
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

  const { ref, inView, entry } = useInView();

  useEffect(() => (inView ? setSize(size + 1) : ""), [inView]);

  if (!data) return "";
  const getAnalyticsData = (data) => {
    const dataPrice = data.map((item) => item.buy.data.quantity / 10 ** 18);
    const volume = dataPrice.reduce((a, b) => a + b);
    const timestamp = data[data.length - 1].updated_timestamp;
    const average = volume / dataPrice.length;
    const time = calculateTime(timestamp);
    const results = data.length;
    return { volume, time, average, results };
  };

  const getPriceHistoryChart = (data) => {
    if (data.length === 0)
      return (
        <div style={{ width: "100%", textAlign: "center" }}>No sales yet! </div>
      );
    const chartData = {
      datasets: [
        {
          label: "Price of last 10 sales",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 1)",
          pointRadius: 6,
        },
        {
          label: "Price of older sales",
          hidden: true,
          data: [],
          backgroundColor: "rgba(255, 199, 22, 1)",
          hidden: true,
          pointRadius: 6,
        },
      ],
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: "Past sale history of items in similar collection",
        },
      },
    };
    const allSold = [];
    data.map((element) => element.result.map((result) => allSold.push(result)));

    const soldPrice = allSold.map((result, i) => {
      i <= 10
        ? chartData.datasets[0].data.push({
            x: i + 1,
            y: result.buy.data.quantity / 10 ** 18,
          })
        : chartData.datasets[1].data.push({
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
  const createSalesTable = (sold, numberOfItems) => {
    console.log(sold);
    const allSold = [];
    sold?.map((element) =>
      element.result.map((result) => allSold.push(result))
    );
    console.log(allSold);

    if (sold.length === 0) return "No sales yet!";

    return (
      <div className={styles.tableContainer}>
        <div className={`${styles.tableRow} ${styles.tableFirstRow}`}>
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
        {allSold.map((item, i) => (
          <div key={"tableRow" + i} className={styles.tableRow}>
            <Link
              className={styles.tableCell}
              href={`./${item.sell.data.token_address}/${item.sell.data.token_id}`}
            >
              <a className={`${styles.tableCell} ${styles.nameCell}`}>
                <div className={!loaded.includes(i) ? styles.loading : ""}>
                  <img
                    className={styles.tableImage}
                    src={item.sell.data.properties.image_url}
                    onLoad={() => {
                      const newArray = [...loaded];
                      newArray.push(i);
                      setLoaded(newArray);
                    }}
                  />
                </div>
                <span className={styles.cellName}>
                  {item.sell.data.properties.name}
                </span>
              </a>
            </Link>
            <div className={styles.tableCell}>
              {mobile
                ? (item.buy.data.quantity / 10 ** 18).toFixed(2)
                : item.buy.data.quantity / 10 ** 18}{" "}
              <Image src={ethLogo} width={15} height={15} alt="eth logo" />
            </div>
            {collections[item.sell.data.token_address] &&
            collections[item.sell.data.token_address]["ranksArray"] ? (
              <p className={`${styles.tableCell} ${styles.quantityCell}`}>
                #
                {collections[collection]["ranksArray"].indexOf(
                  Number(item.sell.data.token_id)
                ) + 1}
              </p>
            ) : (
              ""
            )}
            <Link href={`/user/${item.user}`}>
              <a className={styles.tableCell}>
                {item.user.slice(0, 5) +
                  "..." +
                  item.user.slice(item.user.length - 5, item.user.length - 1)}
              </a>
            </Link>
            <p className={styles.tableCell}>
              {calculateTime(item.updated_timestamp)}
            </p>
          </div>
        ))}
        <div ref={ref} className={styles.inView}></div>
      </div>
    );
  };
  return (
    <>
      {data ? (
        <div className={styles.mainContainer}>
          {orderData && orderData["day"][name] ? (
            <div className={styles.statsContainer}>
              <div className={styles.statsBox}>
                <div className={styles.stats}>
                  {" "}
                  {orderData["day"][name]?.toFixed(2)}
                  <Image src={ethLogo} width={15} height={15} alt="eth logo" />
                </div>

                <p className={styles.statsName}> Today's Volume</p>
              </div>

              <div className={styles.statsBox}>
                <div className={styles.stats}>
                  {" "}
                  {orderData["week"][name]?.toFixed(2)}
                  <Image src={ethLogo} width={18} height={18} alt="eth logo" />
                </div>

                <p className={styles.statsName}> Week's Volume</p>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className={styles.tabs}>
            <div
              onClick={() => setActiveTab("list")}
              className={
                activeTab === "list" ? styles.activeTab : styles.inactiveTab
              }
            >
              Grid
            </div>
            <div
              onClick={() => setActiveTab("charts")}
              className={
                activeTab === "charts" ? styles.activeTab : styles.inactiveTab
              }
            >
              Chart
            </div>
          </div>
          {activeTab === "list" ? (
            createSalesTable(data, numberOfItems)
          ) : (
            <>
              <div className={styles.chartContainer}>
                {getPriceHistoryChart(data)}
              </div>
            </>
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default FullLastSold;
