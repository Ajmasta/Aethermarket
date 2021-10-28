import AllLastListed from "./AllLastListed"
import { getLongListData, useGetData } from "./functions/functions"
import useSWR from 'swr'
import { useState } from "react"


const AllLastData = ({listingData}) => {
const [status, setStatus]= useState("active")

    
 console.log(listingData)
return(
    <>
{!listingData? "loading":<AllLastListed data={listingData} /> }
    </>
)


}

export default AllLastData