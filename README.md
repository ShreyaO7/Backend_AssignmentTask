# Session Booking Backend

REST API for a platform where users book sessions with teachers. Built with Node.js, TypeScript, Express.js, MongoDB and Mongoose.

## Tech Stack

- Node.js + TypeScript
- Express.js
- MongoDB + Mongoose
- Zod (request validation)

## Project Structure

```
src/
  config/        # env and db connection
  models/        # mongoose schemas
  validators/    # zod schemas for request validation
  services/      # mongodb/mongoose queries only
  controllers/   # business logic, calls services, builds responses
  routes/        # express routers, wires validators + controllers
  middlewares/   # validateRequest, centralized error handler, 404 handler
  utils/         # ApiError, asyncHandler
  app.ts         # express app setup
  server.ts      # entry point, connects db and starts server
```

## Setup

1. Clone the repo and install dependencies
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and update values if needed
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/session-booking
   ```
3. Start MongoDB locally, or point `MONGO_URI` to an Atlas cluster.
4. Run in dev mode
   ```
   npm run dev
   ```
5. Or build and run
   ```
   npm run build
   npm start
   ```

## Note on Teachers

The assignment doesn't list a "Create Teacher" API, but `Create Session` needs an existing teacher to point to. A minimal `POST /teachers` endpoint is included so sessions can actually be created and tested end to end.

## API Reference

Base URL: `http://localhost:5000`

### Create User
`POST /users`
```json
{
  "fullName": "Shreya Ojha",
  "email": "shreya@example.com",
  "phone": "9876543210"
}
```

### Create Teacher
`POST /teachers`
```json
{
  "fullName": "Amit Sharma",
  "email": "amit@example.com",
  "specialization": "Mathematics",
  "experience": 5
}
```

### Create Session
`POST /sessions`
```json
{
  "teacherId": "<teacherId>",
  "startTime": "2025-06-10T10:00:00.000Z",
  "endTime": "2025-06-10T11:00:00.000Z"
}
```
Validates that the teacher exists and `endTime` is after `startTime`. New session is created with `status: AVAILABLE`.

### Available Sessions for a Date
`GET /sessions/available?dateTimestamp=1749513600000`

Returns all `AVAILABLE` sessions whose `startTime` falls on the given date (implemented with the MongoDB aggregation pipeline, joined with teacher info).

### Book Session
`POST /sessions/:id/book`
```json
{
  "userId": "<userId>"
}
```
Fails if the user or session doesn't exist, or if the session is not `AVAILABLE`.

### Mark Session Complete
`PATCH /sessions/:id/complete`

Fails if the session doesn't exist or isn't `BOOKED`. Sets `status: COMPLETED` and `completedAt`.

### User Session List
`GET /users/:id/sessions`

Returns the user's sessions grouped into `upcoming` (BOOKED) and `completed` (COMPLETED), implemented with the MongoDB aggregation pipeline using `$facet`.

## Error Handling

All errors go through a single error-handling middleware (`src/middlewares/errorHandler.ts`) and respond with:
```json
{ "success": false, "message": "..." }
```
with the appropriate HTTP status code (400, 404, 409, 500 etc).

## Postman Collection

Import `postman_collection.json` into Postman. It uses a `baseUrl` collection variable (default `http://localhost:5000`) and `teacherId`, `userId`, `sessionId` variables that get set automatically from the create/book responses.
