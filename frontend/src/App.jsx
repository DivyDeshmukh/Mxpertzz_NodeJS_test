import { useEffect, useState } from "react";
import "./App.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import api from "./api/api";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./features/authSlice";

function App() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.authStatus);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  // console.log(authStatus, userData);

  const refreshAccessToken = async () => {
    try {
      // get token from localStorage
      // send request to server
      // get access token
      // and remove refreshToken and add new refreshToken
 
      const token = localStorage.getItem("refreshToken");
      console.log(token);

      if (token) {
        const response = await api.post(
          "/users/refresh-token",
          { token },
          {
            withCredentials: true,
          }
        );

        if (!response) {
          throw Error;
        }
        console.log(response.data.data.user);
        const { refreshToken } = response.data.data;
        console.log(refreshToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
          dispatch(login(response.data.data.user));
        }
      } else {
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      console.log(error.response.status, error);
    }
  };

  useEffect(() => {
    refreshAccessToken();
  }, [authStatus]);

  return (
    <div className="h-auto w-screen bg-red-600 flex justify-center items-center flex-col gap-4 pt-12 pb-12">
      {authStatus && (
        <div id="nav" className="flex gap-4 mb-8">
          <NavLink
            to={"/home"}
            className={({ isActive }) =>
              `${
                isActive ? "text-white" : "text-black"
              } bg-slate-500 p-3 rounded-lg`
            }
          >
            Home
          </NavLink>
          <NavLink
            to={"/interviews"}
            className={({ isActive }) =>
              `${
                isActive ? "text-white" : "text-black"
              } bg-slate-500 p-3 rounded-lg`
            }
          >
            Interviews
          </NavLink>
          <NavLink
            to={"/students"}
            className={({ isActive }) =>
              `${
                isActive ? "text-white" : "text-black"
              } bg-slate-500 p-3 rounded-lg`
            }
          >
            Students
          </NavLink>
          <NavLink
            to={"/realJobs"}
            className={({ isActive }) =>
              `${
                isActive ? "text-white" : "text-black"
              } bg-slate-500 p-3 rounded-lg`
            }
          >
            Real Jobs
          </NavLink>
          <NavLink
            to={"/download-csv"}
            className={({ isActive }) =>
              `${
                isActive ? "text-white" : "text-black"
              } bg-slate-500 p-3 rounded-lg`
            }
          >
            Download CSV
          </NavLink>
        </div>
      )}
      <Outlet />
    </div>
  );
}

export default App;