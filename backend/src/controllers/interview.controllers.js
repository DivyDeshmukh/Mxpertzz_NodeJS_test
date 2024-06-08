import { asyncHandler } from "../utils/asyncHandler.js";
import { Interview } from "../models/interview.models.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const createInterview = asyncHandler(async (req, res) => {
    const {company, date, status} = req.body;

    if (!company) {
        throw new ApiError(400, "Invalid Data");
    }

    const createInterview = await Interview.create({
        company,
        date,
        status
    });

    if (!createInterview) {
        throw new ApiError(500, "Something went wrong while creating the Interview");
    }

    return res.status(200)
                .json(new ApiResponse (200, createInterview, "Interview created successfully"));
});

const getListOfInterviews = asyncHandler (async (req, res) => {
    const interviews = await Interview.find();

    if (!interviews) {
        throw new ApiError(500, "Something went wrong while fetching the interviews");
    }

    return res.status(200)
                .json(new ApiResponse(200, interviews, "Interviews fetched successfully"));
});

export {
    createInterview,
    getListOfInterviews
}