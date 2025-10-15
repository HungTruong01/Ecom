const route = require("express").Router();
const ctrls = require("../controllers/user");

route.post("/register", ctrls.register);

module.exports = route;
