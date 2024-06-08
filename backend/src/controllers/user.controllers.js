import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.models.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// this is the function that will generate the access and the refresh tokens
const generateAccessRefreshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generating refresh and access token"
      );
    }
  };

// algo for register controller
// first take data from body
// then check whether it is valid or not
// if valid then check for email already present or not
// if not then create account
const register = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;

    if ([name, email, password].some(item => item.trim() === "")) {
        throw new ApiError(400, "Invalid Error Data");
    }

    const isAlreadyPresent = await User.findOne({
        email
    });

    if (isAlreadyPresent) {
        throw new ApiError(400, "User with this email id already present");
    }

    const createUser = await User.create({
        name, email, password
    });

    if (!createUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    const registeredUser = await User.findById(createUser?._id).select("-password -refreshToken");

    if (!registeredUser) {
        throw new ApiError(500, "Something went wrong while fetching the newly created user");
    }

    return res.status(200)
                .json(new ApiResponse(200, registeredUser, "User registered successfully"));

});

// here, after validating the user generate access and refreshTokens and then save the refreshToken in the database and sent the tokens to the client inside cookies.
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    if ([email, password].some((item) => item.trim() === "")) {
      throw new ApiError(400, "Invalid login credentials");
    }
  
    const isUserExist = await User.findOne({ email });
  
    if (!isUserExist) {
      throw new ApiError(400, "User with this email do not exist");
    }
  
    const isPasswordValid = await isUserExist.isPasswordCorrect(password);
  
    if (!isPasswordValid) {
      throw new ApiError(400, "Please enter the correct password");
    }
  
    const { accessToken, refreshToken } = await generateAccessRefreshTokens(
      isUserExist?._id
    );
  
    const sentUser = await User.findById(isUserExist?._id).select(
      "-password -refreshToken"
    );
  
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...options,
      })
      .cookie("refreshToken", refreshToken, {
        ...options,
      })
      .json(
        new ApiResponse(
          200,
          { sentUser, refreshToken },
          "User logged in successfully"
        )
      );
  });

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
  
    const options = {
      httpOnly: true,
    };
  
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged Out"));
  });
  
const refreshAccessToken = asyncHandler(async (req, res) => {
    const { token } = req.body;
    console.log("token: ", token, req.body);
    if (!token) {
      throw new ApiError(400, "Invalid Refresh Token");
    }

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    console.log(decodedToken);
    const user = await User.findById(decodedToken?._id);
    console.log(user);
  
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
  
    if (token !== user?.refreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    const { accessToken, refreshToken } = await generateAccessRefreshTokens(
      user._id
    );
  
    const sentUser = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
  
    console.log(accessToken, refreshToken);
  
    return (
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        // .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user: sentUser,
              refreshToken,
            },
            "Access Token refreshed"
          )
        )
    );
  });
  
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
      .status(200)
      .json(new ApiResponse(200, req.user, "User got successfully"));
  });

export {
    register,
    login,
    logout,
    refreshAccessToken,
    getCurrentUser
}

