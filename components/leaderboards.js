import UsersCount from "./usersCount";
import usersRankings from "./functions/usersRankings.json";
import styles from "./styles/leaderboards.module.css";
import { useState } from "react";
import UsersRankings from "./usersRankings";
import DiamondIcon from "@mui/icons-material/Diamond";
import boxes from "../public/images/boxes.png";
import Image from "next/image";
import usersCount from "./functions/usersCount.json"
const Leaderboards = ({ collection }) => {
  const [active, setActive] = useState("quantity");

  return (
    <div className={styles.mainContainer}>
      <div className={styles.tabs}>
        <div
          onClick={() => setActive("quantity")}
          className={
            active === "quantity" ? styles.activeTab : styles.inactiveTab
          }
        >
          <div className={styles.boxes}>
            <Image src={boxes} width={25} height={24} alt="boxes" />
          </div>
          Quantity
        </div>

        {usersCount[collection] ? (
          <div
            onClick={() => setActive("quality")}
            className={
              active === "quality" ? styles.activeTab : styles.inactiveTab
            }
          >
            <DiamondIcon className={styles.diamondIcon} /> Quality
          </div>
        ) : (
          ""
        )}
      </div>

      {active === "quantity" ? (
        <UsersCount collection={collection} />
      ) : usersRankings[collection] ? (
        <>
          <UsersRankings collection={collection} />
        </>
      ) : (
        "Sorry, no rankings exist for this collection"
      )}
    </div>
  );
};

export default Leaderboards;
