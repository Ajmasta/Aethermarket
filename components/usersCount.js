import styles from "./styles/usersRankings.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";

import collections from "./functions/collectionRankings.json";
import ethLogo from "../public/images/ethLogo.png";
import Image from "next/image";
import orderData from "./functions/orderData.json";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "@mui/material";
import usersCountArray from "./functions/usersCount.json";
import { Bar } from "react-chartjs-2";
import { useRecoilValue } from "recoil";
import { accountAtom } from "./states/states";
import CloseIcon from "@mui/icons-material/Close";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import blacklist from "./functions/blacklist.json";

const UsersCount = ({ collection, name }) => {
  const mobile = useMediaQuery("(max-width:600px)");
  const [numberOfItems, setNumberOfItems] = useState(10);
  const [activeTab, setActiveTab] = useState("list");
  const [orderBy, setOrderBy] = useState("created_at");
  const [orderingDirection, setOrderingDirection] = useState("asc");
  const account = useRecoilValue(accountAtom);
  const { ref, inView, entry } = useInView({ triggerOnce: true });
  let noref;
  const [userRank, setUserRank] = useState(false);
  const [assetData, setAssetData] = useState("");
  const [imageDisplay, setImageDisplay] = useState([]);
  const [assetDisplay, setAssetDisplay] = useState([]);
  useEffect(() => setUserRank(inView), [inView]);

  const giveLabel = (i, length) => {
    const numberOfAssets = usersCountArray[collection].userCounts.length;
    console.log(numberOfAssets);
    const top10 = Math.ceil(numberOfAssets / 1000);
    const top50 = numberOfAssets / 200;
    const top100 = numberOfAssets / 100;
    const top200 = numberOfAssets / 50;
    const top1000 = numberOfAssets / 10;
    const top2000 = numberOfAssets / 5;
    const top3000 = numberOfAssets / 3.33;
    const top4000 = numberOfAssets / 2.5;
    const top5000 = numberOfAssets / 2;
    const top9000 = numberOfAssets / 1.111;
    const top10000 = numberOfAssets / 1;

    if (i <= top10) return <p className={styles.diamondWhale}>Diamond Whale</p>;
    if (i <= top50) return <p className={styles.goldWhale}>Gold Whale</p>;
    if (i <= top100) return <p className={styles.silverWhale}>Silver Whale</p>;
    if (i <= top200) return <p className={styles.bronzeWhale}>Bronze Whale</p>;
    if (i <= top1000) return <p className={styles.topDog}>Top Dog</p>;
    if (i <= top2000)
      return <p className={styles.expertCollector}>Expert Collector</p>;
    if (i <= top3000)
      return (
        <p className={styles.intermediateCollector}>Intermediate Collector</p>
      );
    if (i <= top4000)
      return <p className={styles.noviceCollector}>Novice Collector</p>;
    if (i <= top5000) return <p className={styles.trainee}>Trainee</p>;
    if (i <= top9000) return <p className={styles.holder}>Holder</p>;
    if (i <= top10000) return <p className={styles.sprout}>Sprout</p>;
  };
  const getImage = async (token) => {
    try {
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

      let result = order.result;
      if (result.length > 0 && result[0].status !== "cancelled") {
        data.status = result[0].status;
        data.price = result[0].buy.data.quantity / 10 ** 18;
      }
      console.log(data);
      setAssetData(data);
    } catch (err) {
      return "";
    }
  };
  const createSimilarListings = (result) => {
    console.log(result);
    if (result === {}) return "";
    return (
      <Link href={`./${result.token_address}/${result.token_id}`}>
        <a className={styles.similarListingsContainer}>
          <div className={styles.similarImageContainer}>
            <img
              className={styles.similarImage}
              src={result.image_url}
              alt="nft"
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
              </div>
            ) : (
              ""
            )}
            {collections[collection] ? (
              <p className={styles.rankContainer}>
                Rank:
                {collections[collection]["ranksArray"].indexOf(
                  result.token_id
                ) + 1}
              </p>
            ) : (
              ""
            )}
          </div>
        </a>
      </Link>
    );
  };
  const createAssetsTable = (array, i) => {
    return (
      <div className={styles.tableAssetContainer}>
        <div className={`${styles.tableAssetRow} ${styles.tableFirstRow}`}>
          <p className={styles.tableAssetCell}>Asset ID</p>
          <p className={styles.tableAssetCell}>Rank</p>
          <p className={styles.tableAssetCell}>Check Asset</p>
        </div>
        {array.map((element, y) => (
          <>
            <div key={"tableRow" + i} className={styles.tableAssetRow}>
              <p className={styles.tableAssetCell}>{element[0]}</p>
              <p className={styles.tableAssetCell}>{element[1]}</p>

              {imageDisplay.includes(`${i}e${y}`) ? (
                <p className={styles.tableAssetCell}>
                  <CloseIcon onClick={() => setImageDisplay([])} />{" "}
                </p>
              ) : (
                <p
                  className={styles.tableAssetCell}
                  onClick={() => {
                    let newArray = [`${i}e${y}`];
                    setAssetData({ collection: { name: "" } });
                    getImage(element[0]);

                    setImageDisplay(newArray);
                  }}
                >
                  <ImageSearchIcon />
                </p>
              )}
            </div>
          </>
        ))}
      </div>
    );
  };
  const getNumberOfItems = () => {
    const itemArray = usersCountArray[collection]?.userCounts.map(
      (element) => element[1]
    );

    const numberOfItems = itemArray.reduce((a, b) => a + b);
    console.log(numberOfItems);
    return numberOfItems;
  };
  const createUserRank = (account) => {
    console.log(account[0]);

    const users = usersCountArray[collection].userCounts;
    const arrayOfUsers = usersCountArray[collection].userCounts.map(
      (element) => element[0]
    );
    const userIndex = arrayOfUsers.indexOf(account[0]);
    if (userIndex === -1)
      return (
        <div className={styles.noItems}>
          You don't have any items of this collection. If you just bought one,
          wait 24 hours for the next update!
        </div>
      );

    return (
      <div className={styles.tableUserContainer}>
        <div className={`${styles.tableUserRow} ${styles.tableUserFirstRow}`}>
          Your Rank
        </div>
        <div className={styles.tableUserRow}>
          <p className={styles.tableUserCell}>{userIndex + 1}</p>
          <p className={styles.tableUserCell}>{giveLabel(userIndex)}</p>

          <Link href={`/user/${account[0]}`}>
            <a className={styles.tableUserCell}>
              {account[0].slice(0, 5) +
                "..." +
                account[0].slice(account[0].length - 5, account[0].length - 1)}
            </a>
          </Link>
          <p className={styles.tableUserCell}>{users[userIndex][1]}</p>
          {collections[collection]?.ranksArray ? (
            <p className={styles.tableUserCell}>
              {((users[userIndex][1] / getNumberOfItems()) * 100).toFixed(2)}%
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };
  const createUsersTable = (usersArray, numberOfItems) => {
    let users = usersCountArray[collection].userCounts.slice(0, 100);
    users = users.filter((user) => !blacklist.includes(user[0]));
    return (
      <div className={styles.tableContainer}>
        <div className={`${styles.tableRow} ${styles.tableFirstRow}`}>
          <p className={styles.tableCell}>Rank</p>
          <p className={styles.tableCell}>Title</p>
          <p className={styles.tableCell}>User</p>
          <p className={styles.tableCell}>Number of Assets</p>
          {collections[collection]?.ranksArray ? (
            <p className={styles.tableCell}>% of total Assets</p>
          ) : (
            ""
          )}
        </div>
        {users.map((user, i) => (
          <>
            <div
              ref={i === 3 ? ref : noref}
              key={"tableRow" + i}
              onClick={() => {
                let newArray = [...assetDisplay];
                newArray.includes(i)
                  ? newArray.splice(newArray.indexOf(i), 1)
                  : newArray.push(i);
                setAssetDisplay(newArray);
                console.log(assetDisplay);
              }}
              className={styles.tableRow}
            >
              <p className={styles.tableCell}>{i + 1}</p>
              <p className={styles.tableCell}>{giveLabel(i)}</p>

              <Link href={`/user/${user[0]}`}>
                <a className={`${styles.tableCell} ${styles.tableCellUser}`}>
                  {user[0].slice(0, 5) +
                    "..." +
                    user[0].slice(user[0].length - 5, user[0].length - 1)}
                </a>
              </Link>
              <p className={styles.tableCell}>{user[1]}</p>

              <p className={styles.tableCell}>
                {((user[1] / getNumberOfItems()) * 100).toFixed(3)}%
              </p>
            </div>
            {assetDisplay.includes(i) ? (
              <div className={styles.assetDisplay}>
                {createAssetsTable(user[2], i)}
              </div>
            ) : (
              ""
            )}
          </>
        ))}
      </div>
    );
  };
  const createUsersChart = (userArray) => {
    const chartData = {
      labels: [],
      datasets: [
        {
          label: "Top 100 holders",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 1)",
        },
        {
          label: "Top 200 holders",
          data: [],
          backgroundColor: "rgba(100, 255, 198, 1)",
        },
      ],
    };
    const options = {
      zoom: {
        enabled: true,
        mode: "x",
      },
      pan: {
        enabled: true,
        mode: "x",
      },
      scales: {
        xAxes: [
          {
            ticks: {
              display: false, //this will remove only the label
            },
          },
        ],
      },
      plugins: {
        title: {
          display: true,
          text: "Top Users by Quantity",
        },
      },
    };
    const users = usersCountArray[collection].userCounts.slice(0, 200);
    const userData = users.map((user, i) => {
      i < 100 ? chartData.labels.push(i) : "";
      i <= 99
        ? chartData.datasets[0].data.push(user[1])
        : chartData.datasets[1].data.push(user[1]);
    });
    console.log(chartData);
    return (
      <Bar className={styles.chart} data={chartData} options={options}></Bar>
    );
  };

  return (
    <>
      {usersCountArray ? (
        <div className={styles.mainContainer}>
          {userRank && account.length > 0 ? (
            <div className={styles.userRankContainer}>
              <div className={styles.exitUserRank}>
                <CloseIcon onClick={() => setUserRank(false)} />{" "}
              </div>
              {createUserRank(account)}
            </div>
          ) : userRank ? (
            <div className={styles.userRankContainer}>
              <div className={styles.exitUserRank}>
                <CloseIcon onClick={() => setUserRank(false)} />{" "}
              </div>
              <div className={styles.noItems}>
                Connect your wallet to see your rank!{" "}
              </div>
            </div>
          ) : (
            ""
          )}
          <p className={styles.leaderboardNotice}>
            The leaderboards are updated every 24 hours.{" "}
          </p>

          <div className={styles.tabs}>
            <div
              onClick={() => setActiveTab("list")}
              className={
                activeTab === "list" ? styles.activeTab : styles.inactiveTab
              }
            >
              Table
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
          {usersCountArray.length > 29999
            ? "Only displaying the top 30K holders for this collection"
            : ""}
          {activeTab === "list" ? (
            <>
              {imageDisplay.length > 0 && assetData !== {} ? (
                <div className={styles.imageDisplay}>
                  {createSimilarListings(assetData)}

                  <div className={styles.exitImageDisplay}>
                    <CloseIcon onClick={() => setImageDisplay([])} />
                  </div>
                </div>
              ) : (
                ""
              )}
              {createUsersTable(usersCountArray, numberOfItems)}
            </>
          ) : (
            <>
              <div className={styles.chartContainer}>
                {createUsersChart(usersCountArray)}
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

export default UsersCount;
