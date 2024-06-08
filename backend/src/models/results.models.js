import mongoose from "mongoose";
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  company: { type: Schema.Types.ObjectId, ref: 'Interview', required: true },
  result: { type: String, enum: ['PASS', 'FAIL', 'On Hold', 'Didn’t Attempt'], required: true }
});

export const Result = mongoose.model('Result', resultSchema);
