import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["placed", "not_placed"],
        // required: true,
        default: "not_placed"
    },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
    courseScores: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseScore' },
    interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }]
}, {timestamps: true});

export const Student = mongoose.model("Student", studentSchema);
