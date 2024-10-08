const express = require("express");
const router = express.Router();
const tripsService = require("../services/trips");
const usersService = require("../services/users");
const { tripSchema, tripUpdateSchema } = require("../schema/trip");

const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");
/**
 * TRIPS ROUTES
 */

/***
 * GET all trips
 */
router.get("/", async (req, res) => {
  const sort = {
    by: req.query.sortBy,
    order: req.query.sortOrder,
  };
  const search = req.query.s;
  const { trips, pagination } = await tripsService.getTrips(
    req.query.page,
    req.query.take,
    sort,
    search
  );
  return res.status(201).json({ result: trips, pagination });
});

/***
 * GET all favorites
 */

router.get("/favorites", isAuth, async (req, res) => {
  const userId = req.session.userData.id;
  try {
    const favorites = await tripsService.getUserFavorites(userId);
    return res.status(200).json({ result: favorites });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/***
 * GET all for admin
 */

router.get("/admin", isAdmin, async (req, res) => {
  const { trips, pagination } = await tripsService.getAdminTrips(
    req.query.page,
    req.query.take
  );
  return res.status(201).json({ result: trips, pagination });
});

/***
 * GET user joined trips
 */
router.get("/my", isAuth, async (req, res) => {
  const userId = req.session.userData.id;
  try {
    const trips = await usersService.getJoinedTrips(userId);
    return res.status(201).json(trips);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/***
 * GET a trip by ID
 */

router.get("/:id", async (req, res) => {
  const tripId = req.params.id;
  try {
    const trip = await tripsService.getTrip(tripId);
    if (req.session.userData) {
      const { isFavorite, isJoined } = await usersService.checkTrip(
        req.session.userData.id,
        tripId
      );
      return res.status(200).json({
        result: trip,
        user: {
          isFavorite,
          isJoined,
        },
      });
    } else {
      return res.status(200).json({
        result: trip,
      });
    }
  } catch (err) {
    console.log(err);
    if (err.message === "Not found") {
      return res.status(404).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

/***
 * GET trip participants
 */
router.get("/:id/participants", isAdmin, async (req, res) => {
  const tripId = req.params.id;
  try {
    const { result, info } = await tripsService.getTripParticipants(tripId);
    return res.status(200).json({ result, info });
  } catch (err) {
    if (err.message === "Trip not found") {
      return res.status(404).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

/***
 * DELETE a participant from a trip
 */
router.delete("/:id/participants/:userId", isAdmin, async (req, res) => {
  const tripId = req.params.id;
  const userId = req.params.userId;
  try {
    await tripsService.removeParticipant(tripId, userId);
    return res.status(200).json({ message: "Participant deleted" });
  } catch (err) {
    console.log(err);
    if (err.message === "Trip not found") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message === "User not found") {
      return res.status(404).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

/***
 * PUT - update a trip by ID
 */
router.put("/:id", isAdmin, async (req, res) => {
  const tripId = req.params.id;
  if (req.body.id !== undefined) {
    if (req.body.id !== tripId) {
      return res.status(403).json({ message: "Trip id mismatch" });
    }
    delete req.body.id;
  }
  const tripData = req.body;
  const validationResult = tripUpdateSchema.validate(tripData);
  if (validationResult.error) {
    return res.status(403).json({ message: validationResult.error.message });
  }
  try {
    await tripsService.updateTrip(tripId, tripData);
    return res.status(200).json({ message: `Trip with id ${tripId} updated` });
  } catch (err) {
    console.log(err);
    if (err.code == 5) {
      return res.status(404).json({ message: "Trip not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

/***
 * POST - add a trip
 */

router.post("/add", isAdmin, async (req, res) => {
  const trip = req.body;
  if (trip.startDate !== undefined) {
    trip.startDate = Date.parse(trip.startDate);
  }
  if (trip.endDate !== undefined) {
    trip.endDate = Date.parse(trip.endDate);
  }
  const validationResult = tripSchema.validate(trip);
  if (validationResult.error) {
    return res.status(403).json({ message: validationResult.error.message });
  }
  trip.startDate = new Date(trip.startDate);

  if (trip.endDate !== undefined) {
    trip.endDate = new Date(trip.endDate);
  } else {
    trip.endDate = trip.startDate;
  }

  if (trip.imageUri !== undefined) {
    try {
      const image = await tripsService.uploadFeaturedImage(trip.imageUri);
      trip.featuredImage = image;
      delete trip.imageUri;
    } catch (err) {
      console.log(err);
    }
  }

  const tripId = await tripsService.addTrip(trip);
  res.status(201).json({ message: "Trip created", tripId: tripId });
});

/***
 * DELETE - delete a trip by ID
 */
router.delete("/:id", isAdmin, async (req, res) => {
  const tripId = req.params.id;
  tripsService.deleteTrip(tripId);
  res.status(204).json({ message: `Trip with id ${req.params.id} deleted` });
});

/***
 * POST - join a trip
 */

router.post("/:id/join", isAuth, async (req, res) => {
  const tripId = req.params.id;
  const userId = req.session.userData.id;
  try {
    await tripsService.joinTrip(tripId, userId);
    return res.status(200).json({ message: "User joined trip" });
  } catch (err) {
    if (err.message === "Trip already started") {
        return res.status(403).json({ message: "Trip already started" });
    }
    if (err.message === "Trip not found") {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (err.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    if (err.message === "Trip is full") {
      return res.status(403).json({ message: "Trip is full" });
    }

    if (err.message === "User already joined") {
      return res.status(403).json({ message: "User already joined" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

/***
 * POST - add trip to user favorites
 */
router.post("/:id/favorite", isAuth, async (req, res) => {
  const userId = req.session.userData.id;
  const tripId = req.params.id;
  try {
    const result = await usersService.addTripToFavorites(userId, tripId);
    if (result) {
      return res.status(200).json({ message: "Trip added to favorites" });
    } else {
      return res.status(200).json({ message: "Trip removed from favorites" });
    }
  } catch (err) {
    console.log(err);
    if (err === "Trip not found") {
      return res.status(404).json({ message: "Trip not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

const { generateTrip } = require("../seeders/trip");

router.post("/seed", isAdmin, async (req, res) => {
  const no = req.query.no || 20;
  const data = [];
  for (let i = 0; i < no; i++) {
    const generated = generateTrip();
    await tripsService.addTrip(generated);
    data.push(generated);
  }
  return res.status(200).json({ message: `Successfully seeded ${no} trips!` });
});

module.exports = router;
