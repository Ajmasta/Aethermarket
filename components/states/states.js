import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

export const accountAtom = atom({
  key: "accountState",
  default: "",
});
export const assetsAtom = atom({
  key: "assetsState",
  default: [],
});

export const collectionsAtom = atom({
  key: "collectionsState",
  default: [],
});

export const userBalanceAtom = atom({
  key: "userBalanceState",
  default: [],
});
export const drawerAtom = atom({
  key: "drawerAtom",
  default: false,
});
export const currencyAtom = atom({
  key: "currencyAtom",
  default: "usd",
});
export const ethPriceAtom = atom({
  key: "ethPrice",
  default: "0",
});
