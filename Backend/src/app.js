import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));
app.use(cookieParser());

// routes

import userRouter from "./routes/user.routes.js";
import restaurantRouter from "./routes/restaurant.routes.js";
import orderRouter from "./routes/order.routes.js";
import foodItemRouter from "./routes/fooditem.routes.js"

// routes declaration

app.use("/api/v1/users", userRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/fooditems", foodItemRouter) 

export { app };
