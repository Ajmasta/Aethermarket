import usersCount from "./functions/usersCount.json";

import collectionsList from "./functions/collectionsList.json";
import orderData from "./functions/orderData.json";
import ScrollContainer from "react-indiana-drag-scroll";
import styles from "./styles/fullAnalytics.module.css";
import collectionsRankings from "./functions/collectionRankings.json";
import imagePath from "./functions/imagePath.json";
import { useRecoilValue } from "recoil";
import { ethPriceAtom } from "./states/states";
import { useEffect, useState } from "react";
import { useGetAllFloorPrices } from "./functions/functions";
import PushPinIcon from '@mui/icons-material/PushPin';
import ethLogo from "../public/images/ethLogo.png";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";


const FullAnalytics = () => {
  const ethPrice = useRecoilValue(ethPriceAtom);
  const [filter, setFilter] = useState("changeDay");
  const [filterDown, setFilterDown] = useState(false);
  const { data, isLoading, Error } = useGetAllFloorPrices("test");
  const [dragging, setDragging] = useState(false);
  const [darkMode,setDarkMode] = useState(false)
  const [scrollC, setScrollC] = useState();
  const [topRow, setTopRow] = useState();
  const [filterName,setFilterName] = useState("")
  const [overRow,setOverRow] = useState()
  const [scrollLeft, setScrollLeft] = useState(0);
  const [collections, setCollections] = useState(
    collectionsList.filter((element) => !element.upcoming)
  );
  const [numberOfItems,setNumberOfItems]=useState(10)
const [pinnedCollections,setPinnedCollections]=useState([])

const { ref, inView, entry } = useInView();
useEffect(() => setNumberOfItems(numberOfItems + 5), [inView]);


  useEffect(() => {
    const newArray = collections.map((collection) => {
      const itemArray = usersCount[collection.address]?.userCounts.map(
        (element) => element[1]
      );
      try {
        collection.volume.users =
          usersCount[collection.address]?.userCounts.length;

        collection.volume.items = itemArray?.reduce((a, b) => a + b);
        collection.volume.floorPrice =
          data?.find((element) => element[0] === collection.address)[1]
        ;
        collection.volume.itemsUsers =
          collection.volume.items / collection.volume.users;
        collection.volume.volumeItems =
          collection.volume.all / collection.volume.items;
        collection.volume.volumeUsers =
          collection.volume.all / collection.volume.users;
        collection.volume.averagePrice =
          collection.volume.all / collection.volume.totalSales;
        collection.volume.highestSale = collection.volume.max.buy.data.quantity;
        collection.volume.lowestSale = collection.volume.min.buy.data.quantity;
        collection.volume.highestSaleDays = formatDate(
          collection.volume.max.timestamp
        );
        collection.volume.lowestSaleDays = formatDate(
          collection.volume.min.timestamp
        );
      } catch (err) {
        console.log(err);
      }
      return collection;
    });
    
    setCollections(newArray)
  }, [data]);

  const dollarFormat = Intl.NumberFormat("en-US");
  //supply, users,floorprice, % listed, minted items, average price? twitter followers, discord members etc
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    const today = new Date();
    const timeInMs = today.getTime() - date.getTime();

    return Math.ceil(timeInMs / (1000 * 60 * 60 * 24));
  };
  //Pinned collections, days since first sale, last3days volume?
  useEffect(() => {
    setScrollC(document.querySelector(".indiana-scroll-container"));
    setTopRow(document.getElementById("topRow"));
    setOverRow(document.getElementById("overRow"))
  }, []);
  useEffect(
    () => {
      topRow?.scrollLeft = scrollLeft;
      scrollC?.scrollLeft=scrollLeft;
      overRow?.scrollLeft=scrollLeft
    },
      [scrollLeft, filter, filterDown,dragging]
    )
  ;
   
  useEffect(() => { 
    const pinned=collections.filter(collection=>pinnedCollections.includes(collection.name))
    if (filter !== "" && !filterDown) {
      setFilterDown(false);
      let withVolume = collections.filter((element) => {

        return element.volume[filter] ? true : false;
      });
      let noVolume = collections.filter(
        (element) => !withVolume.includes(element)
      );
      withVolume = withVolume.sort(
        (a, b) => b.volume[filter] - a.volume[filter]
      );
      withVolume.push(...noVolume);
     
     setCollections([...withVolume])
    } else if (filter!=="" &&filterDown) {
      let array2 = [...collections].reverse();
      let withVolume = array2.filter((element) =>
        element.volume[filter] ? true : false
      );
      let noVolume = array2.filter((element) =>
        element.volume[filter] ? false : true
      );
    setCollections([...withVolume,...noVolume])
    
    }
  }, [filter, filterDown]);
  const tableCreator = () => {
    let collectionsArray = filterName===""?collections:collections.filter(collection=>collection.name.toLowerCase().includes(filterName.toLowerCase()))
    const pinned=collections.filter(collection=>pinnedCollections.includes(collection.name))
    collectionsArray=collectionsArray.filter(collection=>!pinnedCollections.includes(collection.name))
      collectionsArray = [...pinned,...collectionsArray]
   return (
      <>
        {collectionsArray?.slice(0,numberOfItems).map((collection, i) => {
          return (
            <div key={`${i}collec`} className={!pinnedCollections.includes(collection.name)? styles.mainTableRow:styles.mainTableRowPinned}>
          <div className={!pinnedCollections.includes(collection.name)? `${styles.mainTableCell4} ${styles.pinCell}`:`${styles.mainTableCell4} ${styles.pinCellActive}`}>

            <PushPinIcon onClick={()=>{
              const newArray = [...pinnedCollections]
              newArray.splice(newArray.indexOf(collection.name),1)
              pinnedCollections.includes(collection.name)? 
            setPinnedCollections(newArray)
            :setPinnedCollections([...pinnedCollections,collection.name])}} />
          </div>  
            <div className={`${styles.mainTableCell3} ${styles.rankCell}`}>
            {i+1}
            </div>
              <Link href={`/collections/${collection.address}`} >
              <a className={`${styles.linkContainer}`}>
              <div className={`${styles.mainTableCell1} ${styles.imageCell}`}>
                 <img
                  alt="Icon"
                  className={styles.collectionIcon}
                  src={
                    imagePath[collection]
                      ? imagePath[collection]
                      : collection.icon_url
                      ? collection.icon_url
                      : collection.collection_image_url
                  }
                />
              </div>
              <div className={`${styles.mainTableCell2} ${styles.nameCell} `}>
                <div className={styles.collectionName}>{collection.name}</div>
              </div>
</a>
</Link>
              <div
                className={
                  collection.volume.changeDay > 0
                    ? `${styles.mainTableCell} ${styles.changePCell} `
                    : collection.volume.changeDay < 0
                    ? `${styles.mainTableCell} ${styles.changeNCell} `
                    : `${styles.mainTableCell} `
                }
              >
                {collection.volume.changeDay > 0
                  ? "+" +
                    parseFloat(collection.volume.changeDay?.toFixed(2)) +
                    " %"
                  : collection.volume.changeDay < 0
                  ? parseFloat(collection.volume.changeDay?.toFixed(2)) + " %"
                  : "-"}
              </div>
              <div className={`${styles.mainTableCell} ${styles.volumeCell}`}>
                {collection.volume.day ? (
                  <>
                    <div> {parseFloat(collection.volume.day?.toFixed(2))}<Image
                        src={ethLogo}
                        width={15}
                        height={15}
                        alt="ethlogo"
                      /> </div>
                    <div className={styles.usdPrice}>
                      {dollarFormat.format(
                        (collection.volume.day * ethPrice).toFixed(2)
                      )}
                      ${" "}
                    </div>
                  </>
                ) : (
                  "-"
                )}
              </div>

              <div
                className={
                  collection.volume.changeWeek > 0
                    ? `${styles.mainTableCell} ${styles.changePCell}`
                    : collection.volume.changeWeek < 0
                    ? `${styles.mainTableCell} ${styles.changeNCell}`
                    : `${styles.mainTableCell}`
                }
              >
                {collection.volume.changeWeek > 0
                  ? "+" +
                    parseFloat(collection.volume.changeWeek?.toFixed(2)) +
                    " %"
                  : collection.volume.changeWeek < 0
                  ? parseFloat(collection.volume.changeWeek?.toFixed(2)) + " %"
                  : "-"}
              </div>

              <div className={`${styles.mainTableCell} ${styles.volumeCell}`}>
                {collection.volume.week ? (
                  <>
                    <div>
                      {" "}
                      {parseFloat(collection.volume.week?.toFixed(2))}<Image
                        src={ethLogo}
                        width={15}
                        height={15}
                        alt="ethlogo"
                      />
                    </div>
                    <div className={styles.usdPrice}>
                      {dollarFormat.format(
                        (collection.volume.week * ethPrice).toFixed(2)
                      )}
                      ${" "}
                    </div>
                  </>
                ) : (
                  "-"
                )}
              </div>

              <div className={`${styles.mainTableCell} ${styles.volumeCell}`}>
                {collection.volume.all ? (
                  <>
                    <div> {parseFloat(collection.volume.all?.toFixed(2))}<Image
                        src={ethLogo}
                        width={15}
                        height={15}
                        alt="ethlogo"
                      /> </div>
                    <div className={styles.usdPrice}>
                      {dollarFormat.format(
                        (collection.volume.all * ethPrice).toFixed(2)
                      )}
                      ${" "}
                    </div>
                  </>
                ) : (
                  "-"
                )}
              </div>
              <div className={`${styles.mainTableCell} ${styles.volumeCell} ${styles.separatorCell}`}>
                {isNaN(collection.volume.floorPrice )?
                "-":
                <>
                <div>
                  {" "}
                  {parseFloat(
                    (collection.volume.floorPrice / 10 ** 18).toFixed(5)
                  )}<Image
                        src={ethLogo}
                        width={15}
                        height={15}
                        alt="ethlogo"
                      />
                </div>
                <div className={styles.usdPrice}>
                  {dollarFormat.format(
                    (
                      (collection.volume.floorPrice / 10 ** 18) *
                      ethPrice
                    ).toFixed(2)
                  )}
                  ${" "}
                </div>
                </>}
              </div>

              <div className={`${styles.mainTableCell} ${styles.volumeCell}`}>
                {Number(collection.volume.items) > 0
                  ? collection.volume.items+" items"
                  : " - "}
              </div>
              <div className={`${styles.mainTableCell} ${styles.volumeCell}`}>
                {Number(collection.volume.users) > 0
                  ? collection.volume.users+" users"
                  : " - "}
              </div>
              <div className={`${styles.mainTableCell} ${styles.volumeCell}`}>
                {(collection.volume.items / collection.volume.users).toFixed(
                  2
                ) > 0
                  ? (collection.volume.items / collection.volume.users).toFixed(
                      2
                    )
                  : " - "}
              </div>
              <div className={`${styles.mainTableCell} ${styles.volumeCell}`}>
                {(collection.volume.all / collection.volume.items).toFixed(2) >
                0
                  ? (collection.volume.all / collection.volume.items).toFixed(2)
                  : " - "}
              </div>
              <div className={`${styles.mainTableCell} ${styles.volumeCell}`}>
                {(collection.volume.all / collection.volume.users).toFixed(2) > 0
                  ? (collection.volume.all / collection.volume.users).toFixed(2)
                  : " - "}
              </div>
              {
                //order data
              }
        
              <div className={`${styles.mainTableCell} ${styles.volumeCell} ${styles.separatorCell}`}>
                {dollarFormat.format(collection.volume.totalSales)}
              </div>
              <div className={`${styles.mainTableCell} ${styles.volumeCell}`}>
                <div>
                  {parseFloat(
                    (
                      collection.volume.all / collection.volume.totalSales
                    ).toFixed(5)
                  )}<Image
                        src={ethLogo}
                        width={15}
                        height={15}
                        alt="ethlogo"
                      />
                </div>
                <div className={styles.usdPrice}>
                  {dollarFormat.format(
                    (
                      (collection.volume.all / collection.volume.totalSales) *
                      ethPrice
                    ).toFixed(2)
                  )}
                  $
                </div>
              </div>
              <div className={`${styles.mainTableCell} ${styles.volumeCell}`}>
                <div>
                  {parseFloat(
                    (
                      collection.volume.max?.buy.data.quantity /
                      10 ** 18
                    ).toFixed(2)
                  )}<Image
                        src={ethLogo}
                        width={15}
                        height={15}
                        alt="ethlogo"
                      />
                </div>
                <div className={styles.usdPrice}>
                  {dollarFormat.format(
                    (
                      (collection.volume.max?.buy.data.quantity * ethPrice) /
                      10 ** 18
                    ).toFixed(2)
                  )}
                </div>
              </div>
              <div className={`${styles.mainTableCell} ${styles.volumeCell}`}>
                {collection.volume.highestSaleDays}{" "}
                {collection.volume.highestSaleDays > 1 ? "days" : "day"}
              </div>
              <div className={`${styles.mainTableCell} ${styles.volumeCell}`}>
                {isNaN(collection.volume.lowestSale) ? (
                  "-"
                ) : (
                  <>
                    <div>
                      {parseFloat(
                        (collection.volume.lowestSale / 10 ** 18).toFixed(6)
                      )}<Image
                        src={ethLogo}
                        width={15}
                        height={15}
                        alt="ethlogo"
                      />
                    </div>
                    <div className={styles.usdPrice}>
                      {dollarFormat.format(
                        (
                          (collection.volume.min?.buy.data.quantity *
                            ethPrice) /
                          10 ** 18
                        ).toFixed(3)
                      )}
                      $
                    </div>
                  </>
                )}
              </div>
              <div className={`${styles.mainTableCell} ${styles.volumeCell}`}>
                {collection.volume.lowestSaleDays}{" "}
                {collection.volume.lowestSaleDays > 1 ? "days" : "day"}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className={!darkMode? styles.mainContainer : styles.mainContainerDark}>
      <div className={styles.subMainContainer}>
        <div className={styles.mainTableOverRow} id="overRow">
        <div
            className={`${styles.mainTableCell1} ${styles.mainTableCellCollection} ${styles.mainTableCell1}`}
          >
              <button onClick={()=>setDarkMode(!darkMode)}>Set Dark </button>

          </div>
          <div className={styles.mainTableOverVolumeCell}>Volume</div>
          <div className={styles.mainTableOverVolumeCell}>Collection Info </div>
          <div className={styles.mainTableOverVolumeCell}>Analytics</div>
        </div>
        <div
          id="topRow"
          className={`${styles.mainTableFirstRow} ${styles.stickyMainCell}`}
        >
          <div
            className={`${styles.mainTableCell1} ${styles.mainTableCellCollection} ${styles.mainTableCell1}`}
          >
           <span> Collections </span>
            <input className={styles.input} type="text" placeHolder="Search a collection" onChange={(e)=>setFilterName(e.target.value)} />
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell} `}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "changeDay") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("changeDay");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("changeDay");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            24h %
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "day") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("day");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("day");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            Daily Volume
          </div>

          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "changeWeek") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("changeWeek");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("changeWeek");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            7d %
          </div>

          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "week") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("week");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("week");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            Weekly Volume
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "all") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("all");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("all");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            All Time
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}  ${styles.separatorCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "floorPrice") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("floorPrice");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("floorPrice");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            Floor Price
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "items") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("items");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("items");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            # of Items
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "users") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("users");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("users");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            Users
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "itemsUsers") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("itemsUsers");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("itemsUsers");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            Items/Users
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "volumeItems") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("volumeItems");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("volumeItems");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            Volume/Items
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "volumeUsers") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("volumeUsers");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("volumeUsers");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            Volume/Users
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}  ${styles.separatorCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "totalSales") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("totalSales");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("totalSales");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            Total Sales
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "averagePrice") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("averagePrice");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("averagePrice");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            Average Price
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "highestSale") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("highestSale");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("highestSale");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            Highest Sale{" "}
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "highestSaleDays") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("highestSaleDays");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("highestSaleDays");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            Days since Highest sale
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              setCollections([]);

              const array = [...collections];
              if (filter !== "lowestSale") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("lowestSale");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("lowestSale");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            Lowest Sale{" "}
          </div>
          <div
            className={`${styles.mainTableCell} ${styles.stickyMainCell}`}
            onClick={() => {
              const array = [...collections];
              if (filter !== "lowestSaleDays") {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("lowestSaleDays");
                  setFilterDown(!filterDown);
                }, 10);
              } else {
                setTimeout(() => {
                  setCollections(array);
                  setFilter("lowestSaleDays");
                  setFilterDown(!filterDown);
                }, 10);
              }
            }}
          >
            Days since Lowest sale
          </div>
        </div>
        <ScrollContainer
          id="scrollContainer"
          className="scrollContainer"
          onStartScroll={(e) => setDragging(true)}
          onScroll={(e) => (setScrollLeft(scrollC.scrollLeft))}
          onEndScroll={() => setDragging(false)}
        >
          <div className={styles.mainTableContainer}>{tableCreator()}</div>
        </ScrollContainer>
        <div ref={ref}></div>

      </div>
    </div>
  );
};

export default FullAnalytics;
