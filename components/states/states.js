import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';

export const accountAtom =  atom({
    key:"accountState",
    default:""
})
export const assetsAtom = atom({
    key:"assetsState",
    default:[]
})

export const collectionsAtom = atom({
    key:"collectionsState",
    default:[]
})

export const userBalanceAtom = atom({
    key:"userBalanceState",
    default:[]
})
export const drawerAtom = atom({
    key:"drawerAtom",
    default:false
})


