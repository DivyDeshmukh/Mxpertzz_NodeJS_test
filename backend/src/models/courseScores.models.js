import mongoose from "mongoose";
const Schema = mongoose.Schema;

const courseScoreSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  dsaScore: { type: Number, required: true, default: 0 },
  webDevScore: { type: Number, required: true, default: 0 },
  reactScore: { type: Number, required: true, default: 0 }
});

export const CourseScore = mongoose.model('CourseScore', courseScoreSchema);
