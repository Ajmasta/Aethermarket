import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { accountAtom, assetsAtom, collectionsAtom } from "./states/states";
import styles from "./styles/AllCollections.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppsIcon from "@mui/icons-material/Apps";
import AssessmentIcon from "@mui/icons-material/Assessment";
import orderData from "./functions/orderData.json";
import ethLogo from "../public/images/ethLogo.png";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import collections2 from "./functions/collectionRankings.json";
import PersonIcon from "@mui/icons-material/Person";
import collections from "./functions/collectionsList.json";
import Loading from "./loading";
import imagePath from "./functions/imagePath.json";
const AllCollections = () => {
  const [status, setStatus] = useState("current");
  const [filter, setFilter] = useState("all");
  const [numberOfItems, setNumberOfItems] = useState(10);
  const { ref, inView, entry } = useInView();

  const createCollectionWidget = () => {
    let currentCollections = collections.filter(
      (collection) => !collection.upcoming
    );
    let currentCollectionsNo = currentCollections.filter(
      (element) => !element.volume[filter]
    );

    currentCollections = currentCollections.filter(
      (element) => element.volume[filter]
    );
    currentCollections.sort((a, b) => b.volume[filter] - a.volume[filter]);
    currentCollections.push(...currentCollectionsNo);
 
    return (
      <>
        {currentCollections.slice(0, numberOfItems).map((collection, i) => {
          const name = collection.name;
          const change =
            filter === "day"
              ? collection.volume["changeDay"]?.toFixed(2)
              : filter === "week"
              ? collection.volume["changeWeek"]?.toFixed(2)
              : "";

          return (
            <Link
              href={`/collections/${collection.address}`}
              key={`widget${i}`}
            >
              <a className={`${styles.collectionContainer} `}>
                <div className={styles.iconContainer}>
                  <img
                    className={styles.image}
                    src={
                      imagePath[collection]
                        ? imagePath[collection]
                        : collection.collection_image_url
                        ? collection.collection_image_url
                        : collection.icon_url
                    }
                  />
                </div>
                <div className={styles.descriptionContainer}>
                  <span className={styles.name}>{collection.name} </span>
                  <div className={styles.descriptionAnalytics}>
                    <span className={styles.volume}>
                      {collection.volume[filter] ? (
                        <>
                          {collection.volume[filter].toFixed(2)}
                          <Image
                            alt="ethereum logo"
                            src={ethLogo}
                            width={15}
                            height={15}
                          />
                        </>
                      ) : (
                        ""
                      )}
                    </span>
                    <span className={styles.holders}>
                      {collections2[collection.address] ? (
                        <>
                          {collections2[collection.address].users}
                          <PersonIcon />
                        </>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                  <div className={styles.descriptionAnalyticsBottom}>
                    <p
                      className={
                        change > 0
                          ? styles.changeP
                          : change < 0
                          ? styles.changeN
                          : styles.change
                      }
                    >
                      {" "}
                      {change > 0
                        ? "+" + change + "%"
                        : change < 0
                        ? change + "%"
                        : ""}{" "}
                    </p>
                  </div>
                </div>
              </a>
            </Link>
          );
        })}
        <span ref={ref}> </span>
      </>
    );
  };
  useEffect(() => setNumberOfItems(numberOfItems + 5), [inView]);

  const createUpcomingtCollectionWidget = () => {
    const currentCollections = collections.filter(
      (collection) => collection.upcoming
    );

    return (
      <>
        {currentCollections.map((collection, i) => {
          return (
            <Link
              href={`/collections/${collection.address}`}
              key={`widget${i}`}
            >
              <a className={`${styles.collectionContainer} `}>
                <div className={styles.iconContainer}>
                  <img
                    className={styles.image}
                    src={
                      collection.collection_image_url
                        ? collection.collection_image_url
                        : collection.icon_url
                    }
                  />
                </div>
                <div className={styles.descriptionContainer}>
                  <span className={styles.name}>{collection.name} </span>
                </div>
              </a>
            </Link>
          );
        })}
        <span ref={ref}> </span>
      </>
    );
  };
  return (
    <div className={styles.mainContainer}>
      <div className={styles.tabs}>
        <button
          className={
            status === "current" ? styles.activeTab : styles.inactiveTab
          }
          onClick={() => setStatus("current")}
        >
          {" "}
          Current Collections
        </button>
        <button
          className={
            status === "current" ? styles.inactiveTab : styles.activeTab
          }
          onClick={() => setStatus("upcoming")}
        >
          {" "}
          Upcoming Collections
        </button>
      </div>
      <div className={styles.collectionsContainer}>
        {collections ? (
          status === "current" ? (
            <>
              <div className={styles.title}>Volume</div>
              <div className={styles.tabs}>
                <button
                  className={
                    filter === "day" ? styles.activeTab : styles.inactiveTab
                  }
                  onClick={() => {
                    setFilter("");
                    setFilter("day");
                  }}
                >
                  {" "}
                  Day
                </button>
                <button
                  className={
                    filter === "week" ? styles.activeTab : styles.inactiveTab
                  }
                  onClick={() => setFilter("week")}
                >
                  {" "}
                  Week
                </button>
                <button
                  className={
                    filter === "all" ? styles.activeTab : styles.inactiveTab
                  }
                  onClick={() => setFilter("all")}
                >
                  {" "}
                  All
                </button>
              </div>
              {createCollectionWidget(collections)}
            </>
          ) : (
            createUpcomingtCollectionWidget(collections)
          )
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};
export default AllCollections;
