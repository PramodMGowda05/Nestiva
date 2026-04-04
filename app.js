// if(process.env.NODE_ENV != "production"){
//     require('dotenv').config(); 
// };


// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require('ejs-mate');
// const ExpressError = require("./utils/ExpressError.js");
// const session = require("express-session");
// const MongoStore = require('connect-mongo');
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js")


// const listingRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));

// const dbUrl = process.env.ATLASDB_URL;

// const store = MongoStore.create({
//     client: mongoose.connection.getClient(),
//     crypto: {
//         secret: process.env.SECRET,
//     },
//     touchAfter: 24 * 3600,
// });

// store.on("error", (err) => {
//     console.log("Error in MONGO SESSION STORE ", err);
// });

// const sessionOptions = {
//     store,
//     secret : process.env.SECRET,
//     resave : false,
//     saveUninitialized: true,
//     cookie: {
//         expires: Date.now() + 7 * 24 * 60 * 60 *1000,
//         maxAge: 7 * 24 * 60 * 60 *1000,
//         httpOnly: true,
//     },
// };



// const port = 8080;



// main().then(() => {
//     console.log("connected to DB");
// }).catch((err) => {
//     console.log(err);
// });

// async function main() {
//     await mongoose.connect(dbUrl);
// }


// app.use(session(sessionOptions));
// app.use(flash());


// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


// // app.get("/", (req, res) => {
// //     res.send("Hi, I am root");
// // });


// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser = req.user;
//     next();
// });

// // app.get("/demouser",async (req,res,)=>{
// //     let fakeUser = new User({
// //         email: "student@gmail.com",
// //         username: "sigma-student",
// //     });

// //     let registeredUser = await User.register(fakeUser, "helloworld");
// //     res.send(registeredUser);
// // });

// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews",reviewRouter);
// app.use("/", userRouter);


// app.use((req, res, next) => {
//     next(new ExpressError(404, "Page Not Found!"));
// });

// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong!" } = err;
//     res.status(statusCode).render("error.ejs", { message });
//     //res.status(statusCode).send(message);
// });

// app.listen(port, () => {
//     console.log("The app is running on port:", port);
// });

if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ------------------ BASIC CONFIG ------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.ATLASDB_URL;
console.log("DB URL:", dbUrl);
const port = 8080;

// ------------------ START SERVER AFTER DB ------------------
async function main() {
    await mongoose.connect(dbUrl);
    console.log("connected to DB");

    // ✅ Create session store AFTER DB connection
    const store = MongoStore.create({
        mongoUrl: dbUrl,
        dbName: "test", // ✅ ADD THIS LINE
        crypto: {
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 3600,
    });

    store.on("error", (err) => {
        console.log("SESSION STORE ERROR:", err);
    });

    const sessionOptions = {
        store,
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        },
    };

    // ------------------ MIDDLEWARE ------------------
    app.use(session(sessionOptions));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req, res, next) => {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.currUser = req.user;
        next();
    });

    // ------------------ ROUTES ------------------
    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use("/", userRouter);

    // ------------------ 404 ------------------
    app.use((req, res, next) => {
        next(new ExpressError(404, "Page Not Found!"));
    });

    // ------------------ ERROR HANDLER ------------------
    app.use((err, req, res, next) => {
        let { statusCode = 500, message = "Something went wrong!" } = err;
        res.status(statusCode).render("error.ejs", { message });
    });

    // ------------------ START SERVER ------------------
    app.listen(port, () => {
        console.log("The app is running on port:", port);
    });
}

main().catch(err => console.log(err));