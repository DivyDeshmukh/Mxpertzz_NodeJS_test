import mongoose, { isValidObjectId } from "mongoose";
import { Batch } from "../models/batch.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Student } from "../models/student.models.js";

const createBatch = asyncHandler (async (req, res) => {
    const {name} = req.body;

    if ([name].some(item => item.trim() === "")) {
        throw new ApiError(400, "Invalid Data");
    }
    
    const isAlreadyPresent = await Batch.findOne({name});

    if (isAlreadyPresent) {
        throw new ApiError (400, "Batch with this name is already present");
    }

    const addBatch = await Batch.create({
        name,  
    });

    if (!addBatch) {
        throw new ApiError(500, "Something went wrong while creating the batch");
    }

    return res.status(200)
                .json (new ApiResponse(200, addBatch, "Batch created successfully"));
});

const getBatchDetails = asyncHandler (async (req, res) => {
    const {batchId} = req.params;

    console.log(batchId);
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
        throw new ApiError(400, "Invalid Batch ID");
    }

    const isBatchPresent = await Batch.findById(batchId);

    if (!isBatchPresent) {
        throw new ApiError(400, "Batch with this id is not present");
    }

    const batchInfo = await Batch.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(batchId)
            }
        }
    ]);
    console.log(batchInfo[0]);

    const students = await Student.aggregate([
        {
            $match: {
                batch: new mongoose.Types.ObjectId(batchId),
            }
        }
    ]);

    console.log(students);

    if (!batchInfo) {
        throw new ApiError(500, "Something went wrong while fetching batch details");
    }

    return res.status(200)
                .json(new ApiResponse(200, {...batchInfo[0], ...students[0]}, "Batch information fetched successfully"));
});

const getListOfBatches = asyncHandler(async (req, res) => {
    const batches = await Batch.find();

    if (!batches) {
        throw new ApiError(500, "Something went wrong while fetching the batches");
    }
    return res.status(200)
                .json(new ApiResponse(200, batches, "batches fetched successfully"));
});

const getStudentsOfBatch = asyncHandler(async (req, res) => {
    const {batchId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(batchId)) {
        throw new ApiError(400, "Invalid Batch ID");
    }

    const students = await Student.aggregate([
        {
            $match: {
                batch: new mongoose.Types.ObjectId(batchId)
            }
        },
        {
            $lookup: {
                from: "courseScores",
                localField: "courseScores",
                foreignField: "_id",
                as: "courseScores"
            }
        },
        {
            $unwind: {
                path: "$courseScores",
                preserveNullAndEmptyArrays: true // To include students without course scores
            }
        },
        {
            $lookup: {
                from: "interviews",
                localField: "interviews",
                foreignField: "_id",
                as: "interviews"
            }
        }
    ]);

    if (!students) {
        throw new ApiError(500, "Something went wrong while fetching the students");
    }

});

export {
    createBatch,
    getBatchDetails,
    getListOfBatches,
    getStudentsOfBatch
}

