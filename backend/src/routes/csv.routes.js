import {Router} from "express";
import { generateCSV } from "../controllers/csv.controllers.js";

const router = Router();

router.get('/download-csv', generateCSV);

export default router;
