const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");
const isAuthenticated = require("../middleware/is-authenticated");

const router = express.Router();

router.get("/products", isAuthenticated, adminController.getProducts);

router.get("/add-product", isAuthenticated, adminController.getAddProduct);

router.post("/add-product", isAuthenticated, adminController.postAddProduct);

router.get("/edit-product/:productId", isAuthenticated, adminController.getEditProduct);

router.post("/edit-product", isAuthenticated, adminController.postEditProduct);

router.post("/delete-product", isAuthenticated, adminController.postDeleteProduct);

module.exports = router;
