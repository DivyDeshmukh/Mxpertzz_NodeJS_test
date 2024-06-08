import { Router } from "express";
import { createBatch, getBatchDetails, getListOfBatches, getStudentsOfBatch } from "../controllers/batch.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// protected routes
router.route("/createbatch").post(verifyJWT, createBatch);
router.route("/getbatchInfo/:batchId").get(verifyJWT, getBatchDetails)
router.route("/getBatchList").get(getListOfBatches);
router.route("/getbatchStudents/:batchId").get(getStudentsOfBatch);

export default router;
