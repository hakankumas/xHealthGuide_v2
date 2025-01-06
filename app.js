const express = require("express");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Count = require("./models/Count");
const Doctor = require("./models/Doctor");
const Sick = require("./models/Sick");
const Loses = require("./models/Loses");
const Department = require("./models/Department");

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

app.get("/cost", async (req, res) => {
    const list_departments = await Department.list_departments();
    res.render("./cost/index", {
        title: "Kayıp Kazançlar | Sağlık Rehberi KDS",
        activePage: "cost",

        list_departments: list_departments[0],
    });
});

app.post("/department/update/examination_price", async (req, res) => {
    const department = await Department.update_examination_price(req.body);
    if (department) res.redirect("/cost");
});

app.get(
    "/api/monthly_examination_numbers_of_all_internists",
    async (req, res) => {
        const monthly_examination_numbers_of_all_internists =
            await Doctor.monthly_examination_numbers_of_all_internists();

        res.status(200).json({
            monthly_examination_numbers_of_all_internists:
                monthly_examination_numbers_of_all_internists[0],
        });
    }
);

app.get(
    "/api/number_of_examination_for_internists_by_month",
    async (req, res) => {
        const number_of_examination_for_internists_by_month =
            await Doctor.number_of_examination_for_internists_by_month();

        res.status(200).json({
            number_of_examination_for_internists_by_month:
                number_of_examination_for_internists_by_month[0],
        });
    }
);

app.get("/api/distribution_of_examination_by_internists", async (req, res) => {
    const distribution_of_examination_by_internists =
        await Doctor.distribution_of_examination_by_internists();

    res.status(200).json({
        distribution_of_examination_by_internists:
            distribution_of_examination_by_internists[0],
    });
});

app.get("/api/total_revenue_by_record_date", async (req, res) => {
    const total_revenue_by_record_date =
        await Sick.total_revenue_by_record_date();

    res.status(200).json({
        total_revenue_by_record_date: total_revenue_by_record_date[0],
    });
});

app.get("/api/number_of_doctors_in_departments", async (req, res) => {
    const number_of_doctors_in_departments =
        await Doctor.number_of_doctors_in_departments();

    res.status(200).json({
        number_of_doctors_in_departments: number_of_doctors_in_departments[0],
    });
});

app.get("/api/sick_by_gender", async (req, res) => {
    const sick_by_gender = await Sick.sick_by_gender();

    res.status(200).json({
        sick_by_gender: sick_by_gender[0],
    });
});

app.get(
    "/api/distribution_of_examination_and_revenue_for_other_departments",
    async (req, res) => {
        const distribution_of_examination_and_revenue_for_other_departments =
            await Doctor.distribution_of_examination_and_revenue_for_other_departments();

        res.status(200).json({
            distribution_of_examination_and_revenue_for_other_departments:
                distribution_of_examination_and_revenue_for_other_departments[0],
        });
    }
);

app.get(
    "/api/distribution_of_examination_and_revenue_for_all_departments",
    async (req, res) => {
        const distribution_of_examination_and_revenue_for_all_departments =
            await Doctor.distribution_of_examination_and_revenue_for_all_departments();

        res.status(200).json({
            distribution_of_examination_and_revenue_for_all_departments:
                distribution_of_examination_and_revenue_for_all_departments[0],
        });
    }
);

app.get(
    "/api/numbers_of_sicks_for_all_departments_by_doctor",
    async (req, res) => {
        const numbers_of_sicks_for_all_departments_by_doctor =
            await Doctor.numbers_of_sicks_for_all_departments_by_doctor();

        res.status(200).json({
            numbers_of_sicks_for_all_departments_by_doctor:
                numbers_of_sicks_for_all_departments_by_doctor[0],
        });
    }
);

app.get(
    "/api/numbers_of_examinations_for_unavailable_departments",
    async (req, res) => {
        const numbers_of_examinations_for_unavailable_departments =
            await Loses.numbers_of_examinations_for_unavailable_departments();

        res.status(200).json({
            numbers_of_examinations_for_unavailable_departments:
                numbers_of_examinations_for_unavailable_departments[0],
        });
    }
);

app.get(
    "/api/revenues_of_examinations_for_unavailable_departments",
    async (req, res) => {
        const revenues_of_examinations_for_unavailable_departments =
            await Loses.revenues_of_examinations_for_unavailable_departments();

        res.status(200).json({
            revenues_of_examinations_for_unavailable_departments:
                revenues_of_examinations_for_unavailable_departments[0],
        });
    }
);

app.get(
    "/api/numbers_of_examinations_for_unavailable_departments_by_month",
    async (req, res) => {
        const numbers_of_examinations_for_unavailable_departments_by_month =
            await Loses.numbers_of_examinations_for_unavailable_departments_by_month();

        res.status(200).json({
            numbers_of_examinations_for_unavailable_departments_by_month:
                numbers_of_examinations_for_unavailable_departments_by_month[0],
        });
    }
);

app.get(
    "/api/numbers_of_examinations_for_unavailable_departments_by_month_by_department",
    async (req, res) => {
        const numbers_of_examinations_for_unavailable_departments_by_month_by_department =
            await Loses.numbers_of_examinations_for_unavailable_departments_by_month_by_department();

        res.status(200).json({
            numbers_of_examinations_for_unavailable_departments_by_month_by_department:
                numbers_of_examinations_for_unavailable_departments_by_month_by_department[0],
        });
    }
);

const PORT = 3000;
app.locals.baseURL = `http://localhost:${PORT}`;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
