import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    // Student schema will contain the interview ID and with the help of that we will identify the students of a particular interview
    status: {
        type: String,
        enum: ["PASS", "FAIL", "On Hold", "Didn’t Attempt"],
        default: "On Hold"
    }
}, {timestamps: true});

export const Interview = mongoose.model("Interview", interviewSchema);
