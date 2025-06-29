# Ignite Club Class Booking API

## ⚡ Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended) must be installed on your system.
  - Check your version with `node -v`.

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VINAYREDDY59/ignite.git
   cd ignite
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the server:**
   ```bash
   node src/index.mjs
   ```
   The server will start on [http://localhost:3000](http://localhost:3000)

---

## 📚 API Endpoints

### 1. Create a Class

- **POST** `/ignite/classes`
- **Request Body:**
  ```json
  {
    "name": "Yoga",
    "startDate": "2025-08-01",
    "endDate": "2025-08-05",
    "startTime": "09:00",
    "duration": 1,
    "capacity": 10
  }
  ```
- **Response:**
  ```json
  {
    "message": "Classes created successfully"
  }
  ```

#### Example curl

```bash
curl -X POST http://localhost:3000/ignite/classes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Yoga",
    "startDate": "2025-08-01",
    "endDate": "2025-08-05",
    "startTime": "09:00",
    "duration": 1,
    "capacity": 10
  }'
```

---

### 2. Book a Class

- **POST** `/ignite/bookings`
- **Request Body:**
  ```json
  {
    "classId": 1,
    "userName": "Alice",
    "participationDate": "2025-08-01"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Booking created successfully"
  }
  ```

#### Example curl

```bash
curl -X POST http://localhost:3000/ignite/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "classId": 1,
    "userName": "Alice",
    "participationDate": "2025-08-01"
  }'
```

---

### 3. Search Bookings

- **GET** `/ignite/bookings`
- **Query Parameters:**
  - `userName` (optional): filter by member name
  - `startDate` and `endDate` (optional, both required): filter by date range (YYYY-MM-DD)
- **Response:**
  ```json
  [
    {
      "className": "Yoga",
      "classStartTime": "09:00",
      "bookingDate": "2025-08-01",
      "member": "Alice"
    }
  ]
  ```

#### Example curl

```bash
curl "http://localhost:3000/ignite/bookings?userName=Alice&startDate=2025-08-01&endDate=2025-08-05"
```

---

## 📝 Notes

- **Data is not persisted.** All data is lost when the server restarts.
- **No authentication or authorization.** Anyone can create, book, and view classes/bookings.
- **All times/dates are expected in ISO format (YYYY-MM-DD).**

---

## 🔄 Resetting Data

- To clear all classes and bookings, simply restart the server.

---

## 👤 Author

**vinayreddy.govuri.59@gmail.com**
