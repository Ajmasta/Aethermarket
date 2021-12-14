import { useRecoilState, useRecoilValue } from "recoil";
import {
  accountAtom,
  buyCartAtom,
  ethPriceAtom,
  userBalanceAtom,
} from "./states/states";
import styles from "./styles/cart.module.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState } from "react";
import {
  fillAllOrder,
  fillOrder,
  getUserBalances,
  logout,
  setupAndLogin,
} from "./functions/ImxFunctions";
import ethLogo from "../public/images/ethLogo.png";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";

const Cart = () => {
  const [buyCart, setBuyCart] = useRecoilState(buyCartAtom);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [account, setAccount] = useRecoilState(accountAtom);
  const [userBalance, setUserBalance] = useRecoilState(userBalanceAtom);
  const setError = (error) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const ethPrice = useRecoilValue(ethPriceAtom);
 
  const dollarFormat = Intl.NumberFormat("en-US");
  const buyCartPrice = buyCart.map((item) => item.buy.data.quantity);
  const buyCartTotal = buyCartPrice.reduce((a, b) => Number(a) + Number(b), 0);

  const formatUserBalances = async () => {
    const account = await ethereum.request({ method: "eth_requestAccounts" });
    setAccount(account);
    const userBalance = await getUserBalances(account);

    setUserBalance({ ...userBalance, imx: userBalance.imx });
  };
  const buyFunction = (order) => {
    if (account === "") {
      formatUserBalances();
    }
    if (account[0] !== localStorage.getItem("WALLET_ADDRESS")) {
      setError(
        <>
          <p className={styles.mainError}>Not logged into IMX</p>
          <p className={styles.secondaryError}>
            Your current account is not logged into to IMX. Log into IMX to
            continue.
          </p>
        </>
      );
      logout();
      setupAndLogin();
      return "";
    }
    
    if (Number(userBalance.imx) < buyCartTotal) {
      setError(
        <>
          <p className={styles.mainError}>Not enough funds!</p>
          <p className={styles.secondaryError}>
            Transfer funds to IMX by clicking on the wallet in the top-right.
          </p>
        </>
      );
      return "";
    }

    fillAllOrder(order);
  };
  return (
    <div className={styles.mainContainer}>
      {errorMessage !== "" ? (
        <div className={styles.errorContainer}>{errorMessage}</div>
      ) : (
        ""
      )}
      {buyCart.length > 0 && !drawerVisible ? (
        <div
          className={styles.cartNotification}
          onClick={() => {
            setDrawerVisible(!drawerVisible);
            formatUserBalances();
          }}
        >
          <ShoppingCartIcon />
          <div className={styles.cartNumber}>{buyCart.length}</div>
        </div>
      ) : (
        ""
      )}
      <div
        className={
          drawerVisible
            ? styles.drawerContainer
            : `${styles.drawerContainer} ${styles.noWidth}`
        }
      >
        <div className={styles.transferButtonContainer}>
          <button
            onClick={() => buyFunction(buyCart)}
            className={styles.transferAll}
          >
            Buy All
          </button>
          <button onClick={() => setBuyCart([])} className={styles.clearAll}>
            Clear All
          </button>
        </div>
        <div className={styles.buyListContainer}>
          {buyCart.map((item) => (
            <div key={item.order_id} className={styles.buyTableRow}>
              <div className={styles.buyTableLeft}>
                <div className={styles.buyTableCell}>
                  <img
                    src={item.sell.data.properties.image_url}
                    className={styles.cellImage}
                  />
                </div>
                <div className={styles.buyTableCell}>
                  <p className={styles.tokenName}>
                    {item.sell.data.properties.name}{" "}
                    <p className={styles.collectionName}>
                      {item.sell.data.properties.collection.name}{" "}
                    </p>
                  </p>
                </div>
              </div>
              <div className={styles.buyTableCell}>
                <div className={styles.ethPrice}>
                  {item.buy.data.quantity / 10 ** 18}{" "}
                  <Image
                    src={ethLogo}
                    layout="fixed"
                    width={15}
                    height={15}
                    alt="ethLogo"
                  />
                </div>
                <div className={styles.usdPrice}>
                  {dollarFormat.format(
                    ((item.buy.data.quantity / 10 ** 18) * ethPrice).toFixed(2)
                  )}
                  $
                </div>
              </div>
              <div className={styles.buyTableCellClose}>
                <CloseIcon
                  className={styles.closeIcon}
                  onClick={() => {
                    const array = [...buyCart];
                    array.splice(array.indexOf(item), 1);
                    setBuyCart(array);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.buyTableRowTotal}>
          <div className={styles.buyTableLeft}>
            <div className={styles.buyTableCellTotal}>Total</div>
          </div>
          <div className={styles.buyTableCell}>
            <div className={styles.ethPrice}>
              {buyCartTotal / 10 ** 18}{" "}
              <Image
                src={ethLogo}
                layout="fixed"
                width={15}
                height={15}
                alt="ethLogo"
              />
            </div>

            <div className={styles.usdPrice}>
              {dollarFormat.format(
                ((buyCartTotal / 10 ** 18) * ethPrice).toFixed(2)
              )}
              $
            </div>
          </div>
        </div>
      </div>
      {drawerVisible ? (
        <div
          className={styles.clickToClose}
          onClick={() => setDrawerVisible(false)}
        ></div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Cart;
