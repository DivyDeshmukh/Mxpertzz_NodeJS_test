import mongoose from "mongoose";
const Schema = mongoose.Schema;

const courseScoreSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  dsaScore: { type: Number, required: true },
  webDevScore: { type: Number, required: true },
  reactScore: { type: Number, required: true }
});

export const CourseScore = mongoose.model('CourseScore', courseScoreSchema);
