import { asyncHandler } from "../utils/asyncHandler.js";
import {CourseScore} from "../models/courseScores.models.js";


// in courseScores UI show list of batches and then on clicking that batch take that id from the route and fetch all the students with that particular batch, and on clicking that student take the user to add course scores page in which the employee/user will add the marks of all three different subjects and submit and then create courseScores document for that particular student along with the student id.



