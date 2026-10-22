const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
const authRoutes = require("./routes/authRoutes.js");
const electionRoutes = require("./routes/electionRoutes");
const votingRoutes = require("./routes/votingRoutes");
const resultsRoutes = require("./routes/resultsRoutes");

app.use("/auth", authRoutes);
app.use("/elections", electionRoutes);
app.use("/voting", votingRoutes);
app.use("/results", resultsRoutes);

app.get("/", (req, res) => {
    res.redirect("/auth/login");
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});