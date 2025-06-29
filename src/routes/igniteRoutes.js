import express from "express";
const IgniteClassBookingController = require("../controllers/igniteClassController.js");

const router = express.Router();

const igniteClassBookingController = new IgniteClassBookingController();

// RESTful routes
router.post("/classes", (req, res) =>
  igniteClassBookingController.createClass(req, res)
);
router.post("/bookings", (req, res) =>
  igniteClassBookingController.bookClass(req, res)
);
router.get("/bookings", (req, res) =>
  igniteClassBookingController.fetchBookings(req, res)
);

export default router;
