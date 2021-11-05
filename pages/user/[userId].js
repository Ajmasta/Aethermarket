import { useRouter } from "next/router"
import { RecoilValueReadOnly } from "recoil"
import NavBar from '../../components/navbar'
import { accountAtom, assetsAtom } from "../../components/states/states"
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';
import { useGetUserData } from "../../components/functions/functions";
import UserAccount from "../../components/UserAccount";


const User = () => {
    const router=useRouter()
    const {userId} = router.query


const {data,isLoading,isError} = useGetUserData(userId)
   console.log(data)

    return (<>
            <NavBar />
            {isLoading || isError? "No user with this name":
            <UserAccount userId={userId} data={data} />
            } 
           
    </>)

}


export default User

