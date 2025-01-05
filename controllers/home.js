exports.index = async (req, res) => {
    res.render("index", {
        title: "Ana Sayfa | Sağlık Rehberi KDS",
        activePage: "dashboard",
    });
};

exports.login = (req, res) => {
    res.render("login", {
        title: "Yönetici Giriş | Sağlık Rehberi KDS",
    });
};
