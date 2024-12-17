import { Router } from "express";
import {
  addOrderReview,
  cancelOrder,
  generateInvoice,
  getActiveOrdersForRestaurant,
  getAllOrders,
  getCompletedOrdersForRestaurant,
  getOrdersForRestaurant,
  getOrdersForUsers,
  getSingleOrder,
  placeOrder,
  trackOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../midlewares/auth.middleware.js";

const router = Router();

router.route("/placeorder").post(verifyJWT, placeOrder);

router.route("/fetchallorders").get(verifyJWT, getAllOrders);
router.route("/:id").get(verifyJWT, getSingleOrder);
router.route("/:id/status").put(verifyJWT, updateOrderStatus);
router.route("/:id/cancel").put(verifyJWT, cancelOrder);

router.route("/:id/user").get(verifyJWT, getOrdersForUsers);
router.route("/:id/restaurant").get(verifyJWT, getOrdersForRestaurant);

router.route("/:id/review").post(verifyJWT, addOrderReview);
router.route("/:id/track").get(verifyJWT, trackOrder);

router.route("/:id/invoice").get(verifyJWT, generateInvoice);

router.route("/:id/active").get(getActiveOrdersForRestaurant)
router.route("/:id/completed").get(getCompletedOrdersForRestaurant)
export default router;
