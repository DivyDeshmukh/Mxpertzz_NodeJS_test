import {asyncHandler} from "../utils/asyncHandler.js";
import {Student} from "../models/student.models.js";
import {CourseScore} from "../models/courseScores.models.js";
import {Result} from "../models/results.models.js";
import csv from "csv-parser";
import fs from "fs";
import {Interview} from "../models/interview.models.js";

const generateCSVData = (students, interviews, courseScores, result) => {
    let csvData = 'Student id,student name,student college,student status,DSA Final Score,WebD Final Score,React Final Score,interview date,interview company, result\n';
    
    interviews.forEach(interview => {
      const student = students.find(student => student.studentId === interview.studentId);
      if (student) {
        csvData += `${student._id},${student.name},${student.college},${student.status},${courseScores.dsaScore || '65'},${courseScores.WebDevScore || '85'},${courseScores.reactScore || '95'},${interview.date},${interview.company},${result.result || "On Hold"}\n`;
      }
    });
  
    return csvData;
  };  

const generateCSV = asyncHandler(async (req, res) => {
    const students = await Student.find().lean();
    const interviews = await Interview.find().lean();
    const courseScores = await CourseScore.find().lean();
    const results = await Result.find ().lean();
    // For simplicity, let's assume we have a function to generate CSV
    const csvData = generateCSVData(students, interviews, courseScores, results);

    // Send CSV file as response
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="interview_data.csv"');
    res.status(200).send(csvData);
});

export {generateCSV}