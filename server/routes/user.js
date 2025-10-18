const route = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyToken } = require("../middleware/verifyToken");
route.post("/register", ctrls.register);
route.post("/login", ctrls.login);
route.get("/current", verifyToken, ctrls.getCurrent);
route.get("/refreshToken", verifyToken, ctrls.refreshAccessToken);
route.get("/logout", ctrls.logout);

module.exports = route;
