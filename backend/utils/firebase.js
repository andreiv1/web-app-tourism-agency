require("dotenv").config();

const {initializeApp, applicationDefault, cert,} = require("firebase-admin/app");

const { getFirestore } = require("firebase-admin/firestore");

const { getStorage } = require("firebase-admin/storage");


const firebaseKey = process.env.FIREBASE_KEY_FILE;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (!firebaseKey || !storageBucket) {
  console.log("FIREBASE_KEY_FILE or FIREBASE_STORAGE_BUCKET is not defined");
  process.exit(1);
}

const serviceAccount = require(firebaseKey);

  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: storageBucket,
  });

  const db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });

  const storage = getStorage();
module.exports = { db, storage }