import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from './Button';
import api from '../api/api';

function Interview() {

  const {interviewId} = useParams();
  const [isActive, setIsActive] = useState("allocate");
  const [status, setStatus] = useState("pending");
  const [students, setStudents] = useState(null);
  const [allocatedStudents, setAllocatedStudents] = useState(null);

  const getInterviewInfo = async () => {
    try {
      const response = await api.get("/students/getStudentList", {
        withCredentials: true
      });

      console.log(response.data.data);

      if (response) {
        // only students who are not allocated that will be shown here
        const filterStudents = response.data.data.filter((item) => item.interviews.length === 0);
        setStudents(filterStudents);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getInterviewInfo();
    getAllocatedStudents();
  }, []);

  useEffect(() => {
    console.log(allocatedStudents);
  }, [allocatedStudents]);

  const allocateToInterview = async (studentId) => {
    try {
      const response = await api.post(`/students/allocateToInterview/${studentId}/${interviewId}`);

      console.log(response);

      if (response) {

      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllocatedStudents = async () => {
    try {
      const response = await api.get(`/students/getStudentsOfInterview/${interviewId}`, {
        withCredentials: true
      });
      console.log(response.data.data);
      if (response) {
        setAllocatedStudents(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const updateStatus = async (status, studentId) => {
    setStatus(status);
    try {
      const response = await api.post(`/interview/updateStatus/${studentId}`, {status}, {
        withCredentials: true
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div id="btns" className='flex gap-4 flex-col'>
        <div className='flex gap-4 justify-center items-center'>
          <button onClick={() => setIsActive("allocate")} className={'bg-slate-600 text-white p-3 rounded-xl font-bold'}>Allocate Interview</button>
          <button onClick={() => setIsActive("allocated")} className={'bg-slate-600 text-white p-3 rounded-xl font-bold'}>Allocated Students</button>
        </div>
        
        {
          isActive === "allocate" && <div>
          <div className='bg-white flex w-[80vw] p-4 rounded-xl mb-4 gap-6 items-center border-b-[1px] border-b-black '>
              <p className='font-bold text-black'>No.</p>
              <p className='font-semibold text-black'>Student</p>
          </div>
          {
            students?.map((item, index) => (
              <div key={index} to={`${item._id}`} className='bg-white flex w-[80vw] p-4 gap-12 items-center rounded-xl'>
              <p className='font-bold text-black'>{index + 1}.</p>
              <p className='font-semibold text-black'>{item?.name}</p>
              <button className='p-2 bg-slate-600 text-white rounded-xl' onClick={() => allocateToInterview(item?._id)}>add</button>
            </div>
            ))
          }
        </div>
        }

        {
          isActive === "allocated" && (
            <div>
              <div className='bg-white flex w-[80vw] p-4 rounded-xl mb-4 gap-12 items-center border-b-[1px] border-b-black '>
                <p className='font-bold text-black'>No.</p>
                <p className='font-semibold text-black'>Student</p>
                <p className='font-semibold text-black'>College</p>
                <p className='font-semibold text-black'>Status</p>
                <p className='font-semibold text-black'>Update Status</p>
              </div>
              {
                allocatedStudents?.map((item, index) => (
                  <div key={index} className='bg-white flex w-[80vw] p-4 gap-12 items-center rounded-xl'>
                    <p className='font-bold text-black'>{index + 1}.</p>
                    <p className='font-semibold text-black'>{item?.name}</p>
                    <p className='font-semibold text-black'>{item?.interviewsDetails[0].company}</p>
                    <p className='font-semibold text-black'>{status}</p>

                    <select className='bg-slate-600 p-2 text-white rounded-lg' 
                    onChange={(e) => updateStatus(e.target.value, item?._id)}
                    >
                      <option value="pending">pending</option>
                      <option value="selected">selected</option>
                      <option value="not_selected">not_selected</option>
                    </select>
                  </div>
                ))
              }
            </div>
          )
        }

      </div>
    </div>
  );
}

export default Interview;
