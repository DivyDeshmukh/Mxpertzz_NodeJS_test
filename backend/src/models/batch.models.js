import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: (new Date()).toLocaleDateString()
    },
    // Student schema will contain the batch ID and with the help of that we will identify the students of a particular batch
}, {timestamps: true});

export const Batch = mongoose.model("Batch", batchSchema);
