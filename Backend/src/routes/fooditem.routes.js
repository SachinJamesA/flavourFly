import Router from "express";
import { addFoodItem } from "../controllers/fooditem.controller.js";
import { upload } from "../midlewares/multer.middleware.js";

const router = new Router();

router.route("/:id/addfooditem").post(
  upload.fields([
    {
      name: "foodImage",
      maxCount: 1,
    },
  ]),
  addFoodItem
);

export default router;
