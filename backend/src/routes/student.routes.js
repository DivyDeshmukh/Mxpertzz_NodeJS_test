import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { addToBatch, allocateToInterview, createStudent, getListOfStudents, getStudentDetails, getStudentsOfInterview, updateInterviewStatus, getJobs } from "../controllers/student.controllers.js";

const router = Router();

router.route("/addStudent").post(verifyJWT, createStudent);
router.route("/getStudentList").get(verifyJWT, getListOfStudents);
router.route("/getStudentDetails/:studentId").get(verifyJWT, getStudentDetails);
router.route("/addToBatch/:studentId/:batchId").post(verifyJWT, addToBatch);
router.route("/allocateToInterview/:studentId/:interviewId").post(verifyJWT, allocateToInterview);
router.route("/getStudentsOfInterview/:interviewId").get(verifyJWT, getStudentsOfInterview);
router.route("/updateStatus/:studentId/:interviewId").post(verifyJWT, updateInterviewStatus);
router.route("/getjobs").get(verifyJWT, getJobs);

export default router;
