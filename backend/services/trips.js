const {
  query,
  where,
  orderBy,
  limit,
  FieldPath,
} = require("firebase-admin/firestore");
const { db, storage } = require("../utils/firebase");
const { hashImage } = require("../utils/image");

const tripsRef = db.collection("trips");
const usersRef = db.collection("users");

/**
 * TRIPS SERVICE
 */

/**
 * Add a new trip
 * @param {*} tripData
 * @returns
 */
async function addTrip(tripData) {
  if (tripData.imageUri !== undefined) {
    try {
      const image = await tripsService.uploadFeaturedImage(tripData.imageUri);
      tripData.featuredImage = image;
      delete tripData.imageUri;
    } catch (err) {
      console.log(err);
    }
  }
  tripData.participants = {};
  tripData.currentParticipants = 0;
  tripData.dateAdded = new Date();
  tripData.startDate = new Date(tripData.startDate);
  tripData.endDate = new Date(tripData.endDate);
  const trip = await tripsRef.add(tripData);
  return trip.id;
}

/***
 * Get all trips
 */

async function getTrips(page, take, sort, search) {
  try {
    page = parseInt(page);
  } catch (error) {
    page = 1;
  }
  try {
    take = parseInt(take);
  } catch (error) {
    take = 10;
  }

  take = parseInt(take);
  if (isNaN(page) || page <= 0) {
    page = 1;
  }
  if (isNaN(take) || take <= 0) {
    take = 10;
  }

  const startIndex = (page - 1) * take;

  let query = tripsRef.select(
    "title",
    "price",
    "currency",
    "startDate",
    "endDate",
    "featuredImage",
    "maxParticipants",
    "destinations"
  );

  if (search !== undefined && search !== "") {
    query = query
      .where("title", ">=", search)
      .where("title", "<=", search + "\uf8ff")
      .orderBy("title", "asc");
  } else {
    if (sort !== undefined && sort.by !== undefined) {
      if (sort.order === undefined) {
        sort.order = "asc";
      }
      switch (sort.by) {
        case "date":
          query = query
              .orderBy("startDate", sort.order)
              .orderBy("endDate", sort.order);
          break;
        case "price":
          query = query.orderBy("price", sort.order);
          break;
        case "title":
          query = query.orderBy("title", sort.order);
          break;
        default:
          query = query
              .orderBy("startDate", "asc")
              .orderBy("endDate", "asc");
          break;
      }
    } else {
      query = query
          .orderBy("startDate", "asc")
          .orderBy("endDate", "asc");
    }
  }

  const total = (await query.get()).size;
  query = query.offset(startIndex).limit(take);

  const snapshot = await query.get();
  const trips = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const item = {
      id: doc.id,
      startDate: undefined,
      endDate: undefined,
      ...data,
    };

    try {
      if (data.startDate !== undefined) {
        item.startDate = data.startDate.toDate().toISOString().split("T")[0];
      }

      if (data.endDate !== undefined) {
        item.endDate = data.endDate.toDate().toISOString().split("T")[0];
      }
    } catch (err) {
      console.log(err);
    }

    if (data.featuredImage !== undefined) {
      try {
        item.featuredImage = storage
          .bucket()
          .file(data.featuredImage)
          .publicUrl();
      } catch (error) {
        console.log(error);
      }
    }

    trips.push(item);
  });

  return {
    trips,
    pagination: {
      size: trips.length,
      page,
      take,
      total,
    },
  };
}

/***
 * Get trips for admin
 */
async function getAdminTrips(page, take) {
  try {
    page = parseInt(page);
  } catch (error) {
    page = 1;
  }
  try {
    take = parseInt(take);
  } catch (error) {
    take = 10;
  }

  take = parseInt(take);
  if (isNaN(page) || page <= 0) {
    page = 1;
  }
  if (isNaN(take) || take <= 0) {
    take = 10;
  }

  const startIndex = (page - 1) * take;

  let query = tripsRef.select(
    "title",
    "price",
    "currency",
    "startDate",
    "endDate",
    "dateAdded",
    "currentParticipants",
    "minParticipants",
    "maxParticipants",
    "destinations"
  );

  const total = (await query.get()).size;
  query = query.orderBy("dateAdded", "desc").offset(startIndex).limit(take);

  const snapshot = await query.get();
  const trips = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const item = {
      id: doc.id,
      startDate: undefined,
      endDate: undefined,
      ...data,
    };

    try {
      if (data.startDate !== undefined) {
        item.startDate = data.startDate.toDate().toISOString().split("T")[0];
      }

      if (data.endDate !== undefined) {
        item.endDate = data.endDate.toDate().toISOString().split("T")[0];
      }

      if (data.dateAdded !== undefined) {
        item.dateAdded = data.dateAdded.toDate().toISOString();
      }
    } catch (err) {
      console.log(err);
    }

    if (data.featuredImage !== undefined) {
      try {
        item.featuredImage = storage
          .bucket()
          .file(data.featuredImage)
          .publicUrl();
      } catch (error) {
        console.log(error);
      }
    }

    trips.push(item);
  });

  return {
    trips,
    pagination: {
      size: trips.length,
      page,
      take,
      total,
    },
  };
}

/***
 * Get a trip by ID
 */

async function getTrip(id) {
  const doc = await tripsRef.doc(id).get();
  const data = doc.data();
  if (data === undefined) throw new Error("Not found");
  const {
    startDate,
    endDate,
    itinerary,
    dateAdded,
    currentParticipants,
    participants,
    ...filteredData
  } = data;
  const item = {
    id: doc.id,
    startDate: undefined,
    endDate: undefined,
    ...filteredData,
  };

  if (itinerary !== undefined) {
    const sortedKeys = Object.keys(itinerary).sort();
    const sortedItinerary = {};

    sortedKeys.forEach((key) => {
      sortedItinerary[key] = itinerary[key];
    });

    item.itinerary = sortedItinerary;
  }

  try {
    if (data.startDate !== undefined) {
      item.startDate = data.startDate.toDate().toISOString().split("T")[0];
    }

    if (data.endDate !== undefined) {
      item.endDate = data.endDate.toDate().toISOString().split("T")[0];
    }
  } catch (err) {
    console.log(err);
  }

  if (data.featuredImage !== undefined) {
    try {
      item.featuredImage = storage
        .bucket()
        .file(data.featuredImage)
        .publicUrl();
    } catch (error) {
      console.log(error);
    }
  }

  return item;
}

/***
 * Get trip participants
 */
async function getTripParticipants(id) {
  const query = tripsRef
    .select(
      "participants",
      "currentParticipants",
      "minParticipants",
      "maxParticipants"
    )
    .where(FieldPath.documentId(), "==", id);
  const snapshot = await query.get();
  if (snapshot.empty) {
    throw new Error("Trip not found");
  }
  const tripDoc = snapshot.docs[0];
  const tripData = tripDoc.data();
  participants = [];
  for (const participantId in tripData.participants) {
    const participant = tripData.participants[participantId];
    const newParticipant = { ...participant };
    try {
      if (newParticipant.joinDate !== undefined) {
        newParticipant.joinDate = newParticipant.joinDate
          .toDate()
          .toISOString()
          .split("T")[0];
      }
    } catch (err) {}
    participants.push(newParticipant);
  }
  return {
    result: participants,
    info: {
      current: tripData.currentParticipants,
      min: tripData.minParticipants,
      max: tripData.maxParticipants,
    },
  };
}

/***
 * Remove a participant from a trip
 */
async function removeParticipant(tripId, userId) {
  const query = tripsRef
    .select("participants", "currentParticipants")
    .where(FieldPath.documentId(), "==", tripId);
  const snapshot = await query.get();
  if (snapshot.empty) {
    throw new Error("Trip not found");
  }
  const tripDoc = snapshot.docs[0];
  const tripData = tripDoc.data();
  if (userId in tripData.participants === false) {
    throw new Error("User not found");
  }

  if (tripData.currentParticipants === undefined) {
    tripData.currentParticipants = 0;
  } else {
    tripData.currentParticipants -= 1;
  }
  delete tripData.participants[userId];
  await tripDoc.ref.update(tripData);

  const userRef = usersRef.doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data();
  delete userData.trips[tripId];
  await userDoc.ref.update(userData);
}
/***
 * Update a trip
 */
async function updateTrip(id, tripData) {
  if (tripData.imageUri !== undefined) {
    try {
      tripData.featuredImage = await uploadFeaturedImage(tripData.imageUri);
      delete tripData.imageUri;
    } catch (err) {
      console.log(err);
    }
  }
  tripData.startDate = new Date(tripData.startDate);
  tripData.endDate = new Date(tripData.endDate);

  tripData.minParticipants = parseInt(tripData.minParticipants);
  tripData.maxParticipants = parseInt(tripData.maxParticipants);
  await tripsRef.doc(id).update(tripData);
}

async function deleteTrip(id) {
  await tripsRef.doc(id).delete();
}

/***
 * Join a trip
 */
async function joinTrip(id, userId) {
  if (userId === undefined || userId === "") {
    throw new Error("User id not given");
  }

  const query = tripsRef
    .select(
      "maxParticipants",
      "participants",
      "currentParticipants",
      "title",
      "destinations",
      "startDate",
      "endDate",
      "price",
      "currency"
    )
    .where(FieldPath.documentId(), "==", id);

  const snapshot = await query.get();
  if (snapshot.empty) {
    throw new Error("Trip not found");
  }

  const tripDoc = snapshot.docs[0];
  const tripData = tripDoc.data();

  const participantsRef = tripData.participants || {};

  if(tripData.startDate.toDate() < new Date()) {
    throw new Error("Trip already started");
  }

  if (userId in participantsRef) {
    throw new Error("User already joined");
  }

  if (tripData.currentParticipants >= tripData.maxParticipants) {
    throw new Error("Trip is full");
  }
  // Add user to participants
  const userRef = usersRef.doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data();
  if (tripData.currentParticipants === undefined) {
    tripData.currentParticipants = 1;
  } else {
    tripData.currentParticipants += 1;
  }
  tripData.participants = participantsRef;

  tripData.participants[userId] = {
    id: userDoc.id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    joinDate: new Date(),
  };
  // Update trip
  await tripDoc.ref.update(tripData);

  // Add trip to user
  userData.trips = userData.trips || {};
  userData.trips[id] = {
    id: tripDoc.id,
    title: tripData.title,
    startDate: tripData.startDate,
    endDate: tripData.endDate,
    destinations: tripData.destinations,
    price: tripData.price,
    currency: tripData.currency,
  };

  await userDoc.ref.update(userData);
}

async function uploadFeaturedImage(imageUri) {
  const bucket = storage.bucket();

  const contentType = imageUri.split(";")[0].split(":")[1];
  const base64Image = imageUri.split(";base64,").pop();
  const imageBuffer = Buffer.from(base64Image, "base64");
  const hash = hashImage(imageBuffer);
  const filePath = `trips/${hash}.${contentType.split("/")[1]}`;
  try {
    const file = bucket.file(filePath);
    await file.save(imageBuffer, {
      metadata: { contentType },
      predefinedAcl: "publicRead",
    });

    return filePath;
  } catch (error) {
    console.log(error)
    throw new Error("Image error");
  }
}

async function getUserFavorites(userId) {
  const userRef = usersRef.doc(userId);
  const user = await userRef.get();
  const userData = user.data();
  const favorites = [];
  if (userData.favorites != null) {
    for (const favId in userData.favorites) {
      const fav = userData.favorites[favId];
      const newFav = { ...fav };
      try {
        if (newFav.startDate !== undefined) {
          newFav.startDate = newFav.startDate
            .toDate()
            .toISOString()
            .split("T")[0];
        }

        if (newFav.endDate !== undefined) {
          newFav.endDate = newFav.endDate.toDate().toISOString().split("T")[0];
        }
      } catch (err) {
        console.log(err);
      }
      favorites.push(newFav);
    }
  }
  return favorites;
}

module.exports = {
  addTrip,
  getTrips,
  getTripParticipants,
  removeParticipant,
  getAdminTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  joinTrip,
  uploadFeaturedImage,

  getUserFavorites,
};
