import React, { useEffect, useState } from 'react';
import api from "../api/api.js";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import Input from "./Input.jsx";
import Button from './Button.jsx';

function StudentList() {

  const [students, setStudents] = useState(null);
  const [isActive, setIsActive] = useState("list");
  const {register, handleSubmit} = useForm();

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students/getStudentList", {
        withCredentials: true
      });
      console.log(response.data.data);

      if (response) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addStudent = async (data) => {
    try {
      const response = await api.post("/students/addStudent", data, {
        withCredentials: true
      });

      console.log(response);
      if (response) {
        setIsActive("list");
        fetchStudents();
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
         <div className='flex gap-4 justify-center items-center mb-6'>
          <button onClick={() => setIsActive("list")} className={'bg-slate-600 text-white p-3 rounded-xl font-bold'}>Student List</button>
          <button onClick={() => setIsActive("add")} className={'bg-slate-600 text-white p-3 rounded-xl font-bold'}>Add Student</button>
        </div>
      {
        isActive === "list" &&  <div className='bg-white flex w-[80vw] p-6 gap-24 items-center border-b-[1px] border-b-black'>
        <p className='font-bold text-black'>No.</p>
        <p className='font-semibold text-black'>Student</p>
        <p>email</p>
        <p>college</p>
     </div>
      }
      { 
        isActive === "list" &&
        students?.length !== 0 ? (
          students?.map((item, index) => (
            <Link key={index} to={`${item._id}`} className='bg-white flex w-[80vw] p-4 gap-20 items-center'>
              <p className='font-bold text-black'>{index + 1}.</p>
              <p className='font-semibold text-black'>{item?.name}</p>
              <p>{item?.email}</p>
              <p>{item?.college}</p>
            </Link>
          ))
        ) : (isActive === "list" && <h1>No students</h1>)
      }

      {
        isActive === "add" && (
          <div>
            <form onSubmit={handleSubmit(addStudent)} className='bg-slate-600 p-6 rounded-xl text-white flex flex-col  gap-4 items-center'>
              <Input 
              type='text'
              label="Name: "
              placeholder="name"
              {...register("name", {
                required: true
              })}
              className={'bg-yellow-300 text-black'}
              />
              <Input 
              type='text'
              label="College: "
              placeholder="college"
              {...register("college", {
                required: true
              })}
              className={'bg-yellow-300 text-black'}
              />
              <Input 
              type='email'
              label="Email: "
              placeholder="email"
              {...register("email", {
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

export default StudentList;
