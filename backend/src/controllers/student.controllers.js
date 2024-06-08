import {asyncHandler} from "../utils/asyncHandler.js";
import {Student} from "../models/student.models.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Batch } from "../models/batch.models.js";
import {Interview} from "../models/interview.models.js";

const createStudent = asyncHandler (async (req, res) => {
    const {name, college, email} = req.body;

    if ([name, college, email].some(item => item.trim() === "")) {
        throw new ApiError (400, "Invalid Data");
    }

    const isAlreadyPresent = await Student.findOne({email});

    if (isAlreadyPresent) {
        throw new ApiError(400, "Student with this email Id already present");
    }

    const addStudent = await Student.create({
        name,
        college, 
        email
    });

    if (!addStudent) {
        throw new ApiError(500, "Something went wrong");
    }

    return res.status (200)
                .json (new ApiResponse(200, addStudent, "Student Added successfully"));
});


const getListOfStudents = asyncHandler (async (req, res) => {
    const students = await Student.find();

    if (!students) {
        throw new ApiError(500, "Something went wrong while fetching the students");
    }
    return res.status(200)
                .json(new ApiResponse(200, students, "Students fetched successfully"));
});

const getStudentDetails = asyncHandler (async (req, res) => {
    const {studentId} = req.params;

    const isStudentPresent = await Student.findById(studentId);

    if (!isStudentPresent) {
        throw new ApiError(400, "Student with this Id is not present");
    }

    const studentInfo = await Student.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(studentId)
            }
        },
        {
            $lookup: {
                from: "batches",
                localField: "batch",
                foreignField: "_id",
                as: "batchDetails"
            }
        },
        {
            $lookup: {
                from: "courseScores",
                localField: "courseScores",
                foreignField: "_id",
                as: "courseScoresDetails"
            }
        },
        {
            $lookup: {
                from: "interviews",
                localField: "interviews",
                foreignField: "_id",
                as: "interviewsDetails"
            }
        }
    ]);

    console.log(studentInfo);

    return res.status(200)
                .json(new ApiResponse(200, studentInfo[0], "Student Info Fetched Successfully"));
});

const addToBatch = asyncHandler(async (req, res) => {
    const {studentId, batchId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(batchId) && !mongoose.Types.ObjectId.isValid(studentId)) {
        throw new ApiError(400, "Invalid Batch ID");
    }

    console.log(studentId, batchId);

    const isBatchPresent = await Batch.findById(batchId);

    const isStudentPresent = await Student.findById(studentId);

    if (!isBatchPresent && !isStudentPresent) {
        throw new ApiError(500, "Either student or batch id is wrong");
    }

    const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        { $set: { batch: batchId } },
        { new: true } // To return the updated document
    );

    if (!updatedStudent) {
        throw new ApiError(500, "Something went wrong while updating the student");
    }

    return res.status(200)
                .json(new ApiResponse(200, updatedStudent, "Student added to the batch successfully"));
});

const allocateToInterview = asyncHandler(async (req, res) => {
    const {studentId, interviewId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId) && !mongoose.Types.ObjectId.isValid(studentId)) {
        throw new ApiError(400, "Invalid Batch ID");
    }

    console.log(studentId, interviewId);

    const isInterviewPresent = await Interview.findById(interviewId);

    const isStudentPresent = await Student.findById(studentId);

    if (!isInterviewPresent && !isStudentPresent) {
        throw new ApiError(500, "Either student or interview id is wrong");
    }

    const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        { $set: { interviews: interviewId } },
        { new: true } // To return the updated document
    );

    console.log(updatedStudent);

    if (!updatedStudent) {
        throw new ApiError(500, "Something went wrong while updating the student");
    }

    return res.status(200)
                .json(new ApiResponse(200, updatedStudent, "Student added to the batch successfully"));
});

const getStudentsOfInterview = asyncHandler(async (req, res) => {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
        throw new ApiError(400, "Invalid Interview ID");
    }

    const isInterviewPresent = await Interview.findById(interviewId);

    if (!isInterviewPresent) {
        throw new ApiError(400, "Interview with this ID is not present");
    }

    const getStudents = await Student.aggregate([
        {
            $match: {
                interviews: new mongoose.Types.ObjectId(interviewId)
            }
        },
        {
            $lookup: {
                from: "batches",
                localField: "batch",
                foreignField: "_id",
                as: "batchDetails"
            }
        },
        {
            $unwind: {
                path: "$batchDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "courseScores",
                localField: "courseScores",
                foreignField: "_id",
                as: "courseScoresDetails"
            }
        },
        {
            $unwind: {
                path: "$courseScoresDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "interviews",
                localField: "interviews",
                foreignField: "_id",
                as: "interviewsDetails",
            }
        },
    ]);

    // if (!getStudents || getStudents.length === 0) {
    //     throw new ApiError(404, "No students found for this interview");
    // }

    res.status(200).json(new ApiResponse(200, getStudents, "Student fetched succesfully"));
});

const updateInterviewStatus = asyncHandler (async (req, res) => {
    const {studentId, interviewId} = req.params;
    const {status} = req.body;
    if (!mongoose.Types.ObjectId.isValid(interviewId) && !mongoose.Types.ObjectId.isValid(studentId)) {
        throw new ApiError(400, "Invalid Interview ID, student Id");
    }

    const isInterviewPresent = await Interview.findById(interviewId);

    const isStudentPresent = await Student.findById(studentId);

    if (!isInterviewPresent && !isStudentPresent) {
        throw new ApiError(500, "Either student or interview id is wrong");
    }

    const student = await Student.findOneAndUpdate(
        { _id: studentId, "interviews._id": new mongoose.Types.ObjectId(interviewId) },
        { $set: { "interviews.$.status": status } },
        { new: true }
    );

    console.log(student);

});

const getJobs = asyncHandler(async (req, res) => {
    const jobs = [
        {
          "profile": "We are looking for a skilled software engineer with experience in full-stack web development.",
          "company": "Tech Innovators Inc.",
          "position": "Full-Stack Software Engineer"
        },
        {
          "profile": "Seeking a creative graphic designer to join our marketing team.",
          "company": "Design Dynamics Ltd.",
          "position": "Graphic Designer"
        },
        {
          "profile": "Join our fast-paced startup as a mobile app developer and help shape the future of our product.",
          "company": "NextGen Solutions",
          "position": "Mobile App Developer"
        },
        {
          "profile": "We need a detail-oriented data analyst to help us make sense of our data and drive business decisions.",
          "company": "Insightful Analytics Corp.",
          "position": "Data Analyst"
        },
        {
          "profile": "Exciting opportunity for a passionate UX/UI designer to create engaging user experiences.",
          "company": "UserFirst Technologies",
          "position": "UX/UI Designer"
        },
        {
          "profile": "Join our dynamic sales team and help us expand our market reach.",
          "company": "Global Solutions Inc.",
          "position": "Sales Representative"
        },
        {
          "profile": "Looking for an experienced project manager to lead our upcoming product launch.",
          "company": "Project Management Pro",
          "position": "Project Manager"
        },
        {
          "profile": "Seeking a motivated customer support specialist to provide exceptional service to our clients.",
          "company": "Service Excellence Ltd.",
          "position": "Customer Support Specialist"
        },
        {
          "profile": "Join our research team and contribute to cutting-edge scientific discoveries.",
          "company": "Science Innovations Labs",
          "position": "Research Scientist"
        },
        {
          "profile": "We are hiring a skilled network engineer to maintain and optimize our network infrastructure.",
          "company": "Network Solutions Ltd.",
          "position": "Network Engineer"
        }
      ];
      
    return res.status(200)
                .json(new ApiResponse(200, jobs, "Fetched jobs successfully"));
});

export {
    createStudent,
    getListOfStudents,
    getStudentDetails,
    addToBatch,
    allocateToInterview,
    getStudentsOfInterview,
    updateInterviewStatus,
    getJobs
}

