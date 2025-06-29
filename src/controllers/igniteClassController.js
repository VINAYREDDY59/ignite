class IgniteClassBookingController {
  constructor() {
    this.classId = 1;
    this.classList = [];
    this.bookings = [];
  }

  // Create recurring classes for each day in the given date range
  createClass(req, res) {
    try {
      const { name, startDate, endDate, startTime, duration, capacity } =
        req.body;

      // Check for all required fields
      if (
        !name ||
        !startDate ||
        !endDate ||
        !startTime ||
        !duration ||
        capacity === undefined
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Capacity must be at least 1
      if (typeof capacity !== "number" || capacity < 1) {
        return res.status(400).json({ error: "Capacity must be at least 1" });
      }

      // Validate date order and future end date
      const start = new Date(startDate);
      const end = new Date(endDate);
      const now = new Date();
      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      if (end < now) {
        return res
          .status(400)
          .json({ error: "End date must be in the future" });
      }
      if (end < start) {
        return res
          .status(400)
          .json({ error: "End date must be after start date" });
      }

      // Generate all dates for the class sessions
      const classDates = this.getDatesInRange(start, end);

      // Only one class per day allowed
      if (this.isAnyDateTaken(classDates)) {
        res.status(400).json({ error: "Only one class per day allowed" });
        return;
      }

      // Add each session as a separate entry
      classDates.forEach((date) => {
        this.classList.push({
          classId: this.classId++,
          name,
          date: date.toISOString().split("T")[0],
          startTime,
          duration,
          capacity,
        });
      });

      return res.status(201).json({ message: "Classes created successfully" });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Book a spot in a class session
  bookClass(req, res) {
    try {
      const { classId, userName, participationDate } = req.body;

      // All fields are required
      if (!classId || !userName || !participationDate) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Participation date must be valid and in the future
      const date = new Date(participationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(date)) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      if (date < today) {
        return res
          .status(400)
          .json({ error: "Participation date must be in the future" });
      }

      // Find the class session
      const classInfo = this.classList.find((cls) => cls.classId === classId);
      if (!classInfo) {
        return res.status(404).json({ error: "Class not found" });
      }

      // Participation date must match the class session date
      const classDateStr = classInfo.date;
      const participationDateStr = date.toISOString().split("T")[0];
      if (participationDateStr !== classDateStr) {
        return res
          .status(400)
          .json({ error: "Participation date does not match class date" });
      }

      // Don't allow overbooking: check if class is already at capacity for that date
      const bookingsForClassAndDate = this.bookings.filter(
        (booking) =>
          booking.classId === classId && booking.date === participationDateStr
      );

      if (bookingsForClassAndDate.length >= classInfo.capacity) {
        return res
          .status(400)
          .json({ error: "Class is already at full capacity for this date" });
      }

      // Book the class (no check for member's availability)
      this.bookings.push({
        classId,
        userName,
        date: participationDateStr,
      });
      return res.status(201).json({ message: "Booking created successfully" });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Search bookings by member, date range, or both
  fetchBookings(req, res) {
    try {
      const { userName, startDate, endDate } = req.query;
      let filteredBookings = this.bookings;

      // Filter by userName if provided
      if (userName) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.userName === userName
        );
      }

      // If only one of startDate or endDate is provided, throw error
      if ((startDate && !endDate) || (!startDate && endDate)) {
        return res.status(400).json({
          error: "Both startDate and endDate must be provided together.",
        });
      }

      // Filter by date range if both provided
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
          return res.status(400).json({ error: "Invalid date format" });
        }
        filteredBookings = filteredBookings.filter((booking) => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= start && bookingDate <= end;
        });
      }

      // Return booking details with class info
      const results = filteredBookings.map((booking) => {
        const classInfo = this.classList.find(
          (cls) => cls.classId === booking.classId
        );
        return {
          className: classInfo ? classInfo.name : undefined,
          classStartTime: classInfo ? classInfo.startTime : undefined,
          bookingDate: booking.date,
          member: booking.userName,
        };
      });

      return res.json(results);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Utility: Get all dates between start and end (inclusive)
  getDatesInRange(start, end) {
    const dates = [];
    let current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  // Utility: Check if any date in the range already has a class
  isAnyDateTaken(dates) {
    const takenDates = new Set(this.classList.map((cls) => cls.date));
    return dates.some((date) =>
      takenDates.has(date.toISOString().split("T")[0])
    );
  }
}

module.exports = IgniteClassBookingController;
