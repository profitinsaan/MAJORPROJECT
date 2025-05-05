const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/Listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await listing.deleteMany({});
// owner Id
const ownerId =  new mongoose.Types.ObjectId('680166bba5d199213896c97b');
  // Add owner field to each listing
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: ownerId
  }));
  console.log(initData.data[0]); // Check if 'owner' is present before saving

  console.log(Array.isArray(initData.data)); // should print true

  await listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();