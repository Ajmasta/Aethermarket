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
    key:"collectionsStae",
    default:[]
})