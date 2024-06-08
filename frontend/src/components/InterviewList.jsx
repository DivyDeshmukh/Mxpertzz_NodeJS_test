import React, { useEffect, useState } from 'react';
import api from "../api/api.js";
import {Link} from "react-router-dom";

function InterviewList() {

  const [interviews, setInterviews] = useState(null);

  const fetchInterviews = async () => {
    try {
      const response = await api.get("/interview/getInterviews", {
        withCredentials: true
      });
      console.log(response.data.data);

      if (response) {
        setInterviews(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchInterviews();
  }, []);

  return (
    <div>
       <div className='bg-white flex w-[80vw] p-6 gap-6 items-center border-b-[1px] border-b-black'>
              <p className='font-bold text-black'>No.</p>
              <p className='font-semibold text-black'>Company</p>
              <p>Date</p>
            </div>
      {
        interviews?.length !== 0 ? (
          interviews?.map((item, index) => (
            <Link key={index} to={`${item._id}`} className='bg-white flex w-[80vw] p-4 gap-12 items-center'>
              <p className='font-bold text-black'>{index + 1}.</p>
              <p className='font-semibold text-black'>{item?.company}</p>
              <p>{(new Date(item.date)).toLocaleDateString()}</p>
            </Link>
          ))
        ) : <h1>No Interviews</h1>
      }
    </div>
  );
}

export default InterviewList;
