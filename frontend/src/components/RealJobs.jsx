import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import api from "../api/api.js";

function RealJobs() {

  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/students/getjobs", {
        withCredentials: true
      });
      console.log(response.data.data);
      if (response) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className='flex  flex-wrap w-[80%] gap-6 items-center justify-center'>
      {
        jobs.length !== 0 &&
        jobs?.map((item, index) => (
          <div key={index} className='flex flex-col h-[300px] bg-blue-600 p-6 text-white rounded-xl w-[250px] items-center'>
            <h1>Profile: {item?.profile}</h1>
            <h1>Position: {item?.position}</h1>
            <h1>Company: {item?.company}</h1>
            <Link to={"/https:www.google.com"} className={"mt-4 bg-white p-2 px-4 rounded-xl text-black font-semibold"}>Apply</Link>
          </div>
        ))
      }
    </div>
  );
}

export default RealJobs;
