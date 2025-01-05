const express = require("express");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const homeRoutes = require("./routes/home");
const apiRoutes = require("./routes/api");
app.use(homeRoutes);
app.use("/api", apiRoutes);

const PORT = 3009;
app.locals.baseURL = `http://localhost:${PORT}`;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
