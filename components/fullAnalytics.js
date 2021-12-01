import collectionsList from "./functions/collectionsList.json";
import orderData from "./functions/orderData.json";
import usersCount from "./functions/usersCount.json";
const FullAnalytics = () => {
  const collections = collectionsList.filter((element) => !element.upcoming);

  return (
    <div className={styles.mainTableContainer}>
      <div className={styles.mainTableFirstRow}>
        <div className={styles.mainTableCell}>Collection</div>
        <div className={styles.mainTableCell}>Volume</div>
        <div className={styles.mainTableCell}>Users</div>
        <div className={styles.mainTableCell}>Floor Price</div>
        <div className={styles.mainTableCell}># of Items</div>
        <div className={styles.mainTableCell}>% listed</div>
      </div>
      <div className={styles.mainTableRow}></div>
    </div>
  );
};
