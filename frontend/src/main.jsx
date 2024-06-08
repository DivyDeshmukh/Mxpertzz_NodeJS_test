import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Home from "./components/Home.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import InterviewList from "./components/InterviewList.jsx";
import StudentList from "./components/StudentList.jsx";
import  RealJobs from "./components/RealJobs.jsx";
import Interview from "./components/Interview.jsx";
import Stundent from "./components/Stundent.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/interviews",
        element: <InterviewList />
      },
      {
        path: "/interviews/:interviewId",
        element: <Interview />
      },
      {
        path: "/students",
        element: <StudentList />
      },
      {
        path: "/students/:studentId",
        element: <Stundent />
      },
      {
        path: "/realJobs",
        element: <RealJobs />
      }
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);