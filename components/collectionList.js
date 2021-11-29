import styles from "./styles/collectionList.module.css";
import Link from "next/link";
import Image from "next/image";
import TwitterIcon from "@mui/icons-material/Twitter";
import WebIcon from "@mui/icons-material/Web";
import collections2 from "../components/functions/collectionRankings.json";
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
  drawerAtom,
  userBalanceAtom,
} from "./states/states";
import { useEffect, useState } from "react";
import collectionsFetched from "./functions/collectionsList.json";
import ethLogo from "../public/images/ethLogo.png";
import PersonIcon from "@mui/icons-material/Person";

const CollectionList = () => {
  const [collections, setCollections] = useState([]);

  const getCollections = () => {
    if (collections2 && collectionsFetched) {
      let listOfCollections = [];
      for (let object in collections2) {
        const collection = collectionsFetched.filter(
          (element) => element.address === object
        );
        if (Number(collections2[object].users) > 300)
          listOfCollections.push(...collection);
      }
      setCollections(listOfCollections);
    }
  };
  useEffect(() => {
    getCollections();
  }, [collections2, collectionsFetched]);

  const upcomingCollections = [
    {
      name: "Dinos IMX",
      description:
        "IMX Dinos is the first Dino community on IMX! No gas fees, Carbon Neutral, we're taking it back to the Jurassic Period!",
      icon_url: "/images/dinosIcon.gif",
      collection_image_url: "/images/dinosIcon.jpg",
      twitter: "https://mobile.twitter.com/imxdinos",
      website: "",
      discord: "https://t.co/LE795eI7le?amp=1",
    },
    {
      name: "Highrise Creature Club",
      description:
        "The creative world where everyone belongs. Highrise Creature Club a collection of 10,000 unique NFT Creatures",
      icon_url: "/images/highRise.png",
      collection_image_url: "/images/highriseIcon.jpg",
      twitter: "https://mobile.twitter.com/HighriseApp",
      website: "https://apps.apple.com/app/id924589795?mt=8",
      discord: "https://discord.gg/hcc",
    },
    {
      name: "Immutable Kongz",
      description:
        "6666 Genetically modified Unique Beasts on a mission to conquer Planet IMX with style and utility",
      icon_url: "/images/kongz.png",
      collection_image_url: "/images/kongzIcon.png",
      twitter: "https://twitter.com/immutablekongz?lang=en",
      website: "https://t.co/Y3djvdGhvX?amp=1",
      discord: "https://t.co/AE9PMakKQ5?amp=1",
    },
    {
      name: "Yellowcake Mutants",
      description:
        "Adopt of of the 9999 mutated animals. Enjoy their P2E game taking place in their Yellowcake Park metaverse! ",
      icon_url: "/images/mutant.png",
      collection_image_url: "/images/yellowpark.jpg",
      twitter: "https://twitter.com/YCMutants",
      website: "https://www.yellowcakeparkmutants.com/",
      discord: "https://discord.gg/enta9b3p8P",
    },
  ];
  const featuredCollections = ["Moody Krows", "Last Dragons", "Bad Grandma"];
  const createFeaturedCollections = () => {
    const collectionsFiltered = collectionsFetched.filter((collection) =>
      featuredCollections.includes(collection.name)
    );
    return collectionsFiltered.map((collection, i) => {
      return (
        <Link href={`/collections/${collection.address}`} key={`widget${i}`}>
          <a className={`${styles.collectionContainerFeatured} `}>
            <div className={styles.iconContainerFeatured}>
              <img
                className={styles.imageFeatured}
                src={
                  collections2[collection.address].collectionIcon
                    ? collections2[collection.address].collectionIcon
                    : collection.collection_image_url
                    ? collection.collection_image_url
                    : collection.icon_url
                }
                loading="lazy"
              />
            </div>
            <div className={styles.descriptionContainerFeatured}>
              <span className={styles.name}>{collection.name} </span>
              <div className={styles.descriptionAnalytics}>
                <span className={styles.label}>Volume</span>
                <span className={styles.label}>Users</span>
              </div>
              <div className={styles.descriptionAnalytics}>
                <span className={styles.volume}>
                  <>
                    {collection.volume.all.toFixed(2)}
                    <Image
                      alt="ethereum logo"
                      src={ethLogo}
                      width={15}
                      height={15}
                    />
                  </>
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
            </div>
          </a>
        </Link>
      );
    });
  };
  const createCollectionWidget = () => {
    return collections.map((collection, i) => {
      return (
        <Link href={`/collections/${collection.address}`} key={`widget${i}`}>
          <a className={`${styles.collectionContainer} `}>
            <div className={styles.iconContainer}>
              <img
                className={styles.image}
                src={
                  collections2[collection.address].collectionIcon
                    ? collections2[collection.address].collectionIcon
                    : collection.collection_image_url
                    ? collection.collection_image_url
                    : collection.icon_url
                }
                loading="lazy"
              />
            </div>
            <div className={styles.descriptionContainer}>
              <span className={styles.name}>{collection.name} </span>
            </div>
          </a>
        </Link>
      );
    });
  };
  const createUpcomigCollectionWidget = (collections) => {
    return collections.map((collection, i) => {
      return (
        <div
          key={`upcollec${i}`}
          className={`${styles.upcomingCollectionContainer} panel${i}`}
        >
          <div className={styles.upcomingImageContainer}>
            <img
              className={styles.upcomingImage}
              src={collection.icon_url}
              alt="collection sample"
            />
            <div className={styles.upcomingIconContainer}>
              <img
                className={styles.upcomingIcon}
                src={
                  collection.collection_image_url
                    ? collection.collection_image_url
                    : collection.icon_url
                }
                alt="collection icon"
              />
            </div>
          </div>
          <div className={styles.upcomingDescriptionContainer}>
            <p className={styles.upcomingName}>{collection.name}</p>
            <p className={styles.upcomingDescription}>
              {collection.description}
            </p>
          </div>
          <div className={styles.logoContainer}>
            {collection.twitter !== "" ? (
              <a href={collection.twitter}>
                <TwitterIcon />
              </a>
            ) : (
              ""
            )}
            {collection.website !== "" ? (
              <a href={collection.website}>
                <WebIcon />
              </a>
            ) : (
              ""
            )}
            {collection.discord !== "" ? (
              <a href={collection.discord}>
                <Image
                  src={"/images/discord.png"}
                  alt="discord Icon"
                  width={24}
                  height={24}
                />{" "}
              </a>
            ) : (
              ""
            )}
          </div>
        </div>
      );
    });
  };
  return (
    <div className={styles.mainContainer} id="collectionContainer">
      <div className={styles.upcomingCollection}>
        <div className={styles.title2}>Top Upcoming Collections</div>
        <div className={styles.upcomingCollectionsContainer}>
          {createUpcomigCollectionWidget(upcomingCollections)}
        </div>
      </div>
      <div className={styles.containerFeatured}>
        <div className={styles.title}>Featured Collections</div>

        <div className={styles.collectionsContainerFeatured}>
          {createFeaturedCollections()}
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.title}>Curated Collections</div>

        <div className={styles.collectionsContainer}>
          {createCollectionWidget(collections)}
        </div>
      </div>
    </div>
  );
};

export default CollectionList;
