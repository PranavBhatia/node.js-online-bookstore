const path = require("path");

const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuthenticated = require("../middleware/is-authenticated");

const router = express.Router();

router.get("/products", isAuthenticated, adminController.getProducts);

router.get("/add-product", isAuthenticated, adminController.getAddProduct);

router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuthenticated,
  adminController.postAddProduct
);

router.get(
  "/edit-product/:productId",
  isAuthenticated,
  adminController.getEditProduct
);

router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuthenticated,
  adminController.postEditProduct
);

router.delete(
  "/product/:productId",
  isAuthenticated,
  adminController.deleteProduct
);

module.exports = router;
