import { useRouter } from "next/router"
import FullLastData from "../../components/fullLastData.js"
import NavBar from '../../components/navbar'


const Collection = ({activeListings}) => {

    const router=useRouter()
    const {collection} = router.query
    console.log(collection)
    return (
        <>
        <NavBar /> 
        <FullLastData collection={collection} />
  </>  )
}

export default Collection

