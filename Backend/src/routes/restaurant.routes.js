import { Router } from "express";
import {
  addMenuItem,
  addRestaurant,
  addRestaurantReview,
  deleteMenuItem,
  deleteRestaurant,
  getAllRestaurants,
  getMenuItems,
  getReviews,
  getSingleRestaurant,
  searchRestaurant,
  updateMenuItem,
  updateRestaurants,
  updateRestaurantStatus,
  // uploadRestaurantImage,
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
router.route("/:id").put(updateRestaurants);

router.route("/:id/menu").post(
  upload.fields([
    {
      name: "foodImage",
      maxCount: 1,
    },
  ]),
  addMenuItem
);
router.route("/:id/menu").get(getMenuItems);

router.route("/:id/foodItem").put(
  upload.fields([
    {
      name: "foodImage",
      maxCount: 1,
    }
  ]),
  updateMenuItem
)

router.route("/:id/foodItem").delete(deleteMenuItem)
router.route("/search").get(searchRestaurant)

router.route("/:id/reviews").post(addRestaurantReview)
router.route("/:id/reviews").get(getReviews)
router.route("/:id/status").patch(updateRestaurantStatus)
// router.route("/:id/image")/post(uploadRestaurantImage)

export default router;