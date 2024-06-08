import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { getCurrentUser, login, logout, refreshAccessToken, register } from "../controllers/user.controllers.js";
const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getuser").get(verifyJWT, getCurrentUser);
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
