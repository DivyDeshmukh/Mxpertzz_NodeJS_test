import React, { useEffect, useState } from 'react';
import api from "../api/api.js";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import Input from "./Input.jsx";
import Button from './Button.jsx';

function InterviewList() {

  const [interviews, setInterviews] = useState(null);
  const [isActive, setIsActive] = useState("list");
  const {register, handleSubmit} = useForm();

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

  const createInterview = async (data) => {
    try {
      const response = await api.post("/interview/createInterview", data, {
        withCredentials: true
      });

      console.log(response);
      if (response) {
        setIsActive("list");
        fetchInterviews();
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
         <div className='flex gap-4 justify-center items-center mb-6'>
          <button onClick={() => setIsActive("list")} className={'bg-slate-600 text-white p-3 rounded-xl font-bold'}>Interview List</button>
          <button onClick={() => setIsActive("create")} className={'bg-slate-600 text-white p-3 rounded-xl font-bold'}>Create Interview</button>
        </div>
      {
        isActive === "list" &&  <div className='bg-white flex w-[80vw] p-6 gap-6 items-center border-b-[1px] border-b-black'>
        <p className='font-bold text-black'>No.</p>
        <p className='font-semibold text-black'>Company</p>
        <p>Date</p>
     </div>
      }
      { 
        isActive === "list" &&
        interviews?.length !== 0 ? (
          interviews?.map((item, index) => (
            <Link key={index} to={`${item._id}`} className='bg-white flex w-[80vw] p-4 gap-12 items-center'>
              <p className='font-bold text-black'>{index + 1}.</p>
              <p className='font-semibold text-black'>{item?.company}</p>
              <p>{(new Date(item.date)).toLocaleDateString()}</p>
            </Link>
          ))
        ) : (isActive === "list" && <h1>No Interviews</h1>)
      }

      {
        isActive === "create" && (
          <div>
            <form onSubmit={handleSubmit(createInterview)} className='bg-slate-600 p-6 rounded-xl text-white flex flex-col  gap-4 items-center'>
              <Input 
              type='text'
              label="Company: "
              placeholder="company"
              {...register("company", {
                required: true
              })}
              className={'bg-yellow-300 text-black'}
              />
              <Input 
              type='date'
              label="Date: "
              placeholder="date"
              {...register("date", {
                required: true
              })}
              className={'bg-yellow-300 text-black'}
              />
              <button className='bg-red-600 text-white p-3 font-semibold rounded-xl mt-4' type='submit'>Submit</button>
            </form>
          </div>
        )
      }

    </div>
  );
}

export default InterviewList;
