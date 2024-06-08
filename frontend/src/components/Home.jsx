import React, { useState } from "react";
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutUser } from "../features/authSlice.js";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

  const logout = async () => {
    try {
      const response = await api.post(
        "/users/logout",
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response) {
        localStorage.removeItem("refreshToken");
        dispatch(logoutUser());
        navigate("/login");
      }
    } catch (error) {
      console.log(error.response.status);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => logout()}
        className="bg-slate-400 p-3 rounded-xl font-semibold"
      >
        Logout
      </button>
      <button
        className="bg-slate-400 rounded-xl font-semibold p-3"
        // onClick={() => getCurrentUser()}
        onClick={() => setData(userData)}
      >
        Show Current User
      </button>
      {data && (
        <div className="p-4 bg-black text-white">
          <h1>{data.name}</h1>
        </div>
      )}
    </div>
  );
}

export default Home;