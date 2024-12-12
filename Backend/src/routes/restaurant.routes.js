import { Router } from "express";
import {
  addRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getSingleRestaurant,
  updateRestaurants,
} from "../controllers/restaurant.controller.js";
import { upload } from "../midlewares/multer.middleware.js";

const router = Router();

router.route("/addRestaurant").post(
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  addRestaurant
);

router.route("/getAllRestaurants").get(getAllRestaurants);
router.route("/:id").get(getSingleRestaurant);
router.route("/:id").delete(deleteRestaurant);
router.route("/:id").put(updateRestaurants)

export default router;