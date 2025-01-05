const express = require("express");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Count = require("./models/Count");
app.get("/", async (req, res) => {
    const total_revenue = await Count.total_revenue();
    const total_examination = await Count.total_examination();
    const total_department = await Count.total_department();
    const total_doctor = await Count.total_doctor();

    res.render("index", {
        title: "Ana Sayfa | Sağlık Rehberi KDS",
        activePage: "dashboard",

        total_revenue: total_revenue[0],
        total_examination: total_examination[0],
        total_department: total_department[0],
        total_doctor: total_doctor[0],
    });
});

app.get("/department", async (req, res) => {
    res.render("./department/index", {
        title: "Departmanlar | Sağlık Rehberi KDS",
        activePage: "department",
    });
});

app.get("/doctor", async (req, res) => {
    res.render("./doctor/index", {
        title: "Doktorlar | Sağlık Rehberi KDS",
        activePage: "doctor",
    });
});

const PORT = 3009;
app.locals.baseURL = `http://localhost:${PORT}`;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
