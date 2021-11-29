import AllLastListed from "./AllLastListed";
import { getLongListData, useGetData } from "./functions/functions";
import useSWR from "swr";
import { useState } from "react";
import Loading from "./loading";

const AllLastData = ({ listingData }) => {
  const [status, setStatus] = useState("active");

  return (
    <>{!listingData ? <Loading /> : <AllLastListed data={listingData} />}</>
  );
};

export default AllLastData;
