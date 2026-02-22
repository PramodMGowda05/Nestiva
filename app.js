const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/nestiva";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

app.get("/testListing",async (req,res)=>{
    let sampleListing = new Listing({
        title: "My Sample",
        description: "By the beach",
        price:1700,
        location:"Panjim , Goa",
        country: "India",
    });
   await sampleListing.save();
   console.log("sample was saved");
   res.send("Successfully tested");
});

app.listen(port, () => {
    console.log("The app is running on port:", port);
});