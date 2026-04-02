const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/nestiva";

// Coordinate Mapping [longitude, latitude]
const geoData = {
    "Malibu": [-118.8064, 34.0259],
    "New York City": [-74.0060, 40.7128],
    "Aspen": [-106.8175, 39.1911],
    "Florence": [11.2558, 43.7696],
    "Portland": [-122.6765, 45.5231],
    "Cancun": [-86.8515, 21.1619],
    "Lake Tahoe": [-120.0324, 39.0968],
    "Los Angeles": [-118.2437, 34.0522],
    "Verbier": [7.2286, 46.0961],
    "Serengeti National Park": [34.8333, -2.3333],
    "Amsterdam": [4.8952, 52.3702],
    "Fiji": [178.0650, -17.7134],
    "Cotswolds": [-1.7024, 51.8330],
    "Boston": [-71.0589, 42.3601],
    "Bali": [115.1889, -8.4095],
    "Banff": [-115.5708, 51.1784],
    "Santorini": [25.4315, 36.3932],
    "Tokyo": [139.6503, 35.6762],
    "Kyoto": [135.7681, 35.0116],
    "Paris": [2.3522, 48.8566],
    "London": [-0.1276, 51.5072],
    "Dubai": [55.2708, 25.2048],
    "Sydney": [151.2093, -33.8688],
    "Rome": [12.4964, 41.9028],
    "Prague": [14.4378, 50.0755],
    "Reykjavik": [-21.9426, 64.1466],
    "Cape Town": [18.4233, -33.9249],
    "Seoul": [126.9780, 37.5665],
    "Zermatt": [7.7491, 46.0207]
};

main().then(() => {
    console.log("connected to DB");
    initDB(); // Run initialization after connection
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        
        // Map over data to add owner and geometry
        const updatedData = initData.data.map((obj) => ({
            ...obj,
            owner: "69b95511b7e5db3aa2c2de20",
            geometry: {
                type: "Point",
                // Lookup coordinates; default to [0,0] if location missing
                coordinates: geoData[obj.location] || [0, 0] 
            }
        }));

        await Listing.insertMany(updatedData);
        console.log("Data was initialized with Geometry successfully!");
    } catch (err) {
        console.error("Initialization error:", err);
    }
};
