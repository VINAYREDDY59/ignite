const IgniteClassBookingController = require("../controllers/igniteClassController.js");

describe("IgniteClassBookingController", () => {
  let controller, req, res;

  beforeEach(() => {
    controller = new IgniteClassBookingController();
    req = { body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("createClass", () => {
    it("creates classes for a date range", () => {
      req.body = {
        name: "Yoga",
        startDate: "2025-08-01",
        endDate: "2025-08-03",
        startTime: "09:00",
        duration: 1,
        capacity: 10,
      };
      controller.createClass(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Classes created successfully",
      });
      expect(controller.classList.length).toBe(3);
    });

    it("returns 400 if required fields are missing", () => {
      req.body = { name: "Yoga" };
      controller.createClass(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("prevents duplicate class on same day", () => {
      req.body = {
        name: "Yoga",
        startDate: "2025-08-01",
        endDate: "2025-08-01",
        startTime: "09:00",
        duration: 1,
        capacity: 10,
      };
      controller.createClass(req, res);
      controller.createClass(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("bookClass", () => {
    beforeEach(() => {
      // Add a class for booking
      controller.classList.push({
        classId: 1,
        name: "Yoga",
        date: "2025-08-01",
        startTime: "09:00",
        duration: 1,
        capacity: 2,
      });
    });

    it("books a class successfully", () => {
      req.body = {
        classId: 1,
        userName: "Alice",
        participationDate: "2025-08-01",
      };
      controller.bookClass(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Booking created successfully",
      });
      expect(controller.bookings.length).toBe(1);
    });

    it("prevents overbooking", () => {
      req.body = { classId: 1, userName: "A", participationDate: "2025-08-01" };
      controller.bookings.push({
        classId: 1,
        userName: "B",
        date: "2025-08-01",
      });
      controller.bookings.push({
        classId: 1,
        userName: "C",
        date: "2025-08-01",
      });
      controller.bookClass(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 for wrong participation date", () => {
      req.body = {
        classId: 1,
        userName: "Alice",
        participationDate: "2025-08-02",
      };
      controller.bookClass(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 for missing fields", () => {
      req.body = { classId: 1 };
      controller.bookClass(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("fetchBookings", () => {
    beforeEach(() => {
      controller.classList.push({
        classId: 1,
        name: "Yoga",
        date: "2025-08-01",
        startTime: "09:00",
        duration: 1,
        capacity: 10,
      });
      controller.bookings.push({
        classId: 1,
        userName: "Alice",
        date: "2025-08-01",
      });
      controller.bookings.push({
        classId: 1,
        userName: "Bob",
        date: "2025-08-01",
      });
    });

    it("returns all bookings", () => {
      req.query = {};
      controller.fetchBookings(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ member: "Alice" }),
          expect.objectContaining({ member: "Bob" }),
        ])
      );
    });

    it("filters bookings by userName", () => {
      req.query = { userName: "Alice" };
      controller.fetchBookings(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ member: "Alice" })])
      );
      expect(res.json.mock.calls[0][0].length).toBe(1);
    });

    it("filters bookings by date range", () => {
      req.query = { startDate: "2025-08-01", endDate: "2025-08-01" };
      controller.fetchBookings(req, res);
      expect(res.json.mock.calls[0][0].length).toBe(2);
    });

    it("filters bookings by userName and date range", () => {
      req.query = {
        userName: "Alice",
        startDate: "2025-08-01",
        endDate: "2025-08-01",
      };
      controller.fetchBookings(req, res);
      expect(res.json.mock.calls[0][0].length).toBe(1);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ member: "Alice" })])
      );
    });
  });

  it("should instantiate", () => {
    expect(controller).toBeInstanceOf(IgniteClassBookingController);
  });
});
