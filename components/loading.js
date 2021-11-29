import styles from "./styles/loading.module.css";
import icon from "../public/images/loading.svg";
import Image from "next/image";

const Loading = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.iconContainer}>
        <img
          className={styles.icon}
          src={"/images/loading.svg"}
          width={100}
          height={100}
          alt="aether logo"
        />
      </div>
    </div>
  );
};
export default Loading;
