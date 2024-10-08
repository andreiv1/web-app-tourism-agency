const {db} = require("../utils/firebase");
const {hashPassword} = require("../utils/password");
const usersRef = db.collection("users");
const tripsRef = db.collection("trips");

/**
 * USERS SERVICE
 */

async function addUser(userData) {
    try {
        userData.dateAdded = new Date()
        userData.birthDate = new Date(userData.birthDate)
        const user = await usersRef.add(userData);
        return user.id;
    } catch (err) {
        console.log(err);
        throw new Error("Error while adding user");
    }
}

async function getUsers(page, take) {
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
    try {
        const total = (await usersRef.get()).size;
        query = usersRef.offset(startIndex).limit(take)
            .orderBy("dateAdded", "desc")

        const snapshot = await query.get();
        const users = [];
        snapshot.forEach((doc) => {
            const userData = {id: doc.id, ...doc.data()};

            const {password, ...updatedUserData} = userData;

            const modifiedUserData = {...updatedUserData};

            if (userData.birthDate !== undefined) {
                try {
                    modifiedUserData.birthDate = userData.birthDate
                        .toDate()
                        .toISOString()
                        .split("T")[0];
                }
                catch(err){
                    console.log(err);
                }
            }

            if (userData.dateAdded !== undefined) {
                try {
                    modifiedUserData.dateAdded = userData.dateAdded
                        .toDate()
                        .toISOString()
                        .split("T")[0];
                }
                catch(err){
                    console.log(err);
                }
            }
            users.push(modifiedUserData);
        });
        return {
            users,
            pagination: {
                size: users.length,
                page,
                take,
                total,
            },
        };
    } catch (err) {
        console.log(err);
        throw new Error("Error while getting users");
    }
}

async function getUser(id) {
    try {
        const doc = await usersRef.doc(id).get();
        const data = doc.data();
        const userData = {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            birthDate: data.birthDate,
            gender: data.gender,
            email: data.email,
            type: data.type,
            dateAdded: data.dateAdded,
        }

        const trips = data.trips;
        const favorites = data.favorites;

        if(userData.birthDate !== undefined){
            userData.birthDate = userData.birthDate.toDate().toISOString().split("T")[0];
        }
        if(userData.dateAdded !== undefined){
            userData.dateAdded = userData.dateAdded.toDate().toISOString().split("T")[0];
        }

        Object.values(trips || {}).forEach(t => {
          if(t.startDate !== undefined){
            t.startDate = t.startDate.toDate().toISOString().split("T")[0];
          }
            if(t.endDate !== undefined){
                t.endDate = t.endDate.toDate().toISOString().split("T")[0];
            }
        })

        Object.values(favorites || {}).forEach(t => {
          if(t.startDate !== undefined){
            t.startDate = t.startDate.toDate().toISOString().split("T")[0];
          }
            if(t.endDate !== undefined){
                t.endDate = t.endDate.toDate().toISOString().split("T")[0];
            }
        })

        return {
            user: userData,
            trips: Object.values(trips || {}),
            favorites: Object.values(favorites || {})
        }

    } catch (err) {
        console.log(err);
        throw new Error("Error while getting user");
    }
}

async function getUserProfile(id) {
    try {
        const doc = await usersRef.doc(id).get();
        const data = doc.data();
        const { password, trips, favorites, ...userData} = data;

        if(userData.birthDate !== undefined){
            userData.birthDate = userData.birthDate.toDate().toISOString().split("T")[0];
        }

        if(userData.dateAdded !== undefined){
            userData.dateAdded = userData.dateAdded.toDate().toISOString().split("T")[0];
        }

        return userData;

    } catch (err) {
        console.log(err);
        throw new Error("Error while getting user");
    }
}

async function updateUser(id, userData) {
    try {
        if(userData.password) {
            userData.password = await hashPassword(userData.password);
        }
        userData.birthDate = new Date(userData.birthDate);
        console.log(userData)
        await usersRef.doc(id).update(userData);
    } catch (err) {
        console.log(err);
        throw new Error("Error while updating user");
    }
}

async function deleteUser(id) {
    try {
        await usersRef.doc(id).delete();
    } catch (err) {
        console.log(err);
        throw new Error("Error while deleting user");
    }
}

async function checkUserExists(email, phoneNumber) {
    const queryByEmail = await usersRef.where("email", "==", email).get();
    const queryByPhoneNumber = await usersRef
        .where("phoneNumber", "==", phoneNumber)
        .get();

    if (!queryByEmail.empty || !queryByPhoneNumber.empty) {
        return true;
    }

    return false;
}

async function addTripToFavorites(userId, tripId) {
    const userRef = usersRef.doc(userId);
    const user = await userRef.get();
    const userData = user.data();
    const trip = await db.collection("trips").doc(tripId).get();
    let favorites = userData.favorites;

    const favTrip = {
        id: trip.id,
        title: trip.data().title,
        startDate: trip.data().startDate,
        endDate: trip.data().endDate,
        price: trip.data().price,
        currency: trip.data().currency,
        destinations: trip.data().destinations,
    }
    if(favorites === undefined) {
        favorites = {}
    }
    if (!(tripId in favorites)) {
        favorites[tripId] = favTrip;
        await userRef.update({ favorites });
        return true;
    } else {
        delete favorites[tripId];
        await userRef.update({ favorites });
        return false;
    }
}

async function checkTrip(userId, tripId) {
    const trip = await tripsRef.doc(tripId).get();
    if (!trip.exists) {
        throw new Error("Trip not found");
    }
    const result = {
        isJoined: false,
        isFavorite: false,
    }
    const userRef = usersRef.doc(userId);
    const user = await userRef.get();
    const userData = user.data();
  
    if (userData.favorites !== undefined && tripId in userData.favorites) {
        result.isFavorite = true;
    }
    if (userData.trips !== undefined && tripId in userData.trips) {
        result.isJoined = true;
    }
    return result;
}

async function getJoinedTrips(userId) {
    const userRef = usersRef.doc(userId);
    const user = await userRef.get();
    const userData = user.data();
    
    const trips = Object.values(userData.trips || {});

    const today = Date.now();

    const upcoming = trips
        .filter(t => t.startDate.toMillis() > today)
        .sort((a, b) => a.startDate.toMillis() - b.startDate.toMillis());
    const previous = trips
        .filter(t => t.startDate.toMillis() <= today)
        .sort((a, b) => a.startDate.toMillis() - b.startDate.toMillis());
    upcoming.forEach(t => {
        if(t.startDate !== undefined){
            t.startDate = t.startDate.toDate().toISOString().split("T")[0];
        }
        if(t.endDate !== undefined){
            t.endDate = t.endDate.toDate().toISOString().split("T")[0];
        }
    })
    previous.forEach(t => {
        if(t.startDate !== undefined){
            t.startDate = t.startDate.toDate().toISOString().split("T")[0];
        }
        if(t.endDate !== undefined){
            t.endDate = t.endDate.toDate().toISOString().split("T")[0];
        }
    })
    return { upcoming, previous };
}

module.exports = {
    addUser,
    getUsers,
    getUser,
    getUserProfile,
    updateUser,
    deleteUser,

    addTripToFavorites,
    checkTrip,
    getJoinedTrips
};
