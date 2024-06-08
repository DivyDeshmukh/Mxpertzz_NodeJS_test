import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import api from "../api/api";

function Signup() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const signup = async (data) => {
    try {
      const response = await api.post("/users/register", data, {
        withCredentials: true,
      });
      console.log(response);

      if (response) {
        navigate("/login");
      }
    } catch (error) {
      setError(error?.message);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#1b181f] flex flex-col items-center justify-center">
      <div className="card h-auto max-h-[480px] w-[90%] max-w-[330px] sm:max-w-[350px] md:max-w-[380px] lg:max-w-[400px] bg-[#ffe0c3] rounded-2xl flex flex-col items-center pt-6 text-black">
        <div id="top" className="flex flex-col gap-2 items-center p-2 mb-2">
          {/* <Logo /> */}
          <h3 className="text-[10.5px] font-semibold">
            Already have an account? Please login here &nbsp;
            <Link
              to={"/login"}
              className="text-[12.5px] font-semibold text-[#FF9400] underline"
            >
              Login
            </Link>
          </h3>
          {error && (
            <p className="text-red-600 text-[12px] font-semibold mb-2">
              {error}
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit(signup)}
          className="flex flex-col gap-4 w-full pt-2 items-center pb-4"
        >
          <Input
            type="text"
            id="name"
            label="FullName:"
            placeholder="Enter your full name"
            {...register("name", {
              required: true,
              maxLength: 70,
              pattern: /^[a-zA-Z ,.'-]+$/,
            })}
          />
          <Input
            type="email"
            id="email"
            label="Email: "
            placeholder="Enter your email"
            {...register("email", {
              required: true,
              pattern:
                /^[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\.)+[A-Z]{2,}$/i,
            })}
          />
          <Input
            type="password"
            id="password"
            placeholder="Enter your password here"
            label="Password: "
            {...register("password", {
              required: true,
            })}
          />
          <div className="flex w-full justify-center gap-6">
            <Button
              text={"Back"}
              className="font-semibold -translate-y-2"
              linkClassName={"hover:bg-[#ffe0c3]"}
              keepRightIcon={false}
              keepLeftIcon={true}
              link="/"
            />

            <Button
              text={"Signup"}
              className="font-semibold -translate-y-2"
              linkClassName={"hover:bg-[#ffe0c3]"}
              keepRightIcon={true}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;