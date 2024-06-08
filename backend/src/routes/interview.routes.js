import { Router } from "express";
import { createInterview, getListOfInterviews } from "../controllers/interview.controllers.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

router.route ("/createInterview").post(verifyJWT, createInterview);
router.route("/getInterviews").get(verifyJWT, getListOfInterviews);

export default router;

    
