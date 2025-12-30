const route = require("express").Router();
const ctrls = require("../controllers/product");
const { verifyToken, isAdmin } = require("../middleware/verifyToken");

route.post("/", [verifyToken, isAdmin], ctrls.createProduct);
route.get("/", [verifyToken, isAdmin], ctrls.getAllProducts);
route.put("/:pid", [verifyToken, isAdmin], ctrls.updateProduct);
route.get("/:pid", ctrls.getProduct);
route.delete("/:pid", [verifyToken, isAdmin], ctrls.deleteProduct);

module.exports = route;
