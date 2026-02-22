const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/brown-and-white-wooden-house-near-swimming-pool-during-daytime-_twiIcIsp2s",
        set: (v) => v === "" ? "https://unsplash.com/photos/brown-and-white-wooden-house-near-swimming-pool-during-daytime-_twiIcIsp2s" : v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
