import { Router } from "express";
import { upload } from "../midlewares/multer.middleware.js";
import { verifyJWT } from "../midlewares/auth.middleware.js";
import {
    changePass,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/:id/getUserDetails").get(verifyJWT, getUserDetails);
router.route("/:id/updateprofile").put(verifyJWT, updateProfile);

router.route("/:id/changepass").post(verifyJWT, changePass);

export default router;