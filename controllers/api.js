const Admin = require("../models/Admin");

exports.login = async (req, res) => {
    const admin = await Admin.get(req.body);
    if (admin[0][0]) res.redirect("/");
    else res.redirect("/login");
};
